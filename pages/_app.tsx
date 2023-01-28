import '@/styles/globals.css';
import type { AppProps } from 'next/app';
import { createContext } from 'react';
import { ApiClient } from '@/lib/apiClient';
import PocketBase from 'pocketbase';
import { api, ApiContext } from '@/context/apiContext';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <ApiContext.Provider value={api}>
      <Component {...pageProps} />
    </ApiContext.Provider>
  );
}
