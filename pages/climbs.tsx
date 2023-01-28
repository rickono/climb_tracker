import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Page from '@/components/Page';
import { Climb } from '@/schema';
import { useApi } from '@/lib/useApi';
import { displayClimbAngle } from '@/lib/stringify';
import {
  ArchiveBoxXMarkIcon,
  ArrowUpTrayIcon,
} from '@heroicons/react/24/outline';
import { ClimbsDisciplineOptions } from '@/schema/pocketbase-types';
import CompactTable from '@/components/util/CompactTable';

const Climbs = () => {
  const [climbs, setClimbs] = useState<Climb[]>([]);

  const api = useApi();
  const router = useRouter();

  useEffect(() => {
    const getClimbs = async () => {
      const climbs = await api.getClimbs({ expand: 'gym,grade' });
      setClimbs(climbs);
      console.log(climbs);
    };
    getClimbs();
  }, [api]);

  const archiveClimb = async (climbId: string) => {
    await api.updateClimb(climbId, { active: false });
    setClimbs((climbs) =>
      climbs.map((climb) => {
        if (climb.id === climbId) {
          return { ...climb, active: false };
        }
        return climb;
      })
    );
  };
  const unarchiveClimb = async (climbId: string) => {
    await api.updateClimb(climbId, { active: true });
    setClimbs((climbs) =>
      climbs.map((climb) => {
        if (climb.id === climbId) {
          return { ...climb, active: true };
        }
        return climb;
      })
    );
  };
  return (
    <Page title='My Climbs'>
      <section className='card bg-primary-content p-4 shadow-lg'>
        <h1 className='text-lg font-bold mb-4'>Active Climbs</h1>
        <h2 className='text-md font-medium mb-3'>Boulders</h2>
        <CompactTable
          headers={[
            'Name',
            'Location',
            'Grade',
            '# Moves',
            'Wall Angle',
            'Archive',
          ]}
          rows={climbs
            .filter((climb) => climb.active)
            .filter(
              (climb) => climb.discipline == ClimbsDisciplineOptions.boulder
            )
            .map((climb) => ({
              ...climb,
              key: climb.id,
            }))}
          renderRow={(climb) => (
            <tr
              onClick={() => router.push(`/climb/${climb.id}`)}
              className='hover cursor-pointer'
            >
              <td>{climb.name}</td>
              <td>{climb.expand?.gym?.name}</td>
              <td>{climb.expand?.grade?.grade}</td>
              <td>{climb.moves}</td>
              <td>{displayClimbAngle(climb.angle)}</td>
              <td>
                <button
                  className='btn btn-circle btn-xs btn-ghost text-error'
                  onClick={() => archiveClimb(climb.id)}
                >
                  <ArchiveBoxXMarkIcon className='h-4 w-4' />
                </button>
              </td>
            </tr>
          )}
        />
      </section>
      <section className='card bg-primary-content p-4 shadow-lg'>
        <h1 className='text-lg font-bold mb-4'>Archived Climbs</h1>
        <h2 className='text-md font-medium mb-3'>Boulders</h2>
        <CompactTable
          headers={[
            'Name',
            'Location',
            'Grade',
            '# Moves',
            'Wall Angle',
            'Unarchive',
          ]}
          rows={climbs
            .filter((climb) => !climb.active)
            .filter(
              (climb) => climb.discipline == ClimbsDisciplineOptions.boulder
            )
            .map((climb) => ({
              ...climb,
              key: climb.id,
            }))}
          renderRow={(climb) => (
            <tr
              onClick={() => router.push(`/climb/${climb.id}`)}
              className='hover cursor-pointer'
            >
              <td>{climb.name}</td>
              <td>{climb.expand?.gym?.name}</td>
              <td>{climb.expand?.grade?.grade}</td>
              <td>{climb.moves}</td>
              <td>{displayClimbAngle(climb.angle)}</td>
              <td>
                <button
                  className='btn btn-circle btn-xs btn-ghost text-success'
                  onClick={() => unarchiveClimb(climb.id)}
                >
                  <ArrowUpTrayIcon className='h-4 w-4' />
                </button>
              </td>
            </tr>
          )}
        />
      </section>
    </Page>
  );
};

export default Climbs;
