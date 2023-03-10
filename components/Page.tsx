import Head from 'next/head';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import Navbar from './Navbar';
import { useApi } from '@/lib/useApi';

export default function Page({
  children,
  title,
  authRequired,
}: {
  children: React.ReactNode;
  title: string;
  authRequired?: boolean;
}) {
  const router = useRouter();
  const api = useApi();
  useEffect(() => {
    if (authRequired && !api.getUser()) {
      router.push('/login');
    }
  }, [authRequired, router, api]);
  return (
    <>
      <Head>
        <title>{title}</title>
        <meta name='description' content='Generated by create next app' />
        <meta name='viewport' content='width=device-width, initial-scale=1' />
        <link rel='icon' href='/favicon.ico' />
      </Head>
      <main>
        <Navbar />
        <div className='w-full bg-base-200'>
          <div className='container min-h-screen flex flex-col gap-4 pt-12 mx-auto md:px-32'>
            {children}
          </div>
        </div>
      </main>
    </>
  );
}
