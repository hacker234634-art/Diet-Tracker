export type MealCategory =
  | 'Breakfast'
  | 'Lunch'
  | 'Dinner'
  | 'Snack'
  | 'Fruit'
  | 'Juice'
  | 'Other';

export interface FoodItem {
  id: string;
  name: string;
  category: string;
  servingSize: number; // in grams or ml
  servingUnit: 'g' | 'ml' | 'piece' | 'cup' | 'serving';
  calories: number; // per 100g or standard unit
  protein: number; // in grams per 100g
  carbs: number;
  fat: number;
  fiber: number;
  isVegetarian?: boolean;
  isWeightGainFriendly?: boolean;
  notes?: string;
}

export interface MealFoodPortion {
  foodId: string;
  foodName: string;
  quantity: number; // in grams or ml
  unit: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber: number;
}

export interface MealEntry {
  id: string;
  profileId: string;
  date: string; // YYYY-MM-DD
  time: string; // HH:mm (24-hour format for reliable sorting, e.g. "08:15", "14:30")
  category: MealCategory;
  items: MealFoodPortion[];
  notes?: string;
  createdAt: number;
}

export interface ProcessedMealEntry extends MealEntry {
  chronologicalIndex: number; // 1 for First meal, 2 for Second meal, etc.
  ordinalLabel: string; // "First meal", "Second meal", "Third meal", etc.
  gapFromPreviousMinutes?: number; // Gap in minutes from the previous meal of the same day
  gapFormatted?: string; // e.g. "3 hours 15 minutes" or "3h 15m"
}

export interface DayMealSummary {
  date: string;
  totalMeals: number;
  firstMealTime?: string; // e.g. "8:15 AM"
  lastMealTime?: string; // e.g. "8:30 PM"
  eatingWindowMinutes: number;
  eatingWindowFormatted: string; // e.g. "12 hours 15 minutes"
  averageGapMinutes: number;
  averageGapFormatted: string; // e.g. "3 hours 4 minutes"
  totalCalories: number;
  totalProtein: number;
  totalCarbs: number;
  totalFat: number;
  totalFiber: number;
}

export interface WaterLog {
  id: string;
  profileId: string;
  date: string; // YYYY-MM-DD
  time: string;
  amountMl: number;
}

export interface WeightEntry {
  id: string;
  profileId: string;
  date: string; // YYYY-MM-DD
  weightKg: number;
  notes?: string;
}

export interface ReminderItem {
  id: string;
  profileId: string;
  title: string; // e.g. "Meal reminder", "Drink water", "Snack reminder"
  time: string; // HH:mm (e.g. "11:00")
  days: number[]; // 0=Sun, 1=Mon, ..., 6=Sat
  isEnabled: boolean;
}

export interface UserProfile {
  id: string;
  name: string;
  avatarColor: string;
  calorieTarget: number;
  proteinTarget: number;
  waterTargetMl: number;
  currentWeightKg: number;
  targetWeightKg: number;
  weightGoalType: 'gain' | 'maintain' | 'lose';
  monthlyGainTargetKg?: number;
  isVegetarian: boolean;
}
