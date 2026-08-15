import { MealEntry, ProcessedMealEntry, DayMealSummary } from '../types';

/**
 * Converts 24-hour time "HH:mm" to 12-hour formatted time "h:mm A"
 * e.g. "08:15" -> "8:15 AM", "14:05" -> "2:05 PM", "00:30" -> "12:30 AM"
 */
export function formatTime12h(time24: string): string {
  if (!time24) return '';
  const [hStr, mStr] = time24.split(':');
  let h = parseInt(hStr, 10);
  const m = parseInt(mStr || '0', 10);
  if (isNaN(h)) return time24;
  const ampm = h >= 12 ? 'PM' : 'AM';
  h = h % 12;
  if (h === 0) h = 12;
  const mFormatted = m < 10 ? `0${m}` : `${m}`;
  return `${h}:${mFormatted} ${ampm}`;
}

/**
 * Converts standard Date or current time to "HH:mm" string (24h)
 */
export function getCurrentTime24h(): string {
  const now = new Date();
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
  return `${hours}:${minutes}`;
}

/**
 * Returns today's date formatted as YYYY-MM-DD
 */
export function getTodayDateString(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * Converts "HH:mm" to total minutes from midnight
 */
export function timeToMinutes(time24: string): number {
  if (!time24) return 0;
  const [hStr, mStr] = time24.split(':');
  const h = parseInt(hStr, 10) || 0;
  const m = parseInt(mStr, 10) || 0;
  return h * 60 + m;
}

/**
 * Converts total minutes from midnight to "HH:mm"
 */
export function minutesToTime24(minutes: number): string {
  const clamped = Math.max(0, Math.min(1439, Math.round(minutes)));
  const h = Math.floor(clamped / 60);
  const m = clamped % 60;
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
}

/**
 * Formats duration in minutes into clean readable string
 * e.g. 195 mins -> "3 hours 15 minutes" (full) or "3h 15m" (short)
 */
export function formatDuration(minutes: number, short = false): string {
  if (minutes <= 0) return short ? '0m' : '0 minutes';
  const h = Math.floor(minutes / 60);
  const m = Math.round(minutes % 60);

  if (short) {
    if (h > 0 && m > 0) return `${h}h ${m}m`;
    if (h > 0) return `${h}h`;
    return `${m}m`;
  }

  const parts: string[] = [];
  if (h > 0) {
    parts.push(`${h} ${h === 1 ? 'hour' : 'hours'}`);
  }
  if (m > 0 || h === 0) {
    parts.push(`${m} ${m === 1 ? 'minute' : 'minutes'}`);
  }
  return parts.join(' ');
}

/**
 * Returns ordinal string for meal numbers (1 -> "First meal", 2 -> "Second meal", etc.)
 */
export const ORDINAL_WORDS = [
  'First',
  'Second',
  'Third',
  'Fourth',
  'Fifth',
  'Sixth',
  'Seventh',
  'Eighth',
  'Ninth',
  'Tenth',
  'Eleventh',
  'Twelfth',
];

export function getOrdinalMealLabel(index: number): string {
  if (index >= 1 && index <= ORDINAL_WORDS.length) {
    return `${ORDINAL_WORDS[index - 1]} meal`;
  }
  return `Meal #${index}`;
}

/**
 * Processes and sorts an array of MealEntry for a single day chronologically.
 * Calculates exact meal numbering and consecutive gaps.
 */
export function processDayMeals(meals: MealEntry[]): ProcessedMealEntry[] {
  // Sort by time ascending
  const sorted = [...meals].sort((a, b) => {
    return timeToMinutes(a.time) - timeToMinutes(b.time);
  });

  return sorted.map((meal, idx) => {
    const prevMeal = idx > 0 ? sorted[idx - 1] : null;
    let gapMinutes: number | undefined = undefined;
    let gapFormatted: string | undefined = undefined;

    if (prevMeal) {
      const currentMin = timeToMinutes(meal.time);
      const prevMin = timeToMinutes(prevMeal.time);
      gapMinutes = Math.max(0, currentMin - prevMin);
      gapFormatted = formatDuration(gapMinutes);
    }

    return {
      ...meal,
      chronologicalIndex: idx + 1,
      ordinalLabel: getOrdinalMealLabel(idx + 1),
      gapFromPreviousMinutes: gapMinutes,
      gapFormatted,
    };
  });
}

/**
 * Computes daily summary for a given day's meals
 */
export function calculateDaySummary(date: string, meals: MealEntry[]): DayMealSummary {
  const processed = processDayMeals(meals);
  const totalMeals = processed.length;

  let totalCalories = 0;
  let totalProtein = 0;
  let totalCarbs = 0;
  let totalFat = 0;
  let totalFiber = 0;

  for (const m of processed) {
    for (const item of m.items) {
      totalCalories += item.calories || 0;
      totalProtein += item.protein || 0;
      totalCarbs += item.carbs || 0;
      totalFat += item.fat || 0;
      totalFiber += item.fiber || 0;
    }
  }

  if (totalMeals === 0) {
    return {
      date,
      totalMeals: 0,
      eatingWindowMinutes: 0,
      eatingWindowFormatted: '0 minutes',
      averageGapMinutes: 0,
      averageGapFormatted: 'None',
      totalCalories: 0,
      totalProtein: 0,
      totalCarbs: 0,
      totalFat: 0,
      totalFiber: 0,
    };
  }

  const firstMeal = processed[0];
  const lastMeal = processed[processed.length - 1];

  const firstMin = timeToMinutes(firstMeal.time);
  const lastMin = timeToMinutes(lastMeal.time);
  const eatingWindowMinutes = Math.max(0, lastMin - firstMin);
  const eatingWindowFormatted = formatDuration(eatingWindowMinutes);

  // Average gap between consecutive meals
  let averageGapMinutes = 0;
  let averageGapFormatted = 'None';

  if (totalMeals > 1) {
    let sumGaps = 0;
    let gapCount = 0;
    for (let i = 1; i < processed.length; i++) {
      if (processed[i].gapFromPreviousMinutes !== undefined) {
        sumGaps += processed[i].gapFromPreviousMinutes!;
        gapCount++;
      }
    }
    if (gapCount > 0) {
      averageGapMinutes = Math.round(sumGaps / gapCount);
      averageGapFormatted = formatDuration(averageGapMinutes);
    }
  }

  return {
    date,
    totalMeals,
    firstMealTime: formatTime12h(firstMeal.time),
    lastMealTime: formatTime12h(lastMeal.time),
    eatingWindowMinutes,
    eatingWindowFormatted,
    averageGapMinutes,
    averageGapFormatted,
    totalCalories: Math.round(totalCalories),
    totalProtein: Math.round(totalProtein * 10) / 10,
    totalCarbs: Math.round(totalCarbs * 10) / 10,
    totalFat: Math.round(totalFat * 10) / 10,
    totalFiber: Math.round(totalFiber * 10) / 10,
  };
}

/**
 * Calculates weekly statistics from past 7 days of meal records
 */
export function calculateWeeklyStats(
  profileMeals: MealEntry[],
  currentDateStr: string
) {
  // Generate last 7 days keys
  const days: string[] = [];
  const baseDate = new Date(currentDateStr);

  for (let i = 6; i >= 0; i--) {
    const d = new Date(baseDate);
    d.setDate(d.getDate() - i);
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const dd = String(d.getDate()).padStart(2, '0');
    days.push(`${yyyy}-${mm}-${dd}`);
  }

  const daySummaries: (DayMealSummary & { dayName: string; shortDate: string; rawMeals: ProcessedMealEntry[] })[] = [];

  let sumFirstMealMin = 0;
  let firstMealDaysCount = 0;

  let sumLastMealMin = 0;
  let lastMealDaysCount = 0;

  let sumEatingEvents = 0;
  let totalGapsSum = 0;
  let totalGapsCount = 0;

  for (const day of days) {
    const dayDate = new Date(day);
    const dayName = dayDate.toLocaleDateString('en-US', { weekday: 'short' });
    const shortDate = dayDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

    const mealsForDay = profileMeals.filter((m) => m.date === day);
    const summary = calculateDaySummary(day, mealsForDay);
    const processed = processDayMeals(mealsForDay);

    daySummaries.push({
      ...summary,
      dayName,
      shortDate,
      rawMeals: processed,
    });

    if (processed.length > 0) {
      sumFirstMealMin += timeToMinutes(processed[0].time);
      firstMealDaysCount++;

      sumLastMealMin += timeToMinutes(processed[processed.length - 1].time);
      lastMealDaysCount++;

      sumEatingEvents += processed.length;

      for (let i = 1; i < processed.length; i++) {
        if (processed[i].gapFromPreviousMinutes !== undefined) {
          totalGapsSum += processed[i].gapFromPreviousMinutes!;
          totalGapsCount++;
        }
      }
    }
  }

  const activeDaysCount = firstMealDaysCount;
  const avgFirstMealTime =
    activeDaysCount > 0
      ? formatTime12h(minutesToTime24(sumFirstMealMin / activeDaysCount))
      : 'N/A';

  const avgLastMealTime =
    activeDaysCount > 0
      ? formatTime12h(minutesToTime24(sumLastMealMin / activeDaysCount))
      : 'N/A';

  const avgEatingEventsPerDay =
    activeDaysCount > 0 ? (sumEatingEvents / 7).toFixed(1) : '0';

  const avgGapBetweenMeals =
    totalGapsCount > 0
      ? formatDuration(Math.round(totalGapsSum / totalGapsCount))
      : 'N/A';

  return {
    days: daySummaries,
    avgFirstMealTime,
    avgLastMealTime,
    avgEatingEventsPerDay,
    avgGapBetweenMeals,
    activeDaysCount,
  };
}
