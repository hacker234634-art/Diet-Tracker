import React from 'react';
import {
  MealEntry,
  UserProfile,
} from '../types';
import {
  calculateWeeklyStats,
  timeToMinutes,
  formatTime12h,
} from '../utils/timeUtils';
import {
  Clock,
  Timer,
  Hash,
  Hourglass,
  Calendar,
  AlertCircle,
  TrendingUp,
} from 'lucide-react';

interface WeeklyAnalysisProps {
  profileMeals: MealEntry[];
  currentDate: string;
  activeProfile: UserProfile;
  onSelectDate: (date: string) => void;
}

export const WeeklyAnalysis: React.FC<WeeklyAnalysisProps> = ({
  profileMeals,
  currentDate,
  activeProfile,
  onSelectDate,
}) => {
  const weeklyData = calculateWeeklyStats(profileMeals, currentDate);

  return (
    <div id="weekly-analysis-container" className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-slate-800">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">
            7-Day Aggregate Analysis
          </span>
          <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-emerald-400" />
            Weekly Meal Timing & Interval Pattern
          </h2>
          <p className="text-xs text-slate-400">
            Analysis for {activeProfile.name} across the past 7 days
          </p>
        </div>

        <span className="text-xs font-semibold px-3 py-1 bg-slate-800 text-slate-300 rounded-lg border border-slate-700 w-fit">
          {weeklyData.activeDaysCount} of 7 days recorded
        </span>
      </div>

      {/* 4 Key Weekly Averages */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Average First Meal Time */}
        <div
          id="stat-avg-first-meal"
          className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-md"
        >
          <div className="flex items-center gap-2 text-xs text-slate-400 font-medium mb-1">
            <Clock className="w-4 h-4 text-emerald-400" />
            Average First-Meal Time
          </div>
          <div className="text-xl font-bold text-white mt-1">
            {weeklyData.avgFirstMealTime}
          </div>
          <p className="text-[11px] text-slate-400 mt-1">
            Typical day start time
          </p>
        </div>

        {/* Average Last Meal Time */}
        <div
          id="stat-avg-last-meal"
          className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-md"
        >
          <div className="flex items-center gap-2 text-xs text-slate-400 font-medium mb-1">
            <Clock className="w-4 h-4 text-indigo-400" />
            Average Last-Meal Time
          </div>
          <div className="text-xl font-bold text-white mt-1">
            {weeklyData.avgLastMealTime}
          </div>
          <p className="text-[11px] text-slate-400 mt-1">
            Typical day conclusion
          </p>
        </div>

        {/* Average Eating Events per Day */}
        <div
          id="stat-avg-eating-events"
          className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-md"
        >
          <div className="flex items-center gap-2 text-xs text-slate-400 font-medium mb-1">
            <Hash className="w-4 h-4 text-amber-400" />
            Avg. Eating Events / Day
          </div>
          <div className="text-xl font-bold text-amber-400 mt-1">
            {weeklyData.avgEatingEventsPerDay}
          </div>
          <p className="text-[11px] text-slate-400 mt-1">
            Meals & snacks frequency
          </p>
        </div>

        {/* Average Time Between Eating Events */}
        <div
          id="stat-avg-gap"
          className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-md"
        >
          <div className="flex items-center gap-2 text-xs text-slate-400 font-medium mb-1">
            <Hourglass className="w-4 h-4 text-sky-400" />
            Avg. Time Between Meals
          </div>
          <div className="text-xl font-bold text-sky-400 mt-1">
            {weeklyData.avgGapBetweenMeals}
          </div>
          <p className="text-[11px] text-slate-400 mt-1">
            Interval between events
          </p>
        </div>
      </div>

      {/* Visual Chart of Meal Times Across the Week */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg">
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Timer className="w-4 h-4 text-emerald-400" />
              Meal Schedule Distribution Across the Week
            </h3>
            <p className="text-xs text-slate-400">
              Each point represents an eating event timestamp across the 24-hour day
            </p>
          </div>
          <div className="text-xs text-slate-400 hidden sm:flex items-center gap-3">
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400"></span> 1st Meal
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-sky-400"></span> Intermediate
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-indigo-400"></span> Last Meal
            </span>
          </div>
        </div>

        {/* 24-Hour Timeline Scale */}
        <div className="mt-6 space-y-4">
          {/* Hour markers row */}
          <div className="relative h-5 text-[10px] text-slate-400 border-b border-slate-800 font-mono hidden sm:block">
            <span className="absolute left-[0%]">12 AM</span>
            <span className="absolute left-[25%]">6 AM</span>
            <span className="absolute left-[50%]">12 PM</span>
            <span className="absolute left-[75%]">6 PM</span>
            <span className="absolute right-[0%]">11:59 PM</span>
          </div>

          {/* Days rows */}
          <div className="space-y-3">
            {weeklyData.days.map((day) => {
              const isCurrentDay = day.date === currentDate;
              const hasMeals = day.rawMeals.length > 0;

              return (
                <div
                  key={day.date}
                  onClick={() => onSelectDate(day.date)}
                  className={`p-3 rounded-xl border transition-all cursor-pointer ${
                    isCurrentDay
                      ? 'bg-slate-800/90 border-emerald-500/50 shadow-md'
                      : 'bg-slate-800/40 border-slate-800 hover:border-slate-700 hover:bg-slate-800/70'
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-white w-10">
                        {day.dayName}
                      </span>
                      <span className="text-xs text-slate-400">
                        {day.shortDate}
                      </span>
                      {isCurrentDay && (
                        <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                          Viewing
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-3 text-xs text-slate-400">
                      <span>
                        <strong className="text-slate-200">{day.totalMeals}</strong> events
                      </span>
                      {hasMeals && (
                        <>
                          <span>•</span>
                          <span>
                            Window:{' '}
                            <strong className="text-emerald-400 font-mono">
                              {day.eatingWindowFormatted}
                            </strong>
                          </span>
                          <span>•</span>
                          <span>
                            Avg gap:{' '}
                            <strong className="text-sky-400 font-mono">
                              {day.averageGapFormatted}
                            </strong>
                          </span>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Visual 24-hour timeline bar for the day */}
                  <div className="relative h-7 bg-slate-900 rounded-lg border border-slate-700/60 overflow-hidden flex items-center px-1">
                    {/* Time reference grid lines */}
                    <div className="absolute inset-0 flex justify-between pointer-events-none opacity-20">
                      <div className="w-px h-full bg-slate-500" />
                      <div className="w-px h-full bg-slate-500" />
                      <div className="w-px h-full bg-slate-500" />
                      <div className="w-px h-full bg-slate-500" />
                    </div>

                    {hasMeals ? (
                      <>
                        {/* Shaded Eating Window span */}
                        {day.rawMeals.length > 1 && (
                          <div
                            className="absolute top-1 bottom-1 bg-emerald-500/15 border-y border-emerald-500/30 rounded"
                            style={{
                              left: `${(timeToMinutes(day.rawMeals[0].time) / 1440) * 100}%`,
                              width: `${
                                ((timeToMinutes(day.rawMeals[day.rawMeals.length - 1].time) -
                                  timeToMinutes(day.rawMeals[0].time)) /
                                  1440) *
                                100
                              }%`,
                            }}
                          />
                        )}

                        {/* Individual Meal dots */}
                        {day.rawMeals.map((m, idx) => {
                          const pct = (timeToMinutes(m.time) / 1440) * 100;
                          const isFirst = idx === 0;
                          const isLast = idx === day.rawMeals.length - 1 && day.rawMeals.length > 1;

                          return (
                            <div
                              key={m.id}
                              title={`${m.ordinalLabel} (${m.category}) at ${formatTime12h(
                                m.time
                              )}`}
                              className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 flex flex-col items-center group/dot z-10 cursor-pointer"
                              style={{ left: `${pct}%` }}
                            >
                              <div
                                className={`w-3.5 h-3.5 rounded-full border-2 border-slate-900 shadow transition-transform group-hover/dot:scale-125 ${
                                  isFirst
                                    ? 'bg-emerald-400'
                                    : isLast
                                    ? 'bg-indigo-400'
                                    : 'bg-sky-400'
                                }`}
                              />
                            </div>
                          );
                        })}
                      </>
                    ) : (
                      <div className="text-[11px] text-slate-500 pl-3">
                        No eating events recorded on this date
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Purpose & Disclaimer Box */}
      <div
        id="weekly-disclaimer"
        className="bg-slate-900/60 border border-slate-800 rounded-2xl p-4 text-xs text-slate-400 flex items-start gap-3"
      >
        <AlertCircle className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <div className="font-semibold text-slate-200">
            Tracking & Visualization Purpose
          </div>
          <p className="text-[11px] leading-relaxed">
            The purpose of weekly meal timing analysis is personal organization and pattern observation, not medical diagnosis or universal prescription. Everyone has different schedules, activity levels, and dietary requirements.
          </p>
        </div>
      </div>
    </div>
  );
};
