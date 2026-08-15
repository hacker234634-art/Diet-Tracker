import { MealEntry, UserProfile, WaterLog, WeightEntry } from '../types';

export function downloadJsonFile(filename: string, data: object) {
  const jsonStr = JSON.stringify(data, null, 2);
  const blob = new Blob([jsonStr], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export function downloadCsvFile(filename: string, csvContent: string) {
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export function exportMealsToCsv(meals: MealEntry[], profileName: string) {
  const headers = [
    'Date',
    'Time',
    'Category',
    'Food Items',
    'Total Calories (kcal)',
    'Total Protein (g)',
    'Total Carbs (g)',
    'Total Fat (g)',
    'Notes',
  ];

  const rows = meals.map((m) => {
    const foodNames = m.items.map((it) => `${it.foodName} (${it.quantity}${it.unit})`).join('; ');
    const cal = m.items.reduce((s, it) => s + it.calories, 0);
    const prot = Math.round(m.items.reduce((s, it) => s + it.protein, 0) * 10) / 10;
    const carbs = Math.round(m.items.reduce((s, it) => s + (it.carbs || 0), 0) * 10) / 10;
    const fat = Math.round(m.items.reduce((s, it) => s + (it.fat || 0), 0) * 10) / 10;

    return [
      `"${m.date}"`,
      `"${m.time}"`,
      `"${m.category}"`,
      `"${foodNames.replace(/"/g, '""')}"`,
      cal,
      prot,
      carbs,
      fat,
      `"${(m.notes || '').replace(/"/g, '""')}"`,
    ].join(',');
  });

  const csv = [headers.join(','), ...rows].join('\n');
  const safeProfile = profileName.toLowerCase().replace(/[^a-z0-9]/g, '_');
  downloadCsvFile(`meal_timing_logs_${safeProfile}_${new Date().toISOString().split('T')[0]}.csv`, csv);
}

export function exportFullBackupJson(
  profiles: UserProfile[],
  meals: MealEntry[],
  water: WaterLog[],
  weights: WeightEntry[]
) {
  const backup = {
    exportDate: new Date().toISOString(),
    version: '1.0',
    profiles,
    meals,
    water,
    weights,
  };
  const today = new Date().toISOString().split('T')[0];
  downloadJsonFile(`mealtiming_data_backup_${today}.json`, backup);
}
