import React, { useState } from 'react';
import { UserProfile } from '../types';
import {
  X,
  Users,
  Plus,
  Check,
  Leaf,
  Target,
  Sparkles,
} from 'lucide-react';

interface ProfileManagerModalProps {
  isOpen: boolean;
  onClose: () => void;
  profiles: UserProfile[];
  activeProfileId: string;
  onSelectProfile: (id: string) => void;
  onSaveProfiles: (profiles: UserProfile[]) => void;
}

const AVATAR_COLORS = [
  'bg-emerald-600',
  'bg-indigo-600',
  'bg-amber-600',
  'bg-rose-600',
  'bg-cyan-600',
  'bg-purple-600',
];

export const ProfileManagerModal: React.FC<ProfileManagerModalProps> = ({
  isOpen,
  onClose,
  profiles,
  activeProfileId,
  onSelectProfile,
  onSaveProfiles,
}) => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [newName, setNewName] = useState('');
  const [newCalTarget, setNewCalTarget] = useState('2600');
  const [newProteinTarget, setNewProteinTarget] = useState('100');
  const [newWaterTarget, setNewWaterTarget] = useState('3000');
  const [newCurrentWeight, setNewCurrentWeight] = useState('60');
  const [newTargetWeight, setNewTargetWeight] = useState('65');
  const [newGainMonthly, setNewGainMonthly] = useState('1.5');
  const [newIsVeg, setNewIsVeg] = useState(true);
  const [selectedColor, setSelectedColor] = useState('bg-emerald-600');

  if (!isOpen) return null;

  const handleCreateProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) return;

    const newProfile: UserProfile = {
      id: `p_${Date.now()}`,
      name: newName.trim(),
      avatarColor: selectedColor,
      calorieTarget: parseInt(newCalTarget, 10) || 2500,
      proteinTarget: parseInt(newProteinTarget, 10) || 100,
      waterTargetMl: parseInt(newWaterTarget, 10) || 3000,
      currentWeightKg: parseFloat(newCurrentWeight) || 60,
      targetWeightKg: parseFloat(newTargetWeight) || 65,
      weightGoalType: 'gain',
      monthlyGainTargetKg: parseFloat(newGainMonthly) || 1.5,
      isVegetarian: newIsVeg,
    };

    const updated = [...profiles, newProfile];
    onSaveProfiles(updated);
    onSelectProfile(newProfile.id);
    setShowAddForm(false);
    setNewName('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm overflow-y-auto">
      <div
        id="profile-manager-modal"
        className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl my-8 flex flex-col max-h-[90vh]"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-800 bg-slate-900 sticky top-0 z-10">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-400">
              Multi-Person Management
            </span>
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Users className="w-5 h-5 text-emerald-400" />
              Profiles & Individual Trackers
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
          <div className="flex items-center justify-between">
            <p className="text-xs text-slate-400">
              Each profile retains completely independent meal timing records, intervals, water logs, and goals.
            </p>
            <button
              onClick={() => setShowAddForm(!showAddForm)}
              className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold px-3 py-1.5 rounded-xl text-xs flex items-center gap-1.5 shadow-sm transition-all shrink-0"
            >
              <Plus className="w-4 h-4 stroke-[3]" />
              {showAddForm ? 'Cancel' : 'New Person'}
            </button>
          </div>

          {/* New Profile Form */}
          {showAddForm && (
            <form
              onSubmit={handleCreateProfile}
              className="bg-slate-800/80 border border-slate-700 rounded-2xl p-4 space-y-4 animate-fadeIn"
            >
              <div className="font-bold text-sm text-white flex items-center gap-2">
                <Plus className="w-4 h-4 text-emerald-400" />
                Add Person Profile
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Person Name:
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Rahul Sharma, Ananya Verma"
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 text-white rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Daily Calorie Target (kcal):
                  </label>
                  <input
                    type="number"
                    value={newCalTarget}
                    onChange={(e) => setNewCalTarget(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 text-white rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Daily Protein Target (g):
                  </label>
                  <input
                    type="number"
                    value={newProteinTarget}
                    onChange={(e) => setNewProteinTarget(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 text-white rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Current Weight (kg):
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    value={newCurrentWeight}
                    onChange={(e) => setNewCurrentWeight(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 text-white rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Target Weight (kg):
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    value={newTargetWeight}
                    onChange={(e) => setNewTargetWeight(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 text-white rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              {/* Vegetarian switch & avatar color */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2">
                <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-slate-300">
                  <input
                    type="checkbox"
                    checked={newIsVeg}
                    onChange={(e) => setNewIsVeg(e.target.checked)}
                    className="w-4 h-4 rounded text-emerald-500 accent-emerald-500"
                  />
                  <Leaf className="w-4 h-4 text-emerald-400" />
                  Vegetarian Diet Preference
                </label>

                <div className="flex items-center gap-1.5">
                  <span className="text-xs text-slate-400">Color:</span>
                  {AVATAR_COLORS.map((col) => (
                    <button
                      key={col}
                      type="button"
                      onClick={() => setSelectedColor(col)}
                      className={`w-6 h-6 rounded-lg ${col} transition-all ${
                        selectedColor === col
                          ? 'ring-2 ring-white scale-110'
                          : 'opacity-70 hover:opacity-100'
                      }`}
                    />
                  ))}
                </div>
              </div>

              <div className="flex justify-end pt-2">
                <button
                  type="submit"
                  className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold px-4 py-2 rounded-xl text-xs flex items-center gap-1.5 shadow-md"
                >
                  <Check className="w-4 h-4 stroke-[3]" />
                  Save Person Profile
                </button>
              </div>
            </form>
          )}

          {/* Profile Cards */}
          <div className="space-y-3">
            {profiles.map((p) => {
              const isActive = p.id === activeProfileId;

              return (
                <div
                  key={p.id}
                  onClick={() => {
                    onSelectProfile(p.id);
                    onClose();
                  }}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                    isActive
                      ? 'bg-slate-800/90 border-emerald-500/50 shadow-md ring-1 ring-emerald-500/30'
                      : 'bg-slate-800/40 border-slate-800 hover:border-slate-700 hover:bg-slate-800/70'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-10 h-10 rounded-xl ${p.avatarColor} text-white flex items-center justify-center font-bold text-base shadow-md uppercase`}
                    >
                      {p.name.charAt(0)}
                    </div>

                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="text-sm font-bold text-white">
                          {p.name}
                        </h4>
                        {p.isVegetarian && (
                          <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                            Vegetarian
                          </span>
                        )}
                        {isActive && (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500 text-slate-950">
                            Active
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-3 text-xs text-slate-400 mt-1 font-mono">
                        <span>{p.calorieTarget} kcal target</span>
                        <span>•</span>
                        <span>{p.proteinTarget}g protein</span>
                        <span>•</span>
                        <span>
                          {p.currentWeightKg} kg → {p.targetWeightKg} kg
                        </span>
                      </div>
                    </div>
                  </div>

                  <div>
                    {isActive ? (
                      <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                        <Check className="w-5 h-5 stroke-[2.5]" />
                      </div>
                    ) : (
                      <button
                        type="button"
                        className="text-xs font-semibold px-3 py-1.5 bg-slate-700 hover:bg-emerald-500 hover:text-slate-950 text-slate-300 rounded-xl transition-all"
                      >
                        Switch
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
