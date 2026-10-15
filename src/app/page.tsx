'use client';

import { DEMO_PROFILES } from '@/data/seedData';
import { useLanguage } from '@/context/LanguageContext';
import { useProfile } from '@/context/ProfileContext';
import { matchOpportunitiesForStudent } from '@/lib/opportunityMatcher';
import { ReadinessGauge } from '@/components/ui/ReadinessGauge';
import { FormulaBreakdownModal } from '@/components/ui/FormulaBreakdownModal';
import {
  ArrowRight,
  BarChart2,
  Briefcase,
  Calculator,
  CheckCircle,
  Clock,
  FileText,
  RefreshCw,
  Sparkles,
  User,
  Zap,
} from 'lucide-react';
import Link from 'next/link';
import React, { useMemo, useState } from 'react';

export default function DashboardPage() {
  const { language, t } = useLanguage();
  const {
    profile,
    targetCareer,
    skillGapAnalysis,
    roadmapProgress,
    loadDemoProfile,
  } = useProfile();

  const [formulaModalOpen, setFormulaModalOpen] = useState(false);

  const matchedOpps = useMemo(() => {
    return matchOpportunitiesForStudent(profile, { targetRole: targetCareer?.id }).slice(0, 2);
  }, [profile, targetCareer]);

  const targetTitle = language === 'ta' ? targetCareer?.titleTa : targetCareer?.titleEn;

  // Next up task in roadmap
  const nextIncompleteTask = useMemo(() => {
    if (!roadmapProgress) return null;
    for (const week of roadmapProgress.weeks) {
      for (const task of week.tasks) {
        if (!task.completed) {
          return { weekNumber: week.weekNumber, focusSkillName: language === 'ta' ? week.focusSkillNameTa : week.focusSkillNameEn, task };
        }
      }
    }
    return null;
  }, [roadmapProgress, language]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-8">
      {/* Hero Welcome Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 p-6 sm:p-8 text-white shadow-xl">
        <div className="absolute top-0 right-0 -mt-12 -mr-12 h-64 w-64 rounded-full bg-emerald-500/10 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 -mb-12 h-64 w-64 rounded-full bg-indigo-500/10 blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 rounded-full bg-emerald-500/20 px-3 py-1 text-xs font-semibold text-emerald-300 backdrop-blur-sm border border-emerald-500/30">
              <Sparkles className="h-3.5 w-3.5" />
              <span>{t.tagline}</span>
            </div>
            <h1 className="mt-3 text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight text-white">
              {profile.name
                ? `${t.dashboard.welcomeBack}, ${profile.name}!`
                : t.dashboard.welcomeNew}
            </h1>
            <p className="mt-2 text-sm sm:text-base text-slate-300 leading-relaxed">
              {t.dashboard.heroSub}
            </p>

            {/* Student metadata tag row */}
            {profile.name && (
              <div className="mt-4 flex flex-wrap items-center gap-2 text-xs text-slate-300">
                <span className="rounded-md bg-white/10 px-2.5 py-1 backdrop-blur-xs font-medium">
                  🎓 {profile.degreeField || 'Engineering'} ({profile.graduationYear})
                </span>
                {profile.collegeOrCity && (
                  <span className="rounded-md bg-white/10 px-2.5 py-1 backdrop-blur-xs font-medium">
                    📍 {profile.collegeOrCity}
                  </span>
                )}
                <span className="rounded-md bg-emerald-500/20 px-2.5 py-1 text-emerald-300 font-bold">
                  🎯 {targetTitle}
                </span>
              </div>
            )}
          </div>

          {/* Quick Demo Presets */}
          <div className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-md md:min-w-[280px]">
            <div className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2 flex items-center justify-between">
              <span>{t.profile.quickPresetLabel}</span>
              <RefreshCw className="h-3 w-3 text-slate-400" />
            </div>
            <div className="space-y-1.5">
              {DEMO_PROFILES.map((dp) => (
                <button
                  key={dp.profile.id}
                  onClick={() => loadDemoProfile(dp.profile.id)}
                  className={`w-full text-left rounded-lg px-2.5 py-1.5 text-xs font-medium transition-all cursor-pointer ${
                    profile.name === dp.profile.name
                      ? 'bg-emerald-500 text-white font-bold shadow-xs'
                      : 'text-slate-300 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  {language === 'ta' ? dp.labelTa : dp.labelEn}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Main Grid: Readiness Card, Top Gaps, Roadmap Progress */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Card 1: Target Career Readiness Score */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                {t.dashboard.readinessCardTitle}
              </span>
              <Link
                href="/careers"
                className="text-xs font-bold text-emerald-600 hover:text-emerald-700 dark:text-emerald-400 flex items-center gap-1"
              >
                <span>{language === 'ta' ? 'பணியை மாற்று' : 'Switch Role'}</span>
                <ArrowRight className="h-3 w-3" />
              </Link>
            </div>

            <h3 className="mt-2 text-lg font-bold text-slate-900 dark:text-white">
              {targetTitle}
            </h3>

            {/* Gauge */}
            <div className="my-6 flex justify-center">
              <ReadinessGauge score={skillGapAnalysis?.readinessScore ?? 0} />
            </div>

            <p className="text-xs text-slate-600 dark:text-slate-400 text-center leading-relaxed">
              {language === 'ta'
                ? skillGapAnalysis?.summaryTa
                : skillGapAnalysis?.summaryEn}
            </p>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2">
            <button
              onClick={() => setFormulaModalOpen(true)}
              className="flex items-center gap-1.5 text-xs font-semibold text-slate-700 hover:text-emerald-600 dark:text-slate-300 dark:hover:text-emerald-400 cursor-pointer"
            >
              <Calculator className="h-3.5 w-3.5 text-emerald-600" />
              <span>{t.dashboard.viewCalculation}</span>
            </button>
            <Link
              href="/skill-gap"
              className="rounded-lg bg-emerald-50 px-3 py-1.5 text-xs font-bold text-emerald-700 hover:bg-emerald-100 dark:bg-emerald-950 dark:text-emerald-300"
            >
              {t.dashboard.analyzeSkills} →
            </Link>
          </div>
        </div>

        {/* Card 2: Top Skill Gaps to Bridge */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                {t.dashboard.topGapsTitle}
              </span>
              <span className="rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-bold text-amber-800 dark:bg-amber-950 dark:text-amber-300">
                {skillGapAnalysis?.topGaps.length ?? 0} {language === 'ta' ? 'இடைவெளிகள்' : 'Gaps'}
              </span>
            </div>

            <div className="mt-4 space-y-3">
              {skillGapAnalysis && skillGapAnalysis.topGaps.length > 0 ? (
                skillGapAnalysis.topGaps.slice(0, 3).map((gap) => (
                  <div
                    key={gap.skillId}
                    className="rounded-xl border border-slate-100 bg-slate-50 p-3 dark:border-slate-800 dark:bg-slate-800/60"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-900 dark:text-white">
                        {language === 'ta' ? gap.skillNameTa : gap.skillNameEn}
                      </span>
                      <span className="text-[11px] font-semibold text-amber-600 dark:text-amber-400">
                        {gap.status === 'to_develop'
                          ? language === 'ta' ? 'கற்க வேண்டும் (0)' : 'To Develop (0)'
                          : language === 'ta' ? `பகுதி நிறைவு (${gap.studentLevel}/${gap.requiredLevel})` : `Partial (${gap.studentLevel}/${gap.requiredLevel})`}
                      </span>
                    </div>
                    {/* Progress Bar */}
                    <div className="mt-2 h-1.5 w-full rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden">
                      <div
                        className="h-full bg-amber-500 rounded-full transition-all duration-500"
                        style={{ width: `${gap.percentageMet}%` }}
                      />
                    </div>
                    <p className="mt-1.5 text-[11px] text-slate-500 dark:text-slate-400 line-clamp-1">
                      {language === 'ta' ? gap.adviceTa : gap.adviceEn}
                    </p>
                  </div>
                ))
              ) : (
                <div className="rounded-xl bg-emerald-50 p-4 text-center text-xs text-emerald-800 dark:bg-emerald-950 dark:text-emerald-200">
                  <CheckCircle className="h-6 w-6 text-emerald-600 mx-auto mb-1" />
                  <span>{t.dashboard.noGapsMessage}</span>
                </div>
              )}
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
            <span className="text-xs text-slate-500 dark:text-slate-400">
              {language === 'ta' ? 'முன்னுரிமை அடிப்படையில் வரிசைப்படுத்தப்பட்டது' : 'Prioritized by Career Weight'}
            </span>
            <Link
              href="/roadmap"
              className="text-xs font-bold text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 flex items-center gap-1"
            >
              <span>{t.dashboard.viewRoadmap}</span>
              <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
        </div>

        {/* Card 3: 4-Week Roadmap Progress */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                {t.dashboard.roadmapProgressTitle}
              </span>
              <span className="rounded-full bg-indigo-100 px-2 py-0.5 text-[10px] font-bold text-indigo-800 dark:bg-indigo-950 dark:text-indigo-300">
                {roadmapProgress?.completionPercentage ?? 0}%
              </span>
            </div>

            <div className="mt-4">
              {/* Progress bar */}
              <div className="h-2.5 w-full rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-indigo-500 to-emerald-500 rounded-full transition-all duration-500"
                  style={{ width: `${roadmapProgress?.completionPercentage ?? 0}%` }}
                />
              </div>
              <div className="mt-2 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 font-medium">
                <span>
                  {roadmapProgress?.completedWeeksCount ?? 0} / 4 {t.dashboard.weeksCompleted}
                </span>
                <span>
                  {roadmapProgress?.completedTasksCount ?? 0} / {roadmapProgress?.totalTasksCount ?? 0} {t.dashboard.tasksCompleted}
                </span>
              </div>
            </div>

            {/* Next Up Task Banner */}
            {nextIncompleteTask ? (
              <div className="mt-5 rounded-xl border border-indigo-100 bg-indigo-50/70 p-3.5 dark:border-indigo-900/50 dark:bg-indigo-950/30">
                <div className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-wider text-indigo-700 dark:text-indigo-300">
                  <Zap className="h-3.5 w-3.5 text-indigo-600" />
                  <span>
                    {t.dashboard.nextTaskTitle} (Week {nextIncompleteTask.weekNumber}: {nextIncompleteTask.focusSkillName})
                  </span>
                </div>
                <p className="mt-1 text-xs font-medium text-slate-800 dark:text-slate-200">
                  {language === 'ta'
                    ? nextIncompleteTask.task.titleTa
                    : nextIncompleteTask.task.titleEn}
                </p>
              </div>
            ) : (
              <div className="mt-5 rounded-xl border border-emerald-100 bg-emerald-50/70 p-3.5 text-center text-xs text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300">
                🎉 {t.roadmap.celebrationTitle}
              </div>
            )}
          </div>

          <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
            <span className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1">
              <Clock className="h-3.5 w-3.5" />
              <span>~6 {language === 'ta' ? 'மணி/வாரம்' : 'hrs / week'}</span>
            </span>
            <Link
              href="/roadmap"
              className="rounded-lg bg-indigo-600 px-3 py-1.5 text-xs font-bold text-white hover:bg-indigo-700 shadow-xs"
            >
              {t.dashboard.viewRoadmap} →
            </Link>
          </div>
        </div>
      </div>

      {/* Quick Actions Bar */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-4">
          {t.dashboard.quickActions}
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <Link
            href="/profile"
            className="flex items-center gap-3 rounded-xl border border-slate-200 p-3.5 hover:border-emerald-500 hover:bg-emerald-50/40 dark:border-slate-700 dark:hover:bg-slate-800 transition-all group"
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-100 text-emerald-700 group-hover:scale-110 transition-transform dark:bg-emerald-950 dark:text-emerald-300">
              <User className="h-4 w-4" />
            </div>
            <div>
              <div className="text-xs font-bold text-slate-900 dark:text-white">
                {t.dashboard.completeProfile}
              </div>
              <div className="text-[10px] text-slate-500">Edit skills & goals</div>
            </div>
          </Link>

          <Link
            href="/skill-gap"
            className="flex items-center gap-3 rounded-xl border border-slate-200 p-3.5 hover:border-emerald-500 hover:bg-emerald-50/40 dark:border-slate-700 dark:hover:bg-slate-800 transition-all group"
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-100 text-indigo-700 group-hover:scale-110 transition-transform dark:bg-indigo-950 dark:text-indigo-300">
              <BarChart2 className="h-4 w-4" />
            </div>
            <div>
              <div className="text-xs font-bold text-slate-900 dark:text-white">
                {t.dashboard.analyzeSkills}
              </div>
              <div className="text-[10px] text-slate-500">Interactive gap sliders</div>
            </div>
          </Link>

          <Link
            href="/opportunities"
            className="flex items-center gap-3 rounded-xl border border-slate-200 p-3.5 hover:border-emerald-500 hover:bg-emerald-50/40 dark:border-slate-700 dark:hover:bg-slate-800 transition-all group"
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-amber-100 text-amber-700 group-hover:scale-110 transition-transform dark:bg-amber-950 dark:text-amber-300">
              <Briefcase className="h-4 w-4" />
            </div>
            <div>
              <div className="text-xs font-bold text-slate-900 dark:text-white">
                {t.dashboard.exploreOpportunities}
              </div>
              <div className="text-[10px] text-slate-500">Matched internships</div>
            </div>
          </Link>

          <Link
            href="/resume"
            className="flex items-center gap-3 rounded-xl border border-slate-200 p-3.5 hover:border-emerald-500 hover:bg-emerald-50/40 dark:border-slate-700 dark:hover:bg-slate-800 transition-all group"
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-purple-100 text-purple-700 group-hover:scale-110 transition-transform dark:bg-purple-950 dark:text-purple-300">
              <FileText className="h-4 w-4" />
            </div>
            <div>
              <div className="text-xs font-bold text-slate-900 dark:text-white">
                {t.dashboard.scanResume}
              </div>
              <div className="text-[10px] text-slate-500">Keyword & ATS scan</div>
            </div>
          </Link>
        </div>
      </div>

      {/* Matched Demo Opportunities Teaser */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              {t.dashboard.matchedOppsTitle}
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {t.opportunities.demoNotice}
            </p>
          </div>
          <Link
            href="/opportunities"
            className="text-xs font-bold text-emerald-600 hover:text-emerald-700 dark:text-emerald-400 flex items-center gap-1"
          >
            <span>{t.dashboard.viewAllOpps}</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {matchedOpps.map((opp) => (
            <div
              key={opp.id}
              className="relative rounded-xl border border-slate-200 p-4 hover:border-emerald-400 transition-all dark:border-slate-700 dark:bg-slate-800/40"
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <span className="inline-block rounded-md bg-emerald-100 px-2 py-0.5 text-[10px] font-bold text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                    {opp.type.toUpperCase()} • [DEMO]
                  </span>
                  <h4 className="mt-1 text-sm font-bold text-slate-900 dark:text-white">
                    {language === 'ta' ? opp.titleTa : opp.titleEn}
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    {language === 'ta' ? opp.organizationTa : opp.organizationEn} • {opp.locationEn}
                  </p>
                </div>
                <span className="rounded-full bg-emerald-600 px-2 py-0.5 text-xs font-black text-white">
                  {opp.matchScore}%
                </span>
              </div>

              <p className="mt-2 text-xs text-slate-600 dark:text-slate-300 bg-slate-50 dark:bg-slate-800 p-2 rounded-lg">
                💡 <span className="font-semibold">{t.opportunities.whyMatched}</span>{' '}
                {language === 'ta' ? opp.matchReasonTa : opp.matchReasonEn}
              </p>

              <div className="mt-3 flex items-center justify-between text-[11px] text-slate-500">
                <span>💰 {language === 'ta' ? opp.stipendOrBenefitTa : opp.stipendOrBenefitEn}</span>
                <Link
                  href="/opportunities"
                  className="font-bold text-emerald-600 dark:text-emerald-400 hover:underline"
                >
                  {t.opportunities.viewDetails} →
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Formula Breakdown Modal */}
      {skillGapAnalysis && (
        <FormulaBreakdownModal
          isOpen={formulaModalOpen}
          onClose={() => setFormulaModalOpen(false)}
          gapAnalysis={skillGapAnalysis}
        />
      )}
    </div>
  );
}
