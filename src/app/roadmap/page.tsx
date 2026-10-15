'use client';

import { useLanguage } from '@/context/LanguageContext';
import { useProfile } from '@/context/ProfileContext';
import confetti from 'canvas-confetti';
import {
  BookOpen,
  Clock,
  Copy,
  FolderGit2,
  RefreshCw,
  RotateCcw,
  Target,
  Trophy,
  Zap,
} from 'lucide-react';
import React, { useEffect, useState } from 'react';

export default function RoadmapPage() {
  const { language, t } = useLanguage();
  const {
    roadmapProgress,
    toggleRoadmapTask,
    toggleRoadmapWeek,
    regenerateRoadmap,
    resetRoadmapProgress,
  } = useProfile();

  const [copied, setCopied] = useState(false);

  // Trigger celebration confetti when all 4 weeks are completed
  useEffect(() => {
    if (roadmapProgress && roadmapProgress.completionPercentage === 100) {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
      });
    }
  }, [roadmapProgress?.completionPercentage, roadmapProgress]);

  if (!roadmapProgress) {
    return (
      <div className="mx-auto max-w-5xl px-4 py-16 text-center">
        <div className="inline-block animate-spin text-emerald-600">
          <RefreshCw className="h-8 w-8" />
        </div>
        <p className="mt-3 text-sm text-slate-600">{t.common.loading}</p>
      </div>
    );
  }

  const careerTitle = language === 'ta' ? roadmapProgress.careerTitleTa : roadmapProgress.careerTitleEn;

  // Export roadmap as Markdown
  const handleCopyMarkdown = () => {
    let md = `# NIRA 4-Week Starter Roadmap: ${careerTitle}\n\n`;
    md += `Completion Status: ${roadmapProgress.completionPercentage}% (${roadmapProgress.completedWeeksCount}/4 Weeks)\n\n`;

    roadmapProgress.weeks.forEach((w) => {
      const skillName = language === 'ta' ? w.focusSkillNameTa : w.focusSkillNameEn;
      const goal = language === 'ta' ? w.goalTa : w.goalEn;
      const task = language === 'ta' ? w.smallTaskTa : w.smallTaskEn;
      const milestone = language === 'ta' ? w.projectMilestoneTa : w.projectMilestoneEn;

      md += `## Week ${w.weekNumber}: ${skillName} (${w.estimatedHours} hrs)\n`;
      md += `- **Goal**: ${goal}\n`;
      md += `- **Practice Task**: ${task}\n`;
      md += `- **Portfolio Milestone**: ${milestone}\n`;
      md += `- **Checklist**:\n`;
      w.tasks.forEach((t) => {
        const taskTitle = language === 'ta' ? t.titleTa : t.titleEn;
        md += `  - [${t.completed ? 'x' : ' '}] ${taskTitle}\n`;
      });
      md += `\n`;
    });

    navigator.clipboard.writeText(md);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-slate-200 pb-6 dark:border-slate-800">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
            <BookOpen className="h-3.5 w-3.5" />
            <span>{t.roadmap.title}</span>
          </div>
          <h1 className="mt-2 text-2xl sm:text-3xl font-black tracking-tight text-slate-900 dark:text-white">
            {t.roadmap.title}
          </h1>
          <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
            {t.roadmap.forRole} <strong className="text-slate-900 dark:text-white">{careerTitle}</strong>
          </p>
        </div>

        {/* Roadmap Action Tools */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={handleCopyMarkdown}
            className="flex items-center gap-1.5 rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs font-semibold text-slate-700 shadow-2xs hover:border-emerald-500 hover:text-emerald-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 cursor-pointer"
          >
            <Copy className="h-3.5 w-3.5" />
            <span>{copied ? 'Copied Markdown!' : 'Export Plan'}</span>
          </button>

          <button
            type="button"
            onClick={regenerateRoadmap}
            className="flex items-center gap-1.5 rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs font-semibold text-slate-700 shadow-2xs hover:border-indigo-500 hover:text-indigo-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 cursor-pointer"
            title="Regenerate based on your newest skill ratings"
          >
            <RefreshCw className="h-3.5 w-3.5" />
            <span>{t.roadmap.regenerateRoadmap}</span>
          </button>
        </div>
      </div>

      {/* Progress Summary Card */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              {t.roadmap.progressLabel}
            </span>
            <div className="mt-1 flex items-baseline gap-2">
              <span className="text-3xl font-black text-slate-900 dark:text-white">
                {roadmapProgress.completionPercentage}%
              </span>
              <span className="text-xs font-semibold text-slate-500">
                ({roadmapProgress.completedWeeksCount}/4 {t.roadmap.weekLabel}s Completed • {roadmapProgress.completedTasksCount}/{roadmapProgress.totalTasksCount} Tasks)
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={resetRoadmapProgress}
            className="flex items-center gap-1 text-xs text-slate-500 hover:text-rose-600 dark:text-slate-400 dark:hover:text-rose-400 cursor-pointer self-start sm:self-auto"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            <span>{t.roadmap.resetRoadmap}</span>
          </button>
        </div>

        {/* Progress Bar */}
        <div className="mt-4 h-3 w-full rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-emerald-500 via-teal-500 to-indigo-600 rounded-full transition-all duration-500"
            style={{ width: `${roadmapProgress.completionPercentage}%` }}
          />
        </div>
      </div>

      {/* 100% Celebration Banner */}
      {roadmapProgress.completionPercentage === 100 && (
        <div className="rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-700 p-6 text-white shadow-xl flex items-center gap-4 animate-in zoom-in-95 duration-300">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white/20 backdrop-blur-md">
            <Trophy className="h-6 w-6 text-yellow-300" />
          </div>
          <div>
            <h3 className="text-lg font-black">{t.roadmap.celebrationTitle}</h3>
            <p className="mt-1 text-xs text-emerald-100 leading-relaxed">
              {t.roadmap.celebrationDesc}
            </p>
          </div>
        </div>
      )}

      {/* Week by Week Structured Timeline */}
      <div className="space-y-6">
        {roadmapProgress.weeks.map((week) => {
          const isComplete = week.completed;
          const skillName = language === 'ta' ? week.focusSkillNameTa : week.focusSkillNameEn;
          const goal = language === 'ta' ? week.goalTa : week.goalEn;
          const task = language === 'ta' ? week.smallTaskTa : week.smallTaskEn;
          const milestone = language === 'ta' ? week.projectMilestoneTa : week.projectMilestoneEn;

          return (
            <div
              key={week.weekNumber}
              className={`rounded-2xl border p-6 transition-all ${
                isComplete
                  ? 'border-emerald-300 bg-emerald-50/40 dark:border-emerald-900/50 dark:bg-emerald-950/20'
                  : 'border-slate-200 bg-white shadow-xs dark:border-slate-800 dark:bg-slate-900'
              }`}
            >
              {/* Week Header */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-slate-100 pb-4 dark:border-slate-800">
                <div className="flex items-center gap-3">
                  <div
                    className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl font-black text-sm ${
                      isComplete
                        ? 'bg-emerald-600 text-white'
                        : 'bg-indigo-100 text-indigo-800 dark:bg-indigo-950 dark:text-indigo-300'
                    }`}
                  >
                    W{week.weekNumber}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                        {t.roadmap.weekLabel} {week.weekNumber} • {t.roadmap.focusSkill}
                      </span>
                    </div>
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                      {skillName}
                    </h3>
                  </div>
                </div>

                <div className="flex items-center gap-3 self-start sm:self-auto">
                  <span className="flex items-center gap-1 text-xs text-slate-500 font-semibold">
                    <Clock className="h-3.5 w-3.5" />
                    <span>~{week.estimatedHours} {t.roadmap.hoursPerWeek}</span>
                  </span>

                  <button
                    type="button"
                    onClick={() => toggleRoadmapWeek(week.weekNumber)}
                    className={`rounded-lg px-3 py-1.5 text-xs font-bold transition-all cursor-pointer ${
                      isComplete
                        ? 'bg-emerald-600 text-white'
                        : 'border border-slate-300 text-slate-700 hover:border-emerald-500 dark:border-slate-700 dark:text-slate-300'
                    }`}
                  >
                    {isComplete ? `✓ ${t.roadmap.weekCompleted}` : t.roadmap.markWeekComplete}
                  </button>
                </div>
              </div>

              {/* Goal & Milestone Highlight Cards */}
              <div className="mt-5 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="rounded-xl bg-slate-50 p-4 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
                  <div className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-indigo-700 dark:text-indigo-300">
                    <Target className="h-3.5 w-3.5 text-indigo-600" />
                    <span>{t.roadmap.goalLabel}</span>
                  </div>
                  <p className="mt-1.5 text-xs text-slate-700 dark:text-slate-200 leading-relaxed font-medium">
                    {goal}
                  </p>
                </div>

                <div className="rounded-xl bg-amber-50/70 p-4 dark:bg-amber-950/20 border border-amber-100 dark:border-amber-950">
                  <div className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-amber-800 dark:text-amber-300">
                    <FolderGit2 className="h-3.5 w-3.5 text-amber-600" />
                    <span>{t.roadmap.milestoneLabel}</span>
                  </div>
                  <p className="mt-1.5 text-xs text-slate-700 dark:text-slate-200 leading-relaxed font-medium">
                    {milestone}
                  </p>
                </div>
              </div>

              {/* Hands-On Practice Task */}
              <div className="mt-4 rounded-xl border border-emerald-100 bg-emerald-50/50 p-4 dark:border-emerald-950 dark:bg-emerald-950/20">
                <div className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-emerald-800 dark:text-emerald-300">
                  <Zap className="h-3.5 w-3.5 text-emerald-600" />
                  <span>{t.roadmap.taskLabel}</span>
                </div>
                <p className="mt-1.5 text-xs text-slate-800 dark:text-slate-200 leading-relaxed font-medium">
                  {task}
                </p>
              </div>

              {/* Actionable Micro-Task Checkboxes */}
              <div className="mt-5 space-y-2">
                <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  {language === 'ta' ? 'வாராந்திர செய்முறை பணிகள் (Checklist):' : 'Weekly Step-by-Step Checklist:'}
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {week.tasks.map((tItem) => {
                    const taskTitle = language === 'ta' ? tItem.titleTa : tItem.titleEn;
                    return (
                      <button
                        key={tItem.id}
                        type="button"
                        onClick={() => toggleRoadmapTask(week.weekNumber, tItem.id)}
                        className={`flex items-start gap-2.5 rounded-xl border p-3 text-left transition-all cursor-pointer ${
                          tItem.completed
                            ? 'border-emerald-400 bg-emerald-50/80 text-emerald-950 font-medium dark:bg-emerald-950/40 dark:text-emerald-200 dark:border-emerald-800'
                            : 'border-slate-200 bg-slate-50/60 text-slate-700 hover:border-slate-300 dark:border-slate-800 dark:bg-slate-800/40 dark:text-slate-300'
                        }`}
                      >
                        <div
                          className={`mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-md border text-[10px] font-bold ${
                            tItem.completed
                              ? 'border-emerald-600 bg-emerald-600 text-white'
                              : 'border-slate-400 bg-white dark:bg-slate-700'
                          }`}
                        >
                          {tItem.completed && '✓'}
                        </div>
                        <span className={`text-xs ${tItem.completed ? 'line-through text-slate-500 dark:text-slate-400' : ''}`}>
                          {taskTitle}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
