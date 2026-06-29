import { useState, useEffect, useRef } from 'react';
import { WorkoutType, WorkoutSession } from '../types';
import { 
  Play, 
  Pause, 
  Square, 
  Flame, 
  Heart, 
  Compass, 
  Timer, 
  ChevronLeft,
  FileText
} from 'lucide-react';
import { motion } from 'motion/react';

interface WorkoutTrackerProps {
  workoutType: WorkoutType;
  onCancel: () => void;
  onFinishWorkout: (session: WorkoutSession) => void;
  currentBpm: number;
}

export default function WorkoutTracker({ 
  workoutType, 
  onCancel, 
  onFinishWorkout,
  currentBpm
}: WorkoutTrackerProps) {
  const [isActive, setIsActive] = useState(true);
  const [seconds, setSeconds] = useState(0);
  const [calories, setCalories] = useState(0);
  const [distance, setDistance] = useState(0);
  const [avgHeartRate, setAvgHeartRate] = useState(currentBpm);
  const [notes, setNotes] = useState('');
  const [isFinishing, setIsFinishing] = useState(false);

  const heartRateHistoryRef = useRef<number[]>([currentBpm]);

  // Handle active timer, distance, calorie multipliers
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    if (isActive && !isFinishing) {
      interval = setInterval(() => {
        setSeconds(prev => {
          const nextSec = prev + 1;
          
          // Calories calculation based on average intensity factors per second
          let calPerSecond = 0.08; // default
          switch (workoutType) {
            case 'Running': calPerSecond = 0.16; break;
            case 'Cycling': calPerSecond = 0.12; break;
            case 'Swimming': calPerSecond = 0.14; break;
            case 'Strength': calPerSecond = 0.08; break;
            case 'Yoga': calPerSecond = 0.05; break;
            default: calPerSecond = 0.07;
          }
          setCalories(Math.round(nextSec * calPerSecond));

          // Distance tracker (for outdoor / track activities)
          const supportsDistance = ['Running', 'Cycling', 'Walking'].includes(workoutType);
          if (supportsDistance) {
            let kmPerSecond = 0;
            switch (workoutType) {
              case 'Running': kmPerSecond = 0.0031; break; // 11 km/h
              case 'Cycling': kmPerSecond = 0.0069; break; // 25 km/h
              default: kmPerSecond = 0.0014; // Walking ~5 km/h
            }
            setDistance(prevDist => parseFloat((prevDist + kmPerSecond).toFixed(3)));
          }

          return nextSec;
        });

        // Record real-time heart rates to calculate genuine average heart rate
        heartRateHistoryRef.current.push(currentBpm);
        const sum = heartRateHistoryRef.current.reduce((a, b) => a + b, 0);
        setAvgHeartRate(Math.round(sum / heartRateHistoryRef.current.length));

      }, 1000);
    } else {
      if (interval) clearInterval(interval);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive, workoutType, currentBpm, isFinishing]);

  // Format stopwatch output (MM:SS or HH:MM:SS)
  const formatTime = (totalSeconds: number) => {
    const hrs = Math.floor(totalSeconds / 3600);
    const mins = Math.floor((totalSeconds % 3600) / 60);
    const secs = totalSeconds % 60;
    return [
      hrs > 0 ? String(hrs).padStart(2, '0') : null,
      String(mins).padStart(2, '0'),
      String(secs).padStart(2, '0')
    ].filter(Boolean).join(':');
  };

  const handleStopWorkout = () => {
    setIsFinishing(true);
    setIsActive(false);
  };

  const handleCompleteLogging = () => {
    const session: WorkoutSession = {
      id: `session-${Date.now()}`,
      type: workoutType,
      duration: seconds,
      caloriesBurned: calories,
      distance: ['Running', 'Cycling', 'Walking'].includes(workoutType) ? distance : undefined,
      avgHeartRate,
      timestamp: new Date().toISOString(),
      notes: notes.trim() ? notes : undefined
    };
    onFinishWorkout(session);
  };

  const showDistance = ['Running', 'Cycling', 'Walking'].includes(workoutType);

  return (
    <div className="flex flex-col h-full justify-between pb-6 overflow-y-auto scrollbar-none" id="workout-tracker-container">
      {/* Top Bar Navigation */}
      <div className="flex items-center justify-between" id="workout-tracker-header">
        <button 
          onClick={onCancel}
          className="flex items-center gap-1.5 text-xs text-zinc-400 hover:text-white font-medium transition"
          id="back-dashboard-btn"
        >
          <ChevronLeft className="w-4 h-4" /> Exit Session
        </button>
        <span className="bg-[#CCFF00]/10 border border-[#CCFF00]/20 text-[#CCFF00] text-[10px] font-bold font-mono tracking-widest px-2.5 py-1 rounded-full uppercase">
          Live Tracker
        </span>
      </div>

      {!isFinishing ? (
        /* ACTIVE TRACKING SCREEN */
        <div className="flex-1 flex flex-col justify-around py-6 space-y-6" id="active-screen">
          {/* Main Stopwatch View */}
          <div className="text-center space-y-2" id="timer-display-section">
            <span className="text-[10px] uppercase font-mono tracking-widest text-zinc-500 font-bold">
              Duration
            </span>
            <h1 className="text-5xl font-extrabold text-white tracking-tight font-mono select-all select-none">
              {formatTime(seconds)}
            </h1>
            <p className="text-sm font-semibold text-[#CCFF00] flex items-center justify-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#CCFF00] animate-ping"></span>
              Tracking Active {workoutType}
            </p>
          </div>

          {/* Real-time Dynamic Metric Readouts */}
          <div className="grid grid-cols-2 gap-4" id="tracker-metrics-grid">
            {/* Calories Card */}
            <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-4 flex flex-col justify-between" id="active-calories">
              <div className="flex items-center justify-between text-amber-400">
                <span className="text-[10px] uppercase font-mono tracking-wider font-semibold">Calories</span>
                <Flame className="w-4 h-4" />
              </div>
              <div className="mt-3">
                <p className="text-2xl font-bold font-mono text-white">{calories}</p>
                <p className="text-[10px] text-zinc-400">Kcal burned</p>
              </div>
            </div>

            {/* Heart Rate Card */}
            <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-4 flex flex-col justify-between" id="active-hr">
              <div className="flex items-center justify-between text-red-500">
                <span className="text-[10px] uppercase font-mono tracking-wider font-semibold">Pulse</span>
                <Heart className="w-4 h-4 animate-pulse" />
              </div>
              <div className="mt-3">
                <p className="text-2xl font-bold font-mono text-white">{currentBpm}</p>
                <p className="text-[10px] text-zinc-400">Current bpm</p>
              </div>
            </div>

            {/* Distance Card (If supported) */}
            {showDistance && (
              <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-4 flex flex-col justify-between col-span-2" id="active-distance">
                <div className="flex items-center justify-between text-sky-400">
                  <span className="text-[10px] uppercase font-mono tracking-wider font-semibold">Distance</span>
                  <Compass className="w-4 h-4" />
                </div>
                <div className="mt-2 flex items-baseline justify-between">
                  <div>
                    <p className="text-3xl font-bold font-mono text-white">{distance}</p>
                    <p className="text-[10px] text-zinc-400">Kilometers</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold font-mono text-zinc-300">
                      {seconds > 0 ? (distance / (seconds / 3600)).toFixed(1) : '0.0'}
                    </p>
                    <p className="text-[10px] text-zinc-500">Avg Speed km/h</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Action Control Panel */}
          <div className="flex justify-center items-center gap-6" id="tracker-controls">
            <button 
              onClick={() => setIsActive(!isActive)}
              className={`p-4 rounded-full border shadow-lg transition ${
                isActive 
                  ? 'bg-amber-500/10 border-amber-500/20 text-amber-400 hover:bg-amber-500/25' 
                  : 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400 hover:bg-emerald-500/25'
              }`}
              id="pause-play-workout-btn"
            >
              {isActive ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6" />}
            </button>
            <button 
              onClick={handleStopWorkout}
              className="p-5 rounded-full bg-rose-600 hover:bg-rose-500 text-white shadow-xl hover:scale-105 transition duration-150"
              id="stop-workout-btn"
            >
              <Square className="w-6 h-6 fill-white" />
            </button>
          </div>
        </div>
      ) : (
        /* SUMMARY & SAVE WORKOUT SCREEN */
        <div className="flex-1 flex flex-col justify-between py-4" id="summary-screen">
          <div className="space-y-5" id="summary-form">
            <div className="text-center space-y-1.5">
              <h2 className="text-xl font-bold text-white tracking-tight">Workout Complete! 🎉</h2>
              <p className="text-xs text-zinc-400">Review your training performance logs below.</p>
            </div>

            {/* Performance Card Overview */}
            <div className="bg-zinc-900/60 border border-zinc-800 rounded-2xl p-5 space-y-4" id="summary-overview-card">
              <div className="grid grid-cols-2 gap-4 text-center">
                <div className="border-r border-zinc-800">
                  <span className="text-[10px] font-mono text-zinc-500 uppercase font-bold tracking-wider block">Duration</span>
                  <span className="text-lg font-bold text-white font-mono">{formatTime(seconds)}</span>
                </div>
                <div>
                  <span className="text-[10px] font-mono text-zinc-500 uppercase font-bold tracking-wider block">Burned</span>
                  <span className="text-lg font-bold text-amber-400 font-mono">{calories} kcal</span>
                </div>
                {showDistance && (
                  <div className="col-span-2 border-t border-zinc-800 pt-3">
                    <span className="text-[10px] font-mono text-zinc-500 uppercase font-bold tracking-wider block">Total Distance</span>
                    <span className="text-xl font-bold text-sky-400 font-mono">{distance} km</span>
                  </div>
                )}
                <div className="col-span-2 border-t border-zinc-800 pt-3">
                  <span className="text-[10px] font-mono text-zinc-500 uppercase font-bold tracking-wider block">Average Heart Rate</span>
                  <span className="text-sm font-semibold text-red-400 font-mono">{avgHeartRate} BPM</span>
                </div>
              </div>
            </div>

            {/* Notes Section Input */}
            <div className="space-y-1.5" id="notes-input-section">
              <label className="text-xs font-semibold text-zinc-300 flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5 text-[#CCFF00]" /> Workout Notes (Optional)
              </label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="How did you feel? Note down your training notes, path details, or exercises."
                rows={3}
                className="w-full bg-zinc-950 border border-zinc-800 focus:border-[#CCFF00] focus:ring-1 focus:ring-[#CCFF00] text-zinc-200 rounded-xl p-3 text-xs resize-none outline-none transition"
                id="workout-notes-textarea"
              />
            </div>
          </div>

          {/* Save Workout Controls */}
          <div className="space-y-2 mt-4" id="summary-save-controls">
            <button
              onClick={handleCompleteLogging}
              className="w-full bg-[#CCFF00] hover:bg-[#b5e000] text-black font-extrabold rounded-xl py-3 text-sm shadow-lg transition flex items-center justify-center gap-2 cursor-pointer"
              id="save-workout-btn"
            >
              Log Workout & Earn Points
            </button>
            <button
              onClick={onCancel}
              className="w-full bg-transparent hover:bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white font-medium rounded-xl py-2.5 text-xs transition cursor-pointer"
              id="cancel-workout-btn"
            >
              Discard Session
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
