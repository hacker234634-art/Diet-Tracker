import React from 'react';
import {
  UserProfile,
  DayMealSummary,
  WaterLog,
  WeightEntry,
} from '../types';
import {
  Flame,
  Dna,
  Wheat,
  Droplets,
  Plus,
  Scale,
  Sparkles,
  Target,
} from 'lucide-react';

interface NutritionDashboardProps {
  activeProfile: UserProfile;
  summary: DayMealSummary;
  waterLogs: WaterLog[];
  weightEntries: WeightEntry[];
  onAddWater: (amountMl: number) => void;
  onOpenWeightTracker: () => void;
  onOpenMealPlan: () => void;
}

export const NutritionDashboard: React.FC<NutritionDashboardProps> = ({
  activeProfile,
  summary,
  waterLogs,
  weightEntries,
  onAddWater,
  onOpenWeightTracker,
  onOpenMealPlan,
}) => {
  const totalWaterMl = waterLogs.reduce((acc, it) => acc + it.amountMl, 0);
  const waterTarget = activeProfile.waterTargetMl || 3000;
  const waterPercent = Math.min(100, Math.round((totalWaterMl / waterTarget) * 100));

  const calTarget = activeProfile.calorieTarget || 2500;
  const calPercent = Math.min(100, Math.round((summary.totalCalories / calTarget) * 100));

  const protTarget = activeProfile.proteinTarget || 100;
  const protPercent = Math.min(100, Math.round((summary.totalProtein / protTarget) * 100));

  // Weight goal
  const latestWeight =
    weightEntries.length > 0
      ? weightEntries[weightEntries.length - 1].weightKg
      : activeProfile.currentWeightKg;
  const weightGainRemaining = Math.max(
    0,
    Math.round((activeProfile.targetWeightKg - latestWeight) * 10) / 10
  );

  return (
    <div id="nutrition-dashboard-section" className="space-y-4">
      {/* Daily Calories & Macros Card */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-400">
              Daily Nutrition Totals
            </span>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Flame className="w-4 h-4 text-amber-400" />
              Calories & Macronutrients
            </h3>
          </div>
          <button
            onClick={onOpenMealPlan}
            className="text-xs text-amber-300 hover:text-amber-200 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/20 px-2.5 py-1 rounded-lg transition-colors flex items-center gap-1 font-medium"
          >
            <Sparkles className="w-3.5 h-3.5" />
            Weight-Gain Ideas
          </button>
        </div>

        {/* Calorie Bar */}
        <div className="mt-4">
          <div className="flex items-center justify-between text-xs mb-1.5">
            <span className="font-semibold text-slate-300">Energy Intake</span>
            <span className="font-bold text-white font-mono">
              <span className="text-amber-400 text-sm">{summary.totalCalories}</span> / {calTarget} kcal ({calPercent}%)
            </span>
          </div>
          <div className="w-full h-3 bg-slate-800 rounded-full overflow-hidden p-0.5 border border-slate-700/60">
            <div
              className="h-full bg-gradient-to-r from-amber-500 to-emerald-400 rounded-full transition-all duration-500"
              style={{ width: `${calPercent}%` }}
            />
          </div>
        </div>

        {/* 4 Macros Breakdown Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4">
          {/* Protein */}
          <div className="bg-slate-800/60 border border-slate-700/60 rounded-xl p-3">
            <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
              <span className="flex items-center gap-1 font-semibold text-indigo-300">
                <Dna className="w-3.5 h-3.5" /> Protein
              </span>
              <span className="font-mono font-bold text-white">{summary.totalProtein}g</span>
            </div>
            <div className="w-full h-1.5 bg-slate-700/70 rounded-full overflow-hidden">
              <div
                className="h-full bg-indigo-500 rounded-full transition-all"
                style={{ width: `${protPercent}%` }}
              />
            </div>
            <div className="text-[10px] text-slate-400 mt-1.5 flex justify-between">
              <span>Goal: {protTarget}g</span>
              <span className="text-indigo-400 font-semibold">{protPercent}%</span>
            </div>
          </div>

          {/* Carbs */}
          <div className="bg-slate-800/60 border border-slate-700/60 rounded-xl p-3">
            <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
              <span className="flex items-center gap-1 font-semibold text-sky-300">
                <Wheat className="w-3.5 h-3.5" /> Carbs
              </span>
              <span className="font-mono font-bold text-white">{summary.totalCarbs}g</span>
            </div>
            <div className="w-full h-1.5 bg-slate-700/70 rounded-full overflow-hidden">
              <div
                className="h-full bg-sky-500 rounded-full transition-all"
                style={{ width: `${Math.min(100, (summary.totalCarbs / 350) * 100)}%` }}
              />
            </div>
            <div className="text-[10px] text-slate-400 mt-1.5">
              <span>Complex fuel</span>
            </div>
          </div>

          {/* Fat */}
          <div className="bg-slate-800/60 border border-slate-700/60 rounded-xl p-3">
            <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
              <span className="flex items-center gap-1 font-semibold text-rose-300">
                <Flame className="w-3.5 h-3.5" /> Fats
              </span>
              <span className="font-mono font-bold text-white">{summary.totalFat}g</span>
            </div>
            <div className="w-full h-1.5 bg-slate-700/70 rounded-full overflow-hidden">
              <div
                className="h-full bg-rose-500 rounded-full transition-all"
                style={{ width: `${Math.min(100, (summary.totalFat / 85) * 100)}%` }}
              />
            </div>
            <div className="text-[10px] text-slate-400 mt-1.5">
              <span>Healthy lipids</span>
            </div>
          </div>

          {/* Fiber */}
          <div className="bg-slate-800/60 border border-slate-700/60 rounded-xl p-3">
            <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
              <span className="flex items-center gap-1 font-semibold text-emerald-300">
                <Sparkles className="w-3.5 h-3.5" /> Fiber
              </span>
              <span className="font-mono font-bold text-white">{summary.totalFiber}g</span>
            </div>
            <div className="w-full h-1.5 bg-slate-700/70 rounded-full overflow-hidden">
              <div
                className="h-full bg-emerald-500 rounded-full transition-all"
                style={{ width: `${Math.min(100, (summary.totalFiber / 35) * 100)}%` }}
              />
            </div>
            <div className="text-[10px] text-slate-400 mt-1.5">
              <span>Digestive health</span>
            </div>
          </div>
        </div>
      </div>

      {/* Row 2: Water Intake & Weight Goal Tracking */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Water Tracker */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-lg flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Droplets className="w-4 h-4 text-cyan-400" />
                <h4 className="text-sm font-bold text-white">Water Intake</h4>
              </div>
              <span className="text-xs font-bold text-cyan-400 font-mono">
                {totalWaterMl} / {waterTarget} ml
              </span>
            </div>

            <div className="mt-3">
              <div className="w-full h-2.5 bg-slate-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-cyan-400 rounded-full transition-all duration-500"
                  style={{ width: `${waterPercent}%` }}
                />
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between gap-2 mt-4 pt-3 border-t border-slate-800/80">
            <span className="text-[11px] text-slate-400">Quick Log:</span>
            <div className="flex items-center gap-1.5">
              <button
                id="btn-add-water-250"
                onClick={() => onAddWater(250)}
                className="bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 border border-cyan-500/20 px-2.5 py-1 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1"
              >
                <Plus className="w-3 h-3" /> 250 ml (Glass)
              </button>
              <button
                id="btn-add-water-500"
                onClick={() => onAddWater(500)}
                className="bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 border border-cyan-500/20 px-2.5 py-1 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1"
              >
                <Plus className="w-3 h-3" /> 500 ml (Bottle)
              </button>
            </div>
          </div>
        </div>

        {/* Weight Tracking & Goal */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-lg flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Scale className="w-4 h-4 text-emerald-400" />
                <h4 className="text-sm font-bold text-white">Weight & Goal Tracking</h4>
              </div>
              <span className="text-xs font-semibold text-emerald-400">
                {activeProfile.weightGoalType === 'gain'
                  ? 'Weight Gain Goal'
                  : 'Weight Management'}
              </span>
            </div>

            <div className="grid grid-cols-3 gap-2 mt-3 text-center">
              <div className="bg-slate-800/70 rounded-xl p-2">
                <div className="text-[10px] text-slate-400">Current</div>
                <div className="text-sm font-bold text-white font-mono">
                  {latestWeight} kg
                </div>
              </div>
              <div className="bg-slate-800/70 rounded-xl p-2">
                <div className="text-[10px] text-slate-400">Target</div>
                <div className="text-sm font-bold text-emerald-400 font-mono">
                  {activeProfile.targetWeightKg} kg
                </div>
              </div>
              <div className="bg-slate-800/70 rounded-xl p-2">
                <div className="text-[10px] text-slate-400">To Gain</div>
                <div className="text-sm font-bold text-amber-400 font-mono">
                  +{weightGainRemaining} kg
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between gap-2 mt-4 pt-3 border-t border-slate-800/80">
            <span className="text-[11px] text-slate-400">
              Monthly target: +{activeProfile.monthlyGainTargetKg || 1.5} kg
            </span>
            <button
              id="btn-open-weight-modal"
              onClick={onOpenWeightTracker}
              className="bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 border border-emerald-500/20 px-3 py-1 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1"
            >
              <Target className="w-3 h-3" /> Log Weigh-in
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
