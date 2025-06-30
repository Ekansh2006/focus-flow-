import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { UserPreferences } from '@/types';

interface UserState {
  preferences: UserPreferences;
  setPreferences: (preferences: Partial<UserPreferences>) => void;
  resetPreferences: () => void;
}

const defaultPreferences: UserPreferences = {
  name: '',
  peakFocusTime: 'morning',
  commonDistractions: [],
  reminderType: 'notification',
  theme: 'light',
  focusDuration: 25,
  breakDuration: 5,
  onboardingCompleted: false,
};

export const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      preferences: defaultPreferences,
      setPreferences: (newPreferences) => 
        set((state) => ({
          preferences: { ...state.preferences, ...newPreferences }
        })),
      resetPreferences: () => set({ preferences: defaultPreferences }),
    }),
    {
      name: 'focus-flow-user-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);