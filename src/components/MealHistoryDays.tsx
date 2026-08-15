import React from 'react';
import { MealEntry } from '../types';
import { Calendar, ChevronRight, Clock, Sparkles } from 'lucide-react';
import { calculateDaySummary } from '../utils/timeUtils';

interface MealHistoryDaysProps {
  meals: MealEntry[];
  activeProfileId: string;
  selectedDate: string;
  onSelectDate: (date: string) => void;
}

export const MealHistoryDays: React.FC<MealHistoryDaysProps> = ({
  meals,
  activeProfileId,
  selectedDate,
  onSelectDate,
}) => {
  // Extract all unique dates for the active profile
  const profileMeals = meals.filter((m) => m.profileId === activeProfileId);
  const dateSet = new Set<string>();

  // Ensure current selected date and at least past 5 days are in the list
  dateSet.add(selectedDate);
  const base = new Date();
  for (let i = 0; i < 7; i++) {
    const d = new Date(base);
    d.setDate(d.getDate() - i);
    dateSet.add(d.toISOString().split('T')[0]);
  }
  profileMeals.forEach((m) => dateSet.add(m.date));

  const sortedDates = Array.from(dateSet).sort(
    (a, b) => new Date(b).getTime() - new Date(a).getTime()
  );

  return (
    <div
      id="meal-history-days-widget"
      className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg"
    >
      <div className="flex items-center justify-between pb-3 border-b border-slate-800">
        <div>
          <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-400">
            Past Days Archive
          </span>
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Calendar className="w-4 h-4 text-emerald-400" />
            Meal History & Daily Logs
          </h3>
        </div>
        <span className="text-[11px] text-slate-400">
          Click any date to load timeline
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5 mt-3">
        {sortedDates.slice(0, 6).map((dStr) => {
          const dateMeals = profileMeals.filter((m) => m.date === dStr);
          const summary = calculateDaySummary(dStr, dateMeals);
          const isSelected = dStr === selectedDate;
          const dateObj = new Date(dStr);
          const formattedDate = dateObj.toLocaleDateString('en-US', {
            month: 'long',
            day: 'numeric',
          });

          return (
            <button
              key={dStr}
              type="button"
              id={`history-day-${dStr}`}
              onClick={() => onSelectDate(dStr)}
              className={`p-3 rounded-xl border text-left transition-all flex items-center justify-between gap-2 group ${
                isSelected
                  ? 'bg-emerald-500/15 border-emerald-500/50 shadow-md ring-1 ring-emerald-500/30'
                  : 'bg-slate-800/50 border-slate-800 hover:border-slate-700 hover:bg-slate-800'
              }`}
            >
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-white group-hover:text-emerald-300 transition-colors">
                    {formattedDate}
                  </span>
                  {isSelected && (
                    <span className="text-[9px] font-bold px-1.5 py-0.2 bg-emerald-500 text-slate-950 rounded">
                      Selected
                    </span>
                  )}
                </div>

                <div className="text-[11px] text-slate-400 mt-1 flex items-center gap-1.5">
                  <Sparkles className="w-3 h-3 text-emerald-400" />
                  <span className="font-semibold text-slate-300">
                    {summary.totalMeals} eating {summary.totalMeals === 1 ? 'event' : 'events'}
                  </span>
                  {summary.totalMeals > 0 && (
                    <span className="text-slate-500">
                      • {summary.totalCalories} kcal
                    </span>
                  )}
                </div>
              </div>

              <ChevronRight
                className={`w-4 h-4 transition-transform group-hover:translate-x-0.5 ${
                  isSelected ? 'text-emerald-400' : 'text-slate-500'
                }`}
              />
            </button>
          );
        })}
      </div>
    </div>
  );
};
