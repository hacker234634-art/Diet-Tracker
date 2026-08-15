import React from 'react';
import { VEGETARIAN_WEIGHT_GAIN_PLAN, WeightGainMealIdea } from '../data/vegetarianMealPlan';
import { MealEntry, UserProfile } from '../types';
import {
  X,
  Sparkles,
  Utensils,
  Flame,
  Dna,
  Clock,
  Plus,
  Check,
  Leaf,
  Info,
} from 'lucide-react';
import { formatTime12h } from '../utils/timeUtils';

interface VegetarianMealPlanModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedDate: string;
  activeProfile: UserProfile;
  onLogMealIdea: (meal: Omit<MealEntry, 'id' | 'createdAt'>) => void;
}

export const VegetarianMealPlanModal: React.FC<VegetarianMealPlanModalProps> = ({
  isOpen,
  onClose,
  selectedDate,
  activeProfile,
  onLogMealIdea,
}) => {
  if (!isOpen) return null;

  const handleLogIdea = (idea: WeightGainMealIdea) => {
    onLogMealIdea({
      profileId: activeProfile.id,
      date: selectedDate,
      time: idea.recommendedTime,
      category: idea.category,
      items: idea.items.map((it, idx) => ({
        foodId: `plan_${idea.id}_${idx}`,
        foodName: it.name,
        quantity: 100,
        unit: 'portion',
        calories: it.calories,
        protein: it.protein,
        carbs: it.carbs,
        fat: it.fat,
        fiber: it.fiber,
      })),
      notes: `From Vegetarian Weight-Gain Plan: ${idea.name}`,
    });
  };

  const totalPlanCalories = VEGETARIAN_WEIGHT_GAIN_PLAN.reduce(
    (acc, it) => acc + it.calories,
    0
  );
  const totalPlanProtein =
    Math.round(
      VEGETARIAN_WEIGHT_GAIN_PLAN.reduce((acc, it) => acc + it.protein, 0) * 10
    ) / 10;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm overflow-y-auto">
      <div
        id="vegetarian-meal-plan-modal"
        className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-3xl overflow-hidden shadow-2xl my-8 flex flex-col max-h-[90vh]"
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-800 bg-slate-900 sticky top-0 z-10">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1">
              <Leaf className="w-3.5 h-3.5" />
              Nutrient-Dense Vegetarian Nutrition
            </span>
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Utensils className="w-5 h-5 text-amber-400" />
              Vegetarian Weight-Gain Meal Reference Plan
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-5 space-y-5 overflow-y-auto">
          {/* Plan Overview Banner */}
          <div className="bg-gradient-to-r from-emerald-950/40 via-slate-800/80 to-slate-800/80 border border-emerald-500/20 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-emerald-400" />
                Balanced Daily Total
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                5 scheduled eating events optimized for healthy caloric surplus
              </p>
            </div>

            <div className="flex items-center gap-4 text-xs font-mono">
              <div className="bg-slate-900/80 px-3 py-1.5 rounded-xl border border-slate-700 text-center">
                <div className="text-[10px] text-slate-400 font-sans">Total Cal</div>
                <div className="font-bold text-amber-400">{totalPlanCalories} kcal</div>
              </div>
              <div className="bg-slate-900/80 px-3 py-1.5 rounded-xl border border-slate-700 text-center">
                <div className="text-[10px] text-slate-400 font-sans">Total Protein</div>
                <div className="font-bold text-indigo-400">{totalPlanProtein}g P</div>
              </div>
            </div>
          </div>

          {/* Meal List */}
          <div className="space-y-3">
            {VEGETARIAN_WEIGHT_GAIN_PLAN.map((meal, index) => (
              <div
                key={meal.id}
                className="bg-slate-800/60 border border-slate-700/70 rounded-2xl p-4 transition-all hover:border-slate-600"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-700/60">
                  <div className="flex items-center gap-2.5">
                    <span className="w-7 h-7 rounded-lg bg-emerald-500/20 text-emerald-300 font-bold text-xs flex items-center justify-center border border-emerald-500/30">
                      {index + 1}
                    </span>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="text-sm font-bold text-white">
                          {meal.name}
                        </h4>
                        <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-slate-700 text-slate-300">
                          {meal.category}
                        </span>
                      </div>
                      <div className="text-xs text-emerald-400 flex items-center gap-1 font-medium mt-0.5">
                        <Clock className="w-3.5 h-3.5" />
                        Suggested timing: {formatTime12h(meal.recommendedTime)}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="text-right text-xs">
                      <div className="font-bold text-amber-300 flex items-center gap-1 justify-end">
                        <Flame className="w-3.5 h-3.5 text-amber-400" />
                        {meal.calories} kcal
                      </div>
                      <div className="text-indigo-300 font-mono text-[11px]">
                        {meal.protein}g protein
                      </div>
                    </div>

                    <button
                      id={`btn-log-plan-meal-${meal.id}`}
                      onClick={() => handleLogIdea(meal)}
                      className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold px-3 py-1.5 rounded-xl text-xs flex items-center gap-1.5 shadow-sm transition-all active:scale-95 shrink-0"
                    >
                      <Plus className="w-3.5 h-3.5 stroke-[3]" />
                      Log to Timeline
                    </button>
                  </div>
                </div>

                <div className="pt-3 space-y-2">
                  <div className="text-xs text-slate-300">
                    <strong className="text-slate-400">Included items: </strong>
                    {meal.items.map((it, idx) => (
                      <span key={idx}>
                        {it.name} ({it.quantity})
                        {idx < meal.items.length - 1 ? ', ' : ''}
                      </span>
                    ))}
                  </div>

                  <div className="bg-slate-900/60 rounded-xl p-2.5 text-[11px] text-slate-400 flex items-start gap-2 border border-slate-800">
                    <Info className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                    <span>
                      <strong className="text-slate-300">Nutrition Note:</strong> {meal.tips}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="text-xs text-slate-400 text-center pt-2">
            These are flexible ideas for inspiration. You can customize portions and timings anytime.
          </div>
        </div>
      </div>
    </div>
  );
};
