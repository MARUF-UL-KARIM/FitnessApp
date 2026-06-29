import { useState, useEffect } from 'react';
import { DailyMetrics } from '../types';
import { 
  Heart, 
  Footprints, 
  Zap, 
  Flame, 
  Sliders,
  Play,
  Pause,
  Clock,
  Sparkles
} from 'lucide-react';

interface SensorSimulatorProps {
  metrics: DailyMetrics;
  onUpdateMetrics: (updater: (prev: DailyMetrics) => DailyMetrics) => void;
  currentBpm: number;
  onUpdateBpm: (bpm: number) => void;
}

export default function SensorSimulator({
  metrics,
  onUpdateMetrics,
  currentBpm,
  onUpdateBpm
}: SensorSimulatorProps) {
  const [isAutoWalking, setIsAutoWalking] = useState(false);
  const [activityMode, setActivityMode] = useState<'resting' | 'walking' | 'jogging' | 'sprinting'>('resting');

  // Automatic Step generator (pedometer simulator)
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isAutoWalking) {
      interval = setInterval(() => {
        onUpdateMetrics(prev => {
          let stepInc = 3;
          let calInc = 0.15;
          let activeInc = 0;

          if (activityMode === 'walking') {
            stepInc = 4;
            calInc = 0.2;
          } else if (activityMode === 'jogging') {
            stepInc = 8;
            calInc = 0.5;
          } else if (activityMode === 'sprinting') {
            stepInc = 12;
            calInc = 0.9;
          }

          // Randomly add active minutes every 20 ticks (10 seconds)
          const randomActiveTick = Math.random() > 0.85;
          if (randomActiveTick) {
            activeInc = 1;
          }

          return {
            ...prev,
            steps: prev.steps + stepInc,
            caloriesBurned: Math.round(prev.caloriesBurned + calInc),
            activeMinutes: prev.activeMinutes + activeInc
          };
        });
      }, 500);
    } else {
      if (interval) clearInterval(interval);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isAutoWalking, activityMode]);

  // Handle activity modes preset heart-rates
  const handleSetActivityMode = (mode: 'resting' | 'walking' | 'jogging' | 'sprinting') => {
    setActivityMode(mode);
    let targetBpm = 72;
    switch (mode) {
      case 'walking': targetBpm = 98; break;
      case 'jogging': targetBpm = 135; break;
      case 'sprinting': targetBpm = 168; break;
      default: targetBpm = 72;
    }
    // Add small random noise to make bpm feel real
    const finalBpm = targetBpm + Math.floor(Math.random() * 7) - 3;
    onUpdateBpm(finalBpm);
  };

  // Adjust BPM manually via slider
  const handleBpmChange = (newBpm: number) => {
    onUpdateBpm(newBpm);
    if (newBpm < 90) setActivityMode('resting');
    else if (newBpm < 120) setActivityMode('walking');
    else if (newBpm < 155) setActivityMode('jogging');
    else setActivityMode('sprinting');
  };

  // Incremental metrics injections
  const handleInjectSteps = (amount: number) => {
    onUpdateMetrics(prev => ({
      ...prev,
      steps: prev.steps + amount,
      caloriesBurned: Math.round(prev.caloriesBurned + (amount * 0.04)) // approximate calories per step
    }));
  };

  const handleInjectCalories = (amount: number) => {
    onUpdateMetrics(prev => ({
      ...prev,
      caloriesBurned: prev.caloriesBurned + amount
    }));
  };

  const handleInjectActiveMinutes = (amount: number) => {
    onUpdateMetrics(prev => ({
      ...prev,
      activeMinutes: prev.activeMinutes + amount
    }));
  };

  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 shadow-2xl h-full flex flex-col justify-between space-y-5" id="sensor-simulator-card">
      {/* Header */}
      <div id="simulator-header">
        <h3 className="text-sm font-bold text-white flex items-center gap-2">
          <Sliders className="w-4 h-4 text-[#CCFF00]" /> Sensor Control Board
        </h3>
        <p className="text-[11px] text-zinc-400 mt-1">
          Simulate a real smartphone's accelerometer, GPS coordinates, and PPG heart rate biosensors here to test reactivity inside the tracker app.
        </p>
      </div>

      <div className="space-y-4 flex-1" id="simulator-controls-container">
        {/* Heart Rate Simulator */}
        <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-3 space-y-2.5" id="heart-rate-sim">
          <div className="flex justify-between items-center">
            <span className="text-[11px] font-semibold text-zinc-300 flex items-center gap-1.5">
              <Heart className="w-3.5 h-3.5 text-red-500 fill-red-500/20" /> PPG Heart Rate Sensor
            </span>
            <span className="text-xs font-mono font-bold text-red-400">{currentBpm} BPM</span>
          </div>
          <input
            type="range"
            min="55"
            max="195"
            value={currentBpm}
            onChange={(e) => handleBpmChange(Number(e.target.value))}
            className="w-full accent-red-500 cursor-pointer h-1 rounded bg-zinc-800"
            id="bpm-slider"
          />
          {/* Preset Buttons */}
          <div className="grid grid-cols-4 gap-1 pt-1" id="bpm-presets">
            {(['resting', 'walking', 'jogging', 'sprinting'] as const).map((mode) => (
              <button
                key={mode}
                onClick={() => handleSetActivityMode(mode)}
                className={`text-[9px] font-mono capitalize py-1 px-1.5 rounded transition cursor-pointer ${
                  activityMode === mode 
                    ? 'bg-red-500/10 border border-red-500/30 text-red-400 font-semibold' 
                    : 'bg-zinc-900 text-zinc-400 border border-transparent hover:bg-zinc-800'
                }`}
                id={`preset-${mode}-btn`}
              >
                {mode}
              </button>
            ))}
          </div>
        </div>

        {/* Accelerometer Step Simulator */}
        <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-3 space-y-2.5" id="accelerometer-sim">
          <div className="flex justify-between items-center">
            <span className="text-[11px] font-semibold text-zinc-300 flex items-center gap-1.5">
              <Footprints className="w-3.5 h-3.5 text-[#CCFF00]" /> Accelerometer (Pedometer)
            </span>
            <span className="text-[10px] font-mono bg-[#CCFF00]/10 border border-[#CCFF00]/20 text-[#CCFF00] px-2 py-0.5 rounded-full font-bold">
              {isAutoWalking ? 'Auto Ticking' : 'Static'}
            </span>
          </div>

          <div className="flex gap-2" id="auto-tick-controls">
            <button
              onClick={() => setIsAutoWalking(!isAutoWalking)}
              className={`flex-1 flex items-center justify-center gap-1.5 text-xs font-semibold py-2 rounded-xl transition cursor-pointer ${
                isAutoWalking 
                  ? 'bg-rose-500/10 border border-rose-500/20 text-rose-400 hover:bg-rose-500/20' 
                  : 'bg-[#CCFF00] text-black hover:bg-[#b5e000]'
              }`}
              id="toggle-pedometer-btn"
            >
              {isAutoWalking ? (
                <>
                  <Pause className="w-3.5 h-3.5" /> Stop Walking
                </>
              ) : (
                <>
                  <Play className="w-3.5 h-3.5 fill-black" /> Auto-Walk Simulator
                </>
              )}
            </button>
          </div>

          {/* Manual Step Injection */}
          <div className="grid grid-cols-2 gap-2 text-center" id="manual-step-injection">
            <button
              onClick={() => handleInjectSteps(500)}
              className="text-[10px] font-semibold bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 hover:border-zinc-700 text-zinc-200 py-1.5 rounded-lg transition cursor-pointer"
              id="inject-500-steps-btn"
            >
              +500 Steps
            </button>
            <button
              onClick={() => handleInjectSteps(2000)}
              className="text-[10px] font-semibold bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 hover:border-zinc-700 text-zinc-200 py-1.5 rounded-lg transition cursor-pointer"
              id="inject-2000-steps-btn"
            >
              +2,000 Steps
            </button>
          </div>
        </div>

        {/* Core Calibration (Other metrics injections) */}
        <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-3 space-y-2.5" id="metric-calibration-sim">
          <span className="text-[11px] font-semibold text-zinc-300 flex items-center gap-1.5">
            <Zap className="w-3.5 h-3.5 text-amber-400" /> Manual Metric Calibrator
          </span>
          <div className="grid grid-cols-2 gap-2 text-center" id="manual-metric-injections">
            <button
              onClick={() => handleInjectCalories(100)}
              className="text-[10px] font-semibold bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 hover:border-zinc-700 text-zinc-200 py-1.5 rounded-lg transition cursor-pointer"
              id="inject-100-calories-btn"
            >
              +100 kcal
            </button>
            <button
              onClick={() => handleInjectActiveMinutes(10)}
              className="text-[10px] font-semibold bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 hover:border-zinc-700 text-zinc-200 py-1.5 rounded-lg transition cursor-pointer"
              id="inject-10-active-btn"
            >
              +10 Active Mins
            </button>
          </div>
        </div>
      </div>

      {/* Footer Instructions Info */}
      <div className="bg-zinc-950/40 rounded-xl p-2.5 border border-zinc-800 flex items-center gap-2" id="simulator-hint">
        <Sparkles className="w-3.5 h-3.5 text-amber-400 shrink-0 animate-pulse" />
        <span className="text-[9px] text-zinc-400 leading-tight">
          <strong>Tip:</strong> Toggle <strong>Auto-Walk</strong> with <strong>Jogging</strong> BPM preset to watch step count, active minutes, calories, and goals react in real time.
        </span>
      </div>
    </div>
  );
}
