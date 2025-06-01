import { create } from 'zustand';

interface LoaderState {
    loading: boolean;
    setLoading: (state: boolean) => void;
}

export const useLoaderStore = create<LoaderState>((set, get) => ({
    loading: false,
    setLoading: (state) => {
        if (get().loading !== state) {
            set({ loading: state });
        }
    },
}));

export const useLoader = () => {
    const { loading, setLoading } = useLoaderStore();
    return { loading, setLoading };
};