'use client';

import { ArrowUp, ArrowDown, Minus } from 'lucide-react';

const PRIORITY_CONFIG: Record<string, { label: string; className: string; icon: any }> = {
  urgent: { label: 'Urgent', className: 'priority-urgent', icon: ArrowUp },
  high: { label: 'High', className: 'priority-high', icon: ArrowUp },
  medium: { label: 'Medium', className: 'priority-medium', icon: ArrowUp },
  low: { label: 'Low', className: 'priority-low', icon: ArrowDown },
  none: { label: 'No Priority', className: 'priority-none', icon: Minus },
};

export default function PriorityBadge({ priority }: { priority: string }) {
  const config = PRIORITY_CONFIG[priority] || PRIORITY_CONFIG.none;
  const Icon = config.icon;

  return (
    <span className={`flex items-center gap-1 text-sm font-medium ${config.className}`}>
      <Icon className="w-3.5 h-3.5" />
      {config.label}
    </span>
  );
}
