import React, { useState } from 'react';
import { WeightEntry, UserProfile } from '../types';
import { getTodayDateString } from '../utils/timeUtils';
import {
  X,
  Scale,
  Plus,
  TrendingUp,
  Target,
  Calendar,
  Trash2,
} from 'lucide-react';

interface WeightTrackerModalProps {
  isOpen: boolean;
  onClose: () => void;
  activeProfile: UserProfile;
  weightEntries: WeightEntry[];
  onSaveWeightEntry: (entry: WeightEntry) => void;
  onDeleteWeightEntry: (id: string) => void;
  onUpdateProfileTargets: (updatedProfile: UserProfile) => void;
}

export const WeightTrackerModal: React.FC<WeightTrackerModalProps> = ({
  isOpen,
  onClose,
  activeProfile,
  weightEntries,
  onSaveWeightEntry,
  onDeleteWeightEntry,
  onUpdateProfileTargets,
}) => {
  const [weightKg, setWeightKg] = useState<string>(
    String(activeProfile.currentWeightKg)
  );
  const [date, setDate] = useState<string>(getTodayDateString());
  const [notes, setNotes] = useState<string>('');

  const [editGoalMode, setEditGoalMode] = useState<boolean>(false);
  const [targetWeight, setTargetWeight] = useState<string>(
    String(activeProfile.targetWeightKg)
  );
  const [monthlyGain, setMonthlyGain] = useState<string>(
    String(activeProfile.monthlyGainTargetKg || 1.5)
  );

  if (!isOpen) return null;

  const profileWeights = weightEntries
    .filter((w) => w.profileId === activeProfile.id)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const latestWeight =
    profileWeights.length > 0
      ? profileWeights[0].weightKg
      : activeProfile.currentWeightKg;
  const initialWeight =
    profileWeights.length > 0
      ? profileWeights[profileWeights.length - 1].weightKg
      : activeProfile.currentWeightKg;
  const gainedSoFar =
    Math.round((latestWeight - initialWeight) * 10) / 10;
  const remainingToGoal =
    Math.max(0, Math.round((activeProfile.targetWeightKg - latestWeight) * 10) / 10);

  const handleAddWeighIn = (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = parseFloat(weightKg);
    if (isNaN(parsed) || parsed <= 0) return;

    const newEntry: WeightEntry = {
      id: `w_${Date.now()}`,
      profileId: activeProfile.id,
      date,
      weightKg: parsed,
      notes: notes.trim() ? notes.trim() : undefined,
    };

    onSaveWeightEntry(newEntry);
    onUpdateProfileTargets({
      ...activeProfile,
      currentWeightKg: parsed,
    });
    setNotes('');
  };

  const handleSaveGoal = () => {
    const parsedTarget = parseFloat(targetWeight);
    const parsedGain = parseFloat(monthlyGain);
    if (!isNaN(parsedTarget) && !isNaN(parsedGain)) {
      onUpdateProfileTargets({
        ...activeProfile,
        targetWeightKg: parsedTarget,
        monthlyGainTargetKg: parsedGain,
      });
      setEditGoalMode(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm overflow-y-auto">
      <div
        id="weight-tracker-modal"
        className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl my-8 flex flex-col max-h-[90vh]"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-800 bg-slate-900 sticky top-0 z-10">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-400">
              Progress & Milestone Tracker
            </span>
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Scale className="w-5 h-5 text-emerald-400" />
              Weight Tracking & Monthly Goal
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 space-y-5 overflow-y-auto">
          {/* Progress Overview Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="bg-slate-800/80 border border-slate-700/80 rounded-xl p-3 text-center">
              <div className="text-[10px] text-slate-400 uppercase font-semibold">
                Current Weight
              </div>
              <div className="text-xl font-bold text-white font-mono mt-1">
                {latestWeight} kg
              </div>
            </div>

            <div className="bg-slate-800/80 border border-slate-700/80 rounded-xl p-3 text-center">
              <div className="text-[10px] text-slate-400 uppercase font-semibold">
                Target Weight
              </div>
              <div className="text-xl font-bold text-emerald-400 font-mono mt-1">
                {activeProfile.targetWeightKg} kg
              </div>
            </div>

            <div className="bg-slate-800/80 border border-slate-700/80 rounded-xl p-3 text-center">
              <div className="text-[10px] text-slate-400 uppercase font-semibold">
                Total Gained
              </div>
              <div className="text-xl font-bold text-amber-400 font-mono mt-1">
                {gainedSoFar >= 0 ? `+${gainedSoFar}` : `${gainedSoFar}`} kg
              </div>
            </div>

            <div className="bg-slate-800/80 border border-slate-700/80 rounded-xl p-3 text-center">
              <div className="text-[10px] text-slate-400 uppercase font-semibold">
                Remaining
              </div>
              <div className="text-xl font-bold text-sky-400 font-mono mt-1">
                +{remainingToGoal} kg
              </div>
            </div>
          </div>

          {/* Monthly Weight-Gain Goal Setting */}
          <div className="bg-slate-800/40 border border-slate-800 rounded-2xl p-4">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Target className="w-4 h-4 text-emerald-400" />
                <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                  Monthly Weight-Gain Goal Setting
                </h4>
              </div>
              <button
                type="button"
                onClick={() => setEditGoalMode(!editGoalMode)}
                className="text-xs text-emerald-400 hover:underline"
              >
                {editGoalMode ? 'Cancel' : 'Edit Goal'}
              </button>
            </div>

            {editGoalMode ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <div>
                  <label className="block text-xs text-slate-400 mb-1">
                    Target Goal Weight (kg):
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    value={targetWeight}
                    onChange={(e) => setTargetWeight(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 text-white rounded-xl px-3 py-1.5 text-xs focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-xs text-slate-400 mb-1">
                    Monthly Gain Pace (kg/month):
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    value={monthlyGain}
                    onChange={(e) => setMonthlyGain(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 text-white rounded-xl px-3 py-1.5 text-xs focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <div className="sm:col-span-2 flex justify-end">
                  <button
                    type="button"
                    onClick={handleSaveGoal}
                    className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold px-4 py-1.5 rounded-xl text-xs"
                  >
                    Save Goal Settings
                  </button>
                </div>
              </div>
            ) : (
              <p className="text-xs text-slate-400">
                Paced at{' '}
                <strong className="text-emerald-300">
                  +{activeProfile.monthlyGainTargetKg || 1.5} kg/month
                </strong>{' '}
                for healthy lean mass gain alongside high-protein nutrition.
              </p>
            )}
          </div>

          {/* Log New Weigh-In Form */}
          <form
            onSubmit={handleAddWeighIn}
            className="bg-slate-800/80 border border-slate-700 rounded-2xl p-4 space-y-3"
          >
            <h4 className="text-xs font-bold text-white flex items-center gap-1.5">
              <Plus className="w-4 h-4 text-emerald-400" />
              Log New Weigh-In
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs text-slate-300 mb-1">
                  Weight (kg):
                </label>
                <input
                  type="number"
                  step="0.1"
                  required
                  value={weightKg}
                  onChange={(e) => setWeightKg(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 text-white rounded-xl px-3 py-2 text-xs font-bold font-mono focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs text-slate-300 mb-1 flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-slate-400" />
                  Date:
                </label>
                <input
                  type="date"
                  required
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 text-white rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs text-slate-300 mb-1">
                  Notes:
                </label>
                <input
                  type="text"
                  placeholder="e.g. Morning empty stomach"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 text-white rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-emerald-500 placeholder-slate-500"
                />
              </div>
            </div>

            <div className="flex justify-end pt-1">
              <button
                type="submit"
                className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold px-4 py-2 rounded-xl text-xs flex items-center gap-1.5 shadow-md"
              >
                <TrendingUp className="w-4 h-4 stroke-[3]" />
                Record Weight
              </button>
            </div>
          </form>

          {/* Weigh-in History List */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">
              Weigh-in History ({profileWeights.length})
            </h4>

            {profileWeights.length === 0 ? (
              <div className="text-xs text-slate-500 p-4 text-center border border-dashed border-slate-800 rounded-xl">
                No weigh-in entries logged yet.
              </div>
            ) : (
              <div className="divide-y divide-slate-800 border border-slate-800 rounded-2xl bg-slate-900/60 overflow-hidden">
                {profileWeights.map((entry) => (
                  <div
                    key={entry.id}
                    className="p-3 flex items-center justify-between gap-3 text-xs"
                  >
                    <div>
                      <span className="font-bold text-white font-mono text-sm">
                        {entry.weightKg} kg
                      </span>
                      <span className="text-slate-400 ml-2 font-mono">
                        {entry.date}
                      </span>
                      {entry.notes && (
                        <span className="text-slate-400 italic ml-2">
                          "{entry.notes}"
                        </span>
                      )}
                    </div>

                    <button
                      type="button"
                      onClick={() => onDeleteWeightEntry(entry.id)}
                      className="text-slate-500 hover:text-rose-400 p-1"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
