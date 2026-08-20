'use client';

import { useTheme } from '@/providers/ThemeProvider';
import { Check } from 'lucide-react';

const COLORS = [
  { value: 'amber', label: 'Amber', color: '#f59e0b' },
  { value: 'blue', label: 'Blue', color: '#3b82f6' },
  { value: 'pink', label: 'Pink', color: '#ec4899' },
  { value: 'rose', label: 'Rose', color: '#f43f5e' },
  { value: 'emerald', label: 'Emerald', color: '#10b981' },
  { value: 'black', label: 'Black', color: '#1f2937' },
];

export default function ColorsPage() {
  const { colorMode, setColorMode } = useTheme();

  return (
    <div className="max-w-lg">
      <h2 className="text-lg font-semibold text-text-primary mb-1">Color Mode</h2>
      <p className="text-sm text-text-secondary mb-6">Choose your accent color</p>

      <div className="grid grid-cols-3 gap-4">
        {COLORS.map(({ value, label, color }) => (
          <button key={value} onClick={() => setColorMode(value)}
            className={`relative p-4 rounded-xl border-2 transition-all ${
              colorMode === value
                ? 'border-accent shadow-md'
                : 'border-card-border hover:border-text-muted'
            }`}>
            <div className="w-full h-16 rounded-lg mb-3" style={{ backgroundColor: color }} />
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-text-primary">{label}</span>
              {colorMode === value && <Check className="w-4 h-4 text-accent" />}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
