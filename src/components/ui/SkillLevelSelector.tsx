'use client';

import { SKILL_LEVEL_LABELS, SKILL_LEVEL_SHORT } from '@/data/seedData';
import { useLanguage } from '@/context/LanguageContext';
import { SkillLevel } from '@/types';
import React from 'react';

interface SkillLevelSelectorProps {
  level: SkillLevel;
  onChange: (lvl: SkillLevel) => void;
  requiredLevel?: SkillLevel;
  compact?: boolean;
}

export function SkillLevelSelector({
  level,
  onChange,
  requiredLevel,
  compact = false,
}: SkillLevelSelectorProps) {
  const { language } = useLanguage();
  const levels: SkillLevel[] = [0, 1, 2, 3, 4];

  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-center gap-1">
        {levels.map((lvl) => {
          const isSelected = level === lvl;
          const isBelowOrEqual = level >= lvl && lvl > 0;
          const isBenchmark = requiredLevel === lvl;

          let blockBg = 'bg-slate-100 text-slate-500 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-400';
          if (isSelected) {
            blockBg =
              lvl === 0
                ? 'bg-slate-300 text-slate-800 dark:bg-slate-700 dark:text-slate-100'
                : lvl >= (requiredLevel ?? 3)
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'bg-amber-500 text-white shadow-xs';
          } else if (isBelowOrEqual) {
            blockBg = 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300';
          }

          return (
            <button
              key={lvl}
              type="button"
              onClick={() => onChange(lvl)}
              title={SKILL_LEVEL_LABELS[language][lvl]}
              className={`relative flex items-center justify-center rounded-md font-bold transition-all cursor-pointer ${
                compact ? 'h-7 w-7 text-xs' : 'h-8 px-2 text-xs'
              } ${blockBg} ${isSelected ? 'ring-2 ring-emerald-500 ring-offset-1' : ''}`}
            >
              <span>{lvl}</span>
              {isBenchmark && (
                <span
                  title="Role Benchmark Level"
                  className="absolute -top-1.5 -right-1 flex h-3 w-3 items-center justify-center rounded-full bg-indigo-600 text-[8px] text-white font-bold"
                >
                  *
                </span>
              )}
            </button>
          );
        })}
      </div>
      <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400">
        <span>{SKILL_LEVEL_SHORT[language][level]}</span>
        {requiredLevel !== undefined && (
          <span className="text-[10px] text-indigo-600 dark:text-indigo-400 font-semibold">
            Req: Lvl {requiredLevel}
          </span>
        )}
      </div>
    </div>
  );
}
