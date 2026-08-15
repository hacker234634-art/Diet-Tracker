import React, { useState } from 'react';
import {
  Users,
  Calendar,
  ChevronLeft,
  ChevronRight,
  Clock,
  Plus,
  Bell,
  BarChart3,
  Utensils,
  Scale,
  Download,
  FileSpreadsheet,
  FileJson,
  Smartphone,
  Share2,
} from 'lucide-react';
import { UserProfile, MealEntry, WaterLog, WeightEntry } from '../types';
import { exportMealsToCsv, exportFullBackupJson } from '../utils/exportUtils';

interface NavbarProps {
  profiles: UserProfile[];
  activeProfile: UserProfile;
  onSelectProfile: (id: string) => void;
  onOpenProfileManager: () => void;
  selectedDate: string;
  onSelectDate: (date: string) => void;
  onOpenAddMeal: () => void;
  onOpenReminders: () => void;
  onOpenWeeklyAnalysis: () => void;
  onOpenMealPlan: () => void;
  onOpenWeightTracker: () => void;
  onOpenInstallShare: () => void;
  activeView: 'timeline' | 'weekly' | 'mealplan' | 'reminders';
  setActiveView: (view: 'timeline' | 'weekly' | 'mealplan' | 'reminders') => void;
  meals: MealEntry[];
  waterLogs: WaterLog[];
  weightEntries: WeightEntry[];
}

export const Navbar: React.FC<NavbarProps> = ({
  profiles,
  activeProfile,
  onSelectProfile,
  onOpenProfileManager,
  selectedDate,
  onSelectDate,
  onOpenAddMeal,
  onOpenReminders,
  onOpenWeeklyAnalysis,
  onOpenMealPlan,
  onOpenWeightTracker,
  onOpenInstallShare,
  activeView,
  setActiveView,
  meals,
  waterLogs,
  weightEntries,
}) => {
  const [showExportMenu, setShowExportMenu] = useState(false);

  const handlePrevDay = () => {
    const d = new Date(selectedDate);
    d.setDate(d.getDate() - 1);
    onSelectDate(d.toISOString().split('T')[0]);
  };

  const handleNextDay = () => {
    const d = new Date(selectedDate);
    d.setDate(d.getDate() + 1);
    onSelectDate(d.toISOString().split('T')[0]);
  };

  const handleSetToday = () => {
    const today = new Date().toISOString().split('T')[0];
    onSelectDate(today);
  };

  const handleDownloadCsv = () => {
    const profileMeals = meals.filter((m) => m.profileId === activeProfile.id);
    exportMealsToCsv(profileMeals, activeProfile.name);
    setShowExportMenu(false);
  };

  const handleDownloadJson = () => {
    exportFullBackupJson(profiles, meals, waterLogs, weightEntries);
    setShowExportMenu(false);
  };

  const isToday = selectedDate === new Date().toISOString().split('T')[0];

  const dateObj = new Date(selectedDate);
  const formattedDateTitle = dateObj.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  return (
    <header className="bg-slate-900 border-b border-slate-800 sticky top-0 z-30 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between py-3 gap-3">
          {/* Logo & Brand */}
          <div className="flex items-center justify-between w-full md:w-auto">
            <div
              id="brand-logo"
              className="flex items-center space-x-3 cursor-pointer"
              onClick={() => setActiveView('timeline')}
            >
              <div className="w-10 h-10 rounded-xl bg-emerald-500 flex items-center justify-center text-slate-950 font-bold shadow-lg shadow-emerald-500/20">
                <Clock className="w-6 h-6 text-slate-950 stroke-[2.5]" />
              </div>
              <div>
                <h1 className="text-lg font-bold tracking-tight text-white flex items-center gap-2">
                  MealTiming
                  <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    Interval Tracker
                  </span>
                </h1>
                <p className="text-xs text-slate-400">
                  Chronological gaps & actual eating patterns
                </p>
              </div>
            </div>

            {/* Mobile Actions: Install & Add Meal */}
            <div className="flex items-center gap-1.5 md:hidden">
              <button
                id="btn-mobile-install-share"
                onClick={onOpenInstallShare}
                title="Install / Share App"
                className="bg-slate-800 hover:bg-slate-700 text-emerald-400 border border-slate-700 font-semibold px-2.5 py-1.5 rounded-lg text-xs flex items-center gap-1 shadow-sm transition-all"
              >
                <Smartphone className="w-3.5 h-3.5" />
                <span>Install</span>
              </button>
              <button
                id="btn-mobile-add-meal"
                onClick={onOpenAddMeal}
                className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-semibold px-3 py-1.5 rounded-lg text-xs flex items-center gap-1.5 shadow-sm transition-all"
              >
                <Plus className="w-4 h-4" />
                Add Meal
              </button>
            </div>
          </div>

          {/* Date Navigator */}
          <div className="flex items-center bg-slate-800/80 border border-slate-700/80 rounded-xl px-2 py-1 gap-1 shadow-inner">
            <button
              id="btn-prev-day"
              onClick={handlePrevDay}
              title="Previous Day"
              className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-700 rounded-lg transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-2 px-2">
              <Calendar className="w-4 h-4 text-emerald-400" />
              <input
                id="input-date-picker"
                type="date"
                value={selectedDate}
                onChange={(e) => e.target.value && onSelectDate(e.target.value)}
                className="bg-transparent text-sm font-medium text-slate-200 focus:outline-none cursor-pointer"
              />
              <span className="hidden sm:inline text-xs text-slate-400 font-mono">
                ({formattedDateTitle})
              </span>
            </div>

            <button
              id="btn-next-day"
              onClick={handleNextDay}
              title="Next Day"
              className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-700 rounded-lg transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </button>

            {!isToday && (
              <button
                id="btn-today"
                onClick={handleSetToday}
                className="ml-1 text-xs font-semibold px-2 py-1 bg-emerald-500/20 text-emerald-300 hover:bg-emerald-500/30 rounded-md transition-colors border border-emerald-500/30"
              >
                Today
              </button>
            )}
          </div>

          {/* Profiles & Actions */}
          <div className="flex items-center gap-2">
            {/* Profile Dropdown */}
            <div className="relative flex items-center bg-slate-800 border border-slate-700 rounded-xl p-1">
              <div
                className={`w-7 h-7 rounded-lg ${activeProfile.avatarColor} text-white flex items-center justify-center font-bold text-xs uppercase shadow-sm`}
              >
                {activeProfile.name.charAt(0)}
              </div>
              <select
                id="select-profile"
                value={activeProfile.id}
                onChange={(e) => onSelectProfile(e.target.value)}
                aria-label="Select User Profile"
                className="bg-transparent text-xs font-medium text-slate-200 pl-2 pr-1 py-1 focus:outline-none cursor-pointer"
              >
                {profiles.map((p) => (
                  <option key={p.id} value={p.id} className="bg-slate-800 text-white">
                    {p.name} {p.isVegetarian ? '(Veg)' : ''}
                  </option>
                ))}
              </select>
              <button
                id="btn-manage-profiles"
                onClick={onOpenProfileManager}
                title="Manage & Add Profiles"
                className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-700 rounded-lg transition-colors"
              >
                <Users className="w-4 h-4" />
              </button>
            </div>

            {/* Install / Share App Button */}
            <button
              id="btn-install-share-app"
              onClick={onOpenInstallShare}
              title="Install on Phone/PC or Share Link with Friends"
              className="flex items-center gap-1.5 bg-gradient-to-r from-emerald-500/20 to-emerald-600/20 hover:from-emerald-500/30 hover:to-emerald-600/30 text-emerald-300 border border-emerald-500/40 font-semibold px-3 py-2 rounded-xl text-xs transition-all shadow-sm"
            >
              <Smartphone className="w-4 h-4 text-emerald-400" />
              <span>Install & Share App</span>
            </button>

            {/* Export / Download Data Button */}
            <div className="relative">
              <button
                id="btn-export-data"
                onClick={() => setShowExportMenu(!showExportMenu)}
                title="Download data file (CSV/JSON)"
                className="flex items-center gap-1 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-semibold px-2.5 py-2 rounded-xl text-xs transition-colors"
              >
                <Download className="w-4 h-4 text-emerald-400" />
                <span className="hidden sm:inline">Export</span>
              </button>

              {showExportMenu && (
                <div className="absolute right-0 mt-2 w-56 bg-slate-900 border border-slate-700 rounded-xl shadow-2xl py-2 z-50 animate-fadeIn">
                  <div className="px-3 py-1.5 text-[10px] uppercase font-bold text-slate-400 border-b border-slate-800">
                    Download Data Files
                  </div>
                  <button
                    onClick={handleDownloadCsv}
                    className="w-full px-3 py-2 text-left text-xs text-slate-200 hover:bg-slate-800 flex items-center gap-2.5 transition-colors"
                  >
                    <FileSpreadsheet className="w-4 h-4 text-emerald-400 shrink-0" />
                    <div>
                      <div className="font-semibold">Export Meals (CSV)</div>
                      <div className="text-[10px] text-slate-400">Spreadsheet of all meal logs & macros</div>
                    </div>
                  </button>
                  <button
                    onClick={handleDownloadJson}
                    className="w-full px-3 py-2 text-left text-xs text-slate-200 hover:bg-slate-800 flex items-center gap-2.5 transition-colors"
                  >
                    <FileJson className="w-4 h-4 text-amber-400 shrink-0" />
                    <div>
                      <div className="font-semibold">Full Backup (JSON)</div>
                      <div className="text-[10px] text-slate-400">All profiles, meals, water & weights</div>
                    </div>
                  </button>
                </div>
              )}
            </div>

            {/* Add Meal Desktop Button */}
            <button
              id="btn-add-meal-nav"
              onClick={onOpenAddMeal}
              className="hidden md:flex items-center gap-1.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold px-3.5 py-2 rounded-xl text-xs shadow-md shadow-emerald-500/20 transition-all active:scale-95"
            >
              <Plus className="w-4 h-4 stroke-[3]" />
              Log Meal
            </button>
          </div>
        </div>

        {/* Navigation Tabs Bar */}
        <div className="flex items-center justify-between border-t border-slate-800/80 pt-2 pb-2 overflow-x-auto scrollbar-none">
          <div className="flex items-center gap-1 text-xs">
            <button
              id="tab-daily-timeline"
              onClick={() => setActiveView('timeline')}
              className={`px-3 py-1.5 rounded-lg font-medium transition-all flex items-center gap-1.5 ${
                activeView === 'timeline'
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
              }`}
            >
              <Clock className="w-3.5 h-3.5" />
              Daily Timeline & Gaps
            </button>

            <button
              id="tab-weekly-analysis"
              onClick={() => {
                setActiveView('weekly');
                onOpenWeeklyAnalysis();
              }}
              className={`px-3 py-1.5 rounded-lg font-medium transition-all flex items-center gap-1.5 ${
                activeView === 'weekly'
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
              }`}
            >
              <BarChart3 className="w-3.5 h-3.5" />
              Weekly Analysis
            </button>

            <button
              id="tab-vegetarian-plan"
              onClick={() => {
                setActiveView('mealplan');
                onOpenMealPlan();
              }}
              className={`px-3 py-1.5 rounded-lg font-medium transition-all flex items-center gap-1.5 ${
                activeView === 'mealplan'
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
              }`}
            >
              <Utensils className="w-3.5 h-3.5 text-amber-400" />
              Veg Weight-Gain Plan
            </button>

            <button
              id="tab-reminders"
              onClick={() => {
                setActiveView('reminders');
                onOpenReminders();
              }}
              className={`px-3 py-1.5 rounded-lg font-medium transition-all flex items-center gap-1.5 ${
                activeView === 'reminders'
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
              }`}
            >
              <Bell className="w-3.5 h-3.5 text-sky-400" />
              Reminders
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              id="btn-weight-tracker-shortcut"
              onClick={onOpenWeightTracker}
              className="text-xs text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 border border-slate-700 px-2.5 py-1.5 rounded-lg flex items-center gap-1.5 transition-colors whitespace-nowrap"
            >
              <Scale className="w-3.5 h-3.5 text-emerald-400" />
              <span>
                {activeProfile.currentWeightKg} kg → {activeProfile.targetWeightKg} kg
              </span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
