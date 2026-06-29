export interface DailyMetrics {
  steps: number;
  stepGoal: number;
  caloriesBurned: number;
  calorieGoal: number;
  activeMinutes: number;
  activeMinutesGoal: number;
  waterIntake: number; // in ml
  waterGoal: number;
  sleepHours: number;
  sleepGoal: number;
  heartRate: number; // in bpm
  weight: number; // in kg
}

export type WorkoutType = 'Running' | 'Cycling' | 'Walking' | 'Strength' | 'Yoga' | 'Swimming';

export interface WorkoutSession {
  id: string;
  type: WorkoutType;
  duration: number; // in seconds
  caloriesBurned: number;
  distance?: number; // in km
  avgHeartRate: number;
  timestamp: string; // ISO string
  notes?: string;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlockedAt?: string;
  category: 'steps' | 'calories' | 'workouts' | 'streak';
  threshold: number;
}

export interface UserProfile {
  name: string;
  height: number; // cm
  weight: number; // kg
  age: number;
  gender: 'Male' | 'Female' | 'Other';
  streakDays: number;
  points: number;
}
