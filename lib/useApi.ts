import { useContext } from 'react';
import { ApiContext } from '../context/apiContext';

export const useApi = () => {
  return useContext(ApiContext);
};
