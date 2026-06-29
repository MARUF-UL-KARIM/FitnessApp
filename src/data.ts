import { DailyMetrics, WorkoutSession, Achievement, UserProfile } from './types';

export const INITIAL_PROFILE: UserProfile = {
  name: "Alex Rivera",
  height: 178,
  weight: 74,
  age: 26,
  gender: "Male",
  streakDays: 4,
  points: 1250,
};

export const INITIAL_METRICS: DailyMetrics = {
  steps: 6420,
  stepGoal: 10000,
  caloriesBurned: 380,
  calorieGoal: 600,
  activeMinutes: 24,
  activeMinutesGoal: 45,
  waterIntake: 1250,
  waterGoal: 2500,
  sleepHours: 7.2,
  sleepGoal: 8.0,
  heartRate: 72,
  weight: 74.0,
};

export const INITIAL_HISTORY: WorkoutSession[] = [
  {
    id: "hist-1",
    type: "Running",
    duration: 1800, // 30 mins
    caloriesBurned: 320,
    distance: 4.2,
    avgHeartRate: 145,
    timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(), // Yesterday
    notes: "Evening jog in the park. Felt energetic!",
  },
  {
    id: "hist-2",
    type: "Strength",
    duration: 2700, // 45 mins
    caloriesBurned: 210,
    avgHeartRate: 118,
    timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days ago
    notes: "Upper body workout focus: Bench press and pull-ups.",
  },
  {
    id: "hist-3",
    type: "Yoga",
    duration: 1200, // 20 mins
    caloriesBurned: 80,
    avgHeartRate: 95,
    timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(), // 3 days ago
    notes: "Morning flexibility routine.",
  },
];

export const ALL_ACHIEVEMENTS: Achievement[] = [
  {
    id: "ach-1",
    title: "First Step",
    description: "Log your first steps of the day",
    icon: "Footprints",
    category: "steps",
    threshold: 1,
  },
  {
    id: "ach-2",
    title: "Step Champion",
    description: "Reach your daily step goal of 10,000 steps",
    icon: "Award",
    category: "steps",
    threshold: 10000,
  },
  {
    id: "ach-3",
    title: "Calorie Burner",
    description: "Burn more than 500 active calories in a day",
    icon: "Flame",
    category: "calories",
    threshold: 500,
  },
  {
    id: "ach-4",
    title: "Super Active",
    description: "Log 60 or more minutes of activity in a single day",
    icon: "TrendingUp",
    category: "streak", // maps to active minutes check
    threshold: 60,
  },
  {
    id: "ach-5",
    title: "Hydration Hero",
    description: "Drink at least 2,000ml of water in a day",
    icon: "Droplets",
    category: "streak", // maps to water check
    threshold: 2000,
  },
  {
    id: "ach-6",
    title: "Dedicated Athlete",
    description: "Maintain a 5-day active workout logging streak",
    icon: "Zap",
    category: "streak",
    threshold: 5,
  }
];
