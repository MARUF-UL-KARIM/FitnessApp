import { useState, useEffect } from 'react';
import { DailyMetrics, UserProfile, WorkoutSession, WorkoutType } from './types';
import { 
  INITIAL_PROFILE, 
  INITIAL_METRICS, 
  INITIAL_HISTORY, 
  ALL_ACHIEVEMENTS 
} from './data';
import PhoneSimulator from './components/PhoneSimulator';
import Dashboard from './components/Dashboard';
import WorkoutTracker from './components/WorkoutTracker';
import HistoryLog from './components/HistoryLog';
import ProfileGoals from './components/ProfileGoals';
import SensorSimulator from './components/SensorSimulator';
import { 
  Sparkles, 
  Smartphone, 
  Sliders, 
  Activity, 
  RefreshCw 
} from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [currentBpm, setCurrentBpm] = useState<number>(72);
  const [activeWorkoutType, setActiveWorkoutType] = useState<WorkoutType | null>(null);

  // Dynamic state loaded from localStorage or fallback to defaults
  const [metrics, setMetrics] = useState<DailyMetrics>(() => {
    try {
      const saved = localStorage.getItem('fit_metrics');
      return saved ? JSON.parse(saved) : INITIAL_METRICS;
    } catch {
      return INITIAL_METRICS;
    }
  });

  const [profile, setProfile] = useState<UserProfile>(() => {
    try {
      const saved = localStorage.getItem('fit_profile');
      return saved ? JSON.parse(saved) : INITIAL_PROFILE;
    } catch {
      return INITIAL_PROFILE;
    }
  });

  const [history, setHistory] = useState<WorkoutSession[]>(() => {
    try {
      const saved = localStorage.getItem('fit_history');
      return saved ? JSON.parse(saved) : INITIAL_HISTORY;
    } catch {
      return INITIAL_HISTORY;
    }
  });

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem('fit_metrics', JSON.stringify(metrics));
  }, [metrics]);

  useEffect(() => {
    localStorage.setItem('fit_profile', JSON.stringify(profile));
  }, [profile]);

  useEffect(() => {
    localStorage.setItem('fit_history', JSON.stringify(history));
  }, [history]);

  // Restart/Reset application data
  const handleResetData = () => {
    if (window.confirm("Are you sure you want to reset all tracking history, daily goals, and profile metrics back to defaults?")) {
      setMetrics(INITIAL_METRICS);
      setProfile(INITIAL_PROFILE);
      setHistory(INITIAL_HISTORY);
      setActiveTab('dashboard');
      setActiveWorkoutType(null);
      setCurrentBpm(72);
    }
  };

  // Callback to update metrics safely
  const handleUpdateMetrics = (updater: (prev: DailyMetrics) => DailyMetrics) => {
    setMetrics(prev => {
      const updated = updater(prev);
      
      // Auto gamified point injection when user reaches step milestones
      if (updated.steps >= updated.stepGoal && prev.steps < updated.stepGoal) {
        setProfile(p => ({ ...p, points: p.points + 200 }));
      }
      return updated;
    });
  };

  // Handle Starting a Workout from quick-actions or workout panel
  const handleStartWorkout = (type: WorkoutType) => {
    setActiveWorkoutType(type);
    
    // Elevate simulated heart-rate to reflect active training start
    let startingBpm = 110;
    if (type === 'Running' || type === 'Cycling') startingBpm = 135;
    else if (type === 'Yoga') startingBpm = 85;
    setCurrentBpm(startingBpm);
  };

  // Cancel/Discard active workout
  const handleCancelWorkout = () => {
    setActiveWorkoutType(null);
    setCurrentBpm(72); // back to rest
  };

  // Complete a workout, logging it to history and updating daily stats
  const handleFinishWorkout = (session: WorkoutSession) => {
    // Add session to history
    setHistory(prev => [session, ...prev]);

    // Update active day's total calories and exercise minutes
    handleUpdateMetrics(prev => ({
      ...prev,
      caloriesBurned: prev.caloriesBurned + session.caloriesBurned,
      activeMinutes: prev.activeMinutes + Math.round(session.duration / 60)
    }));

    // Add gaming reward points based on effort: 10 points per min + 50 flat
    const minutesEarned = Math.round(session.duration / 60);
    const addedPoints = (minutesEarned * 10) + 50;
    setProfile(p => ({
      ...p,
      points: p.points + addedPoints,
      streakDays: p.streakDays + 1 // increment workout logs streak
    }));

    // Clean active tracking overlay states
    setActiveWorkoutType(null);
    setCurrentBpm(78);
    setActiveTab('history'); // view logs
  };

  const handleDeleteSession = (id: string) => {
    setHistory(prev => prev.filter(s => s.id !== id));
  };

  const handleUpdateProfile = (updater: (prev: UserProfile) => UserProfile) => {
    setProfile(prev => updater(prev));
  };

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-zinc-100 flex flex-col justify-between" id="root-layout">
      {/* Universal Work Header */}
      <header className="border-b border-zinc-900 bg-zinc-950/40 backdrop-blur-md px-6 py-4 flex items-center justify-between z-10" id="global-nav">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-[#CCFF00]/10 border border-[#CCFF00]/20 text-[#CCFF00] rounded-xl" id="logo-icon">
            <Activity className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <h1 className="text-sm font-bold text-white tracking-tight flex items-center gap-1.5">
              React Native Fitness Simulator <span className="bg-[#CCFF00]/10 text-[#CCFF00] font-mono text-[9px] font-bold px-2 py-0.5 rounded-full border border-[#CCFF00]/20">v1.4</span>
            </h1>
            <p className="text-[11px] text-zinc-400 font-medium">Evaluate mobile performance telemetry live in sandbox</p>
          </div>
        </div>

        <button 
          onClick={handleResetData}
          className="flex items-center gap-1.5 text-xs text-zinc-400 hover:text-white bg-zinc-900 hover:bg-zinc-850 border border-zinc-800 rounded-lg px-3 py-2 transition"
          id="reset-state-btn"
          title="Reset tracker to factory mock values"
        >
          <RefreshCw className="w-3.5 h-3.5" /> Reset Data
        </button>
      </header>

      {/* Main Dual-Panel Workspace Body */}
      <main className="flex-1 max-w-6xl w-full mx-auto p-4 md:p-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center" id="main-grid-panel">
        {/* Left Side: Mobile Phone Device Simulator */}
        <div className="lg:col-span-6 xl:col-span-5 flex justify-center" id="phone-container-panel">
          <PhoneSimulator 
            activeTab={activeTab} 
            onChangeTab={(tab) => {
              // Reset workout type if navigating away unless active
              if (!activeWorkoutType) {
                setActiveTab(tab);
              }
            }}
            currentBpm={currentBpm}
          >
            {activeWorkoutType ? (
              /* Active Exercise overlay overrides screen viewport */
              <WorkoutTracker 
                workoutType={activeWorkoutType}
                onCancel={handleCancelWorkout}
                onFinishWorkout={handleFinishWorkout}
                currentBpm={currentBpm}
              />
            ) : (
              /* Standard navigator screens */
              <>
                {activeTab === 'dashboard' && (
                  <Dashboard 
                    metrics={metrics}
                    onUpdateMetrics={handleUpdateMetrics}
                    onStartWorkout={handleStartWorkout}
                    streakDays={profile.streakDays}
                    points={profile.points}
                  />
                )}
                
                {activeTab === 'workouts' && (
                  <div className="space-y-4 pb-6 overflow-y-auto scrollbar-none" id="workouts-tab-panel">
                    <div>
                      <span className="text-xs font-mono text-zinc-500 uppercase tracking-widest">Training Arena</span>
                      <h2 className="text-xl font-semibold text-white tracking-tight">Launch Workout</h2>
                      <p className="text-xs text-zinc-400 mt-1">Select an athletic sport discipline below to activate live calorie and sensor metrics tracking.</p>
                    </div>

                    <div className="grid grid-cols-1 gap-3 pt-2" id="workouts-launch-list">
                      {(['Running', 'Cycling', 'Walking', 'Strength', 'Yoga', 'Swimming'] as WorkoutType[]).map((type) => {
                        let desc = "Track pace, steps, heart rate and distance.";
                        let iconBg = "bg-rose-500/10 text-rose-400";
                        if (type === 'Strength') { desc = "Log reps, weight lifts, intensity metrics."; iconBg = "bg-amber-500/10 text-amber-400"; }
                        else if (type === 'Yoga') { desc = "Stretch and breathing mindfulness sessions."; iconBg = "bg-emerald-500/10 text-emerald-400"; }
                        else if (type === 'Cycling') { desc = "Track speed, routes, cardio parameters."; iconBg = "bg-sky-500/10 text-sky-400"; }
                        else if (type === 'Swimming') { desc = "Track laps, strokes, thermogenics."; iconBg = "bg-blue-500/10 text-blue-400"; }
                        else if (type === 'Walking') { desc = "Light metabolic health tracking steps."; iconBg = "bg-orange-500/10 text-orange-400"; }

                        return (
                          <button
                            key={type}
                            onClick={() => handleStartWorkout(type)}
                            className="flex items-center justify-between p-4 rounded-xl bg-zinc-900/50 border border-zinc-800 hover:bg-zinc-800/60 hover:border-zinc-700 text-left transition group cursor-pointer"
                            id={`launch-workout-${type.toLowerCase()}-btn`}
                          >
                            <div>
                              <p className="text-sm font-bold text-white">{type}</p>
                              <p className="text-[11px] text-zinc-400 mt-0.5">{desc}</p>
                            </div>
                            <span className={`px-2.5 py-1 text-[10px] font-bold rounded-lg ${iconBg} group-hover:scale-105 transition`}>
                              Start
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                {activeTab === 'history' && (
                  <HistoryLog 
                    history={history}
                    onDeleteSession={handleDeleteSession}
                  />
                )}

                {activeTab === 'profile' && (
                  <ProfileGoals 
                    metrics={metrics}
                    onUpdateMetrics={handleUpdateMetrics}
                    profile={profile}
                    onUpdateProfile={handleUpdateProfile}
                    achievements={ALL_ACHIEVEMENTS}
                  />
                )}
              </>
            )}
          </PhoneSimulator>
        </div>

        {/* Right Side: Sensor Simulation Control Panel */}
        <div className="lg:col-span-6 xl:col-span-7 flex flex-col gap-6" id="simulator-controller-container">
          <div className="space-y-2.5 text-center lg:text-left" id="workspace-info">
            <span className="text-xs font-mono font-bold text-[#CCFF00] uppercase bg-[#CCFF00]/10 border border-[#CCFF00]/20 px-3 py-1 rounded-full inline-block tracking-wider">
              Simulation Sandbox
            </span>
            <h2 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">
              Test Mobile Biosensors Live
            </h2>
            <p className="text-xs md:text-sm text-zinc-400 max-w-lg leading-relaxed">
              Real React Native physical components hook directly into iOS HealthKit or Android Google Fit. In this sandbox environment, utilize our physical simulator panel below to mock biosensors, trigger workouts, and see active UI calculations react in real time.
            </p>
          </div>

          <div className="w-full max-w-lg" id="workspace-simulator-wrapper">
            <SensorSimulator 
              metrics={metrics}
              onUpdateMetrics={handleUpdateMetrics}
              currentBpm={currentBpm}
              onUpdateBpm={setCurrentBpm}
            />
          </div>
        </div>
      </main>

      {/* Elegant, humble, compliant footer */}
      <footer className="border-t border-zinc-900 bg-zinc-950/20 py-4 px-6 text-center" id="global-footer">
        <p className="text-[10px] text-zinc-500 font-mono tracking-wider">
          RUNNING WEB CONTEXT CONTAINER • DISPATCH PORT REWRITE REDIRECT SECURE
        </p>
      </footer>
    </div>
  );
}
