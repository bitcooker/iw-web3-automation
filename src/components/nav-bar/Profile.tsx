import React, { useEffect } from 'react';
import { useAccount, useConnect, useDisconnect } from 'wagmi';
import { InjectedConnector } from 'wagmi/connectors/injected';
import Jazzicon, { jsNumberForAddress } from 'react-jazzicon';
import { clamp } from '@/utils/clamp';
import useWalletStore from '@/hooks';

const Profile = () => {
  const { address, isConnected } = useAccount();
  const { connect } = useConnect({
    connector: new InjectedConnector(),
  });
  const { disconnect } = useDisconnect();
  const walletStore = useWalletStore();

  useEffect(() => {
    if (isConnected) {
      walletStore.setAddress(address!);
    } else {
      walletStore.setAddress('');
    }
  }, [isConnected]);

  return (
    <div className='flex items-center'>
      {isConnected ? (
        <div className='dropdown'>
          <label tabIndex={0} className='btn m-1 flex'>
            <div className='flex items-center'>
              <div className='mr-2'>
                <Jazzicon diameter={30} seed={jsNumberForAddress(address!)} />
              </div>
              <span className='text-md'>{clamp(address!)}</span>
            </div>
          </label>
          <ul
            tabIndex={0}
            className='dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-52 mt-1 border'
          >
            <li>
              <a
                onClick={() => {
                  disconnect();
                }}
              >
                Disconnect
              </a>
            </li>
          </ul>
        </div>
      ) : (
        <button className='btn m-1' onClick={() => connect()}>
          Connect Wallet
        </button>
      )}
    </div>
  );
};
export default Profile;
