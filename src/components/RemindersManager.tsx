import React, { useState } from 'react';
import { ReminderItem, UserProfile } from '../types';
import { formatTime12h, getCurrentTime24h } from '../utils/timeUtils';
import {
  Bell,
  Plus,
  Trash2,
  Clock,
  Check,
  AlertCircle,
  Volume2,
  X,
} from 'lucide-react';

interface RemindersManagerProps {
  isOpen?: boolean;
  onClose?: () => void;
  activeProfile: UserProfile;
  reminders: ReminderItem[];
  onSaveReminders: (reminders: ReminderItem[]) => void;
}

const DAY_LABELS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export const RemindersManager: React.FC<RemindersManagerProps> = ({
  isOpen = true,
  onClose,
  activeProfile,
  reminders,
  onSaveReminders,
}) => {
  const [newTitle, setNewTitle] = useState('');
  const [newTime, setNewTime] = useState('12:00');
  const [selectedDays, setSelectedDays] = useState<number[]>([1, 2, 3, 4, 5, 6, 0]);
  const [feedback, setFeedback] = useState<string | null>(null);

  const profileReminders = reminders.filter(
    (r) => r.profileId === activeProfile.id
  );

  const handleToggleDay = (dayIndex: number) => {
    if (selectedDays.includes(dayIndex)) {
      setSelectedDays(selectedDays.filter((d) => d !== dayIndex));
    } else {
      setSelectedDays([...selectedDays, dayIndex].sort());
    }
  };

  const handleAddReminder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const newReminder: ReminderItem = {
      id: `rem_${Date.now()}`,
      profileId: activeProfile.id,
      title: newTitle.trim(),
      time: newTime,
      days: selectedDays.length > 0 ? selectedDays : [0, 1, 2, 3, 4, 5, 6],
      isEnabled: true,
    };

    onSaveReminders([...reminders, newReminder]);
    setNewTitle('');
    setFeedback('Reminder created successfully!');
    setTimeout(() => setFeedback(null), 3000);
  };

  const handleToggleReminder = (id: string) => {
    const updated = reminders.map((r) =>
      r.id === id ? { ...r,指示: '', isEnabled: !r.isEnabled } : r
    );
    onSaveReminders(updated);
  };

  const handleDeleteReminder = (id: string) => {
    onSaveReminders(reminders.filter((r) => r.id !== id));
  };

  const handleTestChime = () => {
    try {
      const audioCtx = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(587.33, audioCtx.currentTime); // D5
      osc.frequency.setValueAtTime(880, audioCtx.currentTime + 0.15); // A5
      gain.gain.setValueAtTime(0.2, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.5);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.5);
    } catch {
      // Audio context fallback
    }
    setFeedback('Audio chime played!');
    setTimeout(() => setFeedback(null), 2500);
  };

  const content = (
    <div id="reminders-manager-container" className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-slate-800">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">
            Personal Custom Alerts
          </span>
          <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
            <Bell className="w-5 h-5 text-emerald-400" />
            Meal & Hydration Reminders
          </h2>
          <p className="text-xs text-slate-400">
            Configure custom prompts for {activeProfile.name}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleTestChime}
            className="text-xs text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 border border-slate-700 px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-colors"
          >
            <Volume2 className="w-4 h-4 text-emerald-400" />
            Test Chime
          </button>
          {onClose && (
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>

      {feedback && (
        <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-xs px-3 py-2 rounded-xl flex items-center gap-2 animate-fadeIn">
          <Check className="w-4 h-4 text-emerald-400" />
          {feedback}
        </div>
      )}

      {/* Add New Reminder Card */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg">
        <h3 className="text-sm font-bold text-white mb-3 flex items-center gap-2">
          <Plus className="w-4 h-4 text-emerald-400" />
          Create New Personal Reminder
        </h3>

        <form onSubmit={handleAddReminder} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Reminder Name:
              </label>
              <input
                id="input-reminder-title"
                type="text"
                required
                placeholder='e.g. "Meal reminder", "Drink water", "Snack reminder"'
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 text-white rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-emerald-500 placeholder-slate-500"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-semibold text-slate-300 flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-emerald-400" />
                  Time:
                </label>
                <button
                  type="button"
                  onClick={() => setNewTime(getCurrentTime24h())}
                  className="text-[10px] text-emerald-400 hover:text-emerald-300"
                >
                  Use current time
                </button>
              </div>
              <input
                id="input-reminder-time"
                type="time"
                required
                value={newTime}
                onChange={(e) => setNewTime(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 text-white rounded-xl px-3 py-2 text-xs font-bold font-mono focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          {/* Repeat Days Selection */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Repeat Days:
            </label>
            <div className="flex items-center gap-1.5 flex-wrap">
              {DAY_LABELS.map((day, idx) => {
                const isSelected = selectedDays.includes(idx);
                return (
                  <button
                    key={day}
                    type="button"
                    onClick={() => handleToggleDay(idx)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                      isSelected
                        ? 'bg-emerald-500 text-slate-950 shadow-sm'
                        : 'bg-slate-800 text-slate-400 hover:text-white border border-slate-700'
                    }`}
                  >
                    {day}
                  </button>
                );
              })}
              <button
                type="button"
                onClick={() => setSelectedDays([0, 1, 2, 3, 4, 5, 6])}
                className="text-[11px] text-emerald-400 hover:underline px-2 py-1"
              >
                All Days
              </button>
            </div>
          </div>

          {/* Quick presets */}
          <div className="flex items-center gap-2 pt-1 overflow-x-auto text-[11px] text-slate-400">
            <span>Quick presets:</span>
            {['Meal reminder', 'Drink water', 'Snack reminder', 'Evening smoothie'].map(
              (preset) => (
                <button
                  key={preset}
                  type="button"
                  onClick={() => setNewTitle(preset)}
                  className="bg-slate-800 hover:bg-slate-700 hover:text-white px-2 py-0.5 rounded-md border border-slate-700 transition-colors whitespace-nowrap"
                >
                  +{preset}
                </button>
              )
            )}
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              id="btn-save-reminder"
              className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold px-4 py-2 rounded-xl text-xs flex items-center gap-1.5 shadow-md shadow-emerald-500/20 transition-all active:scale-95"
            >
              <Plus className="w-4 h-4 stroke-[3]" />
              Save Reminder
            </button>
          </div>
        </form>
      </div>

      {/* Active Reminders List */}
      <div className="space-y-3">
        <h3 className="text-sm font-bold text-white flex items-center gap-2">
          <Bell className="w-4 h-4 text-emerald-400" />
          Configured Reminders for {activeProfile.name} ({profileReminders.length})
        </h3>

        {profileReminders.length === 0 ? (
          <div className="bg-slate-900 border border-dashed border-slate-800 rounded-2xl p-6 text-center text-xs text-slate-500">
            No reminders configured yet. Add your preferred meal and water reminders above.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {profileReminders.map((rem) => (
              <div
                key={rem.id}
                className={`bg-slate-900 border rounded-2xl p-4 transition-all flex items-center justify-between gap-3 ${
                  rem.isEnabled
                    ? 'border-slate-800 shadow-md'
                    : 'border-slate-800/40 opacity-60'
                }`}
              >
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => handleToggleReminder(rem.id)}
                    className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all ${
                      rem.isEnabled
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                        : 'bg-slate-800 text-slate-500 border border-slate-700'
                    }`}
                  >
                    <Bell className="w-4 h-4" />
                  </button>

                  <div>
                    <h4 className="text-sm font-bold text-white flex items-center gap-2">
                      {rem.title}
                    </h4>
                    <div className="flex items-center gap-2 text-xs text-slate-400 mt-0.5">
                      <span className="font-mono text-emerald-400 font-bold">
                        {formatTime12h(rem.time)}
                      </span>
                      <span>•</span>
                      <span>
                        {rem.days.length === 7
                          ? 'Daily'
                          : rem.days.map((d) => DAY_LABELS[d]).join(', ')}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => handleDeleteReminder(rem.id)}
                    className="p-2 text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 rounded-xl transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Disclaimer Notice */}
      <div
        id="reminders-disclaimer"
        className="bg-slate-900/60 border border-slate-800 rounded-2xl p-4 text-xs text-slate-400 flex items-start gap-2.5"
      >
        <AlertCircle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
        <span className="text-[11px] leading-relaxed">
          <strong className="text-slate-300 font-semibold">Important:</strong> The application does not automatically prescribe meal times or force a strict schedule. Reminders are personal alerts chosen and configured completely by you.
        </span>
      </div>
    </div>
  );

  if (onClose) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm overflow-y-auto">
        <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl my-8 p-6">
          {content}
        </div>
      </div>
    );
  }

  return content;
};
