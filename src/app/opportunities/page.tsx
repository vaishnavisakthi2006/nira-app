'use client';

import { SEEDED_CAREERS, SEEDED_OPPORTUNITIES } from '@/data/seedData';
import { useLanguage } from '@/context/LanguageContext';
import { useProfile } from '@/context/ProfileContext';
import { matchOpportunitiesForStudent } from '@/lib/opportunityMatcher';
import { Opportunity, OpportunityType } from '@/types';
import {
  AlertCircle,
  Briefcase,
  ExternalLink,
  Search,
  X,
} from 'lucide-react';
import React, { useMemo, useState } from 'react';

export default function OpportunitiesPage() {
  const { language, t } = useLanguage();
  const { profile } = useProfile();

  const [selectedType, setSelectedType] = useState<OpportunityType | 'all'>('all');
  const [selectedRole, setSelectedRole] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeModalOpp, setActiveModalOpp] = useState<Opportunity | null>(null);

  const filteredOpportunities = useMemo(() => {
    return matchOpportunitiesForStudent(
      profile,
      {
        type: selectedType,
        targetRole: selectedRole,
        searchQuery,
      },
      SEEDED_OPPORTUNITIES
    );
  }, [profile, selectedType, selectedRole, searchQuery]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-8">
      {/* Header */}
      <div className="border-b border-slate-200 pb-6 dark:border-slate-800">
        <div className="inline-flex items-center gap-2 rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-800 dark:bg-amber-950 dark:text-amber-300">
          <Briefcase className="h-3.5 w-3.5" />
          <span>{t.opportunities.title}</span>
        </div>
        <h1 className="mt-2 text-2xl sm:text-3xl font-black tracking-tight text-slate-900 dark:text-white">
          {t.opportunities.title}
        </h1>
        <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
          {t.opportunities.subtitle}
        </p>

        {/* Prominent Demo Notice Banner */}
        <div className="mt-4 flex items-start gap-2.5 rounded-xl bg-amber-50/80 p-3.5 text-xs text-amber-900 dark:bg-amber-950/30 dark:text-amber-200 border border-amber-200 dark:border-amber-900">
          <AlertCircle className="h-4 w-4 shrink-0 text-amber-600 dark:text-amber-400 mt-0.5" />
          <div>
            <span className="font-bold">DEMO DATA NOTICE: </span>
            <span>{t.opportunities.demoNotice}</span>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs dark:border-slate-800 dark:bg-slate-900 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {/* Search Box */}
          <div className="relative md:col-span-1">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t.opportunities.searchPlaceholder}
              className="w-full rounded-xl border border-slate-300 pl-9 pr-3 py-2 text-xs focus:border-emerald-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
            />
          </div>

          {/* Role Filter */}
          <div className="flex items-center gap-2">
            <label className="text-xs font-bold text-slate-500 whitespace-nowrap">
              Role:
            </label>
            <select
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value)}
              className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs font-semibold text-slate-800 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
            >
              <option value="all">{language === 'ta' ? 'அனைத்து பணிகள்' : 'All Target Roles'}</option>
              {SEEDED_CAREERS.map((c) => (
                <option key={c.id} value={c.id}>
                  {language === 'ta' ? c.titleTa : c.titleEn}
                </option>
              ))}
            </select>
          </div>

          {/* Type Filter Tabs */}
          <div className="flex items-center gap-1 overflow-x-auto pb-1 md:pb-0">
            <button
              onClick={() => setSelectedType('all')}
              className={`rounded-lg px-2.5 py-1.5 text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                selectedType === 'all'
                  ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300'
              }`}
            >
              {t.opportunities.allTypes}
            </button>
            <button
              onClick={() => setSelectedType('internship')}
              className={`rounded-lg px-2.5 py-1.5 text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                selectedType === 'internship'
                  ? 'bg-emerald-600 text-white'
                  : 'bg-emerald-50 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300'
              }`}
            >
              {t.opportunities.types.internship}
            </button>
            <button
              onClick={() => setSelectedType('course')}
              className={`rounded-lg px-2.5 py-1.5 text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                selectedType === 'course'
                  ? 'bg-indigo-600 text-white'
                  : 'bg-indigo-50 text-indigo-800 dark:bg-indigo-950/40 dark:text-indigo-300'
              }`}
            >
              {t.opportunities.types.course}
            </button>
            <button
              onClick={() => setSelectedType('competition')}
              className={`rounded-lg px-2.5 py-1.5 text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                selectedType === 'competition'
                  ? 'bg-amber-600 text-white'
                  : 'bg-amber-50 text-amber-800 dark:bg-amber-950/40 dark:text-amber-300'
              }`}
            >
              {t.opportunities.types.competition}
            </button>
            <button
              onClick={() => setSelectedType('opensource')}
              className={`rounded-lg px-2.5 py-1.5 text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                selectedType === 'opensource'
                  ? 'bg-purple-600 text-white'
                  : 'bg-purple-50 text-purple-800 dark:bg-purple-950/40 dark:text-purple-300'
              }`}
            >
              FOSS
            </button>
          </div>
        </div>
      </div>

      {/* Opportunities List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredOpportunities.length > 0 ? (
          filteredOpportunities.map((opp) => {
            const title = language === 'ta' ? opp.titleTa : opp.titleEn;
            const org = language === 'ta' ? opp.organizationTa : opp.organizationEn;
            const eligibility = language === 'ta' ? opp.eligibilityTa : opp.eligibilityEn;
            const stipend = language === 'ta' ? opp.stipendOrBenefitTa : opp.stipendOrBenefitEn;
            const location = language === 'ta' ? opp.locationTa : opp.locationEn;
            const matchReason = language === 'ta' ? opp.matchReasonTa : opp.matchReasonEn;

            let badgeBg = 'bg-slate-100 text-slate-700';
            if (opp.type === 'internship') badgeBg = 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300';
            if (opp.type === 'course') badgeBg = 'bg-indigo-100 text-indigo-800 dark:bg-indigo-950 dark:text-indigo-300';
            if (opp.type === 'competition') badgeBg = 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300';
            if (opp.type === 'opensource') badgeBg = 'bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300';

            return (
              <div
                key={opp.id}
                className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs hover:shadow-md transition-all flex flex-col justify-between dark:border-slate-800 dark:bg-slate-900"
              >
                <div>
                  {/* Top tags */}
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex flex-wrap items-center gap-1.5">
                      <span className={`rounded-md px-2 py-0.5 text-[10px] font-bold uppercase ${badgeBg}`}>
                        {opp.type}
                      </span>
                      <span className="rounded-md bg-rose-100 px-1.5 py-0.5 text-[9px] font-black text-rose-800 dark:bg-rose-950 dark:text-rose-300 uppercase">
                        DEMO DATA
                      </span>
                      <span className="rounded-md bg-slate-100 px-1.5 py-0.5 text-[10px] font-medium text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                        {opp.mode}
                      </span>
                    </div>

                    <div className="flex flex-col items-end">
                      <span className="rounded-full bg-emerald-600 px-2.5 py-0.5 text-xs font-black text-white">
                        {opp.matchScore}%
                      </span>
                      <span className="text-[9px] font-bold uppercase text-slate-400 mt-0.5">
                        {t.opportunities.matchScore}
                      </span>
                    </div>
                  </div>

                  <h3 className="mt-3 text-base font-bold text-slate-900 dark:text-white">
                    {title}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    🏢 {org} • 📍 {location}
                  </p>

                  {/* Why matched explanation */}
                  <div className="mt-3 rounded-xl bg-slate-50 p-3 text-xs text-slate-700 dark:bg-slate-800/60 dark:text-slate-300 border border-slate-100 dark:border-slate-800">
                    <div className="font-bold text-emerald-700 dark:text-emerald-400 mb-0.5">
                      💡 {t.opportunities.whyMatched}
                    </div>
                    <p className="leading-relaxed text-[11px]">{matchReason}</p>
                  </div>

                  {/* Eligibility & Benefit details */}
                  <div className="mt-3 space-y-1.5 text-xs text-slate-600 dark:text-slate-400">
                    <div>
                      <strong className="text-slate-800 dark:text-slate-200">
                        {t.opportunities.eligibility}{' '}
                      </strong>
                      <span>{eligibility}</span>
                    </div>
                    <div>
                      <strong className="text-slate-800 dark:text-slate-200">
                        {t.opportunities.benefits}{' '}
                      </strong>
                      <span className="text-emerald-600 dark:text-emerald-400 font-semibold">
                        {stipend}
                      </span>
                    </div>
                  </div>

                  {/* Tags */}
                  <div className="mt-3 flex flex-wrap gap-1">
                    {opp.tags.map((tag, i) => (
                      <span
                        key={i}
                        className="rounded bg-slate-100 px-2 py-0.5 text-[10px] text-slate-600 dark:bg-slate-800 dark:text-slate-300 font-medium"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Card footer CTA */}
                <div className="mt-5 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                  <span className="text-[10px] text-slate-400">
                    Required: Level {opp.requiredSkillLevel}+
                  </span>
                  <button
                    type="button"
                    onClick={() => setActiveModalOpp(opp)}
                    className="flex items-center gap-1 rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-bold text-white hover:bg-emerald-700 shadow-2xs cursor-pointer"
                  >
                    <span>{t.opportunities.viewDetails}</span>
                    <ExternalLink className="h-3 w-3" />
                  </button>
                </div>
              </div>
            );
          })
        ) : (
          <div className="col-span-2 rounded-2xl border border-dashed border-slate-300 p-12 text-center dark:border-slate-800">
            <Briefcase className="h-8 w-8 text-slate-400 mx-auto mb-2" />
            <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">
              No demo opportunities match the selected filters.
            </p>
            <button
              onClick={() => {
                setSelectedType('all');
                setSelectedRole('all');
                setSearchQuery('');
              }}
              className="mt-3 text-xs font-bold text-emerald-600 hover:underline cursor-pointer"
            >
              Reset Filters
            </button>
          </div>
        )}
      </div>

      {/* Demo Notice Modal */}
      {activeModalOpp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="relative w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
            <button
              onClick={() => setActiveModalOpp(null)}
              className="absolute top-4 right-4 rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="flex items-center gap-2">
              <span className="rounded-md bg-rose-100 px-2 py-0.5 text-[10px] font-black text-rose-800 dark:bg-rose-950 dark:text-rose-300">
                [DEMO OPPORTUNITY]
              </span>
            </div>

            <h3 className="mt-2 text-lg font-bold text-slate-900 dark:text-white">
              {language === 'ta' ? activeModalOpp.titleTa : activeModalOpp.titleEn}
            </h3>
            <p className="text-xs text-slate-500">
              {language === 'ta' ? activeModalOpp.organizationTa : activeModalOpp.organizationEn}
            </p>

            <div className="mt-4 rounded-xl bg-amber-50 p-4 text-xs text-amber-900 dark:bg-amber-950/40 dark:text-amber-200 border border-amber-200 dark:border-amber-900">
              <div className="font-bold mb-1">{t.opportunities.demoModalTitle}</div>
              <p className="leading-relaxed">{t.opportunities.demoModalBody}</p>
            </div>

            <div className="mt-4 space-y-2 text-xs text-slate-700 dark:text-slate-300">
              <div>
                <strong>Eligibility:</strong>{' '}
                {language === 'ta' ? activeModalOpp.eligibilityTa : activeModalOpp.eligibilityEn}
              </div>
              <div>
                <strong>Stipend / Award:</strong>{' '}
                {language === 'ta' ? activeModalOpp.stipendOrBenefitTa : activeModalOpp.stipendOrBenefitEn}
              </div>
              <div>
                <strong>Match Rationale:</strong>{' '}
                {language === 'ta' ? activeModalOpp.matchReasonTa : activeModalOpp.matchReasonEn}
              </div>
            </div>

            <div className="mt-6 flex justify-end">
              <button
                onClick={() => setActiveModalOpp(null)}
                className="rounded-lg bg-emerald-600 px-5 py-2 text-xs font-bold text-white hover:bg-emerald-700 cursor-pointer"
              >
                {t.opportunities.closeModal}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
