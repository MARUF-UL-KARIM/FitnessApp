import { useState } from 'react';
import { WorkoutSession, WorkoutType } from '../types';
import { 
  Flame, 
  Clock, 
  Calendar, 
  Trash2, 
  Filter, 
  Search, 
  Heart, 
  Compass,
  Smile,
  ChevronRight,
  Sparkles
} from 'lucide-react';

interface HistoryLogProps {
  history: WorkoutSession[];
  onDeleteSession: (id: string) => void;
}

export default function HistoryLog({ history, onDeleteSession }: HistoryLogProps) {
  const [filterType, setFilterType] = useState<WorkoutType | 'All'>('All');
  const [searchQuery, setSearchQuery] = useState('');

  // Format date helper
  const formatDate = (isoString: string) => {
    const d = new Date(isoString);
    return d.toLocaleDateString(undefined, { 
      month: 'short', 
      day: 'numeric', 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  // Format workout duration seconds to readable text
  const formatDuration = (totalSeconds: number) => {
    const hrs = Math.floor(totalSeconds / 3600);
    const mins = Math.floor((totalSeconds % 3600) / 60);
    const secs = totalSeconds % 60;
    
    if (hrs > 0) {
      return `${hrs}h ${mins}m`;
    }
    return `${mins}m ${secs}s`;
  };

  const workoutTypes: (WorkoutType | 'All')[] = ['All', 'Running', 'Cycling', 'Walking', 'Strength', 'Yoga', 'Swimming'];

  // Filter & Search Logic
  const filteredHistory = history.filter(session => {
    const matchesType = filterType === 'All' || session.type === filterType;
    const matchesSearch = !searchQuery.trim() || (
      session.notes?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      session.type.toLowerCase().includes(searchQuery.toLowerCase())
    );
    return matchesType && matchesSearch;
  });

  return (
    <div className="space-y-4 pb-6 overflow-y-auto max-h-[100%] scrollbar-none" id="history-viewport">
      {/* Search and Filters */}
      <div className="space-y-2.5" id="history-header">
        <div>
          <span className="text-xs font-mono text-zinc-500 uppercase tracking-widest">History Logs</span>
          <h2 className="text-xl font-semibold text-white tracking-tight">Completed Activities</h2>
        </div>

        {/* Search Bar */}
        <div className="relative flex items-center" id="search-bar-wrapper">
          <Search className="w-4 h-4 text-zinc-500 absolute left-3.5" />
          <input
            type="text"
            placeholder="Search workouts or notes..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-zinc-900/60 border border-zinc-800 text-xs text-zinc-200 rounded-xl pl-10 pr-4 py-2.5 outline-none focus:border-[#CCFF00] transition"
            id="search-input"
          />
        </div>

        {/* Categories Carousel */}
        <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-none -mx-1 px-1" id="categories-carousel">
          {workoutTypes.map((type) => (
            <button
              key={type}
              onClick={() => setFilterType(type)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap border transition cursor-pointer ${
                filterType === type
                  ? 'bg-[#CCFF00] text-black border-[#CCFF00] font-bold'
                  : 'bg-zinc-900/40 text-zinc-400 border-zinc-800 hover:bg-zinc-800'
              }`}
              id={`filter-${type.toLowerCase()}-btn`}
            >
              {type}
            </button>
          ))}
        </div>
      </div>

      {/* History Items List */}
      <div className="space-y-3" id="history-items-list">
        {filteredHistory.length > 0 ? (
          filteredHistory.map((session) => (
            <div 
              key={session.id}
              className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-4 flex flex-col justify-between hover:border-zinc-700 transition"
              id={`history-item-${session.id}`}
            >
              {/* Card Title Header */}
              <div className="flex items-start justify-between border-b border-zinc-800 pb-2.5" id="history-item-header">
                <div className="flex items-center gap-2.5">
                  <div className={`p-2 rounded-lg bg-[#CCFF00]/10 text-[#CCFF00]`}>
                    <Calendar className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <h3 className="text-xs font-bold text-white flex items-center gap-1.5">
                      {session.type} Workout
                    </h3>
                    <p className="text-[10px] text-zinc-500 font-mono">{formatDate(session.timestamp)}</p>
                  </div>
                </div>
                <button
                  onClick={() => onDeleteSession(session.id)}
                  className="p-1.5 rounded-lg bg-zinc-950 hover:bg-rose-500/10 text-zinc-500 hover:text-rose-400 border border-zinc-800 hover:border-rose-500/20 transition cursor-pointer"
                  id={`delete-btn-${session.id}`}
                  title="Delete workout entry"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Statistics Grid */}
              <div className="grid grid-cols-3 gap-2.5 py-3 text-center" id="history-item-stats">
                <div className="flex flex-col items-center justify-center">
                  <div className="flex items-center gap-1 text-amber-400">
                    <Flame className="w-3 h-3" />
                    <span className="text-[10px] font-mono font-bold text-white">{session.caloriesBurned}</span>
                  </div>
                  <span className="text-[9px] text-zinc-500 font-medium">Calories</span>
                </div>
                <div className="flex flex-col items-center justify-center border-x border-zinc-800">
                  <div className="flex items-center gap-1 text-emerald-400">
                    <Clock className="w-3 h-3" />
                    <span className="text-[10px] font-mono font-bold text-white">{formatDuration(session.duration)}</span>
                  </div>
                  <span className="text-[9px] text-zinc-500 font-medium">Duration</span>
                </div>
                <div className="flex flex-col items-center justify-center">
                  {session.distance !== undefined ? (
                    <>
                      <div className="flex items-center gap-1 text-sky-400">
                        <Compass className="w-3 h-3" />
                        <span className="text-[10px] font-mono font-bold text-white">{session.distance} km</span>
                      </div>
                      <span className="text-[9px] text-zinc-500 font-medium">Distance</span>
                    </>
                  ) : (
                    <>
                      <div className="flex items-center gap-1 text-rose-400">
                        <Heart className="w-3 h-3" />
                        <span className="text-[10px] font-mono font-bold text-white">{session.avgHeartRate} bpm</span>
                      </div>
                      <span className="text-[9px] text-zinc-500 font-medium">Avg Heart Rate</span>
                    </>
                  )}
                </div>
              </div>

              {/* Training Notes (If provided) */}
              {session.notes && (
                <div className="bg-zinc-950/50 border border-zinc-800 rounded-lg p-2 mt-1" id="history-item-notes">
                  <span className="text-[9px] font-mono text-[#CCFF00] font-semibold block uppercase">Notes</span>
                  <p className="text-[11px] text-zinc-400 mt-0.5 leading-relaxed italic">
                    "{session.notes}"
                  </p>
                </div>
              )}
            </div>
          ))
        ) : (
          /* Empty State */
          <div className="text-center py-10 space-y-3 bg-zinc-900/20 border border-dashed border-zinc-800 rounded-2xl" id="empty-history-state">
            <Smile className="w-8 h-8 text-zinc-600 mx-auto" />
            <div>
              <p className="text-xs font-semibold text-zinc-400">No matching activities found</p>
              <p className="text-[10px] text-zinc-500 mt-0.5">Start tracking workouts to populate your fitness history logs.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
