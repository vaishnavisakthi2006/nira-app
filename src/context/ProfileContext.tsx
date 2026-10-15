'use client';

import { DEMO_PROFILES, SEEDED_CAREERS } from '@/data/seedData';
import { generatePersonalizedRoadmap } from '@/lib/roadmapGenerator';
import { calculateSkillGapAnalysis, getCareerRecommendations } from '@/lib/scoring';
import {
  Career,
  CareerRecommendation,
  RoadmapProgress,
  SkillGapAnalysis,
  SkillLevel,
  StudentProfile,
} from '@/types';
import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';

const PROFILE_STORAGE_KEY = 'nira_student_profile_v1';
const ROADMAP_STORAGE_KEY = 'nira_roadmap_progress_v1';

const INITIAL_EMPTY_PROFILE: StudentProfile = {
  id: 'profile_new',
  name: '',
  educationLevel: 'btech_be',
  degreeField: '',
  collegeOrCity: '',
  graduationYear: 2027,
  skills: {},
  careerInterests: ['frontend_developer'],
  preferredLanguage: 'en',
  locationPreference: '',
  targetCareerId: 'frontend_developer',
  updatedAt: new Date().toISOString(),
};

interface ProfileContextType {
  profile: StudentProfile;
  isProfileEmpty: boolean;
  targetCareer: Career | undefined;
  targetCareerId: string;
  setTargetCareerId: (careerId: string) => void;
  updateProfile: (updated: Partial<StudentProfile>) => void;
  updateSkillLevel: (skillId: string, level: SkillLevel) => void;
  batchUpdateSkills: (skills: Record<string, SkillLevel>) => void;
  loadDemoProfile: (demoId: string) => void;
  resetProfile: () => void;
  skillGapAnalysis: SkillGapAnalysis | null;
  careerRecommendations: CareerRecommendation[];
  roadmapProgress: RoadmapProgress | null;
  toggleRoadmapTask: (weekNumber: number, taskId: string) => void;
  toggleRoadmapWeek: (weekNumber: number) => void;
  regenerateRoadmap: () => void;
  resetRoadmapProgress: () => void;
  allCareers: Career[];
}

const ProfileContext = createContext<ProfileContextType | undefined>(undefined);

export function ProfileProvider({ children }: { children: React.ReactNode }) {
  const [profile, setProfile] = useState<StudentProfile>(() => {
    if (typeof window !== 'undefined') {
      try {
        const storedProfile = localStorage.getItem(PROFILE_STORAGE_KEY);
        if (storedProfile) {
          return JSON.parse(storedProfile) as StudentProfile;
        }
      } catch {
        // ignore
      }
    }
    return DEMO_PROFILES[0].profile;
  });

  const targetCareerId = profile.targetCareerId || 'frontend_developer';
  const targetCareer = useMemo(() => {
    return SEEDED_CAREERS.find((c) => c.id === targetCareerId) || SEEDED_CAREERS[0];
  }, [targetCareerId]);

  // Dynamic Skill Gap Analysis for the current target career
  const skillGapAnalysis = useMemo(() => {
    if (!targetCareer) return null;
    return calculateSkillGapAnalysis(targetCareer, profile.skills);
  }, [targetCareer, profile.skills]);

  // Dynamic Career Recommendations
  const careerRecommendations = useMemo(() => {
    return getCareerRecommendations(profile, SEEDED_CAREERS);
  }, [profile]);

  const [roadmapProgress, setRoadmapProgress] = useState<RoadmapProgress | null>(() => {
    if (typeof window !== 'undefined') {
      try {
        const storedRoadmap = localStorage.getItem(ROADMAP_STORAGE_KEY);
        if (storedRoadmap) {
          const parsed = JSON.parse(storedRoadmap) as RoadmapProgress;
          if (parsed.careerId === targetCareer.id) {
            return parsed;
          }
        }
      } catch {
        // ignore
      }
    }
    const gaps = calculateSkillGapAnalysis(targetCareer, profile.skills);
    return generatePersonalizedRoadmap(targetCareer, gaps);
  });

  // Save profile to localStorage whenever it changes
  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(profile));
      } catch (err) {
        console.error('Failed to save profile to localStorage:', err);
      }
    }
  }, [profile]);

  // Save roadmap to localStorage whenever it changes
  useEffect(() => {
    if (typeof window !== 'undefined' && roadmapProgress) {
      try {
        localStorage.setItem(ROADMAP_STORAGE_KEY, JSON.stringify(roadmapProgress));
      } catch (err) {
        console.error('Failed to save roadmap to localStorage:', err);
      }
    }
  }, [roadmapProgress]);

  const isProfileEmpty = useMemo(() => {
    const hasName = Boolean(profile.name && profile.name.trim().length > 0);
    const hasSkills = Object.values(profile.skills || {}).some((lvl) => lvl > 0);
    return !hasName && !hasSkills;
  }, [profile]);

  const setTargetCareerId = (careerId: string) => {
    const career = SEEDED_CAREERS.find((c) => c.id === careerId);
    if (!career) return;

    setProfile((prev) => ({
      ...prev,
      targetCareerId: careerId,
      updatedAt: new Date().toISOString(),
    }));

    // Regenerate roadmap for new target
    const gaps = calculateSkillGapAnalysis(career, profile.skills);
    const newRoadmap = generatePersonalizedRoadmap(career, gaps);
    setRoadmapProgress(newRoadmap);
  };

  const updateProfile = (updated: Partial<StudentProfile>) => {
    setProfile((prev) => ({
      ...prev,
      ...updated,
      updatedAt: new Date().toISOString(),
    }));
  };

  const updateSkillLevel = (skillId: string, level: SkillLevel) => {
    setProfile((prev) => {
      const updatedSkills = { ...prev.skills, [skillId]: level };
      return {
        ...prev,
        skills: updatedSkills,
        updatedAt: new Date().toISOString(),
      };
    });
  };

  const batchUpdateSkills = (newSkills: Record<string, SkillLevel>) => {
    setProfile((prev) => ({
      ...prev,
      skills: { ...prev.skills, ...newSkills },
      updatedAt: new Date().toISOString(),
    }));
  };

  const loadDemoProfile = (demoId: string) => {
    const found = DEMO_PROFILES.find((p) => p.profile.id === demoId || p.profile.name.toLowerCase().includes(demoId.toLowerCase()));
    if (found) {
      setProfile(found.profile);
      const targetC = SEEDED_CAREERS.find((c) => c.id === found.profile.targetCareerId) || SEEDED_CAREERS[0];
      const gaps = calculateSkillGapAnalysis(targetC, found.profile.skills);
      const newRoadmap = generatePersonalizedRoadmap(targetC, gaps);
      setRoadmapProgress(newRoadmap);
    }
  };

  const resetProfile = () => {
    setProfile(INITIAL_EMPTY_PROFILE);
    if (targetCareer) {
      const gaps = calculateSkillGapAnalysis(targetCareer, {});
      setRoadmapProgress(generatePersonalizedRoadmap(targetCareer, gaps));
    }
  };

  const toggleRoadmapTask = (weekNumber: number, taskId: string) => {
    if (!roadmapProgress) return;

    const updatedWeeks = roadmapProgress.weeks.map((w) => {
      if (w.weekNumber !== weekNumber) return w;

      const updatedTasks = w.tasks.map((t) => {
        if (t.id !== taskId) return t;
        return { ...t, completed: !t.completed };
      });

      const isWeekNowComplete = updatedTasks.length > 0 && updatedTasks.every((t) => t.completed);

      return {
        ...w,
        tasks: updatedTasks,
        completed: isWeekNowComplete,
      };
    });

    const totalTasksCount = updatedWeeks.reduce((sum, w) => sum + w.tasks.length, 0);
    const completedTasksCount = updatedWeeks.reduce(
      (sum, w) => sum + w.tasks.filter((t) => t.completed).length,
      0
    );
    const completedWeeksCount = updatedWeeks.filter((w) => w.completed).length;
    const completionPercentage =
      totalTasksCount > 0 ? Math.round((completedTasksCount / totalTasksCount) * 100) : 0;

    setRoadmapProgress({
      ...roadmapProgress,
      weeks: updatedWeeks,
      totalTasksCount,
      completedTasksCount,
      completedWeeksCount,
      completionPercentage,
    });
  };

  const toggleRoadmapWeek = (weekNumber: number) => {
    if (!roadmapProgress) return;

    const targetWeek = roadmapProgress.weeks.find((w) => w.weekNumber === weekNumber);
    if (!targetWeek) return;

    const newCompletedStatus = !targetWeek.completed;

    const updatedWeeks = roadmapProgress.weeks.map((w) => {
      if (w.weekNumber !== weekNumber) return w;

      const updatedTasks = w.tasks.map((t) => ({ ...t, completed: newCompletedStatus }));

      return {
        ...w,
        tasks: updatedTasks,
        completed: newCompletedStatus,
      };
    });

    const totalTasksCount = updatedWeeks.reduce((sum, w) => sum + w.tasks.length, 0);
    const completedTasksCount = updatedWeeks.reduce(
      (sum, w) => sum + w.tasks.filter((t) => t.completed).length,
      0
    );
    const completedWeeksCount = updatedWeeks.filter((w) => w.completed).length;
    const completionPercentage =
      totalTasksCount > 0 ? Math.round((completedTasksCount / totalTasksCount) * 100) : 0;

    setRoadmapProgress({
      ...roadmapProgress,
      weeks: updatedWeeks,
      totalTasksCount,
      completedTasksCount,
      completedWeeksCount,
      completionPercentage,
    });
  };

  const regenerateRoadmap = () => {
    if (!targetCareer || !skillGapAnalysis) return;
    const newRoadmap = generatePersonalizedRoadmap(targetCareer, skillGapAnalysis);
    setRoadmapProgress(newRoadmap);
  };

  const resetRoadmapProgress = () => {
    if (!targetCareer || !skillGapAnalysis) return;
    const fresh = generatePersonalizedRoadmap(targetCareer, skillGapAnalysis);
    const resetWeeks = fresh.weeks.map((w) => ({
      ...w,
      completed: false,
      tasks: w.tasks.map((t) => ({ ...t, completed: false })),
    }));
    setRoadmapProgress({
      ...fresh,
      weeks: resetWeeks,
      completedTasksCount: 0,
      completedWeeksCount: 0,
      completionPercentage: 0,
    });
  };

  return (
    <ProfileContext.Provider
      value={{
        profile,
        isProfileEmpty,
        targetCareer,
        targetCareerId,
        setTargetCareerId,
        updateProfile,
        updateSkillLevel,
        batchUpdateSkills,
        loadDemoProfile,
        resetProfile,
        skillGapAnalysis,
        careerRecommendations,
        roadmapProgress,
        toggleRoadmapTask,
        toggleRoadmapWeek,
        regenerateRoadmap,
        resetRoadmapProgress,
        allCareers: SEEDED_CAREERS,
      }}
    >
      {children}
    </ProfileContext.Provider>
  );
}

export function useProfile() {
  const context = useContext(ProfileContext);
  if (!context) {
    throw new Error('useProfile must be used within a ProfileProvider');
  }
  return context;
}
