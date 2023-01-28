import Page from '@/components/Page';
import Head from 'next/head';
import PocketBase from 'pocketbase';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import {
  Collections,
  GymsResponse,
  GymsRecord,
  SessionsResponse,
} from '../schema/pocketbase-types';
import { useApi } from '@/lib/useApi';

export default function Climb() {
  const [gyms, setGyms] = useState<Array<{ name: string; id: string }>>([]);
  const [selectedGym, setSelectedGym] = useState<string>('');
  const router = useRouter();
  const api = useApi();

  useEffect(() => {
    // Check if there is a session in progress for this user
    const getSessions = async () => {
      const sessions = await api.getSessions({
        filter: `end = '' && user = '${api.getUser()?.id}'`,
      });
      console.log(sessions);

      if (sessions.length > 0) {
        // Redirect to the session page
        router.push(`/track/${sessions[0].id}`);
      }
    };
    const getGyms = async () => {
      const gyms = await api.getGyms({});
      setGyms(gyms.map((record) => ({ name: record.name, id: record.id })));
      console.log(gyms);
    };
    getSessions();
    getGyms();
  }, [api, router]);

  const startSession = async () => {
    const session = await api.createSession({
      gym: selectedGym,
      user: api.getUser()?.id,
      start: new Date().toISOString(),
    });
    console.log(session);
    router.push(`/track/${session.id}`);
  };

  return (
    <Page title='Climb' authRequired>
      <h1 className='text-lg font-bold'>Start a session</h1>
      <select
        className='select select-bordered w-full max-w-xs'
        defaultValue=''
        onChange={(e) => setSelectedGym(e.target.value)}
      >
        <option disabled value=''>
          Select a gym
        </option>
        {gyms.map((gym) => (
          <option key={gym.id} value={gym.id}>
            {gym.name}
          </option>
        ))}
      </select>
      <button className='btn' onClick={startSession}>
        Start your climbing session
      </button>
    </Page>
  );
}
