import Head from 'next/head';
import { useState, useEffect } from 'react';
import PocketBase from 'pocketbase';
import { useRouter } from 'next/router';
import Page from '@/components/Page';
import Set from '@/components/Set';
import { ClockIcon, MapPinIcon, StarIcon } from '@heroicons/react/24/outline';
import {
  BarChart,
  Bar,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { useApi } from '@/lib/useApi';
import { Session, Attempt, ClimbSet, Climb } from '@/schema';
import { displayClimbAngle } from '@/lib/stringify';
import Stats from '@/components/SessionStats';

export default function SessionView() {
  const [session, setSession] = useState<Session | undefined>(undefined);
  const [sets, setSets] = useState<ClimbSet[]>([]);
  const [attempts, setAttempts] = useState<Attempt[]>([]);
  const [climbs, setClimbs] = useState<Climb[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [chartOptions, setChartOptions] = useState<{
    groupBy: 'grade' | 'angle';
    sendsOnly: boolean;
  }>({ groupBy: 'grade', sendsOnly: false });

  const getData = () => {
    switch (chartOptions.groupBy) {
      case 'grade':
        return attempts
          .reduce((acc, attempt) => {
            const climb = attempt.expand?.climb;
            if (!climb) return acc;
            const grade = climb.expand?.grade?.grade ?? 'Unknown';
            const gradeKey = climb.expand?.grade?.sort_key ?? 0;
            const index = acc.findIndex((item) => item.name === grade);
            if (index === -1) {
              acc.push({
                name: grade,
                sends: attempt.send ? 1 : 0,
                attempts: 1,
                key: gradeKey,
              });
            } else {
              acc[index].attempts += 1;
              if (attempt.send) acc[index].sends += 1;
            }

            return acc;
          }, [] as { name: string; sends: number; attempts: number; key: number }[])
          .sort((a, b) => a.key - b.key);
      case 'angle':
        return attempts.reduce((acc, attempt) => {
          const climb = attempt.expand?.climb;
          if (!climb) return acc;
          const angle = attempt.expand?.climb?.angle ?? 'Unknown';
          const index = acc.findIndex((item) => item.angle === angle);
          if (index === -1) {
            acc.push({
              name: displayClimbAngle(angle),
              angle: angle ?? 'Unknown',
              sends: attempt.send ? 1 : 0,
              attempts: 1,
            });
          } else {
            acc[index].attempts += 1;
            if (attempt.send) acc[index].sends += 1;
          }

          return acc;
        }, [] as { name: string; angle: string; sends: number; attempts: number }[]);
    }
  };

  const router = useRouter();
  const api = useApi();
  const { session_id } = router.query;

  useEffect(() => {
    if (typeof session_id !== 'string') return;
    const getSession = async () => {
      const session = await api.getSessionById(session_id);
      setSession(session);
    };
    const getSessionInfo = async () => {
      const sets = await api.getSets({
        filter: `session = '${session_id}'`,
      });
      setSets(sets.items.sort((a, b) => a.set_in_session - b.set_in_session));
    };
    const getClimbsForSession = async () => {
      const climbs = await api.getClimbsForSession(session_id);
      console.log(climbs);
      setClimbs(climbs);
    };
    const getAttemptsForSession = async () => {
      const attempts = await api.getAttemptsForSession(session_id);
      console.log(attempts);
      setAttempts(attempts);
    };
    const fetchData = async () => {
      setLoading(true);
      await getSessionInfo();
      await getSession();
      await getClimbsForSession();
      await getAttemptsForSession();
      setLoading(false);
    };
    fetchData();
  }, [session_id, api]);

  const hardestClimb: Climb | undefined = attempts.reduce(
    (hardest, attempt) => {
      const climb = attempt.expand?.climb;
      if (!climb) return hardest;
      if (attempt.send === false) return hardest;
      if (!hardest) return climb;
      if (
        (climb.expand?.grade?.sort_key ?? 0) >
        (hardest.expand?.grade?.sort_key ?? 0)
      )
        return climb;
      return hardest;
    },
    undefined as Climb | undefined
  );

  if (loading || !session) {
    return (
      <Page title='Climb'>
        <h1 className='text-xl font-bold'>Loading...</h1>
      </Page>
    );
  } else {
    return (
      <Page title='Climb'>
        <h1 className='text-xl font-bold'>
          {`Session ${new Date(session?.start).toLocaleDateString()}`}
        </h1>
        <h2 className='text-lg font-medium'>Summary</h2>
        <Stats
          className='mb-4'
          duration={`${Math.round(
            (new Date(session?.end ?? new Date()).getTime() -
              new Date(session?.start).getTime()) /
              1000 /
              60
          )} min`}
          hardestAscent={hardestClimb?.expand?.grade?.grade ?? '-'}
          tops={attempts.filter((attempt) => attempt.send).length}
          attempts={attempts.length}
        />
        <div className='card p-4 bg-primary-content shadow-md w-full h-full items-center'>
          <div className='flex gap-2 items-center justify-between mb-4 w-full'>
            <div className='flex gap-2 items-center'>
              <MapPinIcon className='h-5 w-5' />
              {`${session.expand?.gym?.name}`}
            </div>
          </div>
          <div className='form-control flex gap-3 flex-row w-full'>
            <label htmlFor='sends-only' className='font-medium text-gray-600'>
              Sends only
            </label>
            <input
              type='checkbox'
              checked={chartOptions.sendsOnly}
              className='checkbox'
              name='sends-only'
              onChange={(e) =>
                setChartOptions({
                  ...chartOptions,
                  sendsOnly: !chartOptions.sendsOnly,
                })
              }
            />
          </div>
          <div className='form-control flex gap-3 flex-row w-full'>
            <label htmlFor='sends-only' className='font-medium text-gray-600'>
              Group by
            </label>
            <select
              className='select select-bordered select-sm w-full max-w-xs'
              onChange={(e) =>
                setChartOptions({
                  ...chartOptions,
                  groupBy: e.target.value as 'grade' | 'angle',
                })
              }
              value={chartOptions.groupBy}
            >
              <option value='grade'>Grade</option>
              <option value='angle'>Wall angle</option>
            </select>
          </div>
          <BarChart
            width={500}
            height={300}
            data={getData()}
            margin={{
              top: 5,
              right: 30,
              left: 20,
              bottom: 5,
            }}
          >
            <CartesianGrid strokeDasharray='3 3' />
            <XAxis dataKey='name' />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey='sends' fill='#8884d8' />
            {!chartOptions.sendsOnly && (
              <Bar dataKey='attempts' fill='#8884d8' />
            )}
          </BarChart>
        </div>
        <h2 className='text-lg font-medium'>Details</h2>
        <div className='flex flex-col gap-4 content-center items-center'>
          {sets.map((set) => (
            <div className='card shadow-md w-full' key={set.id}>
              <Set
                set={set}
                session={session}
                climbs={[]}
                setClimbs={() => {}}
                setName={`Set ${set.set_in_session}`}
              />
            </div>
          ))}
        </div>
      </Page>
    );
  }
}
