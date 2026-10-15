'use client';

import { useLanguage } from '@/context/LanguageContext';
import { useProfile } from '@/context/ProfileContext';
import {
  BarChart2,
  BookOpen,
  Briefcase,
  Compass,
  FileText,
  Globe,
  LayoutDashboard,
  Menu,
  User,
  X,
} from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React, { useState } from 'react';

export function Navbar() {
  const { language, toggleLanguage, t } = useLanguage();
  const { profile, targetCareer, skillGapAnalysis } = useProfile();
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { href: '/', label: t.nav.dashboard, icon: LayoutDashboard },
    { href: '/profile', label: t.nav.profile, icon: User },
    { href: '/careers', label: t.nav.careers, icon: Compass },
    { href: '/skill-gap', label: t.nav.skillGap, icon: BarChart2 },
    { href: '/roadmap', label: t.nav.roadmap, icon: BookOpen },
    { href: '/opportunities', label: t.nav.opportunities, icon: Briefcase },
    { href: '/resume', label: t.nav.resume, icon: FileText },
  ];

  const readinessScore = skillGapAnalysis?.readinessScore ?? 0;
  const targetTitle = language === 'ta' ? targetCareer?.titleTa : targetCareer?.titleEn;

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-200 bg-white/90 backdrop-blur-md dark:border-slate-800 dark:bg-slate-900/90">
      {/* Top micro announcement bar */}
      <div className="bg-gradient-to-r from-emerald-600 via-teal-600 to-indigo-600 px-4 py-1.5 text-center text-xs font-medium text-white shadow-inner">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <span className="flex items-center gap-1.5">
            <span className="inline-block h-2 w-2 rounded-full bg-emerald-300 animate-pulse" />
            <span className="font-semibold tracking-wide uppercase">{t.demoBadge}</span>
            <span className="hidden md:inline text-white/80">• {t.taglineSub}</span>
          </span>
          <span className="text-[11px] font-normal text-white/90 hidden sm:inline">
            100% Explainable • Local Privacy • Bilingual
          </span>
        </div>
      </div>

      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-emerald-600 to-indigo-600 text-white font-black text-xl shadow-md group-hover:scale-105 transition-transform">
            N
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
                {t.appName}
              </span>
              <span className="rounded-md bg-emerald-100 px-1.5 py-0.5 text-[10px] font-bold text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                v1.0
              </span>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 -mt-0.5 line-clamp-1">
              {t.tagline}
            </p>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden xl:flex items-center space-x-1">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400 font-semibold shadow-xs'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-800'
                }`}
              >
                <Icon className={`h-4 w-4 ${isActive ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-400'}`} />
                <span>{link.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Right action tools: Language Switcher & Profile Snapshot */}
        <div className="flex items-center gap-3">
          {/* Active Target Career Pill */}
          {targetCareer && (
            <Link
              href="/skill-gap"
              className="hidden md:flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-medium text-slate-700 hover:border-emerald-300 hover:bg-emerald-50/50 transition-all dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
            >
              <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-ping" />
              <span className="font-semibold text-slate-900 dark:text-white truncate max-w-[140px]">
                {targetTitle}
              </span>
              <span className="rounded-full bg-emerald-600 px-1.5 py-0.5 text-[10px] font-bold text-white">
                {readinessScore}%
              </span>
            </Link>
          )}

          {/* Bilingual Language Switcher Button */}
          <button
            onClick={toggleLanguage}
            className="flex items-center gap-1.5 rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 shadow-xs hover:border-emerald-500 hover:text-emerald-700 transition-all dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:border-emerald-400 cursor-pointer"
            title={`Switch to ${language === 'en' ? 'தமிழ்' : 'English'}`}
            aria-label="Toggle language between English and Tamil"
          >
            <Globe className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
            <span className="font-bold">{t.switchLang}</span>
            <span className="text-[10px] text-slate-400">({language.toUpperCase()})</span>
          </button>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="rounded-lg p-2 text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800 xl:hidden"
            aria-label="Toggle Navigation Menu"
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile navigation drawer */}
      {mobileMenuOpen && (
        <div className="border-b border-slate-200 bg-white px-4 pt-2 pb-4 shadow-lg dark:border-slate-800 dark:bg-slate-900 xl:hidden animate-in slide-in-from-top duration-150">
          <div className="mb-3 rounded-lg bg-slate-50 p-3 dark:bg-slate-800/60">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
                {profile.name || 'Student'} • {targetTitle}
              </span>
              <span className="rounded-full bg-emerald-600 px-2 py-0.5 text-xs font-bold text-white">
                {readinessScore}% Ready
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-1">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300 font-bold'
                      : 'text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800'
                  }`}
                >
                  <Icon className={`h-5 w-5 ${isActive ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-400'}`} />
                  <span>{link.label}</span>
                </Link>
              );
            })}
          </div>
        </div>
      )}
    </header>
  );
}
