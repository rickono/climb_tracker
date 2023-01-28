import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import PocketBase from 'pocketbase';
import { useRouter } from 'next/router';
import Page from '@/components/Page';
import NewClimb from '@/components/NewClimb';
import Select from '@/components/util/Select';
import { useApi } from '@/lib/useApi';
import { Session, Climb, Gym, Grade, Attempt, ClimbSet } from '@/schema';
import {
  AttemptsResultOptions,
  AttemptsTypeOptions,
  ClimbsAngleOptions,
  ClimbsSettingOptions,
} from '@/schema/pocketbase-types';

const NewAttempt = ({
  session,
  set,
  attemptInSet,
  climbs,
  setClimbs,
  onSubmit,
}: {
  session: Session;
  set: ClimbSet;
  climbs: Climb[];
  attemptInSet: number;
  setClimbs: React.Dispatch<React.SetStateAction<Climb[]>>;
  onSubmit?: (newAttempt: Attempt) => void;
}) => {
  const api = useApi();
  const [attemptData, setAttemptData] = useState<Partial<Attempt>>({
    result: AttemptsResultOptions.progress,
    user: api.getUser()?.id,
    notes: '',
    attempt_date: new Date().toISOString(),
    send: false,
    type: AttemptsTypeOptions.flash,
    set: set.id,
  });
  const [newClimbData, setNewClimbData] = useState<Partial<Climb>>({
    setting: ClimbsSettingOptions.gym,
    user: api.getUser()?.id,
    angle: ClimbsAngleOptions.vertical,
    moves: 1,
    active: true,
  });
  const [newClimb, setNewClimb] = useState<boolean>(false);

  const newClimbCallbacks = {
    onChange: (climb: Climb) => {
      setNewClimbData(climb);
    },
  };

  const createAttempt = async () => {
    const previousAttempts = await api.getAttemptsForSet(
      attemptData.climb ?? ''
    );
    const attemptNumber = previousAttempts.length + 1;

    if (newClimb) {
      const newClimb = await api.createClimb({
        ...newClimbData,
        gym: session.expand?.gym?.id,
      });

      const newAttempt = await api.createAttempt({
        ...attemptData,
        attempt_number: attemptNumber,
        attempt_in_set: attemptInSet,
        user: api.getUser()?.id,
        climb: newClimb.id,
      });

      if (onSubmit) onSubmit(newAttempt);
      setClimbs([...climbs, newClimb]);
    } else {
      const newAttempt = await api.createAttempt({
        ...attemptData,
        attempt_number: attemptNumber,
        attempt_in_set: attemptInSet,
        user: api.getUser()?.id,
      });
      if (onSubmit) onSubmit(newAttempt);
    }
  };

  return (
    <div className=''>
      <div className='px-4 pb-5 sm:px-6'>
        <h3 className='text-lg font-medium'>Log an attempt</h3>
        <p className='mt-1 max-w-2xl text-sm text-gray-500'>
          {`Add a new attempt to set ${set.set_in_session}.`}
        </p>
      </div>
      <div className='border-t border-gray-200 px-4 py-5 flex flex-col gap-4'>
        {!newClimb ? (
          <div className='form-control'>
            <label
              htmlFor='climb'
              className='font-medium text-sm text-gray-600'
            >
              Climb
            </label>
            <select
              className='select select-bordered w-full max-w-xs'
              onChange={(e) =>
                setAttemptData({ ...attemptData, climb: e.target.value })
              }
              value={attemptData.climb || ''}
              name='climb'
            >
              <option disabled value=''>
                Choose a climb
              </option>
              {climbs
                .filter((climb) => climb.active)
                .map((climb) => (
                  <option key={climb.id} value={climb.id}>
                    {climb.name || climb.expand?.grade?.grade || 'Unnamed'}
                  </option>
                ))}
            </select>
            <label className='label'>
              <span className='label-text-alt'>
                Or,{' '}
                <Link
                  href=''
                  className='link link-primary'
                  onClick={(e) => {
                    e.preventDefault();
                    setNewClimb(true);
                  }}
                >
                  create a new climb
                </Link>
                .
              </span>
            </label>
          </div>
        ) : (
          <div className='bg-base-200 p-4 my-4 rounded-md'>
            <NewClimb
              title={`New climb for ${session.expand?.gym?.name}`}
              fixedFields={{ gym: session.expand?.gym?.id }}
              callbacks={newClimbCallbacks}
              hideSubmit
              newClimbData={newClimbData}
              setNewClimbData={setNewClimbData}
              gymId={session.expand?.gym?.id ?? ''}
            />
            <p className='text-xs mt-3'>
              Or,{' '}
              <Link
                href=''
                className='link link-primary'
                onClick={(e) => {
                  e.preventDefault();
                  setNewClimb(false);
                }}
              >
                choose an existing climb
              </Link>
              .
            </p>
          </div>
        )}
        <div className='form-control'>
          <label htmlFor='type' className='text-sm font-medium text-gray-600'>
            What type of attempt was this?
          </label>
          <select
            className='select select-bordered w-full max-w-xs'
            defaultValue='progress'
            onChange={(e) =>
              setAttemptData({
                ...attemptData,
                type: e.target.value as AttemptsTypeOptions,
              })
            }
            name='type'
          >
            <option value='flash'>Flash</option>
            <option value='redpoint'>Redpoint</option>
            <option value='repeat'>Repeat</option>
            <option value='beta'>Beta (no intention of sending)</option>
            <option value='campus'>Campus</option>
          </select>
        </div>
        <div className='form-control'>
          <label
            htmlFor='progress'
            className='text-sm font-medium text-gray-600'
          >
            Progress
          </label>
          <select
            className='select select-bordered w-full max-w-xs'
            onChange={(e) =>
              setAttemptData({
                ...attemptData,
                result: e.target.value as AttemptsResultOptions,
              })
            }
            name='progress'
            value={attemptData.result || 'progress'}
          >
            <option value='progress'>Forward progress</option>
            <option value='plateau'>No progress</option>
            <option value='regression'>Backwards progress</option>
          </select>
          <label className='label cursor-pointer justify-start gap-4'>
            <input
              type='checkbox'
              checked={attemptData.send}
              className='checkbox checkbox-primary'
              onChange={(e) =>
                setAttemptData({ ...attemptData, send: e.target.checked })
              }
            />
            <span className='label-text'>Send</span>
          </label>
        </div>
        <div className='form-control'>
          <label htmlFor='notes' className='text-sm font-medium text-gray-600'>
            Notes
          </label>
          <textarea
            className='textarea textarea-bordered'
            placeholder='Focused on ...'
            onChange={(e) =>
              setAttemptData({ ...attemptData, notes: e.target.value })
            }
          ></textarea>
        </div>
        <button className='btn btn-primary' onClick={createAttempt}>
          Add this attempt
        </button>
      </div>
    </div>
  );
};

export default NewAttempt;
