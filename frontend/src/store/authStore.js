import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { authApi } from '../api/authApi';
import { AUTH_TOKEN_KEY, USER_DATA_KEY } from '../utils/constants';
import toast from 'react-hot-toast';

export const useAuthStore = create(
  persist(
    (set, get) => ({
      // State
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      /**
       * Login user
       * @param {Object} credentials - { email, password }
       */
      login: async (credentials) => {
        set({ isLoading: true, error: null });
        
        const { data, error } = await authApi.login(credentials);
        
        if (data && data.success) {
          // Store token in localStorage
          localStorage.setItem(AUTH_TOKEN_KEY, data.token);
          localStorage.setItem(USER_DATA_KEY, JSON.stringify(data.user));
          
          set({
            user: data.user,
            token: data.token,
            isAuthenticated: true,
            isLoading: false,
            error: null,
          });
          
          toast.success(`Welcome back, ${data.user.name}!`);
          return { success: true };
        } else {
          set({ 
            isLoading: false, 
            error: error?.message || 'Login failed' 
          });
          return { 
            success: false, 
            error: error?.message || 'Login failed' 
          };
        }
      },

      /**
       * Signup new user
       * @param {Object} userData - { name, email, password }
       */
      signup: async (userData) => {
        set({ isLoading: true, error: null });
        
        const { data, error } = await authApi.signup(userData);
        
        if (data) {
          localStorage.setItem(AUTH_TOKEN_KEY, data.token);
          localStorage.setItem(USER_DATA_KEY, JSON.stringify(data.user));
          
          set({
            user: data.user,
            token: data.token,
            isAuthenticated: true,
            isLoading: false,
            error: null,
          });
          
          toast.success('Account created successfully!');
          return { success: true };
        } else {
          set({ isLoading: false, error: error.message });
          return { success: false, error: error.message };
        }
      },

      /**
       * Logout user
       */
      logout: async () => {
        try {
          // Call backend to invalidate token
          await authApi.logout();
        } catch (error) {
          console.error('Logout API error:', error);
        } finally {
          // Clear localStorage
          localStorage.removeItem(AUTH_TOKEN_KEY);
          localStorage.removeItem(USER_DATA_KEY);
          
          set({
            user: null,
            token: null,
            isAuthenticated: false,
            error: null,
          });
          
          toast.success('Logged out successfully');
        }
      },

      /**
       * Load user from localStorage (on app init)
       */
      loadUser: () => {
        const token = localStorage.getItem(AUTH_TOKEN_KEY);
        const userData = localStorage.getItem(USER_DATA_KEY);
        
        if (token && userData) {
          try {
            const user = JSON.parse(userData);
            set({
              user,
              token,
              isAuthenticated: true,
            });
          } catch (error) {
            console.error('Failed to parse user data:', error);
            localStorage.removeItem(AUTH_TOKEN_KEY);
            localStorage.removeItem(USER_DATA_KEY);
          }
        }
      },

      /**
       * Update user profile
       * @param {Object} updates - Profile updates
       */
      updateProfile: async (updates) => {
        set({ isLoading: true, error: null });
        
        const { data, error } = await authApi.updateProfile(updates);
        
        if (data && data.success) {
          const updatedUser = { ...get().user, ...updates };
          localStorage.setItem(USER_DATA_KEY, JSON.stringify(updatedUser));
          
          set({
            user: updatedUser,
            isLoading: false,
            error: null,
          });
          
          toast.success('Profile updated successfully!');
          return { success: true };
        } else {
          set({ isLoading: false, error: error?.message || 'Failed to update profile' });
          return { success: false, error: error?.message || 'Failed to update profile' };
        }
      },

      /**
       * Change password
       * @param {Object} passwords - { currentPassword, newPassword }
       */
      changePassword: async (passwords) => {
        set({ isLoading: true, error: null });
        
        const { data, error } = await authApi.changePassword(passwords);
        
        if (data && data.success) {
          set({ isLoading: false, error: null });
          toast.success('Password changed successfully!');
          return { success: true };
        } else {
          set({ isLoading: false, error: error?.message || 'Failed to change password' });
          return { success: false, error: error?.message || 'Failed to change password' };
        }
      },

      /**
       * Delete user account
       */
      deleteAccount: async () => {
        set({ isLoading: true, error: null });
        
        const { data, error } = await authApi.deleteAccount();
        
        if (data && data.success) {
          // Clear everything on successful deletion
          localStorage.removeItem(AUTH_TOKEN_KEY);
          localStorage.removeItem(USER_DATA_KEY);
          
          set({
            user: null,
            token: null,
            isAuthenticated: false,
            isLoading: false,
            error: null,
          });
          
          toast.success('Account deleted successfully');
          return { success: true };
        } else {
          set({ isLoading: false, error: error?.message || 'Failed to delete account' });
          return { success: false, error: error?.message || 'Failed to delete account' };
        }
      },

      /**
       * Clear errors
       */
      clearError: () => set({ error: null }),

      /**
       * Set authentication state (for external use)
       */
      setAuth: (user, token) => {
        localStorage.setItem(AUTH_TOKEN_KEY, token);
        localStorage.setItem(USER_DATA_KEY, JSON.stringify(user));
        set({ user, token, isAuthenticated: true });
      },

      /**
       * Clear authentication state (for external use)
       */
      clearAuth: () => {
        localStorage.removeItem(AUTH_TOKEN_KEY);
        localStorage.removeItem(USER_DATA_KEY);
        set({ user: null, token: null, isAuthenticated: false });
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);

export default useAuthStore;