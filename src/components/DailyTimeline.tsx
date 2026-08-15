import React from 'react';
import {
  ProcessedMealEntry,
  MealCategory,
} from '../types';
import {
  formatTime12h,
} from '../utils/timeUtils';
import {
  Clock,
  ArrowDown,
  Edit2,
  Trash2,
  Plus,
  Flame,
  Dna,
  Coffee,
  Sun,
  Moon,
  Apple,
  GlassWater,
  Sparkles,
  Utensils,
} from 'lucide-react';

interface DailyTimelineProps {
  date: string;
  processedMeals: ProcessedMealEntry[];
  onOpenAddMeal: () => void;
  onEditMeal: (meal: ProcessedMealEntry) => void;
  onDeleteMeal: (mealId: string) => void;
}

export const DailyTimeline: React.FC<DailyTimelineProps> = ({
  date,
  processedMeals,
  onOpenAddMeal,
  onEditMeal,
  onDeleteMeal,
}) => {
  const dateFormatted = new Date(date).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });

  const getCategoryIcon = (category: MealCategory) => {
    switch (category) {
      case 'Breakfast':
        return <Sun className="w-4 h-4 text-amber-400" />;
      case 'Lunch':
        return <Sun className="w-4 h-4 text-orange-400" />;
      case 'Dinner':
        return <Moon className="w-4 h-4 text-indigo-400" />;
      case 'Fruit':
        return <Apple className="w-4 h-4 text-rose-400" />;
      case 'Juice':
        return <GlassWater className="w-4 h-4 text-cyan-400" />;
      case 'Snack':
        return <Coffee className="w-4 h-4 text-emerald-400" />;
      default:
        return <Utensils className="w-4 h-4 text-purple-400" />;
    }
  };

  const getCategoryColorBadge = (category: MealCategory) => {
    switch (category) {
      case 'Breakfast':
        return 'bg-amber-500/10 text-amber-300 border-amber-500/20';
      case 'Lunch':
        return 'bg-orange-500/10 text-orange-300 border-orange-500/20';
      case 'Dinner':
        return 'bg-indigo-500/10 text-indigo-300 border-indigo-500/20';
      case 'Fruit':
        return 'bg-rose-500/10 text-rose-300 border-rose-500/20';
      case 'Juice':
        return 'bg-cyan-500/10 text-cyan-300 border-cyan-500/20';
      case 'Snack':
        return 'bg-emerald-500/10 text-emerald-300 border-emerald-500/20';
      default:
        return 'bg-purple-500/10 text-purple-300 border-purple-500/20';
    }
  };

  const firstMeal = processedMeals.length > 0 ? processedMeals[0] : null;

  return (
    <div id="daily-meal-timeline-container" className="space-y-6">
      {/* Date Header & Quick Add */}
      <div className="flex items-center justify-between">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">
            Chronological Daily Schedule
          </span>
          <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
            <span>Daily Meal Timeline</span>
            <span className="text-xs font-normal text-slate-400 bg-slate-800 px-2.5 py-1 rounded-md border border-slate-700">
              {dateFormatted}
            </span>
          </h2>
        </div>

        <button
          id="btn-add-meal-timeline-top"
          onClick={onOpenAddMeal}
          className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold px-3.5 py-2 rounded-xl text-xs flex items-center gap-1.5 shadow-md shadow-emerald-500/20 transition-all active:scale-95"
        >
          <Plus className="w-4 h-4 stroke-[3]" />
          Log Meal
        </button>
      </div>

      {/* FIRST MEAL HIGHLIGHT CARD (As specifically requested in requirements) */}
      {firstMeal && (
        <div
          id="first-meal-of-the-day-card"
          className="bg-gradient-to-r from-emerald-950/40 via-slate-900 to-slate-900 border border-emerald-500/30 rounded-2xl p-4 sm:p-5 relative overflow-hidden shadow-md"
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-emerald-500/15 pb-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400 font-bold text-sm">
                1
              </div>
              <div>
                <div className="text-xs font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5" />
                  First Meal of the Day
                </div>
                <div className="text-base font-bold text-white flex items-center gap-2">
                  <span>{formatTime12h(firstMeal.time)}</span>
                  <span
                    className={`text-xs font-medium px-2 py-0.5 rounded-full border ${getCategoryColorBadge(
                      firstMeal.category
                    )}`}
                  >
                    {firstMeal.category}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-4 text-xs font-medium">
              <div className="flex items-center gap-1.5 text-amber-300 bg-amber-500/10 px-2.5 py-1 rounded-lg border border-amber-500/20">
                <Flame className="w-3.5 h-3.5 text-amber-400" />
                <span>
                  {Math.round(
                    firstMeal.items.reduce((acc, it) => acc + (it.calories || 0), 0)
                  )}{' '}
                  kcal
                </span>
              </div>
              <div className="flex items-center gap-1.5 text-indigo-300 bg-indigo-500/10 px-2.5 py-1 rounded-lg border border-indigo-500/20">
                <Dna className="w-3.5 h-3.5 text-indigo-400" />
                <span>
                  {Math.round(
                    firstMeal.items.reduce((acc, it) => acc + (it.protein || 0), 0) * 10
                  ) / 10}{' '}
                  g protein
                </span>
              </div>
            </div>
          </div>

          <div className="pt-3">
            <div className="text-xs text-slate-300 font-medium">
              {firstMeal.items.map((item, idx) => (
                <span key={idx}>
                  {item.foodName}
                  {item.quantity ? ` (${item.quantity}${item.unit || 'g'})` : ''}
                  {idx < firstMeal.items.length - 1 ? ' + ' : ''}
                </span>
              ))}
            </div>
            {firstMeal.notes && (
              <p className="text-[11px] text-slate-400 mt-1 italic">
                "{firstMeal.notes}"
              </p>
            )}
          </div>
        </div>
      )}

      {/* Timeline List */}
      {processedMeals.length === 0 ? (
        <div
          id="empty-timeline-state"
          className="bg-slate-900/60 border border-dashed border-slate-800 rounded-2xl p-10 text-center"
        >
          <div className="w-12 h-12 rounded-2xl bg-slate-800 flex items-center justify-center mx-auto mb-3 text-slate-500">
            <Clock className="w-6 h-6" />
          </div>
          <h3 className="text-base font-semibold text-white">No meals recorded for this day</h3>
          <p className="text-xs text-slate-400 max-w-md mx-auto mt-1 mb-4">
            Record what you ate along with the exact time. The application will automatically number your meals and calculate the intervals between eating events.
          </p>
          <button
            onClick={onOpenAddMeal}
            className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold px-4 py-2 rounded-xl text-xs inline-flex items-center gap-1.5 shadow-md transition-all"
          >
            <Plus className="w-4 h-4" />
            Add First Meal of the Day
          </button>
        </div>
      ) : (
        <div id="timeline-meal-list" className="space-y-3 relative">
          {processedMeals.map((meal, index) => {
            const mealCalories = Math.round(
              meal.items.reduce((sum, it) => sum + (it.calories || 0), 0)
            );
            const mealProtein =
              Math.round(
                meal.items.reduce((sum, it) => sum + (it.protein || 0), 0) * 10
              ) / 10;
            const mealCarbs =
              Math.round(
                meal.items.reduce((sum, it) => sum + (it.carbs || 0), 0) * 10
              ) / 10;
            const mealFat =
              Math.round(
                meal.items.reduce((sum, it) => sum + (it.fat || 0), 0) * 10
              ) / 10;

            const prevMeal = index > 0 ? processedMeals[index - 1] : null;

            return (
              <React.Fragment key={meal.id}>
                {/* Interval Gap Indicator between consecutive meals */}
                {meal.gapFromPreviousMinutes !== undefined && (
                  <div
                    id={`meal-gap-${meal.id}`}
                    className="flex items-center justify-center my-2"
                  >
                    <div className="flex items-center gap-2 bg-slate-800/90 border border-slate-700/80 px-3.5 py-1.5 rounded-full shadow-sm">
                      <ArrowDown className="w-3.5 h-3.5 text-emerald-400 animate-bounce" />
                      <span className="text-xs font-semibold text-emerald-300">
                        {meal.gapFormatted}
                      </span>
                      {prevMeal && (
                        <span className="text-[11px] text-slate-400 hidden sm:inline">
                          (Gap from {prevMeal.ordinalLabel.toLowerCase()})
                        </span>
                      )}
                    </div>
                  </div>
                )}

                {/* Meal Item Card */}
                <div
                  id={`meal-card-${meal.id}`}
                  className="bg-slate-900 border border-slate-800 hover:border-slate-700/80 rounded-2xl p-4 sm:p-5 transition-all shadow-md group"
                >
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                    {/* Left: Time, Ordinal Number, and Category */}
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-xl bg-slate-800 border border-slate-700 flex flex-col items-center justify-center shrink-0">
                        <span className="text-xs font-bold text-emerald-400">
                          #{meal.chronologicalIndex}
                        </span>
                        <div className="text-[9px] text-slate-400">
                          {meal.chronologicalIndex === 1 ? '1st' : meal.chronologicalIndex === 2 ? '2nd' : meal.chronologicalIndex === 3 ? '3rd' : `${meal.chronologicalIndex}th`}
                        </div>
                      </div>

                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-sm font-bold text-white flex items-center gap-1.5">
                            <Clock className="w-3.5 h-3.5 text-slate-400" />
                            {formatTime12h(meal.time)}
                          </span>
                          <span className="text-xs font-bold text-slate-300">
                            • {meal.ordinalLabel}
                          </span>
                          <span
                            className={`text-[11px] font-medium px-2 py-0.5 rounded-full border flex items-center gap-1 ${getCategoryColorBadge(
                              meal.category
                            )}`}
                          >
                            {getCategoryIcon(meal.category)}
                            {meal.category}
                          </span>
                        </div>

                        {/* Food Items Breakdown */}
                        <div className="mt-2 space-y-1">
                          {meal.items.map((item, idx) => (
                            <div
                              key={idx}
                              className="text-xs text-slate-200 flex items-center gap-2"
                            >
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400/80"></span>
                              <span className="font-medium">{item.foodName}</span>
                              <span className="text-slate-400 font-mono text-[11px]">
                                {item.quantity} {item.unit || 'g'}
                              </span>
                              <span className="text-slate-400 text-[11px]">
                                • {Math.round(item.calories)} kcal
                              </span>
                            </div>
                          ))}
                        </div>

                        {meal.notes && (
                          <div className="text-xs text-slate-400 mt-2 bg-slate-800/50 px-2.5 py-1 rounded-md border border-slate-800 inline-block">
                            {meal.notes}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Right: Nutrition Summary & Actions */}
                    <div className="flex sm:flex-col items-center sm:items-end justify-between gap-2 shrink-0 border-t sm:border-t-0 pt-2 sm:pt-0 border-slate-800">
                      <div className="flex items-center gap-2">
                        <div className="text-right">
                          <div className="text-sm font-bold text-amber-300 flex items-center gap-1">
                            <Flame className="w-3.5 h-3.5 text-amber-400" />
                            {mealCalories} kcal
                          </div>
                          <div className="text-[11px] text-slate-400 space-x-1 font-mono">
                            <span className="text-indigo-300 font-semibold">{mealProtein}g P</span>
                            <span>•</span>
                            <span className="text-sky-300">{mealCarbs}g C</span>
                            <span>•</span>
                            <span className="text-rose-300">{mealFat}g F</span>
                          </div>
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex items-center gap-1">
                        <button
                          id={`btn-edit-meal-${meal.id}`}
                          onClick={() => onEditMeal(meal)}
                          title="Edit Meal details & time"
                          className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors border border-transparent hover:border-slate-700"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          id={`btn-delete-meal-${meal.id}`}
                          onClick={() => {
                            if (window.confirm('Delete this meal entry?')) {
                              onDeleteMeal(meal.id);
                            }
                          }}
                          title="Delete Meal"
                          className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors border border-transparent hover:border-rose-500/20"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </React.Fragment>
            );
          })}
        </div>
      )}
    </div>
  );
};
