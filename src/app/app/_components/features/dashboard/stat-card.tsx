'use client';

import { motion } from 'framer-motion';
import { cn } from '@/app/app/_util/cn';

interface StatCardProps {
  icon: string;
  iconColor: string;
  label: string;
  value: string | number;
  badge?: string;
  progress?: number; // 0–100
  accentColor?: string; // top border override
}

export function StatCard({
  icon,
  iconColor,
  label,
  value,
  badge,
  progress,
  accentColor,
}: StatCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="glass-panel rounded-xl p-6 flex flex-col relative overflow-hidden group hover:bg-white/[0.05] transition-all duration-300"
      style={accentColor ? { borderTop: `2px solid ${accentColor}` } : undefined}
    >
      <div className="flex justify-between items-start mb-4">
        <div className="w-12 h-12 rounded-lg bg-surface-container flex items-center justify-center border border-glass-border">
          <span className={cn('material-symbols-outlined text-2xl', iconColor)}>{icon}</span>
        </div>
        {badge && (
          <span
            className={cn(
              'text-[11px] tracking-wider font-semibold px-3 py-1 rounded-full border',
              accentColor
                ? 'bg-green-500/10 text-green-400 border-green-500/20'
                : 'bg-primary/10 text-primary border-primary/20',
            )}
          >
            {badge}
          </span>
        )}
      </div>

      <div className="mt-auto">
        <p className="text-[14px] text-on-surface-variant mb-1">{label}</p>
        <h3 className="text-[40px] font-semibold text-white leading-none">{value}</h3>
        {progress !== undefined && (
          <div className="w-full bg-surface-container h-1.5 rounded-full mt-3 overflow-hidden">
            <div
              className="bg-neon-purple h-full rounded-full transition-all duration-500"
              style={{ width: `${Math.min(progress, 100)}%` }}
            />
          </div>
        )}
      </div>

      {/* Bottom hover accent line */}
      <div className="absolute bottom-0 left-0 w-full h-[2px] bg-gradient-to-r from-electric-blue/0 via-electric-blue to-electric-blue/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
    </motion.div>
  );
}
