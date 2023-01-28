import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Page from '@/components/Page';
import Set from '@/components/Set';
import { PlusCircleIcon, CheckCircleIcon } from '@heroicons/react/20/solid';
import { useApi } from '@/lib/useApi';
import { Session, ClimbSet, Climb } from '@/schema';

export default function Track() {
  const [session, setSession] = useState<Session | undefined>(undefined);
  const [sets, setSets] = useState<ClimbSet[]>([]);
  const [climbs, setClimbs] = useState<Climb[]>([]);

  const router = useRouter();
  const api = useApi();
  const { session_id } = router.query;

  useEffect(() => {
    if (typeof session_id !== 'string') return;
    const getSessionAndClimbs = async () => {
      const session = await api.getSessionById(session_id);
      setSession(session);
      const climbs = await api.getClimbs({
        filter: `user = '${api.getUser()?.id}' && gym = '${session?.gym}'`,
        expand: 'grade',
      });
      setClimbs(climbs);
      const sets = await api.getSets({
        filter: `session = '${session_id}'`,
        expand: 'attempts',
      });
      setSets(sets.items.sort((a, b) => a.set_in_session - b.set_in_session));
    };
    getSessionAndClimbs();
  }, [session_id]);

  const addSet = async () => {
    if (!session) return;
    const newSet = await api.createSet({
      session: session.id,
      set_in_session: sets.length + 1,
    });

    setSets((sets) => [...sets, newSet]);
  };

  const finishSession = async () => {
    if (!session) return;
    await api.updateSession(session.id, {
      end: new Date().toISOString(),
    });
    router.push(`/session/${session.id}`);
  };

  if (!session) {
    return (
      <Page title='Climb' authRequired>
        <h1 className='text-xl font-bold'>Loading...</h1>
      </Page>
    );
  } else {
    return (
      <Page title='Climb' authRequired>
        <h1 className='text-xl font-bold'>Session in progress</h1>
        {sets.map((set) => (
          <Set
            key={set.id}
            set={set}
            session={session}
            climbs={climbs}
            setClimbs={setClimbs}
            setName={`Set ${set.set_in_session}`}
            inProgress
          />
        ))}
        <div className='flex gap-4'>
          <button
            className='btn gap-2 w-fit mx-auto btn-sm btn-primary'
            onClick={addSet}
          >
            <PlusCircleIcon className='w-4 h-4' />
            Add another set
          </button>
          <button
            className='btn gap-2 w-fit mx-auto btn-sm btn-success'
            onClick={finishSession}
          >
            <CheckCircleIcon className='w-4 h-4' />
            Finish my session
          </button>
        </div>
      </Page>
    );
  }
}
