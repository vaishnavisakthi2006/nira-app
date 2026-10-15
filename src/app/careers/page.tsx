'use client';

import { useLanguage } from '@/context/LanguageContext';
import { useProfile } from '@/context/ProfileContext';
import {
  CheckCircle2,
  ChevronRight,
  Compass,
  FolderGit2,
  Info,
  Star,
  Target,
} from 'lucide-react';
import Link from 'next/link';
import React from 'react';

export default function CareersPage() {
  const { language, t } = useLanguage();
  const {
    careerRecommendations,
    targetCareerId,
    setTargetCareerId,
  } = useProfile();

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-8">
      {/* Header */}
      <div className="border-b border-slate-200 pb-6 dark:border-slate-800">
        <div className="inline-flex items-center gap-2 rounded-full bg-indigo-100 px-3 py-1 text-xs font-semibold text-indigo-800 dark:bg-indigo-950 dark:text-indigo-300">
          <Compass className="h-3.5 w-3.5" />
          <span>{t.careers.title}</span>
        </div>
        <h1 className="mt-2 text-2xl sm:text-3xl font-black tracking-tight text-slate-900 dark:text-white">
          {t.careers.title}
        </h1>
        <p className="mt-1 text-sm text-slate-600 dark:text-slate-400 max-w-3xl">
          {t.careers.subtitle}
        </p>

        {/* Career disclaimer notice */}
        <div className="mt-4 flex items-start gap-2.5 rounded-xl bg-slate-100 p-3.5 text-xs text-slate-600 dark:bg-slate-900 dark:text-slate-400">
          <Info className="h-4 w-4 shrink-0 text-slate-500 mt-0.5" />
          <span>{t.careers.disclaimer}</span>
        </div>
      </div>

      {/* Career Recommendations List */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {careerRecommendations.map((rec, index) => {
          const { career, readinessScore, matchReasonsEn, matchReasonsTa, topStrengthsEn, topStrengthsTa, criticalGapsEn, criticalGapsTa } = rec;
          const isTarget = career.id === targetCareerId;
          const title = language === 'ta' ? career.titleTa : career.titleEn;
          const category = language === 'ta' ? career.categoryTa : career.categoryEn;
          const description = language === 'ta' ? career.descriptionTa : career.descriptionEn;
          const marketContext = language === 'ta' ? career.marketContextTa : career.marketContextEn;
          const matchReasons = language === 'ta' ? matchReasonsTa : matchReasonsEn;
          const topStrengths = language === 'ta' ? topStrengthsTa : topStrengthsEn;
          const criticalGaps = language === 'ta' ? criticalGapsTa : criticalGapsEn;

          return (
            <div
              key={career.id}
              className={`rounded-2xl border p-6 transition-all flex flex-col justify-between ${
                isTarget
                  ? 'border-emerald-500 bg-white shadow-md ring-2 ring-emerald-500/20 dark:bg-slate-900 dark:border-emerald-500'
                  : 'border-slate-200 bg-white shadow-xs hover:border-indigo-300 hover:shadow-md dark:border-slate-800 dark:bg-slate-900'
              }`}
            >
              <div>
                {/* Header row */}
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="rounded-md bg-slate-100 px-2 py-0.5 text-[10px] font-bold text-slate-600 dark:bg-slate-800 dark:text-slate-300 uppercase">
                        {category}
                      </span>
                      {index === 0 && (
                        <span className="flex items-center gap-1 rounded-md bg-amber-100 px-2 py-0.5 text-[10px] font-bold text-amber-800 dark:bg-amber-950 dark:text-amber-300">
                          <Star className="h-3 w-3 fill-amber-500 text-amber-500" />
                          <span>#1 Best Match</span>
                        </span>
                      )}
                      {isTarget && (
                        <span className="rounded-md bg-emerald-600 px-2 py-0.5 text-[10px] font-bold text-white">
                          🎯 {t.careers.currentTarget}
                        </span>
                      )}
                    </div>
                    <h3 className="mt-2 text-xl font-bold text-slate-900 dark:text-white">
                      {title}
                    </h3>
                  </div>

                  {/* Readiness badge */}
                  <div className="flex flex-col items-end">
                    <div className="flex items-baseline gap-1">
                      <span className="text-2xl font-black text-emerald-600 dark:text-emerald-400">
                        {readinessScore}%
                      </span>
                    </div>
                    <span className="text-[10px] font-semibold text-slate-400 uppercase">
                      {t.careers.readiness}
                    </span>
                  </div>
                </div>

                <p className="mt-3 text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                  {description}
                </p>

                {/* Market context */}
                <div className="mt-3 rounded-lg bg-slate-50 p-2.5 text-[11px] text-slate-600 dark:bg-slate-800/60 dark:text-slate-300 border border-slate-100 dark:border-slate-800">
                  <span className="font-bold text-slate-800 dark:text-slate-100">
                    📍 {language === 'ta' ? 'சந்தை சூழல்:' : 'India Hiring Context:'}{' '}
                  </span>
                  <span>{marketContext}</span>
                </div>

                {/* Why recommended */}
                <div className="mt-4 space-y-1.5">
                  <div className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                    {t.careers.whyRecommended}
                  </div>
                  {matchReasons.map((reason, rIdx) => (
                    <div key={rIdx} className="flex items-start gap-2 text-xs text-slate-700 dark:text-slate-300">
                      <CheckCircle2 className="h-3.5 w-3.5 shrink-0 text-emerald-600 mt-0.5" />
                      <span>{reason}</span>
                    </div>
                  ))}
                </div>

                {/* Strengths and Gaps snapshot */}
                <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3 pt-3 border-t border-slate-100 dark:border-slate-800 text-xs">
                  <div>
                    <span className="font-bold text-emerald-700 dark:text-emerald-400 block mb-1">
                      ✓ {t.careers.strengths}
                    </span>
                    {topStrengths.length > 0 ? (
                      <ul className="space-y-0.5 text-[11px] text-slate-600 dark:text-slate-400">
                        {topStrengths.slice(0, 2).map((st, i) => (
                          <li key={i}>• {st}</li>
                        ))}
                      </ul>
                    ) : (
                      <span className="text-[11px] text-slate-400">Build beginner base</span>
                    )}
                  </div>

                  <div>
                    <span className="font-bold text-amber-600 dark:text-amber-400 block mb-1">
                      ⚡ {t.careers.topGaps}
                    </span>
                    {criticalGaps.length > 0 ? (
                      <ul className="space-y-0.5 text-[11px] text-slate-600 dark:text-slate-400">
                        {criticalGaps.slice(0, 2).map((gap, i) => (
                          <li key={i}>• {gap}</li>
                        ))}
                      </ul>
                    ) : (
                      <span className="text-[11px] text-emerald-600">All met!</span>
                    )}
                  </div>
                </div>

                {/* Sample beginner project teaser */}
                <div className="mt-4 rounded-xl border border-indigo-100 bg-indigo-50/50 p-3 dark:border-indigo-950 dark:bg-indigo-950/20">
                  <div className="flex items-center gap-1.5 text-[11px] font-bold text-indigo-900 dark:text-indigo-300">
                    <FolderGit2 className="h-3.5 w-3.5 text-indigo-600" />
                    <span>{t.careers.sampleProjectTitle}</span>
                  </div>
                  <div className="mt-1 text-xs font-semibold text-slate-900 dark:text-white">
                    {language === 'ta' ? career.beginnerProject.titleTa : career.beginnerProject.titleEn}
                  </div>
                  <p className="mt-1 text-[11px] text-slate-600 dark:text-slate-300 line-clamp-2">
                    {language === 'ta' ? career.beginnerProject.descriptionTa : career.beginnerProject.descriptionEn}
                  </p>
                </div>
              </div>

              {/* Card Bottom CTA */}
              <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3">
                <Link
                  href="/skill-gap"
                  onClick={() => setTargetCareerId(career.id)}
                  className="text-xs font-bold text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 flex items-center gap-1"
                >
                  <span>{t.skillGap.title}</span>
                  <ChevronRight className="h-3.5 w-3.5" />
                </Link>

                {isTarget ? (
                  <span className="rounded-lg bg-emerald-100 px-4 py-2 text-xs font-bold text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 flex items-center gap-1.5">
                    <Target className="h-3.5 w-3.5" />
                    <span>{t.careers.currentTarget}</span>
                  </span>
                ) : (
                  <button
                    type="button"
                    onClick={() => setTargetCareerId(career.id)}
                    className="rounded-lg bg-emerald-600 px-4 py-2 text-xs font-bold text-white hover:bg-emerald-700 shadow-xs cursor-pointer flex items-center gap-1.5 transition-colors"
                  >
                    <Target className="h-3.5 w-3.5" />
                    <span>{t.careers.targetCareerBtn}</span>
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
