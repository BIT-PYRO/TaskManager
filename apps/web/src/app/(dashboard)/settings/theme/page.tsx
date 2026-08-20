'use client';

import { useTheme } from '@/providers/ThemeProvider';
import { Sun, Moon, Check } from 'lucide-react';

export default function ThemePage() {
  const { theme, setTheme } = useTheme();

  return (
    <div className="max-w-lg">
      <h2 className="text-lg font-semibold text-text-primary mb-1">Theme</h2>
      <p className="text-sm text-text-secondary mb-6">Choose your preferred appearance</p>

      <div className="grid grid-cols-2 gap-4">
        {[
          { value: 'light', label: 'Light', icon: Sun, preview: 'bg-white border-gray-200' },
          { value: 'dark', label: 'Dark', icon: Moon, preview: 'bg-gray-900 border-gray-700' },
        ].map(({ value, label, icon: Icon, preview }) => (
          <button key={value} onClick={() => setTheme(value)}
            className={`relative p-4 rounded-xl border-2 transition-all text-left ${
              theme === value
                ? 'border-accent shadow-md'
                : 'border-card-border hover:border-text-muted'
            }`}>
            <div className={`w-full h-20 rounded-lg mb-3 border ${preview}`} />
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Icon className="w-4 h-4 text-text-primary" />
                <span className="text-sm font-medium text-text-primary">{label}</span>
              </div>
              {theme === value && <Check className="w-4 h-4 text-accent" />}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
