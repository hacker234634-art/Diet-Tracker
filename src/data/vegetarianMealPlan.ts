import { MealCategory } from '../types';

export interface WeightGainMealIdea {
  id: string;
  name: string;
  category: MealCategory;
  recommendedTime: string; // e.g. "08:15"
  description: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber: number;
  items: {
    name: string;
    quantity: string;
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
    fiber: number;
  }[];
  tips: string;
}

export const VEGETARIAN_WEIGHT_GAIN_PLAN: WeightGainMealIdea[] = [
  {
    id: 'vg_1',
    name: 'High-Protein Paneer Paratha Breakfast',
    category: 'Breakfast',
    recommendedTime: '08:15',
    description: '2 whole-wheat paneer parathas cooked in pure ghee served with creamy curd',
    calories: 680,
    protein: 28.5,
    carbs: 71.0,
    fat: 32.0,
    fiber: 6.4,
    items: [
      { name: 'Paneer Stuffed Paratha (with Ghee)', quantity: '2 pieces (240g)', calories: 580, protein: 23.0, carbs: 64.0, fat: 27.0, fiber: 6.4 },
      { name: 'Plain Curd / Dahi', quantity: '150g (1 katori)', calories: 98, protein: 5.5, carbs: 7.0, fat: 5.0, fiber: 0 },
    ],
    tips: 'Paneer provides casein & whey protein. Ghee adds healthy essential fats for lean mass gain.',
  },
  {
    id: 'vg_2',
    name: 'Mid-Morning Banana & Nut Butter Power Shake',
    category: 'Snack',
    recommendedTime: '11:30',
    description: 'High calorie mass gainer shake with bananas, full cream milk, peanut butter & honey',
    calories: 480,
    protein: 18.5,
    carbs: 62.0,
    fat: 19.0,
    fiber: 5.5,
    items: [
      { name: 'Banana Peanut Butter Weight-Gain Shake', quantity: '1 glass (350ml)', calories: 480, protein: 18.5, carbs: 62.0, fat: 19.0, fiber: 5.5 },
    ],
    tips: 'Liquid calories are easy to consume between major meals without feeling overly bloated.',
  },
  {
    id: 'vg_3',
    name: 'Hearty Rajma / Dal Makhani + Basmati Rice & Ghee',
    category: 'Lunch',
    recommendedTime: '14:15',
    description: 'Nutrient-rich lunch with slow-digesting carbs, complex plant proteins and fresh salad',
    calories: 740,
    protein: 26.0,
    carbs: 112.0,
    fat: 20.0,
    fiber: 14.5,
    items: [
      { name: 'White Basmati Rice (Cooked)', quantity: '250g (1.5 cups)', calories: 325, protein: 6.8, carbs: 72.5, fat: 0.8, fiber: 1.3 },
      { name: 'Rajma Masala (Kidney Beans)', quantity: '200g (1 large bowl)', calories: 245, protein: 12.2, carbs: 37.5, fat: 5.2, fiber: 8.2 },
      { name: 'Pure Desi Ghee', quantity: '1 tbsp (14g)', calories: 125, protein: 0, carbs: 0, fat: 14.0, fiber: 0 },
      { name: 'Moong Sprouts Chaat / Salad', quantity: '50g', calories: 45, protein: 3.0, carbs: 7.5, fat: 0.5, fiber: 1.8 },
    ],
    tips: 'Combining grains (rice) and legumes (rajma) yields a complete amino acid profile.',
  },
  {
    id: 'vg_4',
    name: 'Evening High-Energy Dry Fruit Milk & Roasted Chana',
    category: 'Snack',
    recommendedTime: '17:30',
    description: 'Dry fruits milkshake paired with crunchy roasted chickpeas',
    calories: 565,
    protein: 20.5,
    carbs: 74.0,
    fat: 21.2,
    fiber: 9.5,
    items: [
      { name: 'Badam Kaju Dry Fruit Milkshake', quantity: '1 glass (300ml)', calories: 380, protein: 11.0, carbs: 45.0, fat: 18.0, fiber: 3.5 },
      { name: 'Roasted Chana (Chickpeas)', quantity: '50g', calories: 185, protein: 9.5, carbs: 29.0, fat: 3.2, fiber: 6.0 },
    ],
    tips: 'Ideal pre-workout or late afternoon calorie booster rich in zinc, magnesium, and healthy calories.',
  },
  {
    id: 'vg_5',
    name: 'Soya Chunks / Paneer Curry + Rotis & Dal',
    category: 'Dinner',
    recommendedTime: '20:30',
    description: 'Substantial high protein vegetarian dinner for overnight muscle recovery',
    calories: 660,
    protein: 34.5,
    carbs: 86.0,
    fat: 19.5,
    fiber: 14.2,
    items: [
      { name: 'Whole Wheat Roti / Chapati', quantity: '3 pieces (120g)', calories: 330, protein: 10.5, carbs: 66.0, fat: 2.4, fiber: 9.0 },
      { name: 'Soya Chunks Curry', quantity: '150g', calories: 210, protein: 24.0, carbs: 16.0, fat: 5.0, fiber: 5.0 },
      { name: 'Yellow Dal Tadka', quantity: '100g', calories: 110, protein: 5.7, carbs: 16.0, fat: 3.0, fiber: 2.8 },
    ],
    tips: 'Soya chunks contain over 50% protein by weight, providing maximum recovery support.',
  },
];
