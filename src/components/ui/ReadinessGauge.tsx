'use client';

import { useLanguage } from '@/context/LanguageContext';
import React from 'react';

interface ReadinessGaugeProps {
  score: number;
  size?: number;
  strokeWidth?: number;
  showLabel?: boolean;
}

export function ReadinessGauge({
  score,
  size = 160,
  strokeWidth = 14,
  showLabel = true,
}: ReadinessGaugeProps) {
  const { language } = useLanguage();
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (Math.max(0, Math.min(100, score)) / 100) * circumference;

  let colorClass = 'stroke-indigo-600 dark:stroke-indigo-400';
  let badgeText = language === 'ta' ? 'தொடக்க நிலை' : 'Foundation Phase';
  let badgeBg = 'bg-indigo-100 text-indigo-800 dark:bg-indigo-950 dark:text-indigo-300';

  if (score >= 80) {
    colorClass = 'stroke-emerald-500 dark:stroke-emerald-400';
    badgeText = language === 'ta' ? 'பயிற்சிக்கு தயார்' : 'Ready for Projects';
    badgeBg = 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300';
  } else if (score >= 50) {
    colorClass = 'stroke-amber-500 dark:stroke-amber-400';
    badgeText = language === 'ta' ? 'இடைநிலை முன்னேற்றம்' : 'Promising Baseline';
    badgeBg = 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300';
  }

  return (
    <div className="flex flex-col items-center justify-center">
      <div className="relative" style={{ width: size, height: size }}>
        <svg
          className="transform -rotate-90"
          width={size}
          height={size}
          viewBox={`0 0 ${size} ${size}`}
        >
          {/* Background circle */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="currentColor"
            strokeWidth={strokeWidth}
            className="text-slate-100 dark:text-slate-800"
            fill="transparent"
          />
          {/* Active progress circle */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="currentColor"
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            className={`${colorClass} transition-all duration-700 ease-out`}
            fill="transparent"
          />
        </svg>

        {/* Center score display */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
          <span className="text-3xl font-black tracking-tight text-slate-900 dark:text-white">
            {score}%
          </span>
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
            {language === 'ta' ? 'தயார் நிலை' : 'Readiness'}
          </span>
        </div>
      </div>

      {showLabel && (
        <div className="mt-3">
          <span className={`inline-block rounded-full px-2.5 py-1 text-xs font-bold ${badgeBg}`}>
            {badgeText}
          </span>
        </div>
      )}
    </div>
  );
}
