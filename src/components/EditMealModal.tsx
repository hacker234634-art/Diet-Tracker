import React, { useState } from 'react';
import {
  ProcessedMealEntry,
  MealCategory,
  MealFoodPortion,
} from '../types';
import { FOOD_DATABASE } from '../data/foodDatabase';
import { getCurrentTime24h } from '../utils/timeUtils';
import {
  X,
  Search,
  Clock,
  Plus,
  Trash2,
  Calendar,
  Flame,
  Check,
  ChevronDown,
  AlertTriangle,
} from 'lucide-react';

interface EditMealModalProps {
  meal: ProcessedMealEntry | null;
  onClose: () => void;
  onUpdateMeal: (updated: ProcessedMealEntry) => void;
  onDeleteMeal: (mealId: string) => void;
}

const CATEGORIES: MealCategory[] = [
  'Breakfast',
  'Lunch',
  'Dinner',
  'Snack',
  'Fruit',
  'Juice',
  'Other',
];

export const EditMealModal: React.FC<EditMealModalProps> = ({
  meal,
  onClose,
  onUpdateMeal,
  onDeleteMeal,
}) => {
  if (!meal) return null;

  const [mealCategory, setMealCategory] = useState<MealCategory>(meal.category);
  const [date, setDate] = useState<string>(meal.date);
  const [time, setTime] = useState<string>(meal.time);
  const [items, setItems] = useState<MealFoodPortion[]>(meal.items);
  const [notes, setNotes] = useState<string>(meal.notes || '');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const handleUseCurrentTime = () => {
    setTime(getCurrentTime24h());
  };

  const handleAddFoodFromDB = (foodId: string) => {
    const food = FOOD_DATABASE.find((f) => f.id === foodId);
    if (!food) return;

    const portionQty = food.servingSize;
    const ratio = portionQty / 100;

    const newPortion: MealFoodPortion = {
      foodId: food.id,
      foodName: food.name,
      quantity: portionQty,
      unit: food.servingUnit === 'ml' ? 'ml' : 'g',
      calories: Math.round(
        food.calories *
          (food.servingUnit === 'piece' ||
          food.servingUnit === 'cup' ||
          food.servingUnit === 'serving'
            ? 1
            : ratio)
      ),
      protein:
        Math.round(
          food.protein *
            (food.servingUnit === 'piece' ||
            food.servingUnit === 'cup' ||
            food.servingUnit === 'serving'
              ? 1
              : ratio) *
            10
        ) / 10,
      carbs:
        Math.round(
          food.carbs *
            (food.servingUnit === 'piece' ||
            food.servingUnit === 'cup' ||
            food.servingUnit === 'serving'
              ? 1
              : ratio) *
            10
        ) / 10,
      fat:
        Math.round(
          food.fat *
            (food.servingUnit === 'piece' ||
            food.servingUnit === 'cup' ||
            food.servingUnit === 'serving'
              ? 1
              : ratio) *
            10
        ) / 10,
      fiber:
        Math.round(
          food.fiber *
            (food.servingUnit === 'piece' ||
            food.servingUnit === 'cup' ||
            food.servingUnit === 'serving'
              ? 1
              : ratio) *
            10
        ) / 10,
    };

    setItems([...items, newPortion]);
    setSearchQuery('');
  };

  const handleUpdatePortionQuantity = (index: number, newQty: number) => {
    const updated = [...items];
    const portion = updated[index];
    const originalFood = FOOD_DATABASE.find((f) => f.id === portion.foodId);

    if (originalFood && originalFood.servingSize > 0) {
      const isDiscrete =
        originalFood.servingUnit === 'piece' ||
        originalFood.servingUnit === 'cup' ||
        originalFood.servingUnit === 'serving';

      const factor = isDiscrete
        ? newQty / originalFood.servingSize
        : newQty / 100;

      portion.quantity = newQty;
      portion.calories = Math.round(originalFood.calories * factor);
      portion.protein = Math.round(originalFood.protein * factor * 10) / 10;
      portion.carbs = Math.round(originalFood.carbs * factor * 10) / 10;
      portion.fat = Math.round(originalFood.fat * factor * 10) / 10;
      portion.fiber = Math.round(originalFood.fiber * factor * 10) / 10;
    } else {
      const oldQty = portion.quantity || 1;
      const ratio = newQty / oldQty;
      portion.quantity = newQty;
      portion.calories = Math.round(portion.calories * ratio);
      portion.protein = Math.round(portion.protein * ratio * 10) / 10;
      portion.carbs = Math.round(portion.carbs * ratio * 10) / 10;
      portion.fat = Math.round(portion.fat * ratio * 10) / 10;
    }

    setItems(updated);
  };

  const handleRemovePortion = (index: number) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const totalMealCalories = items.reduce(
    (acc, it) => acc + (it.calories || 0),
    0
  );
  const totalMealProtein =
    Math.round(items.reduce((acc, it) => acc + (it.protein || 0), 0) * 10) / 10;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (items.length === 0) {
      alert('Please have at least one food item.');
      return;
    }

    onUpdateMeal({
      ...meal,
      category: mealCategory,
      date,
      time,
      items,
      notes: notes.trim() ? notes.trim() : undefined,
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm overflow-y-auto">
      <div
        id="edit-meal-modal"
        className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl my-8 flex flex-col max-h-[90vh]"
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-800 bg-slate-900/90 sticky top-0 z-10">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-400">
              Edit Meal & Timings
            </span>
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Clock className="w-5 h-5 text-emerald-400" />
              Edit {meal.ordinalLabel}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Form */}
        <form onSubmit={handleSubmit} className="p-5 space-y-5 overflow-y-auto">
          {/* Top Row: Category, Date, Time */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {/* Meal Category */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Move to Category:
              </label>
              <div className="relative">
                <select
                  id="edit-meal-category-select"
                  value={mealCategory}
                  onChange={(e) => setMealCategory(e.target.value as MealCategory)}
                  className="w-full bg-slate-800 border border-slate-700 text-white rounded-xl px-3 py-2 text-xs font-medium focus:outline-none focus:border-emerald-500 appearance-none"
                >
                  {CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
                <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 top-2.5 pointer-events-none" />
              </div>
            </div>

            {/* Date */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-slate-400" />
                Change Date:
              </label>
              <input
                id="edit-meal-date-input"
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 text-white rounded-xl px-3 py-2 text-xs font-medium focus:outline-none focus:border-emerald-500"
              />
            </div>

            {/* Time Eaten */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-semibold text-slate-300 flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-emerald-400" />
                  Change Time:
                </label>
                <button
                  type="button"
                  id="edit-btn-use-current-time"
                  onClick={handleUseCurrentTime}
                  className="text-[10px] font-bold text-emerald-400 hover:text-emerald-300 bg-emerald-500/10 hover:bg-emerald-500/20 px-2 py-0.5 rounded border border-emerald-500/20"
                >
                  Current time
                </button>
              </div>
              <input
                id="edit-meal-time-input"
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                required
                className="w-full bg-slate-800 border border-slate-700 text-white rounded-xl px-3 py-2 text-xs font-bold font-mono focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          {/* Quick Notice */}
          <div className="bg-slate-800/40 border border-slate-800 rounded-xl p-3 text-[11px] text-slate-400 flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>
              Changing the meal time or date will automatically recalculate chronological meal order, intervals, and eating window.
            </span>
          </div>

          {/* Items in this meal */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-semibold text-slate-300">
                Food Items ({items.length}):
              </label>
              <div className="text-xs font-bold text-amber-300 flex items-center gap-2">
                <span className="flex items-center gap-1">
                  <Flame className="w-3.5 h-3.5 text-amber-400" />
                  {totalMealCalories} kcal
                </span>
                <span>•</span>
                <span className="text-indigo-300">{totalMealProtein}g P</span>
              </div>
            </div>

            <div className="space-y-2">
              {items.map((portion, idx) => (
                <div
                  key={idx}
                  className="bg-slate-800/90 border border-slate-700/80 rounded-xl p-3 flex items-center justify-between gap-3"
                >
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-bold text-white truncate">
                      {portion.foodName}
                    </div>
                    <div className="text-[11px] text-slate-400 flex items-center gap-2 mt-0.5">
                      <span className="text-amber-300 font-semibold">{portion.calories} kcal</span>
                      <span>•</span>
                      <span className="text-indigo-300">{portion.protein}g protein</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <div className="flex items-center bg-slate-900 border border-slate-700 rounded-lg px-2 py-1">
                      <input
                        type="number"
                        min="1"
                        max="2000"
                        value={portion.quantity}
                        onChange={(e) =>
                          handleUpdatePortionQuantity(idx, parseFloat(e.target.value) || 0)
                        }
                        className="w-14 bg-transparent text-xs font-bold text-white text-right focus:outline-none"
                      />
                      <span className="text-[11px] text-slate-400 ml-1">
                        {portion.unit || 'g'}
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleRemovePortion(idx)}
                      className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Quick add more foods to this meal */}
            <div className="pt-2">
              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  placeholder="+ Add another food to this meal..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 text-white rounded-xl pl-9 pr-4 py-2 text-xs focus:outline-none focus:border-emerald-500"
                />
              </div>

              {searchQuery.trim() !== '' && (
                <div className="mt-1 max-h-36 overflow-y-auto bg-slate-800 border border-slate-700 rounded-xl divide-y divide-slate-700/60 shadow-lg">
                  {FOOD_DATABASE.filter((f) =>
                    f.name.toLowerCase().includes(searchQuery.toLowerCase())
                  )
                    .slice(0, 5)
                    .map((food) => (
                      <div
                        key={food.id}
                        onClick={() => handleAddFoodFromDB(food.id)}
                        className="p-2 text-xs hover:bg-slate-700 cursor-pointer flex items-center justify-between"
                      >
                        <span className="text-white font-medium">{food.name}</span>
                        <span className="text-emerald-400 font-bold">+ Add</span>
                      </div>
                    ))}
                </div>
              )}
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Notes:
            </label>
            <input
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 text-white rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-emerald-500"
            />
          </div>

          {/* Actions */}
          <div className="flex items-center justify-between pt-3 border-t border-slate-800">
            <button
              type="button"
              id="btn-delete-from-edit-modal"
              onClick={() => {
                if (window.confirm('Are you sure you want to delete this meal?')) {
                  onDeleteMeal(meal.id);
                  onClose();
                }
              }}
              className="px-3 py-2 text-xs font-semibold text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 rounded-xl transition-colors flex items-center gap-1.5"
            >
              <Trash2 className="w-3.5 h-3.5" />
              Delete Meal
            </button>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-xs font-semibold text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                id="btn-update-meal-submit"
                className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold px-5 py-2.5 rounded-xl text-xs flex items-center gap-1.5 shadow-lg shadow-emerald-500/20 transition-all active:scale-95"
              >
                <Check className="w-4 h-4 stroke-[3]" />
                Save & Recalculate Timeline
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
