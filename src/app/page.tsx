'use client';
import React from 'react';
import { useRouter } from 'next/navigation';
export default function Home() {
  const router = useRouter();
  return (
    <div className='flex min-h-screen flex-col items-center justify-center bg-white'>
      <div className='p-3'>
        <p className='text-[38px] w-full text-center font-bold'>STRATEGY</p>
        <div className='mt-5'>
          <button
            className='btn btn-block m-2'
            onClick={() => {
              router.push('/strategy-1');
            }}
          >
            Strategy 1
          </button>
          <button
            className='btn btn-block m-2'
            onClick={() => {
              router.push('/strategy-2');
            }}
          >
            Strategy 2
          </button>
        </div>
      </div>
    </div>
  );
}
