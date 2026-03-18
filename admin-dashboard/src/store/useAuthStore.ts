import { create } from 'zustand';
import type { IUser } from '@shared/types';

interface AuthState {
    user: IUser | null;
    isAuthenticated: boolean;
    login: (user: IUser) => void;
    logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => {
    // Try to load initial state from localStorage (for simple persistence, assuming token is in cookie)
    const storedUser = localStorage.getItem('aethelgard_admin');
    const initialUser = storedUser ? JSON.parse(storedUser) : null;

    return {
        user: initialUser,
        isAuthenticated: !!initialUser && initialUser.role === 'admin',
        login: (user) => {
            if (user.role === 'admin') {
                localStorage.setItem('aethelgard_admin', JSON.stringify(user));
                set({ user, isAuthenticated: true });
            }
        },
        logout: () => {
            localStorage.removeItem('aethelgard_admin');
            set({ user: null, isAuthenticated: false });
        }
    };
});
