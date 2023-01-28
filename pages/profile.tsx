import React, { useState, useEffect } from 'react';
import Page from '@/components/Page';
import { useApi } from '@/lib/useApi';
import { GradeSystem, Gym } from '@/schema';
import CompactTable from '@/components/util/CompactTable';
import Modal from '@/components/util/Modal';
import Input from '@/components/util/Input';
import Form from '@/components/util/Form';
import Select from '@/components/util/Select';
import SelectMultiple from '@/components/util/SelectMultiple';
import { GymsDisciplinesOptions } from '@/schema/pocketbase-types';
import NewGymForm from '@/components/NewGymForm';

const Profile = () => {
  const [gyms, setGyms] = useState<Gym[]>([]);
  const [newGymModalOpen, setNewGymModalOpen] = useState(false);
  const api = useApi();

  useEffect(() => {
    const getGyms = async () => {
      const gyms = await api.getGyms({
        page: 1,
        filter: `user = '${api.getUser()?.id}'`,
        expand: 'grade_systems',
      });
      setGyms(gyms);
    };

    getGyms();
  }, [api]);

  return (
    <Page title='Profile' authRequired>
      <h1 className='text-lg font-bold mb-4'>Profile</h1>
      <section className='card p-4 shadow-lg bg-primary-content'>
        <h2 className='text-lg font-bold mb-4'>My Gyms</h2>
        <CompactTable
          headers={['Name', 'Disciplines', 'Grade System']}
          rows={gyms.map((gym) => ({ ...gym, key: gym.id }))}
          renderRow={(gym) => (
            <tr>
              <td>{gym.name}</td>
              <td>{gym.disciplines.join(', ')}</td>
              <td>
                {gym.expand?.grade_systems
                  ?.map((gradeSystem) => gradeSystem.name)
                  .join(', ')}
              </td>
            </tr>
          )}
        />
        <Modal
          buttonText='Add a new gym'
          id='new-gym'
          buttonClass='btn btn-sm btn-primary self-end mt-4'
          modalOpen={newGymModalOpen}
          setModalOpen={setNewGymModalOpen}
        >
          <NewGymForm
            onSubmit={(gym) => {
              setGyms([...gyms, gym]);
              setNewGymModalOpen(false);
            }}
          />
        </Modal>
      </section>
    </Page>
  );
};

export default Profile;
