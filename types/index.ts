export type EnergyLevel = 'low' | 'medium' | 'high';

export type TaskPriority = 'low' | 'medium' | 'high';

export type Task = {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  createdAt: string;
  completedAt?: string;
  priority: TaskPriority;
  energyRequired: EnergyLevel;
  estimatedMinutes: number;
  tags?: string[];
};

export type FocusSession = {
  id: string;
  taskId: string;
  startTime: string;
  endTime?: string;
  duration: number;
  distractions: Distraction[];
  completed: boolean;
  notes?: string;
};

export type Distraction = {
  id: string;
  timestamp: string;
  type: string;
  notes?: string;
};

export type UserPreferences = {
  name: string;
  peakFocusTime: 'morning' | 'afternoon' | 'evening' | 'night';
  commonDistractions: string[];
  reminderType: 'notification' | 'sound' | 'vibration' | 'none';
  theme: 'light' | 'dark' | 'system';
  focusDuration: number;
  breakDuration: number;
  onboardingCompleted: boolean;
};

export type WeeklyInsight = {
  week: string;
  tasksCompleted: number;
  totalFocusTime: number;
  averageSessionLength: number;
  mostProductiveDay: string;
  mostProductiveTime: string;
  commonDistractions: {type: string, count: number}[];
  suggestions: string[];
};