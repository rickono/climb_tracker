import { createContext } from 'react';
import { ApiClient } from '@/lib/apiClient';
import PocketBase from 'pocketbase';

export const api = new ApiClient(
  new PocketBase(process.env.NEXT_PUBLIC_POCKETBASE)
);
export const ApiContext = createContext<ApiClient>(api);
