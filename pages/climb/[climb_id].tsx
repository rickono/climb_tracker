import React, { useState, useEffect } from 'react';
import Page from '@/components/Page';
import { useRouter } from 'next/router';
import { useApi } from '@/lib/useApi';
import { Attempt, Climb, Session } from '@/schema';
import Stats from '@/components/util/Stats';
import {
  ArrowPathIcon,
  CalendarIcon,
  CalculatorIcon,
} from '@heroicons/react/24/outline';
import InfoCard from '@/components/util/InfoCard';
import { ChevronDoubleUpIcon } from '@heroicons/react/20/solid';

export const totalAttempts = (climb: Climb) => {
  return climb.expand?.['attempts(climb)']?.length ?? 0;
};

export const totalSends = (climb: Climb) => {
  return (
    climb.expand?.['attempts(climb)']?.filter((attempt) => attempt.send)
      .length ?? 0
  );
};

export const firstAttempt = (climb: Climb) => {
  return new Date(
    Math.min(
      ...(climb.expand?.['attempts(climb)']?.map((attempt) =>
        new Date(attempt.attempt_date).getTime()
      ) ?? [])
    )
  );
};

// export const firstSend = (climb: Climb) => {
//   return new Date(
//     Math.min(
//       ...(climb.expand?.['attempts(climb)']?.map((attempt) =>
//         attempt.send ? new Date(attempt.attempt_date).getTime() : Infinity
//       ) ?? [])
//     )
//   );
// };

export const firstSend = (climb: Climb) => {
  const attempts = climb.expand?.['attempts(climb)'] ?? [];
  return attempts.find((attempt) => attempt.send);
};

const Climb = () => {
  const router = useRouter();
  const api = useApi();
  const { climb_id } = router.query;

  const [climb, setClimb] = useState<Climb>();
  const [sessions, setSessions] = useState<Attempt[][]>([]);
  const [firstSendAttempt, setFirstSendAttempt] = useState<Attempt>();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (typeof climb_id !== 'string') return;
    const getClimb = async () => {
      const climb = await api.getClimbById(climb_id, {
        expand:
          'grade,attempts(climb),gym,attempts(climb).set,attempts(climb).set.session',
      });
      console.log(climb);

      setClimb(climb);
      setFirstSendAttempt(firstSend(climb));
      setLoading(false);
    };
    const getAttempts = async () => {
      const attempts = await api.getAttempts({
        filter: `climb = '${climb_id}'`,
        expand: 'set,set.session',
      });
      // Group attempts by session
      const sessions = new Map<string, Attempt[]>();
      for (const attempt of attempts) {
        const session = attempt.expand?.set?.expand?.session;

        if (session) {
          if (sessions.has(session.id)) {
            sessions.get(session.id)?.push(attempt);
          } else {
            sessions.set(session.id, [attempt]);
          }
        }
      }
      console.log(Array.from(sessions.values()));

      setSessions(Array.from(sessions.values()));
    };
    getAttempts();
    getClimb();
  }, [climb_id, api]);

  if (loading || !climb) {
    return <div>Loading...</div>;
  } else {
    return (
      <Page title={climb.name}>
        <div>
          <h1 className='text-xl font-bold'>{climb.name}</h1>
          <h2 className=' text-gray-600 text-md'>
            {climb.expand?.grade?.grade} {climb.discipline} at{' '}
            {climb.expand?.gym?.name}
          </h2>
        </div>
        <Stats
          stats={
            firstSendAttempt
              ? [
                  {
                    icon: <CalendarIcon className='h-8 w-8 text-primary' />,
                    title: 'First send',
                    value: new Date(
                      firstSendAttempt?.attempt_date ?? ''
                    ).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                    }),
                  },
                  {
                    icon: (
                      <ChevronDoubleUpIcon className='h-8 w-8 text-primary' />
                    ),
                    title: 'Attempts to redpoint',
                    value:
                      firstSendAttempt?.attempt_number == 1
                        ? 'Flash'
                        : firstSendAttempt?.attempt_number?.toString() ?? '',
                  },
                  {
                    icon: <ArrowPathIcon className='h-8 w-8 text-primary' />,
                    title: 'Repeats',
                    value: (totalSends(climb) - 1).toString(),
                  },
                ]
              : [
                  {
                    icon: <CalendarIcon className='h-8 w-8 text-primary' />,
                    title: 'First attempt',
                    value: firstAttempt(climb).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                    }),
                    description: `${Math.floor(
                      (new Date().getTime() - firstAttempt(climb).getTime()) /
                        (1000 * 60 * 60 * 24)
                    )} days ago`,
                  },
                  {
                    icon: <CalculatorIcon className='h-8 w-8 text-primary' />,
                    title: 'Total attempts',
                    value: totalAttempts(climb).toString(),
                    description: `${
                      new Set(
                        climb.expand?.['attempts(climb)']?.map((attempt) => {
                          console.log(attempt);
                          return attempt.expand?.set?.expand?.session?.id;
                        })
                      ).size
                    } sessions worked`,
                  },
                ]
          }
        />
        <h2 className='font-medium text-lg'>Attempts</h2>
        {sessions.map((session, idx) => {
          const sessionInfo = session[0].expand?.set?.expand?.session;
          if (sessionInfo) {
            return (
              <div key={idx}>
                <h2>
                  Session{' '}
                  {new Date(sessionInfo.start).toLocaleDateString('en-US', {
                    month: 'long',
                    day: 'numeric',
                    year: 'numeric',
                  })}
                </h2>
                {session.map((attempt) => (
                  <div key={attempt.id}>{attempt.result}</div>
                ))}
              </div>
            );
          }
        })}
      </Page>
    );
  }
};

export default Climb;
