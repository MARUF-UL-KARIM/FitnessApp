import { useState } from 'react';
import { DailyMetrics, UserProfile, Achievement } from '../types';
import { 
  Award, 
  Settings, 
  Flame, 
  Footprints, 
  Droplets, 
  TrendingUp, 
  Scale, 
  Sparkles,
  Zap,
  CheckCircle,
  Eye
} from 'lucide-react';
import { motion } from 'motion/react';

interface ProfileGoalsProps {
  metrics: DailyMetrics;
  onUpdateMetrics: (updater: (prev: DailyMetrics) => DailyMetrics) => void;
  profile: UserProfile;
  onUpdateProfile: (updater: (prev: UserProfile) => UserProfile) => void;
  achievements: Achievement[];
}

export default function ProfileGoals({
  metrics,
  onUpdateMetrics,
  profile,
  onUpdateProfile,
  achievements
}: ProfileGoalsProps) {
  const [isEditingGoals, setIsEditingGoals] = useState(false);
  const [isEditingProfile, setIsEditingProfile] = useState(false);

  // Goal states
  const [stepGoal, setStepGoal] = useState(metrics.stepGoal);
  const [calorieGoal, setCalorieGoal] = useState(metrics.calorieGoal);
  const [activeMinutesGoal, setActiveMinutesGoal] = useState(metrics.activeMinutesGoal);
  const [waterGoal, setWaterGoal] = useState(metrics.waterGoal);

  // Profile states
  const [name, setName] = useState(profile.name);
  const [height, setHeight] = useState(profile.height);
  const [weight, setWeight] = useState(profile.weight);
  const [age, setAge] = useState(profile.age);

  const handleSaveGoals = () => {
    onUpdateMetrics(prev => ({
      ...prev,
      stepGoal,
      calorieGoal,
      activeMinutesGoal,
      waterGoal
    }));
    setIsEditingGoals(false);
  };

  const handleSaveProfile = () => {
    onUpdateProfile(prev => ({
      ...prev,
      name,
      height,
      weight,
      age
    }));
    setIsEditingProfile(false);
  };

  // Helper to check if an achievement is unlocked
  const checkAchievementUnlocked = (ach: Achievement): { unlocked: boolean; progress: number } => {
    let progress = 0;
    let unlocked = false;

    switch (ach.id) {
      case 'ach-1': // First Step
        progress = metrics.steps;
        unlocked = metrics.steps > 0;
        break;
      case 'ach-2': // Step Champion
        progress = metrics.steps;
        unlocked = metrics.steps >= metrics.stepGoal;
        break;
      case 'ach-3': // Calorie Burner
        progress = metrics.caloriesBurned;
        unlocked = metrics.caloriesBurned >= ach.threshold;
        break;
      case 'ach-4': // Super Active
        progress = metrics.activeMinutes;
        unlocked = metrics.activeMinutes >= ach.threshold;
        break;
      case 'ach-5': // Hydration Hero
        progress = metrics.waterIntake;
        unlocked = metrics.waterIntake >= ach.threshold;
        break;
      case 'ach-6': // Dedicated Athlete
        progress = profile.streakDays;
        unlocked = profile.streakDays >= ach.threshold;
        break;
      default:
        break;
    }

    const percentage = Math.min(100, Math.round((progress / ach.threshold) * 100));
    return { unlocked, progress: percentage };
  };

  return (
    <div className="space-y-5 pb-6 overflow-y-auto max-h-[100%] scrollbar-none" id="profile-viewport">
      {/* Profile Header & Level Banner */}
      <div className="bg-zinc-900/60 border border-zinc-800 rounded-2xl p-4 flex items-center gap-4 shadow-lg" id="profile-card">
        <div className="w-14 h-14 rounded-full bg-gradient-to-tr from-[#CCFF00] to-emerald-500 flex items-center justify-center text-zinc-950 font-extrabold text-xl uppercase shadow-md relative" id="profile-avatar">
          {profile.name.charAt(0)}
          {/* Level Badge Overlay */}
          <span className="absolute -bottom-1 -right-1 bg-[#CCFF00] text-zinc-950 text-[10px] font-extrabold px-1.5 py-0.5 rounded-full border border-zinc-900 font-mono">
            Lvl 4
          </span>
        </div>

        <div className="flex-1 min-w-0" id="profile-details">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-white truncate">{profile.name}</h2>
            <button 
              onClick={() => setIsEditingProfile(!isEditingProfile)}
              className="text-[10px] text-[#CCFF00] font-bold hover:underline cursor-pointer"
              id="edit-profile-btn"
            >
              {isEditingProfile ? 'Cancel' : 'Edit Info'}
            </button>
          </div>
          <p className="text-[10px] font-mono text-zinc-500">Member since June 2026</p>
          
          <div className="flex gap-4 mt-2 border-t border-zinc-800 pt-2 text-[11px]" id="physical-stats">
            <div>
              <span className="text-zinc-500 block">Height</span>
              <span className="font-semibold text-zinc-300 font-mono">{profile.height} cm</span>
            </div>
            <div className="border-l border-zinc-800 pl-4">
              <span className="text-zinc-500 block">Weight</span>
              <span className="font-semibold text-zinc-300 font-mono">{profile.weight} kg</span>
            </div>
            <div className="border-l border-zinc-800 pl-4">
              <span className="text-zinc-500 block">Age</span>
              <span className="font-semibold text-zinc-300 font-mono">{profile.age} yrs</span>
            </div>
          </div>
        </div>
      </div>

      {/* Editing Physical Attributes Form */}
      {isEditingProfile && (
        <div className="bg-zinc-900/40 border border-zinc-800 rounded-2xl p-4 space-y-3" id="profile-edit-form">
          <h3 className="text-xs font-bold text-white tracking-wide">Edit Physical Profile</h3>
          <div className="grid grid-cols-2 gap-3" id="profile-inputs">
            <div>
              <label className="text-[10px] text-zinc-400 font-medium block mb-1">Display Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-zinc-950 border border-zinc-800 text-xs text-zinc-200 rounded-lg px-2.5 py-1.5 focus:border-[#CCFF00] outline-none"
                id="edit-name-input"
              />
            </div>
            <div>
              <label className="text-[10px] text-zinc-400 font-medium block mb-1">Height (cm)</label>
              <input
                type="number"
                value={height}
                onChange={(e) => setHeight(Number(e.target.value))}
                className="w-full bg-zinc-950 border border-zinc-800 text-xs text-zinc-200 rounded-lg px-2.5 py-1.5 focus:border-[#CCFF00] outline-none font-mono"
                id="edit-height-input"
              />
            </div>
            <div>
              <label className="text-[10px] text-zinc-400 font-medium block mb-1">Weight (kg)</label>
              <input
                type="number"
                value={weight}
                onChange={(e) => setWeight(Number(e.target.value))}
                className="w-full bg-zinc-950 border border-zinc-800 text-xs text-zinc-200 rounded-lg px-2.5 py-1.5 focus:border-[#CCFF00] outline-none font-mono"
                id="edit-weight-input"
              />
            </div>
            <div>
              <label className="text-[10px] text-zinc-400 font-medium block mb-1">Age</label>
              <input
                type="number"
                value={age}
                onChange={(e) => setAge(Number(e.target.value))}
                className="w-full bg-zinc-950 border border-zinc-800 text-xs text-zinc-200 rounded-lg px-2.5 py-1.5 focus:border-[#CCFF00] outline-none font-mono"
                id="edit-age-input"
              />
            </div>
          </div>
          <button
            onClick={handleSaveProfile}
            className="w-full bg-[#CCFF00] hover:bg-[#b5e000] text-black font-extrabold text-xs py-2 rounded-xl mt-1 transition cursor-pointer"
            id="save-profile-btn"
          >
            Save Information
          </button>
        </div>
      )}

      {/* Target Activity Goals Section */}
      <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-4" id="target-goals-section">
        <div className="flex items-center justify-between mb-3" id="goals-header">
          <h3 className="text-xs font-bold text-white tracking-wide uppercase font-mono text-[#CCFF00]">Daily Target Goals</h3>
          <button 
            onClick={() => setIsEditingGoals(!isEditingGoals)}
            className="text-xs text-[#CCFF00] hover:text-[#b5e000] font-bold cursor-pointer"
            id="edit-goals-btn"
          >
            {isEditingGoals ? 'Cancel' : 'Edit Goals'}
          </button>
        </div>

        {!isEditingGoals ? (
          /* View mode */
          <div className="grid grid-cols-2 gap-3" id="goals-grid">
            <div className="bg-zinc-950/40 border border-zinc-800 rounded-xl p-2.5 flex items-center gap-2" id="view-step-goal">
              <Footprints className="w-4 h-4 text-[#CCFF00]" />
              <div>
                <span className="text-[9px] text-zinc-500 block">Steps Goal</span>
                <span className="text-xs font-bold font-mono text-white">{metrics.stepGoal.toLocaleString()}</span>
              </div>
            </div>
            <div className="bg-zinc-950/40 border border-zinc-800 rounded-xl p-2.5 flex items-center gap-2" id="view-calorie-goal">
              <Flame className="w-4 h-4 text-amber-400" />
              <div>
                <span className="text-[9px] text-zinc-500 block">Calories Goal</span>
                <span className="text-xs font-bold font-mono text-white">{metrics.calorieGoal} kcal</span>
              </div>
            </div>
            <div className="bg-zinc-950/40 border border-zinc-800 rounded-xl p-2.5 flex items-center gap-2" id="view-active-goal">
              <TrendingUp className="w-4 h-4 text-emerald-400" />
              <div>
                <span className="text-[9px] text-zinc-500 block">Active Goal</span>
                <span className="text-xs font-bold font-mono text-white">{metrics.activeMinutesGoal} mins</span>
              </div>
            </div>
            <div className="bg-zinc-950/40 border border-zinc-800 rounded-xl p-2.5 flex items-center gap-2" id="view-water-goal">
              <Droplets className="w-4 h-4 text-sky-400" />
              <div>
                <span className="text-[9px] text-zinc-500 block">Hydration Goal</span>
                <span className="text-xs font-bold font-mono text-white">{metrics.waterGoal} ml</span>
              </div>
            </div>
          </div>
        ) : (
          /* Edit Mode Form */
          <div className="space-y-3 pt-1" id="goals-edit-form">
            <div className="space-y-2.5" id="goals-sliders">
              {/* Step Slider */}
              <div id="step-goal-slider">
                <div className="flex justify-between text-[10px] text-zinc-400 mb-1">
                  <span>Daily Steps Target</span>
                  <span className="font-mono text-white font-semibold">{stepGoal.toLocaleString()} steps</span>
                </div>
                <input
                  type="range"
                  min="3000"
                  max="20000"
                  step="500"
                  value={stepGoal}
                  onChange={(e) => setStepGoal(Number(e.target.value))}
                  className="w-full accent-[#CCFF00] cursor-pointer h-1.5 rounded bg-zinc-800"
                />
              </div>

              {/* Calorie Slider */}
              <div id="calorie-goal-slider">
                <div className="flex justify-between text-[10px] text-zinc-400 mb-1">
                  <span>Daily Calories Target</span>
                  <span className="font-mono text-white font-semibold">{calorieGoal} kcal</span>
                </div>
                <input
                  type="range"
                  min="200"
                  max="1500"
                  step="50"
                  value={calorieGoal}
                  onChange={(e) => setCalorieGoal(Number(e.target.value))}
                  className="w-full accent-amber-400 cursor-pointer h-1.5 rounded bg-zinc-800"
                />
              </div>

              {/* Active Minutes Slider */}
              <div id="active-goal-slider">
                <div className="flex justify-between text-[10px] text-zinc-400 mb-1">
                  <span>Active Exercise Target</span>
                  <span className="font-mono text-white font-semibold">{activeMinutesGoal} minutes</span>
                </div>
                <input
                  type="range"
                  min="15"
                  max="120"
                  step="5"
                  value={activeMinutesGoal}
                  onChange={(e) => setActiveMinutesGoal(Number(e.target.value))}
                  className="w-full accent-emerald-400 cursor-pointer h-1.5 rounded bg-zinc-800"
                />
              </div>

              {/* Water Slider */}
              <div id="water-goal-slider">
                <div className="flex justify-between text-[10px] text-zinc-400 mb-1">
                  <span>Hydration Target</span>
                  <span className="font-mono text-white font-semibold">{waterGoal} ml</span>
                </div>
                <input
                  type="range"
                  min="1000"
                  max="4000"
                  step="250"
                  value={waterGoal}
                  onChange={(e) => setWaterGoal(Number(e.target.value))}
                  className="w-full accent-sky-400 cursor-pointer h-1.5 rounded bg-zinc-800"
                />
              </div>
            </div>

            <button
              onClick={handleSaveGoals}
              className="w-full bg-[#CCFF00] hover:bg-[#b5e000] text-black font-extrabold text-xs py-2 rounded-xl transition mt-2 cursor-pointer"
              id="save-goals-btn"
            >
              Save Target Goals
            </button>
          </div>
        )}
      </div>

      {/* Gamified Achievements Checklist */}
      <div className="space-y-3" id="achievements-section">
        <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-wide font-mono flex items-center gap-1.5">
          <Award className="w-4 h-4 text-[#CCFF00]" /> Milestones & Badges
        </h3>
        
        <div className="space-y-2.5" id="achievements-list">
          {achievements.map((ach) => {
            const { unlocked, progress } = checkAchievementUnlocked(ach);

            // Icon Mapping
            let badgeColor = 'text-zinc-500 bg-zinc-900/30 border-zinc-800';
            if (unlocked) {
              if (ach.category === 'steps') badgeColor = 'text-[#CCFF00] bg-[#CCFF00]/10 border-[#CCFF00]/20';
              else if (ach.category === 'calories') badgeColor = 'text-amber-500 bg-amber-500/10 border-amber-500/20';
              else badgeColor = 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20';
            }

            return (
              <div 
                key={ach.id}
                className={`border rounded-xl p-3 flex gap-3 transition ${
                  unlocked 
                    ? 'bg-zinc-900/60 border-zinc-800' 
                    : 'bg-zinc-900/20 border-zinc-900/60 opacity-65'
                }`}
                id={`achievement-${ach.id}`}
              >
                {/* Badge Icon circular logo */}
                <div className={`w-10 h-10 rounded-xl border flex items-center justify-center shrink-0 ${badgeColor}`} id={`achievement-badge-${ach.id}`}>
                  <Award className="w-5 h-5" />
                </div>

                <div className="flex-1 min-w-0" id={`achievement-details-${ach.id}`}>
                  <div className="flex items-center justify-between gap-2">
                    <p className={`text-xs font-semibold ${unlocked ? 'text-white' : 'text-zinc-400'}`}>
                      {ach.title}
                    </p>
                    {unlocked ? (
                      <span className="text-[9px] font-bold text-emerald-400 flex items-center gap-1 shrink-0 bg-emerald-500/10 px-1.5 py-0.5 rounded-full font-mono">
                        <CheckCircle className="w-2.5 h-2.5" /> Unlocked
                      </span>
                    ) : (
                      <span className="text-[9px] font-semibold text-zinc-500 font-mono shrink-0">
                        {progress}%
                      </span>
                    )}
                  </div>
                  <p className="text-[10px] text-zinc-400 mt-0.5 leading-tight">{ach.description}</p>
                  
                  {/* Milestones Progress Bar (If locked) */}
                  {!unlocked && (
                    <div className="w-full bg-zinc-950 h-1 rounded-full mt-2 overflow-hidden" id={`achievement-progress-${ach.id}`}>
                      <div 
                        className="bg-zinc-800 h-full rounded-full transition-all"
                        style={{ width: `${progress}%` }}
                      ></div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
