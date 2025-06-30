import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Task, EnergyLevel, TaskPriority } from '@/types';

interface TaskState {
  tasks: Task[];
  addTask: (task: Omit<Task, 'id' | 'createdAt' | 'completed'>) => void;
  updateTask: (id: string, updates: Partial<Task>) => void;
  deleteTask: (id: string) => void;
  completeTask: (id: string) => void;
  uncompleteTask: (id: string) => void;
  getTaskById: (id: string) => Task | undefined;
  getCompletedTasks: () => Task[];
  getIncompleteTasks: () => Task[];
  getTasksByEnergy: (energy: EnergyLevel) => Task[];
  getTasksByPriority: (priority: TaskPriority) => Task[];
  clearCompletedTasks: () => void;
}

export const useTaskStore = create<TaskState>()(
  persist(
    (set, get) => ({
      tasks: [],
      
      addTask: (taskData) => set((state) => ({
        tasks: [
          ...state.tasks,
          {
            ...taskData,
            id: Date.now().toString(),
            createdAt: new Date().toISOString(),
            completed: false,
          },
        ],
      })),
      
      updateTask: (id, updates) => set((state) => ({
        tasks: state.tasks.map((task) => 
          task.id === id ? { ...task, ...updates } : task
        ),
      })),
      
      deleteTask: (id) => set((state) => ({
        tasks: state.tasks.filter((task) => task.id !== id),
      })),
      
      completeTask: (id) => set((state) => ({
        tasks: state.tasks.map((task) => 
          task.id === id 
            ? { ...task, completed: true, completedAt: new Date().toISOString() } 
            : task
        ),
      })),
      
      uncompleteTask: (id) => set((state) => ({
        tasks: state.tasks.map((task) => 
          task.id === id 
            ? { ...task, completed: false, completedAt: undefined } 
            : task
        ),
      })),
      
      getTaskById: (id) => {
        return get().tasks.find((task) => task.id === id);
      },
      
      getCompletedTasks: () => {
        return get().tasks.filter((task) => task.completed);
      },
      
      getIncompleteTasks: () => {
        return get().tasks.filter((task) => !task.completed);
      },
      
      getTasksByEnergy: (energy) => {
        return get().tasks.filter((task) => task.energyRequired === energy && !task.completed);
      },
      
      getTasksByPriority: (priority) => {
        return get().tasks.filter((task) => task.priority === priority && !task.completed);
      },
      
      clearCompletedTasks: () => set((state) => ({
        tasks: state.tasks.filter((task) => !task.completed),
      })),
    }),
    {
      name: 'focus-flow-task-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);