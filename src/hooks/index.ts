import { create } from 'zustand'

interface WalletStore {
    address: string;
    setAddress: (address: string) => void;
}

const useWalletStore = create<WalletStore>((set) => ({
    address: '',
    setAddress: (address: string) => set({ address: address }),
}))

export default useWalletStore;