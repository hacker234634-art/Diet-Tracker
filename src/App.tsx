import React, { useState, useEffect, useMemo } from 'react';
import {
  UserProfile,
  MealEntry,
  WaterLog,
  WeightEntry,
  ReminderItem,
  ProcessedMealEntry,
} from './types';
import {
  loadProfiles,
  saveProfiles,
  loadActiveProfileId,
  saveActiveProfileId,
  loadMeals,
  saveMeals,
  loadWater,
  saveWater,
  loadWeights,
  saveWeights,
  loadReminders,
  saveReminders,
} from './utils/storage';
import {
  getTodayDateString,
  processDayMeals,
  calculateDaySummary,
  getCurrentTime24h,
} from './utils/timeUtils';
import { Navbar } from './components/Navbar';
import { MealSummaryCard } from './components/MealSummaryCard';
import { DailyTimeline } from './components/DailyTimeline';
import { NutritionDashboard } from './components/NutritionDashboard';
import { AddMealModal } from './components/AddMealModal';
import { EditMealModal } from './components/EditMealModal';
import { WeeklyAnalysis } from './components/WeeklyAnalysis';
import { VegetarianMealPlanModal } from './components/VegetarianMealPlanModal';
import { RemindersManager } from './components/RemindersManager';
import { WeightTrackerModal } from './components/WeightTrackerModal';
import { ProfileManagerModal } from './components/ProfileManagerModal';
import { MealHistoryDays } from './components/MealHistoryDays';
import { InstallShareModal } from './components/InstallShareModal';
import confetti from 'canvas-confetti';

export default function App() {
  // Persistence state
  const [profiles, setProfiles] = useState<UserProfile[]>(() => loadProfiles());
  const [activeProfileId, setActiveProfileId] = useState<string>(() => loadActiveProfileId());
  const [meals, setMeals] = useState<MealEntry[]>(() => loadMeals());
  const [waterLogs, setWaterLogs] = useState<WaterLog[]>(() => loadWater());
  const [weightEntries, setWeightEntries] = useState<WeightEntry[]>(() => loadWeights());
  const [reminders, setReminders] = useState<ReminderItem[]>(() => loadReminders());

  // Navigation & View state
  const [selectedDate, setSelectedDate] = useState<string>(getTodayDateString());
  const [activeView, setActiveView] = useState<'timeline' | 'weekly' | 'mealplan' | 'reminders'>('timeline');

  // Modal states
  const [isAddMealOpen, setIsAddMealOpen] = useState(false);
  const [editingMeal, setEditingMeal] = useState<ProcessedMealEntry | null>(null);
  const [isMealPlanOpen, setIsMealPlanOpen] = useState(false);
  const [isWeightTrackerOpen, setIsWeightTrackerOpen] = useState(false);
  const [isProfileManagerOpen, setIsProfileManagerOpen] = useState(false);
  const [isRemindersModalOpen, setIsRemindersModalOpen] = useState(false);
  const [isInstallShareOpen, setIsInstallShareOpen] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);

  // PWA beforeinstallprompt event capture
  useEffect(() => {
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  // Sync active profile
  const activeProfile = useMemo(() => {
    return (
      profiles.find((p) => p.id === activeProfileId) ||
      profiles[0] || {
        id: 'p_1',
        name: 'Default User',
        avatarColor: 'bg-emerald-600',
        calorieTarget: 2500,
        proteinTarget: 100,
        waterTargetMl: 3000,
        currentWeightKg: 60,
        targetWeightKg: 65,
        weightGoalType: 'gain',
        monthlyGainTargetKg: 1.5,
        isVegetarian: true,
      }
    );
  }, [profiles, activeProfileId]);

  // Sync to localStorage
  useEffect(() => {
    saveProfiles(profiles);
  }, [profiles]);

  useEffect(() => {
    saveActiveProfileId(activeProfileId);
  }, [activeProfileId]);

  useEffect(() => {
    saveMeals(meals);
  }, [meals]);

  useEffect(() => {
    saveWater(waterLogs);
  }, [waterLogs]);

  useEffect(() => {
    saveWeights(weightEntries);
  }, [weightEntries]);

  useEffect(() => {
    saveReminders(reminders);
  }, [reminders]);

  // Profile-specific and Date-specific calculations
  const currentProfileMeals = useMemo(() => {
    return meals.filter((m) => m.profileId === activeProfileId);
  }, [meals, activeProfileId]);

  const selectedDateMeals = useMemo(() => {
    return currentProfileMeals.filter((m) => m.date === selectedDate);
  }, [currentProfileMeals, selectedDate]);

  // Chronological processing: 1. First meal, 2. Second meal, gap calculations
  const processedMeals = useMemo(() => {
    return processDayMeals(selectedDateMeals);
  }, [selectedDateMeals]);

  // Daily Meal Timing Summary (Eating window, Average gap, etc.)
  const daySummary = useMemo(() => {
    return calculateDaySummary(selectedDate, selectedDateMeals);
  }, [selectedDate, selectedDateMeals]);

  const selectedDateWater = useMemo(() => {
    return waterLogs.filter(
      (w) => w.profileId === activeProfileId && w.date === selectedDate
    );
  }, [waterLogs, activeProfileId, selectedDate]);

  // Meal Handlers
  const handleSaveNewMeal = (newMealData: Omit<MealEntry, 'id' | 'createdAt'>) => {
    const newEntry: MealEntry = {
      ...newMealData,
      id: `meal_${Date.now()}`,
      createdAt: Date.now(),
    };

    setMeals((prev) => [...prev, newEntry]);

    // Celebrate milestone if 5th meal logged
    if (selectedDateMeals.length === 4) {
      try {
        confetti({
          particleCount: 50,
          spread: 60,
          origin: { y: 0.8 },
        });
      } catch {
        // Confetti fallback
      }
    }
  };

  const handleUpdateMeal = (updated: ProcessedMealEntry) => {
    setMeals((prev) =>
      prev.map((m) =>
        m.id === updated.id
          ? {
              ...m,
              category: updated.category,
              date: updated.date,
              time: updated.time,
              items: updated.items,
              notes: updated.notes,
            }
          : m
      )
    );
  };

  const handleDeleteMeal = (mealId: string) => {
    setMeals((prev) => prev.filter((m) => m.id !== mealId));
  };

  // Water Log Handler
  const handleAddWater = (amountMl: number) => {
    const newWater: WaterLog = {
      id: `wat_${Date.now()}`,
      profileId: activeProfileId,
      date: selectedDate,
      time: getCurrentTime24h(),
      amountMl,
    };
    setWaterLogs((prev) => [...prev, newWater]);
  };

  // Weight Entry Handlers
  const handleSaveWeightEntry = (entry: WeightEntry) => {
    setWeightEntries((prev) => [...prev, entry]);
  };

  const handleDeleteWeightEntry = (id: string) => {
    setWeightEntries((prev) => prev.filter((w) => w.id !== id));
  };

  const handleUpdateProfileTargets = (updatedProfile: UserProfile) => {
    setProfiles((prev) =>
      prev.map((p) => (p.id === updatedProfile.id ? updatedProfile : p))
    );
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-emerald-500 selection:text-slate-950 flex flex-col">
      {/* Top Navigation Bar */}
      <Navbar
        profiles={profiles}
        activeProfile={activeProfile}
        onSelectProfile={(id) => setActiveProfileId(id)}
        onOpenProfileManager={() => setIsProfileManagerOpen(true)}
        selectedDate={selectedDate}
        onSelectDate={(d) => setSelectedDate(d)}
        onOpenAddMeal={() => setIsAddMealOpen(true)}
        onOpenReminders={() => setIsRemindersModalOpen(true)}
        onOpenWeeklyAnalysis={() => setActiveView('weekly')}
        onOpenMealPlan={() => setIsMealPlanOpen(true)}
        onOpenWeightTracker={() => setIsWeightTrackerOpen(true)}
        onOpenInstallShare={() => setIsInstallShareOpen(true)}
        activeView={activeView}
        setActiveView={setActiveView}
        meals={meals}
        waterLogs={waterLogs}
        weightEntries={weightEntries}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {activeView === 'timeline' && (
          <div className="space-y-6">
            {/* Top Row: Daily Timing Summary Card */}
            <MealSummaryCard summary={daySummary} />

            {/* Middle Grid: Primary Timeline & Nutrition Sidebar */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              {/* Left 7 Cols: Chronological Daily Meal Timeline with exact gap calculations */}
              <div className="lg:col-span-7 space-y-6">
                <DailyTimeline
                  date={selectedDate}
                  processedMeals={processedMeals}
                  onOpenAddMeal={() => setIsAddMealOpen(true)}
                  onEditMeal={(meal) => setEditingMeal(meal)}
                  onDeleteMeal={handleDeleteMeal}
                />

                {/* Meal History / Past Days Quick Selector */}
                <MealHistoryDays
                  meals={meals}
                  activeProfileId={activeProfileId}
                  selectedDate={selectedDate}
                  onSelectDate={(d) => setSelectedDate(d)}
                />
              </div>

              {/* Right 5 Cols: Integrated Nutrition, Water, and Weight Tracker */}
              <div className="lg:col-span-5 space-y-6">
                <NutritionDashboard
                  activeProfile={activeProfile}
                  summary={daySummary}
                  waterLogs={selectedDateWater}
                  weightEntries={weightEntries}
                  onAddWater={handleAddWater}
                  onOpenWeightTracker={() => setIsWeightTrackerOpen(true)}
                  onOpenMealPlan={() => setIsMealPlanOpen(true)}
                />
              </div>
            </div>
          </div>
        )}

        {activeView === 'weekly' && (
          <WeeklyAnalysis
            profileMeals={currentProfileMeals}
            currentDate={selectedDate}
            activeProfile={activeProfile}
            onSelectDate={(d) => {
              setSelectedDate(d);
              setActiveView('timeline');
            }}
          />
        )}

        {activeView === 'mealplan' && (
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">
                  Meal Reference Guide
                </span>
                <h2 className="text-xl font-bold text-white">
                  Vegetarian Weight-Gain Meal Plan & Timings
                </h2>
                <p className="text-xs text-slate-400">
                  Calorie-dense vegetarian meals structured with balanced intervals for {activeProfile.name}
                </p>
              </div>
              <button
                onClick={() => setActiveView('timeline')}
                className="text-xs font-semibold px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl border border-slate-700 transition-colors"
              >
                Back to Timeline
              </button>
            </div>

            <div className="pt-4">
              <VegetarianMealPlanModal
                isOpen={true}
                onClose={() => setActiveView('timeline')}
                selectedDate={selectedDate}
                activeProfile={activeProfile}
                onLogMealIdea={(meal) => {
                  handleSaveNewMeal(meal);
                  setActiveView('timeline');
                }}
              />
            </div>
          </div>
        )}

        {activeView === 'reminders' && (
          <RemindersManager
            isOpen={true}
            activeProfile={activeProfile}
            reminders={reminders}
            onSaveReminders={(updated) => setReminders(updated)}
          />
        )}
      </main>

      {/* Modals */}
      <AddMealModal
        isOpen={isAddMealOpen}
        onClose={() => setIsAddMealOpen(false)}
        selectedDate={selectedDate}
        activeProfileId={activeProfileId}
        onSaveMeal={handleSaveNewMeal}
      />

      <EditMealModal
        meal={editingMeal}
        onClose={() => setEditingMeal(null)}
        onUpdateMeal={handleUpdateMeal}
        onDeleteMeal={handleDeleteMeal}
      />

      <VegetarianMealPlanModal
        isOpen={isMealPlanOpen}
        onClose={() => setIsMealPlanOpen(false)}
        selectedDate={selectedDate}
        activeProfile={activeProfile}
        onLogMealIdea={(meal) => {
          handleSaveNewMeal(meal);
          setIsMealPlanOpen(false);
        }}
      />

      <WeightTrackerModal
        isOpen={isWeightTrackerOpen}
        onClose={() => setIsWeightTrackerOpen(false)}
        activeProfile={activeProfile}
        weightEntries={weightEntries}
        onSaveWeightEntry={handleSaveWeightEntry}
        onDeleteWeightEntry={handleDeleteWeightEntry}
        onUpdateProfileTargets={handleUpdateProfileTargets}
      />

      <ProfileManagerModal
        isOpen={isProfileManagerOpen}
        onClose={() => setIsProfileManagerOpen(false)}
        profiles={profiles}
        activeProfileId={activeProfileId}
        onSelectProfile={(id) => setActiveProfileId(id)}
        onSaveProfiles={(updated) => setProfiles(updated)}
      />

      {isRemindersModalOpen && (
        <RemindersManager
          isOpen={true}
          onClose={() => setIsRemindersModalOpen(false)}
          activeProfile={activeProfile}
          reminders={reminders}
          onSaveReminders={(updated) => setReminders(updated)}
        />
      )}

      {/* Install & Share Modal */}
      <InstallShareModal
        isOpen={isInstallShareOpen}
        onClose={() => setIsInstallShareOpen(false)}
        deferredPrompt={deferredPrompt}
        onInstalled={() => {
          setDeferredPrompt(null);
          setIsInstallShareOpen(false);
        }}
      />

      {/* Subtle Footer */}
      <footer className="border-t border-slate-900 bg-slate-950 py-4 text-center text-xs text-slate-400">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>Meal Timing & Interval Tracker • Recorded Personal Eating Patterns</span>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsInstallShareOpen(true)}
              className="text-[11px] text-emerald-400 hover:underline flex items-center gap-1 font-semibold"
            >
              📲 Install on Phone / Share App
            </button>
            <span className="text-slate-600">•</span>
            <span className="text-[11px] text-slate-500">
              Timings & intervals computed from user recorded timestamps
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}
