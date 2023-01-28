import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

import Page from '@/components/Page';
import { useApi } from '@/lib/useApi';
import { Session } from '@/schema';

const Logbook = () => {
  const [sessions, setSessions] = useState<Session[]>([]);
  const router = useRouter();
  const api = useApi();
  useEffect(() => {
    const getSessions = async () => {
      const sessions = await api.getSessions({
        filter: `user = '${api.getUser()?.id}'`,
      });
      setSessions(sessions);
    };
    getSessions();
  }, [api]);

  return (
    <Page title='Logbook'>
      <h1 className='text-xl font-bold'>Logbook</h1>
      <div className='overflow-x-auto shadow-lg'>
        <table className='table w-full'>
          <thead>
            <tr>
              <th></th>
              <th>Gym</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {sessions.map((session, idx) => (
              <tr
                key={session.id}
                onClick={(e) => router.push(`/session/${session.id}`)}
                className='hover cursor-pointer'
              >
                <th>{idx + 1}</th>
                <td>{session.expand?.gym?.name}</td>
                <td>{new Date(session.start).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Page>
  );
};

export default Logbook;
