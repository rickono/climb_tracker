import Head from 'next/head';
import { useState } from 'react';
import PocketBase from 'pocketbase';
import { useEffect } from 'react';
import Page from '@/components/Page';
import { useApi } from '@/lib/useApi';

export default function Login() {
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const api = useApi();
  const login = async () => {
    api.login(username, password);
  };

  return (
    <Page title='Login'>
      <h1 className='text-xl font-bold'>Login</h1>
      <input
        type='text'
        placeholder='Type here'
        className='input w-full max-w-xs'
        onChange={(e) => setUsername(e.target.value)}
      />
      <input
        placeholder='Type here'
        className='input w-full max-w-xs'
        type='password'
        onChange={(e) => setPassword(e.target.value)}
      />
      <button className='btn btn-primary w-full max-w-xs' onClick={login}>
        Login
      </button>
    </Page>
  );
}
