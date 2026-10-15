'use client';

import { useLanguage } from '@/context/LanguageContext';
import { AlertCircle, CheckCircle2, ShieldCheck } from 'lucide-react';
import React from 'react';

export function Footer() {
  const { t } = useLanguage();

  return (
    <footer className="mt-16 border-t border-slate-200 bg-slate-50 dark:border-slate-800 dark:bg-slate-950">
      {/* Educational Disclaimer Banner */}
      <div className="border-b border-slate-200/80 bg-amber-50/70 py-4 px-4 dark:border-slate-800 dark:bg-amber-950/20">
        <div className="mx-auto flex max-w-7xl items-start gap-3 text-xs text-amber-900 dark:text-amber-200">
          <AlertCircle className="h-5 w-5 shrink-0 text-amber-600 dark:text-amber-400 mt-0.5" />
          <div>
            <span className="font-bold">{t.disclaimerTitle}: </span>
            <span>{t.disclaimerBanner}</span>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand & Purpose */}
          <div>
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-600 text-white font-bold text-base">
                N
              </div>
              <span className="font-bold text-lg text-slate-900 dark:text-white">
                {t.appName}
              </span>
            </div>
            <p className="mt-2 text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              {t.taglineSub}
            </p>
            <div className="mt-3 flex items-center gap-2 text-xs text-emerald-700 dark:text-emerald-400 font-medium">
              <ShieldCheck className="h-4 w-4" />
              <span>{t.privacyNote}</span>
            </div>
          </div>

          {/* Explainable Core Principles */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white">
              Explainability Commitments
            </h4>
            <ul className="mt-3 space-y-2 text-xs text-slate-600 dark:text-slate-400">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
                <span>Deterministic weighted mathematical scoring</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
                <span>Transparent step-by-step formula visibility</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
                <span>No fabricated jobs, salaries, or guarantees</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
                <span>No external telemetry or sensitive tracking</span>
              </li>
            </ul>
          </div>

          {/* Platform Info */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white">
              Tech Stack & Build
            </h4>
            <p className="mt-3 text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Built for Indian college students with Next.js App Router, TypeScript, Tailwind CSS, and full English / Tamil bilingual localization.
            </p>
            <div className="mt-3 flex flex-wrap gap-2 text-[11px]">
              <span className="rounded bg-slate-200 px-2 py-0.5 text-slate-700 dark:bg-slate-800 dark:text-slate-300">
                Next.js App Router
              </span>
              <span className="rounded bg-slate-200 px-2 py-0.5 text-slate-700 dark:bg-slate-800 dark:text-slate-300">
                TypeScript
              </span>
              <span className="rounded bg-slate-200 px-2 py-0.5 text-slate-700 dark:bg-slate-800 dark:text-slate-300">
                Tailwind CSS
              </span>
              <span className="rounded bg-emerald-100 px-2 py-0.5 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                English / தமிழ்
              </span>
            </div>
          </div>
        </div>

        <div className="mt-8 border-t border-slate-200 pt-6 text-center text-xs text-slate-500 dark:border-slate-800 dark:text-slate-500">
          © {new Date().getFullYear()} NIRA Career Readiness Platform. Educational Hackathon MVP.
        </div>
      </div>
    </footer>
  );
}
