import React, { useState } from 'react';
import {
  MealCategory,
  FoodItem,
  MealFoodPortion,
  MealEntry,
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
  Sparkles,
  Flame,
  Check,
  ChevronDown,
} from 'lucide-react';

interface AddMealModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedDate: string;
  activeProfileId: string;
  onSaveMeal: (meal: Omit<MealEntry, 'id' | 'createdAt'>) => void;
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

export const AddMealModal: React.FC<AddMealModalProps> = ({
  isOpen,
  onClose,
  selectedDate,
  activeProfileId,
  onSaveMeal,
}) => {
  const [mealCategory, setMealCategory] = useState<MealCategory>('Breakfast');
  const [date, setDate] = useState<string>(selectedDate);
  const [time, setTime] = useState<string>(getCurrentTime24h());
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedFilter, setSelectedFilter] = useState<string>('All');
  const [selectedPortions, setSelectedPortions] = useState<MealFoodPortion[]>([]);
  const [customFoodName, setCustomFoodName] = useState<string>('');
  const [customCalories, setCustomCalories] = useState<string>('');
  const [customProtein, setCustomProtein] = useState<string>('');
  const [customQty, setCustomQty] = useState<string>('100');
  const [showCustomForm, setShowCustomForm] = useState<boolean>(false);
  const [notes, setNotes] = useState<string>('');

  if (!isOpen) return null;

  const handleUseCurrentTime = () => {
    setTime(getCurrentTime24h());
  };

  const filteredFoods = FOOD_DATABASE.filter((item) => {
    const matchesSearch =
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.category.toLowerCase().includes(searchQuery.toLowerCase());

    if (!matchesSearch) return false;

    if (selectedFilter === 'All') return true;
    if (selectedFilter === 'Veg' && item.isVegetarian) return true;
    if (selectedFilter === 'WeightGain' && item.isWeightGainFriendly) return true;
    if (selectedFilter === 'HighProtein' && item.protein >= 10) return true;
    if (selectedFilter === 'Fruit' && item.category === 'Fruit') return true;
    if (selectedFilter === 'Juice' && item.category === 'Juice') return true;
    return true;
  });

  const handleAddFoodFromDB = (food: FoodItem) => {
    // Default quantity is serving size
    const portionQty = food.servingSize;
    const ratio = portionQty / 100;

    const newPortion: MealFoodPortion = {
      foodId: food.id,
      foodName: food.name,
      quantity: portionQty,
      unit: food.servingUnit === 'ml' ? 'ml' : 'g',
      calories: Math.round(food.calories * (food.servingUnit === 'piece' || food.servingUnit === 'cup' || food.servingUnit === 'serving' ? 1 : ratio)),
      protein: Math.round((food.protein * (food.servingUnit === 'piece' || food.servingUnit === 'cup' || food.servingUnit === 'serving' ? 1 : ratio)) * 10) / 10,
      carbs: Math.round((food.carbs * (food.servingUnit === 'piece' || food.servingUnit === 'cup' || food.servingUnit === 'serving' ? 1 : ratio)) * 10) / 10,
      fat: Math.round((food.fat * (food.servingUnit === 'piece' || food.servingUnit === 'cup' || food.servingUnit === 'serving' ? 1 : ratio)) * 10) / 10,
      fiber: Math.round((food.fiber * (food.servingUnit === 'piece' || food.servingUnit === 'cup' || food.servingUnit === 'serving' ? 1 : ratio)) * 10) / 10,
    };

    setSelectedPortions([...selectedPortions, newPortion]);
    setSearchQuery('');
  };

  const handleUpdatePortionQuantity = (index: number, newQty: number) => {
    const updated = [...selectedPortions];
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
      // Custom portion scaling
      const oldQty = portion.quantity || 1;
      const ratio = newQty / oldQty;
      portion.quantity = newQty;
      portion.calories = Math.round(portion.calories * ratio);
      portion.protein = Math.round(portion.protein * ratio * 10) / 10;
      portion.carbs = Math.round(portion.carbs * ratio * 10) / 10;
      portion.fat = Math.round(portion.fat * ratio * 10) / 10;
    }

    setSelectedPortions(updated);
  };

  const handleRemovePortion = (index: number) => {
    setSelectedPortions(selectedPortions.filter((_, i) => i !== index));
  };

  const handleAddCustomFood = () => {
    if (!customFoodName.trim()) return;

    const qty = parseFloat(customQty) || 100;
    const cals = parseFloat(customCalories) || 0;
    const prot = parseFloat(customProtein) || 0;

    const newPortion: MealFoodPortion = {
      foodId: `custom_${Date.now()}`,
      foodName: customFoodName.trim(),
      quantity: qty,
      unit: 'g',
      calories: cals,
      protein: prot,
      carbs: 0,
      fat: 0,
      fiber: 0,
    };

    setSelectedPortions([...selectedPortions, newPortion]);
    setCustomFoodName('');
    setCustomCalories('');
    setCustomProtein('');
    setShowCustomForm(false);
  };

  const totalMealCalories = selectedPortions.reduce(
    (acc, it) => acc + (it.calories || 0),
    0
  );
  const totalMealProtein =
    Math.round(
      selectedPortions.reduce((acc, it) => acc + (it.protein || 0), 0) * 10
    ) / 10;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (selectedPortions.length === 0) {
      alert('Please add at least one food item to this meal.');
      return;
    }

    onSaveMeal({
      profileId: activeProfileId,
      date,
      time,
      category: mealCategory,
      items: selectedPortions,
      notes: notes.trim() ? notes.trim() : undefined,
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm overflow-y-auto">
      <div
        id="add-meal-modal"
        className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl my-8 flex flex-col max-h-[90vh]"
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-800 bg-slate-900/90 sticky top-0 z-10">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-400">
              Meal Timing Tracker
            </span>
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Clock className="w-5 h-5 text-emerald-400" />
              Log Food / Meal
            </h2>
          </div>
          <button
            id="btn-close-add-modal"
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <form onSubmit={handleSubmit} className="p-5 space-y-5 overflow-y-auto">
          {/* Top Row: Category, Date, Time eaten */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {/* Meal Category */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Meal Category:
              </label>
              <div className="relative">
                <select
                  id="select-meal-category"
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
                Date:
              </label>
              <input
                id="input-meal-date"
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 text-white rounded-xl px-3 py-2 text-xs font-medium focus:outline-none focus:border-emerald-500"
              />
            </div>

            {/* Time eaten */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-semibold text-slate-300 flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-emerald-400" />
                  Time eaten:
                </label>
                <button
                  type="button"
                  id="btn-use-current-time"
                  onClick={handleUseCurrentTime}
                  className="text-[10px] font-bold text-emerald-400 hover:text-emerald-300 bg-emerald-500/10 hover:bg-emerald-500/20 px-2 py-0.5 rounded border border-emerald-500/20 transition-colors"
                >
                  Use current time
                </button>
              </div>
              <input
                id="input-meal-time"
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                required
                className="w-full bg-slate-800 border border-slate-700 text-white rounded-xl px-3 py-2 text-xs font-bold font-mono focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          {/* Food Search & Selection */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-semibold text-slate-300">
                Food: [ Search food ]
              </label>
              <button
                type="button"
                id="btn-toggle-custom-food"
                onClick={() => setShowCustomForm(!showCustomForm)}
                className="text-xs text-slate-400 hover:text-white flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" />
                {showCustomForm ? 'Close custom food' : '+ Custom item'}
              </button>
            </div>

            {/* Custom food quick form */}
            {showCustomForm && (
              <div className="bg-slate-800/80 border border-slate-700 rounded-xl p-3 space-y-2">
                <div className="text-xs font-semibold text-white">Add Custom Food Item:</div>
                <div className="grid grid-cols-1 sm:grid-cols-4 gap-2">
                  <input
                    type="text"
                    placeholder="Food name (e.g. Besan Chilla)"
                    value={customFoodName}
                    onChange={(e) => setCustomFoodName(e.target.value)}
                    className="sm:col-span-2 bg-slate-900 border border-slate-700 text-white rounded-lg px-2.5 py-1.5 text-xs focus:outline-none focus:border-emerald-500"
                  />
                  <input
                    type="number"
                    placeholder="Calories (kcal)"
                    value={customCalories}
                    onChange={(e) => setCustomCalories(e.target.value)}
                    className="bg-slate-900 border border-slate-700 text-white rounded-lg px-2.5 py-1.5 text-xs focus:outline-none focus:border-emerald-500"
                  />
                  <input
                    type="number"
                    placeholder="Protein (g)"
                    value={customProtein}
                    onChange={(e) => setCustomProtein(e.target.value)}
                    className="bg-slate-900 border border-slate-700 text-white rounded-lg px-2.5 py-1.5 text-xs focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <button
                  type="button"
                  onClick={handleAddCustomFood}
                  className="w-full bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 font-semibold py-1.5 rounded-lg text-xs border border-emerald-500/30 transition-colors"
                >
                  Add Custom Item to Meal
                </button>
              </div>
            )}

            {/* Food Search Input */}
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                id="input-food-search"
                type="text"
                placeholder="Search food database (e.g., roti, paneer, rice, dal, smoothie, banana, eggs...)"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 text-white rounded-xl pl-9 pr-4 py-2 text-xs focus:outline-none focus:border-emerald-500 placeholder-slate-500"
              />
            </div>

            {/* Filter pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none text-[11px]">
              {['All', 'Veg', 'WeightGain', 'HighProtein', 'Fruit', 'Juice'].map(
                (filter) => (
                  <button
                    key={filter}
                    type="button"
                    onClick={() => setSelectedFilter(filter)}
                    className={`px-2.5 py-1 rounded-lg font-medium transition-all shrink-0 ${
                      selectedFilter === filter
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                        : 'bg-slate-800 text-slate-400 hover:text-white border border-slate-700'
                    }`}
                  >
                    {filter === 'WeightGain'
                      ? 'Weight-Gain'
                      : filter === 'HighProtein'
                      ? 'High Protein'
                      : filter}
                  </button>
                )
              )}
            </div>

            {/* Food list search results dropdown */}
            {searchQuery.trim() !== '' && (
              <div className="max-h-48 overflow-y-auto bg-slate-800/95 border border-slate-700 rounded-xl divide-y divide-slate-700/60 shadow-lg">
                {filteredFoods.length === 0 ? (
                  <div className="p-3 text-center text-xs text-slate-400">
                    No matching foods found. Use the "+ Custom item" button above to add it.
                  </div>
                ) : (
                  filteredFoods.slice(0, 10).map((food) => (
                    <div
                      key={food.id}
                      onClick={() => handleAddFoodFromDB(food)}
                      className="p-2.5 hover:bg-slate-700/80 cursor-pointer flex items-center justify-between gap-2 transition-colors"
                    >
                      <div>
                        <div className="text-xs font-semibold text-white flex items-center gap-1.5">
                          {food.name}
                          {food.isVegetarian && (
                            <span className="text-[10px] text-emerald-400 bg-emerald-500/10 px-1.5 py-0.2 rounded border border-emerald-500/20">
                              Veg
                            </span>
                          )}
                        </div>
                        <div className="text-[10px] text-slate-400">
                          {food.servingSize} {food.servingUnit} • {food.calories} kcal • {food.protein}g protein
                        </div>
                      </div>
                      <button
                        type="button"
                        className="p-1 bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500 hover:text-slate-950 rounded-lg text-xs font-bold transition-all"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>

          {/* Selected Food Items & Portions */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-xs font-semibold text-slate-300">
                Quantity & Items in this meal ({selectedPortions.length}):
              </label>
              {selectedPortions.length > 0 && (
                <div className="text-xs font-bold text-amber-300 flex items-center gap-2">
                  <span className="flex items-center gap-1">
                    <Flame className="w-3.5 h-3.5 text-amber-400" />
                    {totalMealCalories} kcal
                  </span>
                  <span>•</span>
                  <span className="text-indigo-300">{totalMealProtein}g P</span>
                </div>
              )}
            </div>

            {selectedPortions.length === 0 ? (
              <div className="border border-dashed border-slate-800 rounded-xl p-4 text-center text-xs text-slate-500">
                Search or select foods above to add them to this eating event.
              </div>
            ) : (
              <div className="space-y-2">
                {selectedPortions.map((portion, idx) => (
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

                    {/* Quantity: [ ___ ] g / ml */}
                    <div className="flex items-center gap-2">
                      <div className="flex items-center bg-slate-900 border border-slate-700 rounded-lg px-2 py-1">
                        <input
                          id={`portion-qty-input-${idx}`}
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
            )}
          </div>

          {/* Optional notes */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Notes (Optional):
            </label>
            <input
              type="text"
              placeholder="e.g. Post-workout, with extra ghee, outdoor snack"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 text-white rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-emerald-500 placeholder-slate-500"
            />
          </div>

          {/* Modal Footer / Actions */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              id="btn-save-meal-submit"
              className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold px-5 py-2.5 rounded-xl text-xs flex items-center gap-1.5 shadow-lg shadow-emerald-500/20 transition-all active:scale-95"
            >
              <Check className="w-4 h-4 stroke-[3]" />
              Save Meal & Recalculate Gaps
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
