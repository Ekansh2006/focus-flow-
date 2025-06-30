import { Task, EnergyLevel } from '@/types';

// Mock AI suggestions for task prioritization
export const getTaskSuggestions = (
  tasks: Task[], 
  currentEnergy: EnergyLevel
): Task[] => {
  // Sort tasks based on energy level and priority
  return [...tasks].sort((a, b) => {
    // Match energy level with task requirements
    const energyMatch = (task: Task): number => {
      if (currentEnergy === 'high' && task.energyRequired === 'high') return 3;
      if (currentEnergy === 'medium' && task.energyRequired === 'medium') return 3;
      if (currentEnergy === 'low' && task.energyRequired === 'low') return 3;
      if (currentEnergy === 'high' && task.energyRequired === 'medium') return 2;
      if (currentEnergy === 'medium' && task.energyRequired === 'low') return 2;
      if (currentEnergy === 'medium' && task.energyRequired === 'high') return 1;
      if (currentEnergy === 'low' && task.energyRequired === 'medium') return 1;
      if (currentEnergy === 'low' && task.energyRequired === 'high') return 0;
      return 1;
    };

    // Calculate scores based on energy match and priority
    const scoreA = energyMatch(a) + (a.priority === 'high' ? 3 : a.priority === 'medium' ? 2 : 1);
    const scoreB = energyMatch(b) + (b.priority === 'high' ? 3 : b.priority === 'medium' ? 2 : 1);
    
    return scoreB - scoreA;
  });
};

// Mock AI-generated focus tips
export const getFocusTips = (distractionType?: string): string => {
  const generalTips = [
    "Take a deep breath and reset your attention.",
    "Try the 5-4-3-2-1 technique: notice 5 things you see, 4 things you feel, 3 things you hear, 2 things you smell, and 1 thing you taste.",
    "Set a smaller goal for the next 10 minutes.",
    "Stand up, stretch, and then return to your task with renewed focus.",
    "Write down what's distracting you on a piece of paper to address later.",
    "Try the Pomodoro technique: 25 minutes of focus, then a 5-minute break.",
    "Close all unnecessary tabs and apps.",
    "Put your phone in another room or on Do Not Disturb mode.",
    "Drink a glass of water and reset your posture.",
    "Remind yourself why this task matters to you.",
  ];

  const specificTips: Record<string, string[]> = {
    "social media": [
      "Try a website blocker extension for social media sites.",
      "Schedule specific times to check social media instead of doing it randomly.",
      "Delete social media apps from your phone during work hours.",
      "Turn off notifications from social media apps.",
    ],
    "noise": [
      "Use noise-cancelling headphones or earplugs.",
      "Try ambient background sounds or white noise.",
      "Move to a quieter location if possible.",
      "Use a 'do not disturb' sign to signal to others you need focus time.",
    ],
    "fatigue": [
      "Take a short 10-minute power nap.",
      "Do some quick exercises to get your blood flowing.",
      "Step outside for fresh air.",
      "Have a healthy snack or drink some water.",
    ],
    "procrastination": [
      "Break your task into smaller, more manageable parts.",
      "Promise yourself a specific reward after completing the task.",
      "Use the 'two-minute rule': if it takes less than two minutes, do it now.",
      "Start with the easiest part of the task to build momentum.",
    ],
  };

  if (distractionType && specificTips[distractionType]) {
    const typeSpecificTips = specificTips[distractionType];
    return typeSpecificTips[Math.floor(Math.random() * typeSpecificTips.length)];
  }

  return generalTips[Math.floor(Math.random() * generalTips.length)];
};

// Mock AI-generated break activities
export const getBreakActivities = (duration: number): string[] => {
  const shortBreaks = [
    "Take 5 deep breaths",
    "Stretch your arms and shoulders",
    "Look at something 20 feet away for 20 seconds (20-20-20 rule)",
    "Drink a glass of water",
    "Do 10 jumping jacks",
    "Stand up and stretch your legs",
    "Rest your eyes for a minute",
    "Practice good posture",
    "Roll your shoulders and neck",
    "Tidy up your workspace",
  ];

  const mediumBreaks = [
    "Take a short walk",
    "Do a quick meditation session",
    "Make a cup of tea or coffee",
    "Call a friend for a quick chat",
    "Do some light stretching",
    "Listen to a favorite song",
    "Write in a journal for a few minutes",
    "Water your plants",
    "Do a quick breathing exercise",
    "Read a few pages of a book",
  ];

  const longBreaks = [
    "Go for a 15-minute walk outside",
    "Do a proper workout session",
    "Prepare and eat a healthy snack",
    "Take a power nap (15-20 minutes)",
    "Practice a hobby for a few minutes",
    "Do a household chore",
    "Call a friend or family member",
    "Meditate for 10-15 minutes",
    "Stretch your whole body",
    "Plan your next few hours or tomorrow",
  ];

  if (duration <= 5) {
    return shortBreaks.sort(() => 0.5 - Math.random()).slice(0, 3);
  } else if (duration <= 15) {
    return mediumBreaks.sort(() => 0.5 - Math.random()).slice(0, 3);
  } else {
    return longBreaks.sort(() => 0.5 - Math.random()).slice(0, 3);
  }
};

// Mock AI-generated weekly insights
export const generateWeeklyInsights = (
  tasksCompleted: number,
  totalFocusTime: number,
  averageSessionLength: number,
  commonDistractions: {type: string, count: number}[]
): string[] => {
  const insights = [];

  // Productivity insights
  if (tasksCompleted > 20) {
    insights.push("You completed an impressive number of tasks this week! Great job staying productive.");
  } else if (tasksCompleted > 10) {
    insights.push("You had a solid week of task completion. Keep up the good work!");
  } else {
    insights.push("You completed fewer tasks than usual this week. Consider breaking larger tasks into smaller ones to build momentum.");
  }

  // Focus time insights
  if (totalFocusTime > 15 * 60) { // More than 15 hours
    insights.push("You spent a significant amount of time in focused work this week. Make sure to balance with adequate rest.");
  } else if (totalFocusTime > 10 * 60) { // More than 10 hours
    insights.push("You maintained a healthy amount of focus time this week. Well done!");
  } else {
    insights.push("Your total focus time was lower than optimal this week. Try scheduling specific focus blocks in your calendar.");
  }

  // Session length insights
  if (averageSessionLength > 45) {
    insights.push("Your focus sessions are quite long. Consider if shorter, more intense sessions might be more effective for certain tasks.");
  } else if (averageSessionLength > 25) {
    insights.push("Your average session length is in the optimal range for deep work. Great job!");
  } else {
    insights.push("Your focus sessions tend to be short. Try gradually increasing session length to build focus stamina.");
  }

  // Distraction insights
  if (commonDistractions.length > 0) {
    const topDistraction = commonDistractions[0];
    insights.push(`Your most common distraction is ${topDistraction.type}. Try implementing specific strategies to minimize this interruption.`);
  } else {
    insights.push("You've done a great job managing distractions this week!");
  }

  // Add a random general suggestion
  const generalSuggestions = [
    "Try working in a different environment next week to see if it affects your productivity.",
    "Consider batch processing similar tasks together to reduce context switching.",
    "Experiment with working during different times of day to find your optimal focus periods.",
    "Try the 'eat the frog' technique by tackling your most challenging task first thing in the morning.",
    "Schedule buffer time between tasks to allow your brain to reset.",
    "Set clear intentions at the start of each focus session to improve concentration.",
    "Practice mindfulness for 5 minutes before starting important tasks.",
    "Try using background noise or music without lyrics to enhance focus.",
    "Experiment with different break activities to see what helps you refresh most effectively.",
    "Consider tracking your energy levels throughout the day to identify your personal patterns.",
  ];

  insights.push(generalSuggestions[Math.floor(Math.random() * generalSuggestions.length)]);

  return insights;
};