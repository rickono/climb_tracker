import React, { useEffect, useState } from 'react';
import { PlusCircleIcon } from '@heroicons/react/20/solid';
import { Attempt, Climb, Grade, Gym, Session, ClimbSet } from '@/schema';
import NewAttempt from '@/components/NewAttempt';
import { useApi } from '@/lib/useApi';
import { PlusIcon, CheckIcon } from '@heroicons/react/20/solid';
import { displaySeconds } from '@/lib/stringify';

const Set = ({
  session,
  set,
  climbs,
  setClimbs,
  setName,
  inProgress = false,
}: {
  session: Session;
  set: ClimbSet;
  climbs: Climb[];
  setClimbs: React.Dispatch<React.SetStateAction<Climb[]>>;
  setName: string;
  inProgress?: boolean;
}) => {
  const [attemptModalOpen, setAttemptModalOpen] = useState(false);
  const [restModalInfo, setRestModalInfo] = useState({
    open: false,
    seconds: '',
    attempt: '',
  });
  const [attempts, setAttempts] = useState<Attempt[]>([]);
  const api = useApi();

  useEffect(() => {
    const fetchAttempts = async () => {
      const attempts = await api.getAttemptsForSet(set.id);
      setAttempts(attempts.sort((a, b) => a.attempt_in_set - b.attempt_in_set));
    };
    fetchAttempts();
  }, [api, set.id]);

  const onSubmitNewAttempt = async (newAttempt: Attempt) => {
    setAttempts((attempts) => [...attempts, newAttempt]);
    setAttemptModalOpen(false);
  };

  const updateRest = async (attemptId: string, rest_seconds: number) => {
    const attempt = await api.updateAttempt(attemptId, { rest_seconds });
    setAttempts((attempts) =>
      attempts.map((a) => (a.id === attempt.id ? attempt : a))
    );
  };

  return (
    <>
      <div className='flex flex-col gap-4 px-4 sm:px-6 py-5 bg-primary-content rounded-lg w-full'>
        <div className='border-b border-gray-200 pb-2'>
          <h3 className='text-lg font-medium'>{setName || 'Set'}</h3>
        </div>
        {attempts.map((attempt, idx) => (
          <React.Fragment key={attempt.id}>
            <div className='grid grid-cols-2'>
              <div className=''>
                <div className='flex gap-2'>
                  <h2 className='text-sm font-bold'>
                    {attempt.expand?.climb?.name}
                  </h2>
                  {attempt.send && (
                    <div className='badge badge-success badge-outline text-xs'>
                      <CheckIcon className='w-3 h-3' />
                      &nbsp;top
                    </div>
                  )}
                </div>
                <h3 className='font-medium text-sm text-gray-500'>
                  {`${attempt.expand?.climb?.expand?.grade?.grade} ${attempt.expand?.climb?.angle} ${attempt.expand?.climb?.discipline}`}
                </h3>
                <h3 className='font-normal text-sm text-gray-500'>
                  {`${
                    attempt.type.charAt(0).toUpperCase() + attempt.type.slice(1)
                  } attempt`}
                </h3>
              </div>
              <div>
                <p className='font-normal text-sm text-gray-500 italic'>
                  {attempt.notes || 'No notes.'}
                </p>
              </div>
            </div>
            {idx < attempts.length - 1 && (
              <div className='divider text-sm font-medium text-gray-500'>
                {attempt.rest_seconds ? (
                  `${displaySeconds(attempt.rest_seconds)} rest`
                ) : (
                  <label
                    htmlFor='rest-modal'
                    className='btn btn-xs btn-ghost gap-2 glass'
                    onClick={() =>
                      setRestModalInfo({
                        ...restModalInfo,
                        attempt: attempt.id,
                        seconds: '',
                      })
                    }
                  >
                    <PlusIcon className='w-4 h-4' />
                    Add rest
                  </label>
                )}
              </div>
            )}
          </React.Fragment>
        ))}
        {inProgress && (
          <label
            htmlFor={`attempt-modal-${set.id}`}
            className='btn w-fit mx-auto btn-sm btn-primary btn-outline gap-2'
          >
            <PlusCircleIcon className='w-4 h-4' />
            Add another attempt
          </label>
        )}
      </div>
      <input
        type='checkbox'
        id={`attempt-modal-${set.id}`}
        className='modal-toggle'
        checked={attemptModalOpen}
        onChange={() => setAttemptModalOpen(!attemptModalOpen)}
      />
      <label
        htmlFor={`attempt-modal-${set.id}`}
        className='modal cursor-pointer'
      >
        <label className='modal-box relative' htmlFor=''>
          <NewAttempt
            session={session}
            attemptInSet={attempts.length + 1}
            climbs={climbs}
            setClimbs={setClimbs}
            set={set}
            onSubmit={onSubmitNewAttempt}
          />
        </label>
      </label>
      <input
        type='checkbox'
        id='rest-modal'
        className='modal-toggle'
        checked={restModalInfo.open}
        onChange={() =>
          setRestModalInfo({ ...restModalInfo, open: !restModalInfo.open })
        }
      />
      <label htmlFor='rest-modal' className='modal cursor-pointer'>
        <label
          className='modal-box relative flex items-end justify-between'
          htmlFor=''
        >
          <div className='form-control'>
            <label htmlFor='name' className='text-sm font-medium text-gray-600'>
              Rest (seconds)
            </label>
            <input
              type='number'
              placeholder='120'
              className='input input-bordered w-full max-w-xs'
              onChange={(e) => {
                setRestModalInfo({ ...restModalInfo, seconds: e.target.value });
              }}
              name='name'
              value={restModalInfo.seconds}
            />
          </div>
          <button
            className='btn btn-primary btn-sm'
            onClick={() => {
              updateRest(
                restModalInfo.attempt,
                parseInt(restModalInfo.seconds)
              );
              setRestModalInfo({ ...restModalInfo, open: false });
            }}
          >
            <CheckIcon className='w-4 h-4' />
          </button>
        </label>
      </label>
    </>
  );
};

export default Set;
