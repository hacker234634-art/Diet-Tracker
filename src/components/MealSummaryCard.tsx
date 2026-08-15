import React from 'react';
import {
  Clock,
  Sparkles,
  Timer,
  Hash,
  Hourglass,
  AlertCircle,
} from 'lucide-react';
import { DayMealSummary } from '../types';

interface MealSummaryCardProps {
  summary: DayMealSummary;
}

export const MealSummaryCard: React.FC<MealSummaryCardProps> = ({ summary }) => {
  return (
    <div
      id="meal-timing-summary-card"
      className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-lg relative overflow-hidden"
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-slate-800/80">
        <div>
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <Timer className="w-5 h-5 text-emerald-400" />
            Meal Timing Summary
          </h2>
          <p className="text-xs text-slate-400">
            Recorded daily eating window & interval metrics
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
            {summary.totalMeals} {summary.totalMeals === 1 ? 'Eating Event' : 'Eating Events'}
          </span>
        </div>
      </div>

      {summary.totalMeals === 0 ? (
        <div className="py-6 text-center text-slate-500 text-xs">
          No meals recorded for this day yet. Log a meal above to calculate timing metrics.
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4">
          {/* First Meal */}
          <div
            id="metric-first-meal"
            className="bg-slate-800/60 border border-slate-700/60 rounded-xl p-3.5"
          >
            <div className="flex items-center gap-1.5 text-slate-400 text-xs font-medium mb-1">
              <Clock className="w-3.5 h-3.5 text-emerald-400" />
              First meal
            </div>
            <div className="text-lg font-bold text-white tracking-tight">
              {summary.firstMealTime || '—'}
            </div>
            <div className="text-[11px] text-slate-400 mt-0.5">
              Day start
            </div>
          </div>

          {/* Last Meal */}
          <div
            id="metric-last-meal"
            className="bg-slate-800/60 border border-slate-700/60 rounded-xl p-3.5"
          >
            <div className="flex items-center gap-1.5 text-slate-400 text-xs font-medium mb-1">
              <Clock className="w-3.5 h-3.5 text-indigo-400" />
              Last meal
            </div>
            <div className="text-lg font-bold text-white tracking-tight">
              {summary.lastMealTime || '—'}
            </div>
            <div className="text-[11px] text-slate-400 mt-0.5">
              Day conclusion
            </div>
          </div>

          {/* Eating Window */}
          <div
            id="metric-eating-window"
            className="bg-slate-800/60 border border-slate-700/60 rounded-xl p-3.5"
          >
            <div className="flex items-center gap-1.5 text-slate-400 text-xs font-medium mb-1">
              <Hourglass className="w-3.5 h-3.5 text-amber-400" />
              Eating window
            </div>
            <div className="text-lg font-bold text-emerald-400 tracking-tight">
              {summary.eatingWindowFormatted}
            </div>
            <div className="text-[11px] text-slate-400 mt-0.5">
              First to last meal
            </div>
          </div>

          {/* Average Gap */}
          <div
            id="metric-average-gap"
            className="bg-slate-800/60 border border-slate-700/60 rounded-xl p-3.5"
          >
            <div className="flex items-center gap-1.5 text-slate-400 text-xs font-medium mb-1">
              <Hash className="w-3.5 h-3.5 text-sky-400" />
              Average gap between meals
            </div>
            <div className="text-lg font-bold text-sky-400 tracking-tight">
              {summary.averageGapFormatted}
            </div>
            <div className="text-[11px] text-slate-400 mt-0.5">
              Across {Math.max(0, summary.totalMeals - 1)} intervals
            </div>
          </div>
        </div>
      )}

      {/* Non-medical Disclaimer */}
      <div
        id="disclaimer-non-medical"
        className="mt-4 pt-3 border-t border-slate-800/70 flex items-start gap-2 text-[11px] text-slate-400 leading-relaxed"
      >
        <AlertCircle className="w-4 h-4 text-amber-400/80 shrink-0 mt-0.5" />
        <span>
          <strong className="text-slate-300 font-semibold">Note:</strong> Do NOT interpret these numbers as medical recommendations. The application simply records and summarizes your actual eating patterns.
        </span>
      </div>
    </div>
  );
};
