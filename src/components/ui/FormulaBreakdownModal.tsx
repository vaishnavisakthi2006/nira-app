'use client';

import { useLanguage } from '@/context/LanguageContext';
import { SkillGapAnalysis } from '@/types';
import { Calculator, Info, X } from 'lucide-react';
import React from 'react';

interface FormulaBreakdownModalProps {
  isOpen: boolean;
  onClose: () => void;
  gapAnalysis: SkillGapAnalysis;
}

export function FormulaBreakdownModal({
  isOpen,
  onClose,
  gapAnalysis,
}: FormulaBreakdownModalProps) {
  const { language, t } = useLanguage();

  if (!isOpen) return null;

  const title = language === 'ta' ? gapAnalysis.careerTitleTa : gapAnalysis.careerTitleEn;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-sm animate-in fade-in duration-150">
      <div
        className="relative w-full max-w-3xl rounded-2xl bg-white p-6 shadow-2xl dark:bg-slate-900 max-h-[90vh] overflow-y-auto border border-slate-200 dark:border-slate-800"
        role="dialog"
        aria-modal="true"
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-slate-800 dark:hover:text-white"
          aria-label="Close dialog"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300">
            <Calculator className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              {t.skillGap.formulaExplainerTitle}
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {title} • {gapAnalysis.readinessScore}% {language === 'ta' ? 'தயார் நிலை' : 'Readiness'}
            </p>
          </div>
        </div>

        {/* The Mathematical Formula Banner */}
        <div className="mt-5 rounded-xl bg-slate-50 p-4 border border-slate-200 dark:bg-slate-800/60 dark:border-slate-700 font-mono text-xs">
          <div className="text-[11px] font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400 mb-1">
            {language === 'ta' ? 'அதிகாரப்பூர்வ சூத்திரம்' : 'Transparent Mathematical Formula'}
          </div>
          <div className="overflow-x-auto text-slate-800 dark:text-slate-200 font-semibold py-1">
            Readiness Score (%) = [ ∑ ( Weight × min(Student_Level / Required_Level, 1.0) ) ÷ ∑ (All Weights) ] × 100
          </div>
        </div>

        {/* Plain Language Explanation */}
        <div className="mt-4 flex items-start gap-2.5 rounded-lg bg-emerald-50/70 p-3 text-xs text-emerald-900 dark:bg-emerald-950/30 dark:text-emerald-200">
          <Info className="h-4 w-4 shrink-0 text-emerald-600 dark:text-emerald-400 mt-0.5" />
          <p className="leading-relaxed">
            {language === 'ta'
              ? 'ஒவ்வொரு தேவையான திறனுக்கும் அதன் முக்கியத்துவத்திற்கு ஏற்ப எடை (Weight 1 முதல் 5 வரை) வழங்கப்படுகிறது. மாணவரின் திறன் தேவையான நிலையை விட அதிகமாக இருந்தால் அதிகபட்சமாக 100% மட்டுமே கணக்கில் கொள்ளப்படும். எந்தவொரு திறனும் புறக்கணிக்கப்படுவதில்லை.'
              : 'Each skill is weighted according to its real-world importance for this role (1 to 5). If your rating meets or exceeds the benchmark, it contributes 100% of its weighted points. No skills are hidden or arbitrarily altered.'}
          </p>
        </div>

        {/* Detailed Skills Breakdown Table */}
        <div className="mt-5 overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-800">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-100 dark:bg-slate-800/90 text-slate-700 dark:text-slate-200 font-semibold">
              <tr>
                <th className="p-3">Skill Name</th>
                <th className="p-3 text-center">Student Lvl (0-4)</th>
                <th className="p-3 text-center">Req. Lvl (1-4)</th>
                <th className="p-3 text-center">Weight (1-5)</th>
                <th className="p-3 text-center">Ratio min(S/R, 1)</th>
                <th className="p-3 text-right">Weighted Points</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-600 dark:text-slate-300">
              {gapAnalysis.comparisons.map((comp) => {
                const ratio = Math.min(comp.studentLevel / comp.requiredLevel, 1.0);
                const skillName = language === 'ta' ? comp.skillNameTa : comp.skillNameEn;
                return (
                  <tr key={comp.skillId} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                    <td className="p-3 font-medium text-slate-900 dark:text-white">
                      {skillName}
                    </td>
                    <td className="p-3 text-center">
                      <span className="font-bold text-slate-900 dark:text-white">
                        {comp.studentLevel}
                      </span>
                    </td>
                    <td className="p-3 text-center">{comp.requiredLevel}</td>
                    <td className="p-3 text-center font-semibold text-indigo-600 dark:text-indigo-400">
                      {comp.weight}×
                    </td>
                    <td className="p-3 text-center font-mono">
                      {ratio.toFixed(2)} ({Math.round(ratio * 100)}%)
                    </td>
                    <td className="p-3 text-right font-mono font-bold text-slate-900 dark:text-white">
                      {comp.weightedContribution.toFixed(2)} / {comp.weight}
                    </td>
                  </tr>
                );
              })}
            </tbody>
            <tfoot className="bg-slate-50 dark:bg-slate-800/60 font-bold text-slate-900 dark:text-white border-t border-slate-200 dark:border-slate-700">
              <tr>
                <td className="p-3" colSpan={3}>
                  Total Sums
                </td>
                <td className="p-3 text-center text-indigo-600 dark:text-indigo-400">
                  {gapAnalysis.totalWeight}
                </td>
                <td className="p-3 text-center">-</td>
                <td className="p-3 text-right text-emerald-600 dark:text-emerald-400 font-mono text-sm">
                  {gapAnalysis.weightedSum.toFixed(2)} / {gapAnalysis.totalWeight}
                </td>
              </tr>
            </tfoot>
          </table>
        </div>

        {/* Step-by-Step Calculation Result */}
        <div className="mt-5 rounded-xl bg-slate-900 p-4 text-white dark:bg-slate-950 border border-slate-800">
          <div className="text-xs text-slate-400 mb-1 font-semibold">
            {t.skillGap.formulaStepByStep}
          </div>
          <div className="font-mono text-sm text-emerald-400 font-bold">
            ({gapAnalysis.weightedSum.toFixed(2)} ÷ {gapAnalysis.totalWeight}) × 100 ={' '}
            <span className="text-white underline underline-offset-4 decoration-emerald-500">
              {gapAnalysis.readinessScore}%
            </span>
          </div>
        </div>

        {/* Modal Action Buttons */}
        <div className="mt-6 flex justify-end">
          <button
            onClick={onClose}
            className="rounded-lg bg-emerald-600 px-5 py-2 text-xs font-bold text-white shadow-xs hover:bg-emerald-700 cursor-pointer"
          >
            {t.common.close}
          </button>
        </div>
      </div>
    </div>
  );
}
