import React, { useEffect, useState } from 'react';
import {
  ChartBarIcon,
  BookOpenIcon,
  UserIcon,
} from '@heroicons/react/24/outline';
import Link from 'next/link';
import { useApi } from '@/lib/useApi';

const Navbar = () => {
  const api = useApi();
  const [loggedIn, setLoggedIn] = useState(false);
  useEffect(() => {
    setLoggedIn(api.getUser() !== null);
  }, [api]);
  return (
    <div className='navbar bg-base-100 px-4 shadow-lg'>
      <div className='flex-1'>
        <a className='btn btn-ghost normal-case text-xl'>Ascend</a>
      </div>
      <div className='flex-none gap-2'>
        <div className='dropdown dropdown-end'>
          <label tabIndex={0} className='btn btn-ghost btn-circle'>
            <ChartBarIcon className='h-5 w-5' />
          </label>
          <ul
            tabIndex={0}
            className='menu menu-compact dropdown-content mt-3 p-2 shadow bg-base-100 rounded-box w-52'
          >
            <li>
              <a>Stats</a>
            </li>
          </ul>
        </div>
        <div className='dropdown dropdown-end'>
          <label tabIndex={0} className='btn btn-ghost btn-circle'>
            <BookOpenIcon className='h-5 w-5' />
          </label>
          <ul
            tabIndex={0}
            className='menu menu-compact dropdown-content mt-3 p-2 shadow bg-base-100 rounded-box w-52'
          >
            <li>
              <Link href='/climb'>Start a session</Link>
            </li>
            <li>
              <Link href='/climbs'>My Climbs</Link>
            </li>
            <li>
              <Link href='/logbook'>Logbook</Link>
            </li>
          </ul>
        </div>
        <div className='dropdown dropdown-end'>
          <label tabIndex={0} className='btn btn-ghost btn-circle'>
            <UserIcon className='h-5 w-5' />
          </label>
          {loggedIn ? (
            <ul
              tabIndex={0}
              className='menu menu-compact dropdown-content mt-3 p-2 shadow bg-base-100 rounded-box w-52'
            >
              <li>
                <Link href='/profile'>Profile</Link>
              </li>
              <li>
                <a>Settings</a>
              </li>
              <li
                onClick={() => {
                  api.logout();
                }}
              >
                <a>Logout</a>
              </li>
            </ul>
          ) : (
            <ul
              tabIndex={0}
              className='menu menu-compact dropdown-content mt-3 p-2 shadow bg-base-100 rounded-box w-52'
            >
              <li>
                <Link href={'/login'}>Login</Link>
              </li>
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

export default Navbar;
