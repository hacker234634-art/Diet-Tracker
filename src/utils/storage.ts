import {
  UserProfile,
  MealEntry,
  WaterLog,
  WeightEntry,
  ReminderItem,
} from '../types';
import { getTodayDateString } from './timeUtils';

const STORAGE_KEYS = {
  PROFILES: 'meal_tracker_profiles_v1',
  ACTIVE_PROFILE_ID: 'meal_tracker_active_profile_v1',
  MEALS: 'meal_tracker_meals_v1',
  WATER: 'meal_tracker_water_v1',
  WEIGHT: 'meal_tracker_weights_v1',
  REMINDERS: 'meal_tracker_reminders_v1',
};

const DEFAULT_PROFILES: UserProfile[] = [
  {
    id: 'p_1',
    name: 'Aarav Sharma',
    avatarColor: 'bg-emerald-600',
    calorieTarget: 2800,
    proteinTarget: 110,
    waterTargetMl: 3500,
    currentWeightKg: 64.5,
    targetWeightKg: 70.0,
    weightGoalType: 'gain',
    monthlyGainTargetKg: 1.5,
    isVegetarian: true,
  },
  {
    id: 'p_2',
    name: 'Priya Patel',
    avatarColor: 'bg-indigo-600',
    calorieTarget: 2200,
    proteinTarget: 85,
    waterTargetMl: 2800,
    currentWeightKg: 52.0,
    targetWeightKg: 56.0,
    weightGoalType: 'gain',
    monthlyGainTargetKg: 1.0,
    isVegetarian: true,
  },
];

function generateSeedMeals(): MealEntry[] {
  const today = getTodayDateString();
  const d = new Date(today);

  // Today - 1 (August 14)
  const dMinus1 = new Date(d);
  dMinus1.setDate(dMinus1.getDate() - 1);
  const dateYesterday = dMinus1.toISOString().split('T')[0];

  // Today - 2 (August 13)
  const dMinus2 = new Date(d);
  dMinus2.setDate(dMinus2.getDate() - 2);
  const date2DaysAgo = dMinus2.toISOString().split('T')[0];

  return [
    // Today for Aarav (matches the prompt example)
    {
      id: 'm_today_1',
      profileId: 'p_1',
      date: today,
      time: '08:15',
      category: 'Breakfast',
      items: [
        {
          foodId: 'f_roti',
          foodName: 'Whole Wheat Roti (2 pcs)',
          quantity: 80,
          unit: 'g',
          calories: 220,
          protein: 7.0,
          carbs: 44.0,
          fat: 1.6,
          fiber: 6.0,
        },
        {
          foodId: 'f_paneer_sabzi',
          foodName: 'Paneer Sabzi',
          quantity: 150,
          unit: 'g',
          calories: 230,
          protein: 11.0,
          carbs: 8.0,
          fat: 17.0,
          fiber: 2.0,
        },
      ],
      createdAt: Date.now() - 100000,
    },
    {
      id: 'm_today_2',
      profileId: 'p_1',
      date: today,
      time: '11:30',
      category: 'Snack',
      items: [
        {
          foodId: 'f_banana',
          foodName: 'Fresh Banana (Medium)',
          quantity: 120,
          unit: 'g',
          calories: 110,
          protein: 1.4,
          carbs: 28.0,
          fat: 0.3,
          fiber: 3.2,
        },
        {
          foodId: 'f_whole_milk',
          foodName: 'Whole Milk (Full Cream)',
          quantity: 250,
          unit: 'ml',
          calories: 170,
          protein: 8.5,
          carbs: 12.5,
          fat: 9.5,
          fiber: 0,
        },
      ],
      createdAt: Date.now() - 80000,
    },
    {
      id: 'm_today_3',
      profileId: 'p_1',
      date: today,
      time: '14:15',
      category: 'Lunch',
      items: [
        {
          foodId: 'f_rice_cooked',
          foodName: 'White Basmati Rice',
          quantity: 200,
          unit: 'g',
          calories: 260,
          protein: 5.5,
          carbs: 58.0,
          fat: 0.6,
          fiber: 1.0,
        },
        {
          foodId: 'f_dal_tadka',
          foodName: 'Yellow Dal Tadka',
          quantity: 150,
          unit: 'g',
          calories: 165,
          protein: 8.5,
          carbs: 24.0,
          fat: 4.5,
          fiber: 4.2,
        },
        {
          foodId: 'f_mixed_vegetable',
          foodName: 'Mixed Veg Sabzi',
          quantity: 150,
          unit: 'g',
          calories: 125,
          protein: 3.5,
          carbs: 16.0,
          fat: 5.5,
          fiber: 4.0,
        },
        {
          foodId: 'f_ghee',
          foodName: 'Pure Desi Ghee',
          quantity: 8,
          unit: 'g',
          calories: 70,
          protein: 0,
          carbs: 0,
          fat: 8.0,
          fiber: 0,
        },
      ],
      createdAt: Date.now() - 60000,
    },
    {
      id: 'm_today_4',
      profileId: 'p_1',
      date: today,
      time: '17:30',
      category: 'Juice',
      items: [
        {
          foodId: 'f_fruit_smoothie',
          foodName: 'Fruit Smoothie (Mango & Yogurt)',
          quantity: 350,
          unit: 'ml',
          calories: 350,
          protein: 9.0,
          carbs: 58.0,
          fat: 8.0,
          fiber: 4.5,
        },
      ],
      createdAt: Date.now() - 40000,
    },
    {
      id: 'm_today_5',
      profileId: 'p_1',
      date: today,
      time: '20:30',
      category: 'Dinner',
      items: [
        {
          foodId: 'f_roti',
          foodName: 'Whole Wheat Roti (3 pcs)',
          quantity: 120,
          unit: 'g',
          calories: 330,
          protein: 10.5,
          carbs: 66.0,
          fat: 2.4,
          fiber: 9.0,
        },
        {
          foodId: 'f_paneer_sabzi',
          foodName: 'Paneer Sabzi',
          quantity: 140,
          unit: 'g',
          calories: 220,
          protein: 11.5,
          carbs: 8.0,
          fat: 16.0,
          fiber: 2.0,
        },
      ],
      createdAt: Date.now() - 20000,
    },

    // Yesterday (August 14) for Aarav
    {
      id: 'm_yest_1',
      profileId: 'p_1',
      date: dateYesterday,
      time: '08:00',
      category: 'Breakfast',
      items: [
        {
          foodId: 'f_paneer_paratha',
          foodName: 'Paneer Paratha (2 pcs)',
          quantity: 240,
          unit: 'g',
          calories: 580,
          protein: 23.0,
          carbs: 64.0,
          fat: 27.0,
          fiber: 6.4,
        },
      ],
      createdAt: Date.now() - 200000,
    },
    {
      id: 'm_yest_2',
      profileId: 'p_1',
      date: dateYesterday,
      time: '11:00',
      category: 'Fruit',
      items: [
        {
          foodId: 'f_banana_pb_shake',
          foodName: 'Banana Peanut Butter Shake',
          quantity: 350,
          unit: 'ml',
          calories: 480,
          protein: 18.5,
          carbs: 62.0,
          fat: 19.0,
          fiber: 5.5,
        },
      ],
      createdAt: Date.now() - 180000,
    },
    {
      id: 'm_yest_3',
      profileId: 'p_1',
      date: dateYesterday,
      time: '14:00',
      category: 'Lunch',
      items: [
        {
          foodId: 'f_rajma_curry',
          foodName: 'Rajma Masala + Rice',
          quantity: 350,
          unit: 'g',
          calories: 550,
          protein: 17.5,
          carbs: 92.0,
          fat: 9.0,
          fiber: 9.5,
        },
      ],
      createdAt: Date.now() - 160000,
    },
    {
      id: 'm_yest_4',
      profileId: 'p_1',
      date: dateYesterday,
      time: '16:45',
      category: 'Snack',
      items: [
        {
          foodId: 'f_roasted_chana',
          foodName: 'Roasted Chana + Chai',
          quantity: 150,
          unit: 'g',
          calories: 270,
          protein: 11.5,
          carbs: 41.0,
          fat: 6.3,
          fiber: 6.0,
        },
      ],
      createdAt: Date.now() - 140000,
    },
    {
      id: 'm_yest_5',
      profileId: 'p_1',
      date: dateYesterday,
      time: '19:15',
      category: 'Fruit',
      items: [
        {
          foodId: 'f_papaya',
          foodName: 'Fresh Papaya & Apple',
          quantity: 200,
          unit: 'g',
          calories: 110,
          protein: 1.0,
          carbs: 26.0,
          fat: 0.5,
          fiber: 4.5,
        },
      ],
      createdAt: Date.now() - 120000,
    },
    {
      id: 'm_yest_6',
      profileId: 'p_1',
      date: dateYesterday,
      time: '21:30',
      category: 'Dinner',
      items: [
        {
          foodId: 'f_soya_curry',
          foodName: 'Soya Chunks Curry + Rotis',
          quantity: 300,
          unit: 'g',
          calories: 540,
          protein: 34.5,
          carbs: 60.0,
          fat: 7.4,
          fiber: 14.0,
        },
      ],
      createdAt: Date.now() - 100000,
    },

    // 2 Days Ago (August 13) for Aarav
    {
      id: 'm_2d_1',
      profileId: 'p_1',
      date: date2DaysAgo,
      time: '08:45',
      category: 'Breakfast',
      items: [
        {
          foodId: 'f_oats_porridge',
          foodName: 'Oats Porridge with Milk & Honey',
          quantity: 250,
          unit: 'g',
          calories: 350,
          protein: 13.0,
          carbs: 58.0,
          fat: 8.0,
          fiber: 6.0,
        },
      ],
      createdAt: Date.now() - 300000,
    },
    {
      id: 'm_2d_2',
      profileId: 'p_1',
      date: date2DaysAgo,
      time: '12:30',
      category: 'Lunch',
      items: [
        {
          foodId: 'f_chana_masala',
          foodName: 'Chole with Rice & Salad',
          quantity: 350,
          unit: 'g',
          calories: 630,
          protein: 16.5,
          carbs: 98.0,
          fat: 11.0,
          fiber: 8.5,
        },
      ],
      createdAt: Date.now() - 280000,
    },
    {
      id: 'm_2d_3',
      profileId: 'p_1',
      date: date2DaysAgo,
      time: '16:15',
      category: 'Snack',
      items: [
        {
          foodId: 'f_almonds_walnuts',
          foodName: 'Mixed Dry Fruits & Coconut Water',
          quantity: 80,
          unit: 'g',
          calories: 233,
          protein: 7.2,
          carbs: 14.8,
          fat: 17.0,
          fiber: 5.4,
        },
      ],
      createdAt: Date.now() - 260000,
    },
    {
      id: 'm_2d_4',
      profileId: 'p_1',
      date: date2DaysAgo,
      time: '20:15',
      category: 'Dinner',
      items: [
        {
          foodId: 'f_paneer_sabzi',
          foodName: 'Palak Paneer with 3 Rotis',
          quantity: 270,
          unit: 'g',
          calories: 570,
          protein: 23.5,
          carbs: 74.0,
          fat: 19.9,
          fiber: 12.8,
        },
      ],
      createdAt: Date.now() - 240000,
    },

    // Priya Patel (Starts her first meal at 10:15 AM - demonstrating individual actual schedules)
    {
      id: 'm_priya_1',
      profileId: 'p_2',
      date: today,
      time: '10:15',
      category: 'Breakfast',
      items: [
        {
          foodId: 'f_oats_porridge',
          foodName: 'Rolled Oats with Berries & Almonds',
          quantity: 250,
          unit: 'g',
          calories: 340,
          protein: 13.0,
          carbs: 54.0,
          fat: 8.5,
          fiber: 6.0,
        },
      ],
      createdAt: Date.now() - 50000,
    },
    {
      id: 'm_priya_2',
      profileId: 'p_2',
      date: today,
      time: '13:45',
      category: 'Lunch',
      items: [
        {
          foodId: 'f_palak_paneer',
          foodName: 'Palak Paneer with 2 Rotis',
          quantity: 230,
          unit: 'g',
          calories: 460,
          protein: 20.0,
          carbs: 52.0,
          fat: 19.1,
          fiber: 9.8,
        },
      ],
      createdAt: Date.now() - 30000,
    },
    {
      id: 'm_priya_3',
      profileId: 'p_2',
      date: today,
      time: '17:15',
      category: 'Fruit',
      items: [
        {
          foodId: 'f_sweet_lassi',
          foodName: 'Sweet Punjabi Lassi & Papaya',
          quantity: 350,
          unit: 'ml',
          calories: 305,
          protein: 8.2,
          carbs: 52.0,
          fat: 8.4,
          fiber: 2.5,
        },
      ],
      createdAt: Date.now() - 20000,
    },
    {
      id: 'm_priya_4',
      profileId: 'p_2',
      date: today,
      time: '20:45',
      category: 'Dinner',
      items: [
        {
          foodId: 'f_dal_makhani',
          foodName: 'Dal Makhani & Brown Rice',
          quantity: 300,
          unit: 'g',
          calories: 450,
          protein: 14.5,
          carbs: 64.0,
          fat: 15.5,
          fiber: 8.8,
        },
      ],
      createdAt: Date.now() - 10000,
    },
  ];
}

const DEFAULT_REMINDERS: ReminderItem[] = [
  {
    id: 'rem_1',
    profileId: 'p_1',
    title: 'Morning Breakfast & Timing Log',
    time: '08:15',
    days: [0, 1, 2, 3, 4, 5, 6],
    isEnabled: true,
  },
  {
    id: 'rem_2',
    profileId: 'p_1',
    title: 'Mid-Morning Weight-Gain Shake',
    time: '11:30',
    days: [1, 2, 3, 4, 5, 6],
    isEnabled: true,
  },
  {
    id: 'rem_3',
    profileId: 'p_1',
    title: 'Drink Water (500ml)',
    time: '13:00',
    days: [0, 1, 2, 3, 4, 5, 6],
    isEnabled: true,
  },
  {
    id: 'rem_4',
    profileId: 'p_1',
    title: 'Evening Snack / Smoothie',
    time: '17:30',
    days: [0, 1, 2, 3, 4, 5, 6],
    isEnabled: true,
  },
  {
    id: 'rem_5',
    profileId: 'p_2',
    title: 'Late Morning First Meal',
    time: '10:15',
    days: [0, 1, 2, 3, 4, 5, 6],
    isEnabled: true,
  },
];

const DEFAULT_WEIGHTS: WeightEntry[] = [
  {
    id: 'w_1',
    profileId: 'p_1',
    date: '2026-08-01',
    weightKg: 63.2,
    notes: 'Monthly starting weigh-in',
  },
  {
    id: 'w_2',
    profileId: 'p_1',
    date: '2026-08-08',
    weightKg: 63.9,
    notes: 'Week 1 gain on track',
  },
  {
    id: 'w_3',
    profileId: 'p_1',
    date: '2026-08-15',
    weightKg: 64.5,
    notes: 'Mid-month check-in',
  },
  {
    id: 'w_4',
    profileId: 'p_2',
    date: '2026-08-01',
    weightKg: 51.2,
  },
  {
    id: 'w_5',
    profileId: 'p_2',
    date: '2026-08-15',
    weightKg: 52.0,
  },
];

const DEFAULT_WATER: WaterLog[] = [
  {
    id: 'wat_1',
    profileId: 'p_1',
    date: getTodayDateString(),
    time: '08:30',
    amountMl: 500,
  },
  {
    id: 'wat_2',
    profileId: 'p_1',
    date: getTodayDateString(),
    time: '11:45',
    amountMl: 500,
  },
  {
    id: 'wat_3',
    profileId: 'p_1',
    date: getTodayDateString(),
    time: '14:30',
    amountMl: 500,
  },
  {
    id: 'wat_4',
    profileId: 'p_1',
    date: getTodayDateString(),
    time: '17:00',
    amountMl: 250,
  },
];

export function loadProfiles(): UserProfile[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.PROFILES);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.PROFILES, JSON.stringify(DEFAULT_PROFILES));
      return DEFAULT_PROFILES;
    }
    return JSON.parse(raw);
  } catch (e) {
    console.error('Failed to load profiles:', e);
    return DEFAULT_PROFILES;
  }
}

export function saveProfiles(profiles: UserProfile[]): void {
  localStorage.setItem(STORAGE_KEYS.PROFILES, JSON.stringify(profiles));
}

export function loadActiveProfileId(): string {
  try {
    const active = localStorage.getItem(STORAGE_KEYS.ACTIVE_PROFILE_ID);
    if (active) return active;
    const profiles = loadProfiles();
    const fallback = profiles[0]?.id || 'p_1';
    localStorage.setItem(STORAGE_KEYS.ACTIVE_PROFILE_ID, fallback);
    return fallback;
  } catch {
    return 'p_1';
  }
}

export function saveActiveProfileId(id: string): void {
  localStorage.setItem(STORAGE_KEYS.ACTIVE_PROFILE_ID, id);
}

export function loadMeals(): MealEntry[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.MEALS);
    if (!raw) {
      const seed = generateSeedMeals();
      localStorage.setItem(STORAGE_KEYS.MEALS, JSON.stringify(seed));
      return seed;
    }
    return JSON.parse(raw);
  } catch (e) {
    console.error('Failed to load meals:', e);
    return [];
  }
}

export function saveMeals(meals: MealEntry[]): void {
  localStorage.setItem(STORAGE_KEYS.MEALS, JSON.stringify(meals));
}

export function loadWater(): WaterLog[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.WATER);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.WATER, JSON.stringify(DEFAULT_WATER));
      return DEFAULT_WATER;
    }
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

export function saveWater(water: WaterLog[]): void {
  localStorage.setItem(STORAGE_KEYS.WATER, JSON.stringify(water));
}

export function loadWeights(): WeightEntry[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.WEIGHT);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.WEIGHT, JSON.stringify(DEFAULT_WEIGHTS));
      return DEFAULT_WEIGHTS;
    }
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

export function saveWeights(weights: WeightEntry[]): void {
  localStorage.setItem(STORAGE_KEYS.WEIGHT, JSON.stringify(weights));
}

export function loadReminders(): ReminderItem[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.REMINDERS);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.REMINDERS, JSON.stringify(DEFAULT_REMINDERS));
      return DEFAULT_REMINDERS;
    }
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

export function saveReminders(reminders: ReminderItem[]): void {
  localStorage.setItem(STORAGE_KEYS.REMINDERS, JSON.stringify(reminders));
}
