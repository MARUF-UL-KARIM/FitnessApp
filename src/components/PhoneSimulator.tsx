import { useState, useEffect, ReactNode } from 'react';
import { 
  Signal, 
  Wifi, 
  Battery, 
  LayoutDashboard, 
  Flame, 
  History, 
  User,
  Heart
} from 'lucide-react';

interface PhoneSimulatorProps {
  children: ReactNode;
  activeTab: string;
  onChangeTab: (tab: string) => void;
  currentBpm: number;
}

export default function PhoneSimulator({ 
  children, 
  activeTab, 
  onChangeTab,
  currentBpm
}: PhoneSimulatorProps) {
  const [timeStr, setTimeStr] = useState('09:41');

  // Live ticking clock in Phone's Status Bar
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      let hrs = now.getHours();
      let mins = String(now.getMinutes()).padStart(2, '0');
      const ampm = hrs >= 12 ? 'PM' : 'AM';
      hrs = hrs % 12;
      hrs = hrs ? hrs : 12; // 0 should be 12
      setTimeStr(`${hrs}:${mins} ${ampm}`);
    };
    
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const tabs = [
    { id: 'dashboard', label: 'Activity', icon: LayoutDashboard },
    { id: 'workouts', label: 'Workouts', icon: Flame },
    { id: 'history', label: 'History', icon: History },
    { id: 'profile', label: 'Profile', icon: User },
  ];

  return (
    <div className="relative mx-auto w-full max-w-[375px] h-[780px] bg-[#0A0A0A] rounded-[44px] border-[10px] border-zinc-900 shadow-2xl flex flex-col overflow-hidden select-none" id="mobile-device-frame">
      {/* Device Top Bezel details (Notch) */}
      <div className="absolute top-0 inset-x-0 h-7 bg-zinc-900 rounded-b-2xl z-30 flex items-center justify-center" id="device-notch">
        {/* Speaker piece */}
        <div className="w-16 h-1.5 bg-zinc-800 rounded-full" id="device-earpiece"></div>
        {/* Camera pinhole */}
        <div className="absolute right-12 w-2.5 h-2.5 bg-zinc-950 rounded-full border border-zinc-800" id="device-camera-sensor"></div>
      </div>

      {/* Simulated Device OS Status Bar */}
      <div className="pt-8 px-5 pb-2 bg-[#0A0A0A] flex items-center justify-between text-[11px] font-semibold text-zinc-400 z-20" id="status-bar-sensor-panels">
        {/* Left Side: Time */}
        <div className="font-mono text-[10px]" id="status-bar-time">
          {timeStr}
        </div>
        
        {/* Middle: Interactive Pulse BPM indicator */}
        <div className="flex items-center gap-1 bg-red-500/10 border border-red-500/20 text-red-400 px-2 py-0.5 rounded-full text-[9px] font-mono animate-pulse" id="status-bar-bpm">
          <Heart className="w-2.5 h-2.5 fill-red-400" />
          <span>{currentBpm} BPM</span>
        </div>

        {/* Right Side: Network Signals & Battery */}
        <div className="flex items-center gap-1.5" id="status-bar-signals">
          <Signal className="w-3.5 h-3.5" />
          <Wifi className="w-3.5 h-3.5" />
          <div className="flex items-center gap-1 text-[10px]" id="status-battery-meter">
            <Battery className="w-4 h-4 text-zinc-300" />
            <span className="font-mono font-bold">88%</span>
          </div>
        </div>
      </div>

      {/* Primary React Native App Canvas Area */}
      <div className="flex-1 overflow-hidden px-4 py-2 bg-[#0A0A0A] relative flex flex-col" id="applet-view-port">
        {children}
      </div>

      {/* Simulated Bottom Tab Navigator */}
      <div className="bg-zinc-950/95 backdrop-blur-md border-t border-zinc-900 pb-5 pt-2 px-3 flex justify-around items-center z-20" id="react-native-tab-navigator">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onChangeTab(tab.id)}
              className="flex flex-col items-center justify-center w-14 py-1 transition group cursor-pointer relative"
              id={`tab-button-${tab.id}`}
            >
              <div className={`p-1.5 rounded-xl transition ${
                isActive 
                  ? 'text-[#CCFF00]' 
                  : 'text-zinc-500 group-hover:text-zinc-400'
              }`} id={`tab-icon-wrapper-${tab.id}`}>
                <tab.icon className="w-5 h-5 transition-transform group-hover:scale-105" />
              </div>
              <span className={`text-[10px] font-semibold mt-0.5 tracking-tight ${
                isActive ? 'text-[#CCFF00] font-bold' : 'text-zinc-500'
              }`} id={`tab-label-${tab.id}`}>
                {tab.label}
              </span>
              
              {/* Highlight Dot Indicator */}
              {isActive && (
                <div className="absolute -top-1 w-1 h-1 bg-[#CCFF00] rounded-full" id={`tab-indicator-dot-${tab.id}`}></div>
              )}
            </button>
          );
        })}
      </div>

      {/* Simulated Device Home Swipe Indicator */}
      <div className="absolute bottom-1 inset-x-0 h-1 flex justify-center items-center pointer-events-none z-30" id="bottom-bezel-swipe-bar">
        <div className="w-28 h-1 bg-zinc-800 rounded-full" id="home-swipe-line"></div>
      </div>
    </div>
  );
}
