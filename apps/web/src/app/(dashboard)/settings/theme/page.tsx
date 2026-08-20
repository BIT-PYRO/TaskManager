'use client';

import { useTheme } from '@/providers/ThemeProvider';
import { Sun, Moon, Check } from 'lucide-react';

export default function ThemePage() {
  const { theme, setTheme } = useTheme();

  return (
    <div className="max-w-3xl space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-text-primary tracking-tight mb-2">Theme Preferences</h2>
        <p className="text-sm text-text-secondary">
          Choose your preferred interface appearance and contrast mode.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {[
          {
            value: 'light',
            label: 'Light Mode',
            description: 'Clean light interface with high contrast',
            icon: Sun,
            previewBg: 'bg-slate-50 border-slate-200',
            cardBg: 'bg-white border-slate-200',
            barBg: 'bg-slate-200',
          },
          {
            value: 'dark',
            label: 'Dark Mode',
            description: 'Sleek dark interface easy on the eyes',
            icon: Moon,
            previewBg: 'bg-zinc-950 border-zinc-800',
            cardBg: 'bg-zinc-900 border-zinc-800',
            barBg: 'bg-zinc-800',
          },
        ].map(({ value, label, description, icon: Icon, previewBg, cardBg, barBg }) => {
          const isSelected = theme === value;
          return (
            <button
              key={value}
              onClick={() => setTheme(value)}
              className={`group relative p-6 rounded-2xl border-2 transition-all text-left bg-card-bg shadow-sm hover:shadow-md flex flex-col justify-between ${
                isSelected
                  ? 'border-accent ring-2 ring-accent/20'
                  : 'border-card-border hover:border-text-muted'
              }`}
            >
              {/* Preview Card */}
              <div className={`w-full h-32 rounded-xl p-3 border mb-5 flex flex-col gap-2 ${previewBg}`}>
                <div className={`w-full h-4 rounded-md ${barBg}`} />
                <div className="flex gap-2 flex-1">
                  <div className={`w-1/3 h-full rounded-md ${barBg}`} />
                  <div className={`w-2/3 h-full rounded-md ${cardBg}`} />
                </div>
              </div>

              {/* Header Info */}
              <div className="flex items-start justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2.5">
                    <Icon className={`w-5 h-5 ${isSelected ? 'text-accent' : 'text-text-primary'}`} />
                    <span className="text-base font-semibold text-text-primary">{label}</span>
                  </div>
                  <p className="text-xs text-text-muted">{description}</p>
                </div>
                {isSelected && (
                  <div className="w-6 h-6 rounded-full bg-accent flex items-center justify-center text-white shrink-0">
                    <Check className="w-3.5 h-3.5" />
                  </div>
                )}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
