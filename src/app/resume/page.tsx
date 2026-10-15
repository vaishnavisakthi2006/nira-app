'use client';

import { SEEDED_CAREERS } from '@/data/seedData';
import { useLanguage } from '@/context/LanguageContext';
import { useProfile } from '@/context/ProfileContext';
import { analyzeResumeText } from '@/lib/resumeAnalyzer';
import { ResumeAnalysisResult } from '@/types';
import {
  AlertCircle,
  CheckCircle,
  FileText,
  Lightbulb,
  RefreshCw,
  Search,
  ShieldCheck,
  Trash2,
  Upload,
} from 'lucide-react';
import React, { useState } from 'react';

const SAMPLE_STUDENT_RESUME = `ANANYA S.
Chennai, Tamil Nadu • github.com/ananya-dev • linkedin.com/in/ananya-demo

EDUCATION
Anna University, Chennai — B.Tech in Information Technology (2023 - 2027) | CGPA: 8.7/10

TECHNICAL SKILLS
Languages: JavaScript (ES6+), Python, TypeScript, HTML5, CSS3, C++
Frameworks & Libraries: React.js, Tailwind CSS, Express, Node.js
Databases & Tools: PostgreSQL, Git, GitHub, VS Code, Postman

PROJECTS
1. Student Study Hub & Revision Planner (React, JavaScript, Tailwind CSS)
- Developed an interactive responsive web application with React and Tailwind CSS for 200+ batchmates to manage study schedules.
- Integrated localStorage state management and public REST API for daily quiz questions.
- Built reusable modular UI components and deployed live on GitHub Pages.

2. College Event QR Ticket Validation System (Node.js, PostgreSQL, REST APIs)
- Engineered backend REST API endpoints for attendee ticketing and QR check-ins.
- Implemented JWT authentication and schema validation using PostgreSQL tables.
- Wrote Postman API collections and unit tests with Vitest.

COURSEWORK & CERTIFICATIONS
Data Structures & Algorithms, Object-Oriented Programming, Database Management Systems.`;

export default function ResumePage() {
  const { language, t } = useLanguage();
  const { targetCareerId } = useProfile();

  const [resumeText, setResumeText] = useState('');
  const [selectedRole, setSelectedRole] = useState(targetCareerId || 'frontend_developer');
  const [analysisResult, setAnalysisResult] = useState<ResumeAnalysisResult | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  // Paste sample resume
  const handleLoadSample = () => {
    setResumeText(SAMPLE_STUDENT_RESUME);
    const result = analyzeResumeText(SAMPLE_STUDENT_RESUME, selectedRole);
    setAnalysisResult(result);
  };

  // Analyze pasted text
  const handleAnalyze = (e: React.FormEvent) => {
    e.preventDefault();
    if (!resumeText.trim()) return;
    setIsAnalyzing(true);
    setTimeout(() => {
      const result = analyzeResumeText(resumeText, selectedRole);
      setAnalysisResult(result);
      setIsAnalyzing(false);
    }, 300);
  };

  // Upload .txt file
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      if (content) {
        setResumeText(content);
        const result = analyzeResumeText(content, selectedRole);
        setAnalysisResult(result);
      }
    };
    reader.readAsText(file);
  };

  // Clear everything cleanly
  const handleClear = () => {
    setResumeText('');
    setAnalysisResult(null);
  };

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8 space-y-8">
      {/* Header */}
      <div className="border-b border-slate-200 pb-6 dark:border-slate-800">
        <div className="inline-flex items-center gap-2 rounded-full bg-purple-100 px-3 py-1 text-xs font-semibold text-purple-800 dark:bg-purple-950 dark:text-purple-300">
          <FileText className="h-3.5 w-3.5" />
          <span>{t.resume.title}</span>
        </div>
        <h1 className="mt-2 text-2xl sm:text-3xl font-black tracking-tight text-slate-900 dark:text-white">
          {t.resume.title}
        </h1>
        <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
          {t.resume.subtitle}
        </p>

        {/* Privacy Guarantee Banner */}
        <div className="mt-4 flex items-start gap-2.5 rounded-xl bg-emerald-50/70 p-3.5 text-xs text-emerald-900 dark:bg-emerald-950/30 dark:text-emerald-200 border border-emerald-200 dark:border-emerald-900">
          <ShieldCheck className="h-4 w-4 shrink-0 text-emerald-600 dark:text-emerald-400 mt-0.5" />
          <span>{t.resume.privacyGuarantee}</span>
        </div>
      </div>

      {/* Input Section */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs dark:border-slate-800 dark:bg-slate-900 space-y-4">
        {/* Controls header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div className="flex items-center gap-2">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
              {t.resume.targetRoleLabel}
            </label>
            <select
              value={selectedRole}
              onChange={(e) => {
                setSelectedRole(e.target.value);
                if (resumeText.trim()) {
                  setAnalysisResult(analyzeResumeText(resumeText, e.target.value));
                }
              }}
              className="rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs font-bold text-slate-900 shadow-2xs dark:border-slate-700 dark:bg-slate-800 dark:text-white cursor-pointer"
            >
              {SEEDED_CAREERS.map((c) => (
                <option key={c.id} value={c.id}>
                  {language === 'ta' ? c.titleTa : c.titleEn}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleLoadSample}
              className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 cursor-pointer"
            >
              {t.resume.loadSampleResume}
            </button>

            <label className="flex items-center gap-1 rounded-lg border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 cursor-pointer">
              <Upload className="h-3 w-3" />
              <span>.txt File</span>
              <input
                type="file"
                accept=".txt"
                onChange={handleFileUpload}
                className="hidden"
              />
            </label>
          </div>
        </div>

        {/* Text Area */}
        <form onSubmit={handleAnalyze} className="space-y-4">
          <textarea
            rows={8}
            value={resumeText}
            onChange={(e) => setResumeText(e.target.value)}
            placeholder={t.resume.pastePlaceholder}
            className="w-full rounded-xl border border-slate-300 p-4 font-mono text-xs leading-relaxed focus:border-emerald-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
          />

          <div className="flex flex-wrap items-center justify-between gap-3">
            {resumeText && (
              <button
                type="button"
                onClick={handleClear}
                className="flex items-center gap-1.5 text-xs font-semibold text-rose-600 hover:text-rose-700 dark:text-rose-400 cursor-pointer"
              >
                <Trash2 className="h-4 w-4" />
                <span>{t.resume.clearBtn}</span>
              </button>
            )}

            <button
              type="submit"
              disabled={!resumeText.trim() || isAnalyzing}
              className="ml-auto flex items-center gap-2 rounded-xl bg-purple-600 px-6 py-2.5 text-xs font-bold text-white shadow-md hover:bg-purple-700 disabled:opacity-50 cursor-pointer"
            >
              {isAnalyzing ? (
                <>
                  <RefreshCw className="h-4 w-4 animate-spin" />
                  <span>Analyzing...</span>
                </>
              ) : (
                <>
                  <Search className="h-4 w-4" />
                  <span>{t.resume.analyzeBtn}</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Analysis Results Display */}
      {analysisResult && (
        <div className="space-y-6 animate-in fade-in duration-200">
          {/* Top Score Banner */}
          <div className="rounded-2xl border border-purple-200 bg-gradient-to-r from-purple-50 via-white to-indigo-50 p-6 dark:border-purple-900/50 dark:from-purple-950/40 dark:via-slate-900 dark:to-indigo-950/40 shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-purple-700 dark:text-purple-300">
                  {t.resume.resultsTitle}
                </span>
                <h3 className="mt-1 text-xl font-bold text-slate-900 dark:text-white">
                  Target Role: {analysisResult.targetCareerTitleEn}
                </h3>
                <p className="mt-1 text-xs text-slate-600 dark:text-slate-300">
                  Detected {analysisResult.detectedSkills.length} total technical skills in text • Matched{' '}
                  {analysisResult.matchedRequiredSkills.length} of{' '}
                  {analysisResult.matchedRequiredSkills.length + analysisResult.missingRequiredSkills.length} role requirements
                </p>
              </div>

              <div className="flex flex-col items-center sm:items-end">
                <div className="text-3xl font-black text-purple-700 dark:text-purple-300">
                  {analysisResult.coveragePercentage}%
                </div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  {t.resume.coverageScore}
                </span>
              </div>
            </div>
          </div>

          {/* Grid: Detected vs Missing Skills */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Matched Required Skills */}
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs dark:border-slate-800 dark:bg-slate-900 space-y-4">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400 border-b border-slate-100 pb-2 dark:border-slate-800">
                <CheckCircle className="h-4 w-4" />
                <span>{t.resume.matchedReqTitle} ({analysisResult.matchedRequiredSkills.length})</span>
              </div>

              <div className="space-y-2">
                {analysisResult.matchedRequiredSkills.map((req) => {
                  const detected = analysisResult.detectedSkills.find((d) => d.skillId === req.skillId);
                  return (
                    <div
                      key={req.skillId}
                      className="rounded-xl bg-emerald-50/70 p-3 dark:bg-emerald-950/30 border border-emerald-100 dark:border-emerald-900/40 text-xs"
                    >
                      <div className="flex items-center justify-between font-bold text-emerald-900 dark:text-emerald-200">
                        <span>{language === 'ta' ? req.skillNameTa : req.skillNameEn}</span>
                        <span className="rounded-md bg-emerald-600 px-1.5 py-0.5 text-[10px] text-white">
                          Req: Lvl {req.requiredLevel}
                        </span>
                      </div>
                      {detected && (
                        <p className="mt-1 font-mono text-[11px] text-slate-600 dark:text-slate-400">
                          Matched keyword: <span className="font-bold text-emerald-700">"{detected.foundKeyword}"</span>
                        </p>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Missing Required Skills */}
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs dark:border-slate-800 dark:bg-slate-900 space-y-4">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-amber-700 dark:text-amber-400 border-b border-slate-100 pb-2 dark:border-slate-800">
                <AlertCircle className="h-4 w-4" />
                <span>{t.resume.missingReqTitle} ({analysisResult.missingRequiredSkills.length})</span>
              </div>

              <div className="space-y-2">
                {analysisResult.missingRequiredSkills.length > 0 ? (
                  analysisResult.missingRequiredSkills.map((req) => (
                    <div
                      key={req.skillId}
                      className="rounded-xl bg-amber-50/70 p-3 dark:bg-amber-950/30 border border-amber-100 dark:border-amber-900/40 text-xs"
                    >
                      <div className="flex items-center justify-between font-bold text-amber-900 dark:text-amber-200">
                        <span>{language === 'ta' ? req.skillNameTa : req.skillNameEn}</span>
                        <span className="text-[10px] font-semibold text-amber-700 dark:text-amber-300">
                          Importance Weight: {req.weight}×
                        </span>
                      </div>
                      <p className="mt-1 text-[11px] text-slate-600 dark:text-slate-400">
                        {language === 'ta' ? req.reasonTa : req.reasonEn}
                      </p>
                    </div>
                  ))
                ) : (
                  <div className="rounded-xl bg-emerald-50 p-4 text-center text-xs text-emerald-800">
                    🎉 Excellent! All required skills are explicitly mentioned in your text.
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Actionable Improvement Suggestions */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs dark:border-slate-800 dark:bg-slate-900 space-y-3">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white border-b border-slate-100 pb-2 dark:border-slate-800">
              <Lightbulb className="h-4 w-4 text-amber-500" />
              <span>{t.resume.suggestionsTitle}</span>
            </div>

            <div className="space-y-2.5">
              {(language === 'ta'
                ? analysisResult.improvementSuggestionsTa
                : analysisResult.improvementSuggestionsEn
              ).map((sug, sIdx) => (
                <div
                  key={sIdx}
                  className="flex items-start gap-2.5 rounded-xl bg-slate-50 p-3 text-xs text-slate-700 dark:bg-slate-800/60 dark:text-slate-300 border border-slate-100 dark:border-slate-800"
                >
                  <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-indigo-100 text-indigo-700 text-[10px] font-bold dark:bg-indigo-950 dark:text-indigo-300">
                    {sIdx + 1}
                  </span>
                  <p className="leading-relaxed">{sug}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
