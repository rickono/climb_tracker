import React, { useState, useEffect } from 'react';

import { useApi } from '@/lib/useApi';

import { GymsDisciplinesOptions } from '@/schema/pocketbase-types';
import { GradeSystem, Gym } from '@/schema';

import Form from './util/Form';
import Input from './util/Input';
import SelectMultiple from './util/SelectMultiple';
import Select from './util/Select';

import { arrayToggle, objectToggle } from '@/lib/utils';

const NewGymForm = ({
  onSubmit = () => {},
}: {
  onSubmit?: (newGym: Gym) => void;
}) => {
  const api = useApi();

  const [gradeSystems, setGradeSystems] = useState<GradeSystem[]>([]);
  const [formData, setFormData] = useState<{
    name: string;
    user: string;
    disciplines: {
      [key in GymsDisciplinesOptions]?: string;
    };
  }>({
    name: '',
    user: api.getUser()?.id ?? '',
    disciplines: {},
  });

  useEffect(() => {
    const getGradeSystems = async () => {
      const gradeSystems = await api.getGradeSystems({});
      setGradeSystems(gradeSystems);
    };
    getGradeSystems();
  }, [api]);

  const addGym = async () => {
    const gym = await api.createGym(
      {
        name: formData.name,
        user: formData.user,
        disciplines: Object.keys(
          formData.disciplines
        ) as GymsDisciplinesOptions[],
        grade_systems: Object.values(formData.disciplines),
      },
      { expand: 'grade_systems' }
    );
    return gym;
  };

  return (
    <Form
      onSubmit={async (e) => {
        const gym = await addGym();
        onSubmit(gym);
      }}
    >
      <h2 className='font-bold'>Add a new gym</h2>
      <Input
        label='Name'
        name='name'
        placeholder='My climbing gym'
        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
      />
      <SelectMultiple
        label='Disciplines'
        options={[
          {
            label: 'Bouldering',
            value: 'bouldering',
            checked: GymsDisciplinesOptions.boulder in formData.disciplines,
            onChange: (e) =>
              setFormData({
                ...formData,
                disciplines: objectToggle(
                  formData.disciplines,
                  GymsDisciplinesOptions.boulder,
                  ''
                ),
              }),
          },
          {
            label: 'Sport',
            value: 'sport',
            checked: GymsDisciplinesOptions.sport in formData.disciplines,
            onChange: (e) =>
              setFormData({
                ...formData,
                disciplines: objectToggle(
                  formData.disciplines,
                  GymsDisciplinesOptions.sport,
                  ''
                ),
              }),
          },
        ]}
      />
      {Object.keys(formData.disciplines).map((discipline) => (
        <Select
          label={`Grade system (${discipline})`}
          name={discipline}
          options={gradeSystems
            .filter(
              (gradeSystem) =>
                (gradeSystem.discipline as string) == (discipline as string)
            )
            .map((gradeSystem) => ({
              value: gradeSystem.id,
              label: gradeSystem.name,
            }))}
          placeholder='Select a grade system'
          key={discipline}
          onChange={(e) => {
            setFormData({
              ...formData,
              disciplines: {
                ...formData.disciplines,
                [discipline]: e.target.value,
              },
            });
          }}
        />
      ))}
      <button className='btn btn-sm btn-primary self-end' type='submit'>
        Save
      </button>
    </Form>
  );
};

export default NewGymForm;
