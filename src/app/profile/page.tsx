'use client';

import { DEMO_PROFILES, SEEDED_CAREERS, SEEDED_SKILLS } from '@/data/seedData';
import { useLanguage } from '@/context/LanguageContext';
import { useProfile } from '@/context/ProfileContext';
import { SkillLevelSelector } from '@/components/ui/SkillLevelSelector';
import { EducationLevel, SkillLevel } from '@/types';
import {
  CheckCircle2,
  GraduationCap,
  Layers,
  Plus,
  RotateCcw,
  Save,
  User,
  Wrench,
} from 'lucide-react';
import React, { useState } from 'react';

export default function ProfilePage() {
  const { language, t } = useLanguage();
  const { profile, updateProfile, loadDemoProfile, resetProfile } = useProfile();

  const [name, setName] = useState(profile.name);
  const [educationLevel, setEducationLevel] = useState<EducationLevel>(profile.educationLevel);
  const [degreeField, setDegreeField] = useState(profile.degreeField);
  const [collegeOrCity, setCollegeOrCity] = useState(profile.collegeOrCity);
  const [graduationYear, setGraduationYear] = useState(profile.graduationYear);
  const [locationPreference, setLocationPreference] = useState(profile.locationPreference || '');
  const [careerInterests, setCareerInterests] = useState<string[]>(profile.careerInterests || []);
  const [skills, setSkills] = useState<Record<string, SkillLevel>>(profile.skills || {});

  const [customSkillName, setCustomSkillName] = useState('');
  const [customSkillsList, setCustomSkillsList] = useState<{ id: string; name: string }[]>([]);

  const [savedSuccess, setSavedSuccess] = useState(false);
  const [activeCategory, setActiveCategory] = useState<string>('all');

  // Handle Interest toggle
  const toggleInterest = (careerId: string) => {
    if (careerInterests.includes(careerId)) {
      setCareerInterests(careerInterests.filter((id) => id !== careerId));
    } else {
      setCareerInterests([...careerInterests, careerId]);
    }
  };

  // Handle Save
  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile({
      name,
      educationLevel,
      degreeField,
      collegeOrCity,
      graduationYear,
      locationPreference,
      careerInterests,
      skills,
    });
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  // Add custom skill
  const handleAddCustomSkill = () => {
    if (!customSkillName.trim()) return;
    const customId = `custom_${customSkillName.trim().toLowerCase().replace(/[^a-z0-9]/g, '_')}`;
    setSkills((prev) => ({ ...prev, [customId]: 2 }));
    setCustomSkillsList((prev) => [...prev, { id: customId, name: customSkillName.trim() }]);
    setCustomSkillName('');
  };

  const handleReset = () => {
    if (confirm(language === 'ta' ? 'சுயவிவரத்தை முழுமையாக மீட்டமைக்கவா?' : 'Reset profile to blank state?')) {
      resetProfile();
      setName('');
      setDegreeField('');
      setCollegeOrCity('');
      setSkills({});
      setCareerInterests([]);
    }
  };

  // Group skills by category
  const categories = [
    { id: 'all', labelEn: 'All Skills', labelTa: 'அனைத்து திறன்கள்' },
    { id: 'core', labelEn: 'Core Languages', labelTa: 'முதன்மை மொழிகள்' },
    { id: 'frontend', labelEn: 'Frontend Web', labelTa: 'முன்னணி வலை' },
    { id: 'backend', labelEn: 'Backend & DB', labelTa: 'பின்னணி & தரவுத்தளம்' },
    { id: 'data', labelEn: 'Data & Analytics', labelTa: 'தரவு பகுப்பாய்வு' },
    { id: 'ai_ml', labelEn: 'AI & Machine Learning', labelTa: 'செயற்கை நுண்ணறிவு' },
    { id: 'mobile', labelEn: 'Mobile App', labelTa: 'மொபைல் செயலி' },
    { id: 'cloud', labelEn: 'Cloud & DevOps', labelTa: 'கிளவுட் & டெவொப்ஸ்' },
  ];

  const filteredSkills = SEEDED_SKILLS.filter(
    (s) => activeCategory === 'all' || s.category === activeCategory
  );

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-slate-200 pb-6 dark:border-slate-800">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
            <User className="h-3.5 w-3.5" />
            <span>{t.profile.title}</span>
          </div>
          <h1 className="mt-2 text-2xl sm:text-3xl font-black tracking-tight text-slate-900 dark:text-white">
            {t.profile.title}
          </h1>
          <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
            {t.profile.subtitle}
          </p>
        </div>

        {/* Demo profiles switcher */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs text-slate-500 font-medium">
            {t.profile.quickPresetLabel}:
          </span>
          {DEMO_PROFILES.map((dp) => (
            <button
              key={dp.profile.id}
              type="button"
              onClick={() => {
                loadDemoProfile(dp.profile.id);
                setName(dp.profile.name);
                setEducationLevel(dp.profile.educationLevel);
                setDegreeField(dp.profile.degreeField);
                setCollegeOrCity(dp.profile.collegeOrCity);
                setGraduationYear(dp.profile.graduationYear);
                setLocationPreference(dp.profile.locationPreference || '');
                setCareerInterests(dp.profile.careerInterests || []);
                setSkills(dp.profile.skills || {});
              }}
              className="rounded-lg border border-slate-200 bg-white px-2.5 py-1 text-xs font-medium text-slate-700 shadow-2xs hover:border-emerald-500 hover:text-emerald-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 cursor-pointer"
            >
              {dp.profile.name}
            </button>
          ))}
        </div>
      </div>

      {savedSuccess && (
        <div className="mt-6 flex items-center gap-2 rounded-xl bg-emerald-600 p-4 text-white shadow-lg animate-in fade-in duration-200">
          <CheckCircle2 className="h-5 w-5 shrink-0" />
          <span className="text-sm font-semibold">{t.profile.savedSuccess}</span>
        </div>
      )}

      <form onSubmit={handleSave} className="mt-8 space-y-8">
        {/* Section 1: Academic & Background Information */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs dark:border-slate-800 dark:bg-slate-900 space-y-6">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-3 dark:border-slate-800">
            <GraduationCap className="h-5 w-5 text-emerald-600" />
            <h2 className="text-base font-bold text-slate-900 dark:text-white">
              {t.profile.basicInfoTitle}
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                {t.profile.nameLabel} *
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder={t.profile.namePlaceholder}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                {t.profile.educationLevelLabel}
              </label>
              <select
                value={educationLevel}
                onChange={(e) => setEducationLevel(e.target.value as EducationLevel)}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
              >
                <option value="btech_be">B.E / B.Tech</option>
                <option value="bca_bsc">BCA / B.Sc Computer Science / IT</option>
                <option value="diploma">Diploma in Engineering / Poly</option>
                <option value="mca_msc">MCA / M.Sc Computer Science</option>
                <option value="mtech_me">M.Tech / M.E</option>
                <option value="other">Other / Self-Taught</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                {t.profile.degreeLabel}
              </label>
              <input
                type="text"
                value={degreeField}
                onChange={(e) => setDegreeField(e.target.value)}
                placeholder={t.profile.degreePlaceholder}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                {t.profile.collegeCityLabel}
              </label>
              <input
                type="text"
                value={collegeOrCity}
                onChange={(e) => setCollegeOrCity(e.target.value)}
                placeholder={t.profile.collegeCityPlaceholder}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                {t.profile.gradYearLabel}
              </label>
              <select
                value={graduationYear}
                onChange={(e) => setGraduationYear(Number(e.target.value))}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
              >
                {[2024, 2025, 2026, 2027, 2028, 2029, 2030].map((yr) => (
                  <option key={yr} value={yr}>
                    {yr}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                {t.profile.locationPrefLabel}
              </label>
              <input
                type="text"
                value={locationPreference}
                onChange={(e) => setLocationPreference(e.target.value)}
                placeholder={t.profile.locationPrefPlaceholder}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
              />
            </div>
          </div>
        </div>

        {/* Section 2: Career Interests */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs dark:border-slate-800 dark:bg-slate-900 space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-3 dark:border-slate-800">
            <Layers className="h-5 w-5 text-indigo-600" />
            <h2 className="text-base font-bold text-slate-900 dark:text-white">
              {t.profile.interestsTitle}
            </h2>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            {t.profile.interestsHint}
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {SEEDED_CAREERS.map((c) => {
              const isSelected = careerInterests.includes(c.id);
              const title = language === 'ta' ? c.titleTa : c.titleEn;
              return (
                <button
                  type="button"
                  key={c.id}
                  onClick={() => toggleInterest(c.id)}
                  className={`flex items-center justify-between rounded-xl border p-3 text-left transition-all cursor-pointer ${
                    isSelected
                      ? 'border-indigo-600 bg-indigo-50/70 text-indigo-950 font-bold dark:bg-indigo-950/50 dark:text-indigo-200 dark:border-indigo-500 ring-2 ring-indigo-500/20'
                      : 'border-slate-200 bg-slate-50/50 text-slate-700 hover:border-slate-300 dark:border-slate-800 dark:bg-slate-800/40 dark:text-slate-300'
                  }`}
                >
                  <span className="text-xs leading-snug">{title}</span>
                  {isSelected && (
                    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-indigo-600 text-white text-xs">
                      ✓
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Section 3: Self-Assessed Skills Matrix */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs dark:border-slate-800 dark:bg-slate-900 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-b border-slate-100 pb-3 dark:border-slate-800">
            <div className="flex items-center gap-2">
              <Wrench className="h-5 w-5 text-emerald-600" />
              <h2 className="text-base font-bold text-slate-900 dark:text-white">
                {t.profile.skillsTitle}
              </h2>
            </div>
            <span className="text-xs text-slate-400">
              0 = {language === 'ta' ? 'இல்லை' : 'None'} • 4 = {language === 'ta' ? 'மேம்பட்ட நிலை' : 'Advanced'}
            </span>
          </div>

          <p className="text-xs text-slate-500 dark:text-slate-400">
            {t.profile.skillsHint}
          </p>

          {/* Category Filter Pills */}
          <div className="flex flex-wrap gap-1.5 pb-2">
            {categories.map((cat) => (
              <button
                type="button"
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`rounded-lg px-3 py-1 text-xs font-semibold transition-all cursor-pointer ${
                  activeCategory === cat.id
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-400'
                }`}
              >
                {language === 'ta' ? cat.labelTa : cat.labelEn}
              </button>
            ))}
          </div>

          {/* Skills Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredSkills.map((skill) => {
              const currentLevel = (skills[skill.id] ?? 0) as SkillLevel;
              const name = language === 'ta' ? skill.nameTa : skill.nameEn;
              const desc = language === 'ta' ? skill.descriptionTa : skill.descriptionEn;

              return (
                <div
                  key={skill.id}
                  className="rounded-xl border border-slate-200 p-4 dark:border-slate-800 dark:bg-slate-800/40 flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                        {name}
                      </h4>
                      <span className="rounded bg-slate-100 px-1.5 py-0.5 text-[10px] uppercase font-bold text-slate-500 dark:bg-slate-800 dark:text-slate-400">
                        {skill.category}
                      </span>
                    </div>
                    <p className="mt-1 text-[11px] text-slate-500 dark:text-slate-400 line-clamp-2">
                      {desc}
                    </p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800">
                    <SkillLevelSelector
                      level={currentLevel}
                      onChange={(newLevel) => setSkills((prev) => ({ ...prev, [skill.id]: newLevel }))}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          {/* Custom Skills Section */}
          <div className="mt-6 rounded-xl border border-dashed border-slate-300 p-4 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/20">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-2">
              {t.profile.addCustomSkill}
            </h4>
            <div className="flex flex-col sm:flex-row gap-2">
              <input
                type="text"
                value={customSkillName}
                onChange={(e) => setCustomSkillName(e.target.value)}
                placeholder={t.profile.customSkillPlaceholder}
                className="flex-1 rounded-lg border border-slate-300 px-3 py-1.5 text-xs focus:border-emerald-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
              />
              <button
                type="button"
                onClick={handleAddCustomSkill}
                className="rounded-lg bg-slate-800 px-4 py-1.5 text-xs font-bold text-white hover:bg-slate-900 dark:bg-slate-700 dark:hover:bg-slate-600 flex items-center justify-center gap-1 cursor-pointer"
              >
                <Plus className="h-3.5 w-3.5" />
                <span>Add</span>
              </button>
            </div>

            {customSkillsList.length > 0 && (
              <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-3">
                {customSkillsList.map((cs) => (
                  <div key={cs.id} className="rounded-lg border border-slate-200 bg-white p-3 dark:border-slate-700 dark:bg-slate-800">
                    <div className="font-bold text-xs text-slate-900 dark:text-white mb-2">{cs.name}</div>
                    <SkillLevelSelector
                      level={(skills[cs.id] ?? 2) as SkillLevel}
                      onChange={(lvl) => setSkills((prev) => ({ ...prev, [cs.id]: lvl }))}
                    />
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4">
          <button
            type="button"
            onClick={handleReset}
            className="flex items-center gap-2 text-xs font-semibold text-rose-600 hover:text-rose-700 dark:text-rose-400 cursor-pointer"
          >
            <RotateCcw className="h-4 w-4" />
            <span>{t.profile.resetProfile}</span>
          </button>

          <button
            type="submit"
            className="w-full sm:w-auto flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-8 py-3 text-sm font-bold text-white shadow-md hover:bg-emerald-700 hover:shadow-lg transition-all cursor-pointer"
          >
            <Save className="h-4 w-4" />
            <span>{t.profile.saveProfile}</span>
          </button>
        </div>
      </form>
    </div>
  );
}
