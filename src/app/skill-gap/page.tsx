'use client';

import { SEEDED_CAREERS } from '@/data/seedData';
import { useLanguage } from '@/context/LanguageContext';
import { useProfile } from '@/context/ProfileContext';
import { calculateSkillGapAnalysis } from '@/lib/scoring';
import { ReadinessGauge } from '@/components/ui/ReadinessGauge';
import { FormulaBreakdownModal } from '@/components/ui/FormulaBreakdownModal';
import { SkillLevelSelector } from '@/components/ui/SkillLevelSelector';
import { SkillLevel } from '@/types';
import {
  BarChart2,
  Calculator,
  CheckCircle2,
  HelpCircle,
  Save,
} from 'lucide-react';
import Link from 'next/link';
import React, { useMemo, useState } from 'react';

export default function SkillGapPage() {
  const { language, t } = useLanguage();
  const {
    profile,
    targetCareerId,
    setTargetCareerId,
    batchUpdateSkills,
  } = useProfile();

  // Active career being analyzed (defaults to target career)
  const [selectedCareerId, setSelectedCareerId] = useState<string>(targetCareerId || 'frontend_developer');
  // Local editable skill ratings for simulation
  const [localSkills, setLocalSkills] = useState<Record<string, SkillLevel>>(profile.skills || {});
  const [activeTab, setActiveTab] = useState<'all' | 'met' | 'partly_met' | 'to_develop'>('all');
  const [formulaModalOpen, setFormulaModalOpen] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Synchronize when active target career changes externally
  const activeCareer = useMemo(() => {
    return SEEDED_CAREERS.find((c) => c.id === selectedCareerId) || SEEDED_CAREERS[0];
  }, [selectedCareerId]);

  // Real-time recalculation from local interactive skills
  const gapAnalysis = useMemo(() => {
    return calculateSkillGapAnalysis(activeCareer, localSkills);
  }, [activeCareer, localSkills]);

  const handleSkillChange = (skillId: string, level: SkillLevel) => {
    setLocalSkills((prev) => ({ ...prev, [skillId]: level }));
  };

  const handleSaveToProfile = () => {
    batchUpdateSkills(localSkills);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const careerTitle = language === 'ta' ? activeCareer.titleTa : activeCareer.titleEn;

  // Filter comparisons based on tab
  const filteredComparisons = gapAnalysis.comparisons.filter((comp) => {
    if (activeTab === 'all') return true;
    return comp.status === activeTab;
  });

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-slate-200 pb-6 dark:border-slate-800">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
            <BarChart2 className="h-3.5 w-3.5" />
            <span>{t.skillGap.title}</span>
          </div>
          <h1 className="mt-2 text-2xl sm:text-3xl font-black tracking-tight text-slate-900 dark:text-white">
            {t.skillGap.title}
          </h1>
          <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
            {t.skillGap.subtitle}
          </p>
        </div>

        {/* Role Selector Dropdown */}
        <div className="flex items-center gap-3">
          <label className="text-xs font-bold text-slate-700 dark:text-slate-300 whitespace-nowrap">
            {t.skillGap.selectCareer}
          </label>
          <select
            value={selectedCareerId}
            onChange={(e) => {
              setSelectedCareerId(e.target.value);
              setTargetCareerId(e.target.value);
            }}
            className="rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs font-bold text-slate-900 shadow-xs focus:border-emerald-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white cursor-pointer"
          >
            {SEEDED_CAREERS.map((c) => (
              <option key={c.id} value={c.id}>
                {language === 'ta' ? c.titleTa : c.titleEn}
              </option>
            ))}
          </select>
        </div>
      </div>

      {savedSuccess && (
        <div className="flex items-center gap-2 rounded-xl bg-emerald-600 p-4 text-white shadow-lg animate-in fade-in duration-200">
          <CheckCircle2 className="h-5 w-5 shrink-0" />
          <span className="text-sm font-semibold">{t.skillGap.skillsSavedNotice}</span>
        </div>
      )}

      {/* Top Banner: Score & Transparent Math Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Readiness Gauge Card */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900 flex flex-col items-center justify-center text-center">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
            {t.skillGap.scoreCardTitle}
          </span>
          <h3 className="mt-1 text-base font-bold text-slate-900 dark:text-white">
            {careerTitle}
          </h3>

          <div className="my-4">
            <ReadinessGauge score={gapAnalysis.readinessScore} size={150} />
          </div>

          <div className="grid grid-cols-3 gap-2 w-full pt-4 border-t border-slate-100 dark:border-slate-800 text-center">
            <div className="rounded-lg bg-emerald-50 p-2 dark:bg-emerald-950/40">
              <div className="text-sm font-black text-emerald-700 dark:text-emerald-300">
                {gapAnalysis.metCount}
              </div>
              <div className="text-[10px] font-bold text-emerald-800 dark:text-emerald-400">
                {t.skillGap.legendMet}
              </div>
            </div>

            <div className="rounded-lg bg-amber-50 p-2 dark:bg-amber-950/40">
              <div className="text-sm font-black text-amber-700 dark:text-amber-300">
                {gapAnalysis.partlyMetCount}
              </div>
              <div className="text-[10px] font-bold text-amber-800 dark:text-amber-400">
                {t.skillGap.legendPartly}
              </div>
            </div>

            <div className="rounded-lg bg-rose-50 p-2 dark:bg-rose-950/40">
              <div className="text-sm font-black text-rose-700 dark:text-rose-300">
                {gapAnalysis.toDevelopCount}
              </div>
              <div className="text-[10px] font-bold text-rose-800 dark:text-rose-400">
                {t.skillGap.legendDevelop}
              </div>
            </div>
          </div>
        </div>

        {/* Transparent Formula Card (2 Columns wide) */}
        <div className="lg:col-span-2 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Calculator className="h-5 w-5 text-emerald-600" />
                <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900 dark:text-white">
                  {t.skillGap.formulaExplainerTitle}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setFormulaModalOpen(true)}
                className="flex items-center gap-1 text-xs font-bold text-emerald-600 hover:text-emerald-700 dark:text-emerald-400 cursor-pointer"
              >
                <span>{language === 'ta' ? 'முழு அட்டவணை' : 'Detailed Breakdown'}</span>
                <HelpCircle className="h-3.5 w-3.5" />
              </button>
            </div>

            {/* Formula Block */}
            <div className="mt-3 rounded-xl bg-slate-900 p-4 text-emerald-300 font-mono text-xs dark:bg-slate-950 border border-slate-800">
              <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1">
                {language === 'ta' ? 'சூத்திரம்' : 'Core Mathematical Formula'}:
              </div>
              <div className="font-semibold text-white">
                Readiness % = [ ∑ (weight × min(student_lvl / req_lvl, 1.0)) ÷ ∑ (total_weights) ] × 100
              </div>
              <div className="mt-2 text-emerald-400 text-[11px] pt-2 border-t border-slate-800">
                👉 Current Calculation: ({gapAnalysis.weightedSum.toFixed(2)} ÷ {gapAnalysis.totalWeight}) × 100 ={' '}
                <span className="font-bold text-white bg-emerald-600/60 px-1.5 py-0.5 rounded">
                  {gapAnalysis.readinessScore}%
                </span>
              </div>
            </div>

            {/* Plain Language Explanation */}
            <p className="mt-4 text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              {language === 'ta' ? gapAnalysis.summaryTa : gapAnalysis.summaryEn}
            </p>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3">
            <div className="text-xs text-slate-500">
              💡 {t.skillGap.interactiveHint}
            </div>
            <button
              type="button"
              onClick={handleSaveToProfile}
              className="flex items-center gap-2 rounded-lg bg-emerald-600 px-4 py-2 text-xs font-bold text-white hover:bg-emerald-700 shadow-xs cursor-pointer"
            >
              <Save className="h-3.5 w-3.5" />
              <span>{t.skillGap.saveUpdatedSkills}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Interactive Skill Comparisons Table & Sliders */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900 space-y-6">
        {/* Status Filter Tabs */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 pb-4 dark:border-slate-800">
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setActiveTab('all')}
              className={`rounded-lg px-3 py-1.5 text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'all'
                  ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-400'
              }`}
            >
              {t.skillGap.statusTabs.all} ({gapAnalysis.comparisons.length})
            </button>
            <button
              onClick={() => setActiveTab('met')}
              className={`rounded-lg px-3 py-1.5 text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'met'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'bg-emerald-50 text-emerald-800 hover:bg-emerald-100 dark:bg-emerald-950/60 dark:text-emerald-300'
              }`}
            >
              ✓ {t.skillGap.statusTabs.met} ({gapAnalysis.metCount})
            </button>
            <button
              onClick={() => setActiveTab('partly_met')}
              className={`rounded-lg px-3 py-1.5 text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'partly_met'
                  ? 'bg-amber-500 text-white shadow-xs'
                  : 'bg-amber-50 text-amber-800 hover:bg-amber-100 dark:bg-amber-950/60 dark:text-amber-300'
              }`}
            >
              ⚡ {t.skillGap.statusTabs.partly_met} ({gapAnalysis.partlyMetCount})
            </button>
            <button
              onClick={() => setActiveTab('to_develop')}
              className={`rounded-lg px-3 py-1.5 text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'to_develop'
                  ? 'bg-rose-600 text-white shadow-xs'
                  : 'bg-rose-50 text-rose-800 hover:bg-rose-100 dark:bg-rose-950/60 dark:text-rose-300'
              }`}
            >
              ⭕ {t.skillGap.statusTabs.to_develop} ({gapAnalysis.toDevelopCount})
            </button>
          </div>

          <Link
            href="/roadmap"
            className="flex items-center gap-1 text-xs font-bold text-indigo-600 hover:text-indigo-700 dark:text-indigo-400"
          >
            <span>{t.dashboard.viewRoadmap}</span>
            <span>→</span>
          </Link>
        </div>

        {/* Skill Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredComparisons.map((comp) => {
            const skillName = language === 'ta' ? comp.skillNameTa : comp.skillNameEn;
            const advice = language === 'ta' ? comp.adviceTa : comp.adviceEn;

            let statusBadge = (
              <span className="rounded-full bg-rose-100 px-2 py-0.5 text-[10px] font-bold text-rose-800 dark:bg-rose-950 dark:text-rose-300">
                {t.skillGap.legendDevelop} (0/{comp.requiredLevel})
              </span>
            );

            if (comp.status === 'met') {
              statusBadge = (
                <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-bold text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                  ✓ {t.skillGap.legendMet} ({comp.studentLevel}/{comp.requiredLevel})
                </span>
              );
            } else if (comp.status === 'partly_met') {
              statusBadge = (
                <span className="rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-bold text-amber-800 dark:bg-amber-950 dark:text-amber-300">
                  ⚡ {t.skillGap.legendPartly} ({comp.studentLevel}/{comp.requiredLevel})
                </span>
              );
            }

            return (
              <div
                key={comp.skillId}
                className="rounded-xl border border-slate-200 p-4.5 dark:border-slate-800 dark:bg-slate-800/40 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                        {skillName}
                      </h4>
                      <div className="mt-1 flex items-center gap-2 text-[11px] text-slate-500">
                        <span>Weight: <strong className="text-indigo-600 dark:text-indigo-400">{comp.weight}×</strong></span>
                        <span>•</span>
                        <span>Coverage: <strong>{comp.percentageMet}%</strong></span>
                      </div>
                    </div>
                    {statusBadge}
                  </div>

                  {/* Visual Coverage Bar */}
                  <div className="mt-3 h-2 w-full rounded-full bg-slate-100 dark:bg-slate-700 overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-300 ${
                        comp.status === 'met'
                          ? 'bg-emerald-500'
                          : comp.status === 'partly_met'
                          ? 'bg-amber-500'
                          : 'bg-rose-400'
                      }`}
                      style={{ width: `${comp.percentageMet}%` }}
                    />
                  </div>

                  <p className="mt-3 text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                    {advice}
                  </p>
                </div>

                {/* Interactive Stepper */}
                <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                  <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400">
                    {language === 'ta' ? 'உங்கள் நிலையை மாற்று:' : 'Adjust Your Rating:'}
                  </span>
                  <SkillLevelSelector
                    level={comp.studentLevel}
                    requiredLevel={comp.requiredLevel}
                    onChange={(lvl) => handleSkillChange(comp.skillId, lvl)}
                    compact
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Formula Modal */}
      <FormulaBreakdownModal
        isOpen={formulaModalOpen}
        onClose={() => setFormulaModalOpen(false)}
        gapAnalysis={gapAnalysis}
      />
    </div>
  );
}
