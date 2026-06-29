import { useState, useEffect } from 'react';
import { DailyMetrics, WorkoutType } from '../types';
import { 
  Flame, 
  Footprints, 
  TrendingUp, 
  Droplets, 
  Heart, 
  Plus, 
  Minus, 
  Play, 
  ChevronRight,
  Sparkles,
  Zap
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface DashboardProps {
  metrics: DailyMetrics;
  onUpdateMetrics: (updater: (prev: DailyMetrics) => DailyMetrics) => void;
  onStartWorkout: (type: WorkoutType) => void;
  streakDays: number;
  points: number;
}

export default function Dashboard({ 
  metrics, 
  onUpdateMetrics, 
  onStartWorkout,
  streakDays,
  points
}: DashboardProps) {
  const [pulse, setPulse] = useState(false);
  const [showWaterSuccess, setShowWaterSuccess] = useState(false);

  // Heartbeat animation based on simulated heart rate
  useEffect(() => {
    // Determine pulse frequency (lower bpm = slower, higher bpm = faster pulse)
    const intervalTime = Math.max(300, Math.min(1500, (60 / metrics.heartRate) * 1000));
    const interval = setInterval(() => {
      setPulse(prev => !prev);
    }, intervalTime);

    return () => clearInterval(interval);
  }, [metrics.heartRate]);

  const handleAddWater = (amount: number) => {
    onUpdateMetrics(prev => {
      const newWater = Math.max(0, prev.waterIntake + amount);
      if (newWater >= prev.waterGoal && prev.waterIntake < prev.waterGoal) {
        setShowWaterSuccess(true);
        setTimeout(() => setShowWaterSuccess(false), 3000);
      }
      return { ...prev, waterIntake: newWater };
    });
  };

  // Ring calculations
  const calculateRingParams = (value: number, goal: number, radius: number) => {
    const circumference = 2 * Math.PI * radius;
    const percentage = Math.min(1, value / goal);
    const strokeDashoffset = circumference * (1 - percentage);
    return { circumference, strokeDashoffset };
  };

  const stepsRing = calculateRingParams(metrics.steps, metrics.stepGoal, 38);
  const caloriesRing = calculateRingParams(metrics.caloriesBurned, metrics.calorieGoal, 26);
  const minutesRing = calculateRingParams(metrics.activeMinutes, metrics.activeMinutesGoal, 14);

  // Activity list for Quick Start
  const quickWorkouts: { type: WorkoutType; label: string; icon: any; color: string; bg: string }[] = [
    { type: 'Running', label: 'Outdoor Run', icon: Play, color: 'text-rose-500', bg: 'bg-rose-500/10' },
    { type: 'Cycling', label: 'Cycling Ride', icon: Play, color: 'text-sky-500', bg: 'bg-sky-500/10' },
    { type: 'Strength', label: 'Weight Lifting', icon: Play, color: 'text-amber-500', bg: 'bg-amber-500/10' },
    { type: 'Yoga', label: 'Yoga Flow', icon: Play, color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
  ];

  return (
    <div className="space-y-5 pb-6 overflow-y-auto max-h-[100%] select-none scrollbar-none" id="dashboard-viewport">
      {/* Dynamic Welcome Header */}
      <div className="flex items-center justify-between" id="header-section">
        <div>
          <span className="text-xs font-mono text-zinc-500 uppercase tracking-widest">Active Today</span>
          <h2 className="text-xl font-semibold text-white tracking-tight flex items-center gap-1.5">
            Hey Alex! <Sparkles className="w-4 h-4 text-[#CCFF00] animate-pulse" />
          </h2>
        </div>
        <div className="flex items-center gap-2" id="header-badges">
          <div className="bg-amber-500/10 border border-amber-500/20 rounded-full px-2.5 py-1 flex items-center gap-1">
            <Zap className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
            <span className="text-xs font-semibold text-amber-400 font-mono">{streakDays}d</span>
          </div>
          <div className="bg-[#CCFF00]/10 border border-[#CCFF00]/20 rounded-full px-2.5 py-1 flex items-center gap-1">
            <span className="text-xs font-semibold text-[#CCFF00] font-mono">{points} pts</span>
          </div>
        </div>
      </div>

      {/* Ring Ring Circular Progress Visualizer */}
      <div className="bg-zinc-900/60 backdrop-blur-md border border-zinc-850 rounded-2xl p-5 flex items-center justify-between shadow-xl" id="activity-rings-card">
        <div className="relative w-28 h-28 flex items-center justify-center" id="svg-rings-wrapper">
          {/* SVG Progress Rings */}
          <svg className="w-full h-full transform -rotate-90">
            {/* Steps Ring (Outer) */}
            <circle cx="56" cy="56" r="38" className="stroke-zinc-800" strokeWidth="6" fill="transparent" />
            <circle 
              cx="56" cy="56" r="38" 
              className="stroke-[#CCFF00] transition-all duration-500 ease-out" 
              strokeWidth="6" 
              fill="transparent"
              strokeDasharray={stepsRing.circumference}
              strokeDashoffset={stepsRing.strokeDashoffset}
              strokeLinecap="round"
            />

            {/* Calories Ring (Middle) */}
            <circle cx="56" cy="56" r="26" className="stroke-zinc-800" strokeWidth="6" fill="transparent" />
            <circle 
              cx="56" cy="56" r="26" 
              className="stroke-amber-400 transition-all duration-500 ease-out" 
              strokeWidth="6" 
              fill="transparent"
              strokeDasharray={caloriesRing.circumference}
              strokeDashoffset={caloriesRing.strokeDashoffset}
              strokeLinecap="round"
            />

            {/* Active Minutes Ring (Inner) */}
            <circle cx="56" cy="56" r="14" className="stroke-zinc-800" strokeWidth="6" fill="transparent" />
            <circle 
              cx="56" cy="56" r="14" 
              className="stroke-emerald-400 transition-all duration-500 ease-out" 
              strokeWidth="6" 
              fill="transparent"
              strokeDasharray={minutesRing.circumference}
              strokeDashoffset={minutesRing.strokeDashoffset}
              strokeLinecap="round"
            />
          </svg>
          <div className="absolute flex flex-col items-center justify-center text-center" id="ring-center-stats">
            <span className="text-sm font-bold text-white font-mono">
              {Math.round((metrics.steps / metrics.stepGoal) * 100)}%
            </span>
            <span className="text-[9px] text-zinc-400 font-medium">Done</span>
          </div>
        </div>

        {/* Legend Panel */}
        <div className="flex-1 pl-5 space-y-2.5" id="rings-legend">
          <div className="flex items-center justify-between" id="legend-steps">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#CCFF00]"></span>
              <span className="text-xs text-zinc-300 font-medium">Steps</span>
            </div>
            <div className="text-right">
              <p className="text-xs font-semibold text-white font-mono">{metrics.steps.toLocaleString()}</p>
              <p className="text-[10px] text-zinc-500 font-mono">/ {metrics.stepGoal.toLocaleString()}</p>
            </div>
          </div>
          <div className="flex items-center justify-between" id="legend-calories">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-amber-400"></span>
              <span className="text-xs text-zinc-300 font-medium">Calories</span>
            </div>
            <div className="text-right">
              <p className="text-xs font-semibold text-white font-mono">{metrics.caloriesBurned} kcal</p>
              <p className="text-[10px] text-zinc-500 font-mono">/ {metrics.calorieGoal} kcal</p>
            </div>
          </div>
          <div className="flex items-center justify-between" id="legend-minutes">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
              <span className="text-xs text-zinc-300 font-medium">Active</span>
            </div>
            <div className="text-right">
              <p className="text-xs font-semibold text-white font-mono">{metrics.activeMinutes} min</p>
              <p className="text-[10px] text-zinc-500 font-mono">/ {metrics.activeMinutesGoal} min</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Core Biometrics Stats Grid */}
      <div className="grid grid-cols-2 gap-3" id="stats-grid">
        {/* Step Meter Card */}
        <div className="bg-zinc-900/40 border border-zinc-800 rounded-xl p-3.5 flex flex-col justify-between" id="steps-card">
          <div className="flex justify-between items-start">
            <div className="bg-[#CCFF00]/10 p-2 rounded-lg">
              <Footprints className="w-4 h-4 text-[#CCFF00]" />
            </div>
            <span className="text-[10px] font-mono font-medium text-[#CCFF00]">Target Reached</span>
          </div>
          <div className="mt-4">
            <h4 className="text-zinc-400 text-[10px] font-medium uppercase tracking-wider">Steps</h4>
            <p className="text-lg font-bold text-white font-mono mt-0.5">{metrics.steps.toLocaleString()}</p>
            <div className="w-full bg-zinc-800 rounded-full h-1 mt-2 overflow-hidden">
              <div 
                className="bg-[#CCFF00] h-1 rounded-full transition-all duration-300"
                style={{ width: `${Math.min(100, (metrics.steps / metrics.stepGoal) * 100)}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* Calories Burned Card */}
        <div className="bg-zinc-900/40 border border-zinc-800 rounded-xl p-3.5 flex flex-col justify-between" id="calories-card">
          <div className="flex justify-between items-start">
            <div className="bg-amber-400/10 p-2 rounded-lg">
              <Flame className="w-4 h-4 text-amber-400" />
            </div>
            <span className="text-[10px] font-mono font-medium text-amber-400">Active</span>
          </div>
          <div className="mt-4">
            <h4 className="text-zinc-400 text-[10px] font-medium uppercase tracking-wider">Calories</h4>
            <p className="text-lg font-bold text-white font-mono mt-0.5">{metrics.caloriesBurned} <span className="text-xs text-zinc-400 font-normal">kcal</span></p>
            <div className="w-full bg-zinc-800 rounded-full h-1 mt-2 overflow-hidden">
              <div 
                className="bg-amber-400 h-1 rounded-full transition-all duration-300"
                style={{ width: `${Math.min(100, (metrics.caloriesBurned / metrics.calorieGoal) * 100)}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* Dynamic Heart Rate Monitor (With Pulsing Heart relative to sensor bpm) */}
        <div className="bg-zinc-900/40 border border-zinc-800 rounded-xl p-3.5 flex flex-col justify-between" id="heart-rate-card">
          <div className="flex justify-between items-start">
            <div className="bg-red-500/10 p-2 rounded-lg relative">
              <Heart 
                className={`w-4 h-4 text-red-500 transition-all duration-150 ${pulse ? 'scale-125' : 'scale-100'}`} 
              />
            </div>
            <div className="flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span>
              <span className="text-[10px] text-emerald-400 font-mono">Live</span>
            </div>
          </div>
          <div className="mt-4">
            <h4 className="text-zinc-400 text-[10px] font-medium uppercase tracking-wider">Heart Rate</h4>
            <p className="text-lg font-bold text-white font-mono mt-0.5">
              {metrics.heartRate} <span className="text-xs text-zinc-400 font-normal">BPM</span>
            </p>
            <span className="text-[10px] text-zinc-500 font-medium flex items-center gap-1 mt-1">
              {metrics.heartRate > 100 ? 'Elevated (Active)' : metrics.heartRate < 60 ? 'Bradycardia' : 'Healthy Resting'}
            </span>
          </div>
        </div>

        {/* Active Minutes Card */}
        <div className="bg-zinc-900/40 border border-zinc-800 rounded-xl p-3.5 flex flex-col justify-between" id="active-minutes-card">
          <div className="flex justify-between items-start">
            <div className="bg-emerald-500/10 p-2 rounded-lg">
              <TrendingUp className="w-4 h-4 text-emerald-400" />
            </div>
            <span className="text-[10px] font-mono font-medium text-emerald-400">Minutes</span>
          </div>
          <div className="mt-4">
            <h4 className="text-zinc-400 text-[10px] font-medium uppercase tracking-wider">Active Duration</h4>
            <p className="text-lg font-bold text-white font-mono mt-0.5">
              {metrics.activeMinutes} <span className="text-xs text-zinc-400 font-normal">MIN</span>
            </p>
            <div className="w-full bg-zinc-800 rounded-full h-1 mt-2 overflow-hidden">
              <div 
                className="bg-emerald-400 h-1 rounded-full transition-all duration-300"
                style={{ width: `${Math.min(100, (metrics.activeMinutes / metrics.activeMinutesGoal) * 100)}%` }}
              ></div>
            </div>
          </div>
        </div>
      </div>

      {/* Water Hydration Tracker Module */}
      <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-4 relative overflow-hidden" id="hydration-card">
        <AnimatePresence>
          {showWaterSuccess && (
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="absolute inset-x-0 top-0 bg-sky-500/90 text-white py-1 px-3 text-center text-[11px] font-semibold tracking-wide flex items-center justify-center gap-1 z-10"
              id="water-target-banner"
            >
              <Sparkles className="w-3 h-3 text-amber-300" /> Daily Hydration Goal Reached!
            </motion.div>
          )}
        </AnimatePresence>

        <div className="flex justify-between items-center" id="water-header">
          <div>
            <h3 className="text-sm font-semibold text-white tracking-tight flex items-center gap-1.5">
              <Droplets className="w-4 h-4 text-sky-400" /> Water Hydration
            </h3>
            <p className="text-[11px] text-zinc-400 mt-0.5">
              {metrics.waterIntake}ml of {metrics.waterGoal}ml logged
            </p>
          </div>
          <div className="flex gap-2" id="water-controls">
            <button 
              onClick={() => handleAddWater(-250)}
              className="p-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 text-zinc-400 hover:text-white transition"
              id="remove-water-btn"
            >
              <Minus className="w-3.5 h-3.5" />
            </button>
            <button 
              onClick={() => handleAddWater(250)}
              className="p-1.5 rounded-lg bg-sky-500 hover:bg-sky-400 text-white font-medium flex items-center gap-1 text-xs transition"
              id="add-water-btn"
            >
              <Plus className="w-3.5 h-3.5" /> 250ml
            </button>
          </div>
        </div>

        {/* Simulated Water Bottle Visual Gauge */}
        <div className="w-full h-12 bg-zinc-950 rounded-lg mt-4 border border-zinc-800 relative overflow-hidden flex items-center justify-center" id="water-gauge">
          <div 
            className="absolute left-0 bottom-0 top-0 bg-sky-500/20 transition-all duration-500 ease-out flex items-center" 
            style={{ width: `${Math.min(100, (metrics.waterIntake / metrics.waterGoal) * 100)}%` }}
          >
            {/* Animated liquid waves inside standard styling */}
            <div className="absolute right-0 top-0 bottom-0 w-3 bg-sky-400/40 animate-pulse border-r border-sky-400/50"></div>
          </div>
          <span className="text-[10px] font-mono text-zinc-400 font-bold tracking-widest uppercase z-10">
            Bottle Status: {Math.round((metrics.waterIntake / metrics.waterGoal) * 100)}% Filled
          </span>
        </div>
      </div>

      {/* Quick Start Activities */}
      <div className="space-y-3" id="quick-start-section">
        <h3 className="text-sm font-semibold text-white tracking-tight">Quick Start Workout</h3>
        <div className="grid grid-cols-2 gap-2.5" id="quick-workouts-grid">
          {quickWorkouts.map((workout) => (
            <button
              key={workout.type}
              onClick={() => onStartWorkout(workout.type)}
              className="flex items-center justify-between p-3 rounded-xl bg-zinc-900/40 border border-zinc-800 hover:bg-zinc-800/50 hover:border-zinc-750 text-left transition group cursor-pointer"
              id={`start-${workout.type.toLowerCase()}-btn`}
            >
              <div className="flex items-center gap-2.5">
                <div className={`${workout.bg} p-2 rounded-lg group-hover:scale-105 transition duration-200`}>
                  <workout.icon className={`w-4 h-4 ${workout.color}`} />
                </div>
                <div>
                  <p className="text-xs font-semibold text-white">{workout.type}</p>
                  <p className="text-[10px] text-zinc-400">{workout.label}</p>
                </div>
              </div>
              <ChevronRight className="w-3.5 h-3.5 text-zinc-500 group-hover:text-white transition group-hover:translate-x-0.5" />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
