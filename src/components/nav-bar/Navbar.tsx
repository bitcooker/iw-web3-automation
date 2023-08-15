import React from 'react';
import Container from '@/components/Container';
import Profile from './Profile';

import { WagmiConfig, createConfig, mainnet } from 'wagmi';
import { createPublicClient, http } from 'viem';

const config = createConfig({
  autoConnect: true,
  publicClient: createPublicClient({
    chain: mainnet,
    transport: http(),
  }),
});

const Navbar = () => {
  return (
    <div className='w-full z-10 bg-white drop-shadow-md'>
      <div className='py-4'>
        <Container>
          <div className='flex justify-between'>
            <a href='/'>
              <div className='text-[32px] font-bold text-gray-600'>
                EasyToken
              </div>
            </a>

            <WagmiConfig config={config}>
              <Profile />
            </WagmiConfig>
          </div>
        </Container>
      </div>
    </div>
  );
};

export default Navbar;
