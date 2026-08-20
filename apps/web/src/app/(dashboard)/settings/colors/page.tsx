'use client';

import { useTheme } from '@/providers/ThemeProvider';
import { Check } from 'lucide-react';

const COLORS = [
  { value: 'amber', label: 'Amber', color: '#f59e0b', bgLight: '#fef3c7' },
  { value: 'blue', label: 'Blue', color: '#3b82f6', bgLight: '#dbeafe' },
  { value: 'pink', label: 'Pink', color: '#ec4899', bgLight: '#fce7f3' },
  { value: 'rose', label: 'Rose', color: '#f43f5e', bgLight: '#ffe4e6' },
  { value: 'emerald', label: 'Emerald', color: '#10b981', bgLight: '#d1fae5' },
  { value: 'black', label: 'Monochrome', color: '#1f2937', bgLight: '#f3f4f6' },
];

export default function ColorsPage() {
  const { colorMode, setColorMode } = useTheme();

  return (
    <div className="max-w-3xl space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-text-primary tracking-tight mb-2">Accent Color Palette</h2>
        <p className="text-sm text-text-secondary">
          Personalize active indicators, highlights, and primary buttons with your favorite accent color.
        </p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-6">
        {COLORS.map(({ value, label, color, bgLight }) => {
          const isSelected = colorMode === value;
          return (
            <button
              key={value}
              onClick={() => setColorMode(value)}
              className={`group relative p-5 rounded-2xl border-2 transition-all text-left bg-card-bg shadow-sm hover:shadow-md flex flex-col justify-between ${
                isSelected
                  ? 'border-accent ring-2 ring-accent/20'
                  : 'border-card-border hover:border-text-muted'
              }`}
            >
              {/* Color Swatch Card */}
              <div
                className="w-full h-20 rounded-xl mb-4 shadow-inner flex items-center justify-center transition-transform group-hover:scale-95"
                style={{ backgroundColor: color }}
              >
                <div className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-sm border border-white/30" />
              </div>

              {/* Label & Indicator */}
              <div className="flex items-center justify-between pt-1">
                <span className="text-sm font-semibold text-text-primary">{label}</span>
                {isSelected && (
                  <div className="w-5 h-5 rounded-full bg-accent flex items-center justify-center text-white shrink-0">
                    <Check className="w-3 h-3" />
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
