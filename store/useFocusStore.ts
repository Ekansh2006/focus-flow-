import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { FocusSession, Distraction } from '@/types';

interface FocusState {
  sessions: FocusSession[];
  currentSession: FocusSession | null;
  isSessionActive: boolean;
  startSession: (taskId: string) => void;
  endSession: (notes?: string) => void;
  pauseSession: () => void;
  resumeSession: () => void;
  addDistraction: (type: string, notes?: string) => void;
  getSessions: () => FocusSession[];
  getSessionById: (id: string) => FocusSession | undefined;
  getSessionsByTaskId: (taskId: string) => FocusSession[];
  getTotalFocusTime: () => number;
  getWeeklyFocusTime: () => number;
  getDailyFocusTime: () => number;
}

export const useFocusStore = create<FocusState>()(
  persist(
    (set, get) => ({
      sessions: [],
      currentSession: null,
      isSessionActive: false,
      
      startSession: (taskId) => set({
        currentSession: {
          id: Date.now().toString(),
          taskId,
          startTime: new Date().toISOString(),
          duration: 0,
          distractions: [],
          completed: false,
        },
        isSessionActive: true,
      }),
      
      endSession: (notes) => {
        const { currentSession, sessions } = get();
        
        if (!currentSession) return;
        
        const endTime = new Date().toISOString();
        const duration = (new Date(endTime).getTime() - new Date(currentSession.startTime).getTime()) / 60000;
        
        const completedSession = {
          ...currentSession,
          endTime,
          duration,
          completed: true,
          notes,
        };
        
        set({
          sessions: [...sessions, completedSession],
          currentSession: null,
          isSessionActive: false,
        });
      },
      
      pauseSession: () => set({ isSessionActive: false }),
      
      resumeSession: () => set({ isSessionActive: true }),
      
      addDistraction: (type, notes) => {
        const { currentSession } = get();
        
        if (!currentSession) return;
        
        const newDistraction: Distraction = {
          id: Date.now().toString(),
          timestamp: new Date().toISOString(),
          type,
          notes,
        };
        
        set({
          currentSession: {
            ...currentSession,
            distractions: [...currentSession.distractions, newDistraction],
          },
        });
      },
      
      getSessions: () => get().sessions,
      
      getSessionById: (id) => {
        return get().sessions.find((session) => session.id === id);
      },
      
      getSessionsByTaskId: (taskId) => {
        return get().sessions.filter((session) => session.taskId === taskId);
      },
      
      getTotalFocusTime: () => {
        return get().sessions.reduce((total, session) => total + session.duration, 0);
      },
      
      getWeeklyFocusTime: () => {
        const oneWeekAgo = new Date();
        oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
        
        return get().sessions
          .filter((session) => new Date(session.startTime) >= oneWeekAgo)
          .reduce((total, session) => total + session.duration, 0);
      },
      
      getDailyFocusTime: () => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        return get().sessions
          .filter((session) => new Date(session.startTime) >= today)
          .reduce((total, session) => total + session.duration, 0);
      },
    }),
    {
      name: 'focus-flow-session-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);