import Head from 'next/head';
import React, { useState, useEffect } from 'react';
import PocketBase from 'pocketbase';
import { useRouter } from 'next/router';
import Page from '@/components/Page';
import { PhotoIcon } from '@heroicons/react/20/solid';
import { useApi } from '@/lib/useApi';
import { Climb, ClimbSet, GradeSystem, Gym } from '@/schema';
import {
  ClimbsAngleOptions,
  ClimbsDisciplineOptions,
  GradesSystemOptions,
  GradeSystemsDisciplineOptions,
  GymsDisciplinesOptions,
} from '@/schema/pocketbase-types';

const processGrades = (
  grades: { system: string; grade: string; discipline: string; id: string }[]
) => {
  const processedGrades: {
    [key: string]: { [key: string]: { grade: string; id: string }[] };
  } = grades.reduce(
    (proc, grade) => {
      if (!proc[grade.discipline]) {
        proc[grade.discipline] = {};
      }
      if (!proc[grade.discipline][grade.system]) {
        proc[grade.discipline][grade.system] = [];
      }
      proc[grade.discipline][grade.system].push({
        grade: grade.grade,
        id: grade.id,
      });
      return proc;
    },
    { boulder: { hueco: [], font: [] }, sport: { french: [], yds: [] } } as {
      [key: string]: { [key: string]: { grade: string; id: string }[] };
    }
  );
  return processedGrades;
};

export default function NewClimb({
  title,
  hideSubmit,
  callbacks,
  newClimbData,
  setNewClimbData,
  gymId,
}: {
  title: string;
  fixedFields: Partial<Climb>;
  hideSubmit?: boolean;
  callbacks?: Partial<{
    onSubmit: (climb: Climb) => void;
    onChange: (climb: Climb) => void;
  }>;
  newClimbData: Partial<Climb>;
  setNewClimbData: React.Dispatch<React.SetStateAction<Partial<Climb>>>;
  gymId: string;
}) {
  // Grades in the format { discipline: { system: [grade, grade, grade] } }
  const [gym, setGym] = useState<Gym>();
  const api = useApi();

  const onDisciplineRadioChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewClimbData({
      ...newClimbData,
      discipline: e.target.value as ClimbsDisciplineOptions,
    });
  };

  const onSystemRadioChange = (e: React.ChangeEvent<HTMLInputElement>) => {};

  const createClimb = async () => {
    console.log(newClimbData);
    const newClimb = await api.createClimb(newClimbData);
    console.log(newClimb);
    if (callbacks?.onSubmit) {
      callbacks?.onSubmit(newClimb);
    }
  };

  useEffect(() => {
    const getGym = async () => {
      const gym = await api.getGymById(gymId, {
        expand: 'grade_systems,grade_systems.grades(grade_system)',
      });
      console.log(gym);
      setGym(gym);
    };
    getGym();
  }, [api, gymId]);

  return (
    <div className='flex flex-col content-center gap-4'>
      <h3 className='text-md font-medium'>{title}</h3>
      <div className='form-control'>
        <label htmlFor='name' className='text-sm font-medium text-gray-600'>
          Name
        </label>
        <input
          type='text'
          placeholder='Orange crimpy v5 near entrance'
          className='input input-bordered w-full max-w-xs'
          onChange={(e) =>
            setNewClimbData({ ...newClimbData, name: e.target.value })
          }
          name='name'
        />
      </div>
      <div className='form-control'>
        <label
          htmlFor='discipline-radio'
          className='text-sm font-medium text-gray-600'
        >
          Discipline
        </label>
        {gym?.disciplines.map((discipline) => (
          <div className='form-control' key={discipline}>
            <label className='label cursor-pointer justify-start gap-4'>
              <input
                type='radio'
                name='discipline-radio'
                className='radio checked:bg-primary'
                onChange={onDisciplineRadioChange}
                value={discipline as GymsDisciplinesOptions}
                checked={
                  newClimbData.discipline ==
                  (discipline as unknown as ClimbsDisciplineOptions)
                }
              />
              <span className='label-text'>{discipline}</span>
            </label>
          </div>
        ))}
      </div>
      <div className='form-control'>
        <label
          htmlFor='grade-system-radio'
          className='text-sm font-medium text-gray-600'
        >
          Grade
        </label>
        <select
          className='select select-bordered w-full max-w-xs'
          onChange={(e) =>
            setNewClimbData({ ...newClimbData, grade: e.target.value })
          }
          defaultValue=''
        >
          <option disabled value=''>
            Grade
          </option>
          {gym?.expand?.grade_systems
            ?.filter(
              (system) =>
                system.discipline ==
                (newClimbData.discipline as unknown as GradeSystemsDisciplineOptions)
            )[0]
            ?.expand?.['grades(grade_system)']?.sort(
              (gradeA, gradeB) =>
                (gradeA.sort_key ?? 0) - (gradeB.sort_key ?? 0)
            )
            .map((grade) => (
              <option key={grade.id} value={grade.id}>
                {grade.grade}
              </option>
            ))}
        </select>
      </div>
      <div className='form-control'>
        <label htmlFor='angle' className='text-sm font-medium text-gray-600'>
          Wall Angle
        </label>
        <select
          className='select select-bordered w-full max-w-xs'
          value={newClimbData.angle}
          name='angle'
          onChange={(e) =>
            setNewClimbData({
              ...newClimbData,
              angle: e.target.value as ClimbsAngleOptions,
            })
          }
        >
          <option value='slab'>Slab</option>
          <option value='vertical'>Vertical</option>
          <option value='overhang-1'>Slight overhang (20-30 degrees)</option>
          <option value='overhang-2'>Overhang (30-45 degrees)</option>
          <option value='overhang-3'>Steep (45+ degrees)</option>
        </select>
      </div>
      <div className='form-control'>
        <label htmlFor='moves' className='text-sm font-medium text-gray-600'>
          Number of moves
        </label>
        <input
          type='number'
          name='moves'
          className='input input-bordered w-full max-w-xs'
          onChange={(e) =>
            setNewClimbData({
              ...newClimbData,
              moves: parseInt(e.target.value) ?? 1,
            })
          }
          value={String(newClimbData.moves) ?? '1'}
        />
      </div>
      {/* <div className='form-control'>
        <label htmlFor='image' className='text-sm font-medium text-gray-600'>
          Image
        </label>
        <input
          type='file'
          name='image'
          className='file-input file-input-primary w-full max-w-xs file-input-sm'
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) {
              setNewClimbData({
                ...newClimbData,
                image: file,
              });
            }
          }}
        />
      </div> */}
      {!hideSubmit && (
        <button className='btn btn-primary' onClick={createClimb}>
          <label htmlFor='new-climb'>Add climb</label>
        </button>
      )}
    </div>
  );
}
