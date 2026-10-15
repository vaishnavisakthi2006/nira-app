import { describe, expect, it } from 'vitest';
import { SEEDED_CAREERS } from '@/data/seedData';
import { calculateSkillGapAnalysis, getCareerRecommendations } from '@/lib/scoring';
import { Career, SkillLevel, StudentProfile } from '@/types';

describe('Scoring Engine & Skill-Gap Analysis', () => {
  const sampleCareer: Career = {
    id: 'test_role',
    titleEn: 'Test Software Role',
    titleTa: 'மாதிரி மென்பொருள் பணி',
    categoryEn: 'Engineering',
    categoryTa: 'பொறியியல்',
    iconName: 'Code',
    descriptionEn: 'Test role description',
    descriptionTa: 'மாதிரி விளக்கம்',
    marketContextEn: 'Market Context',
    marketContextTa: 'சந்தை சூழல்',
    typicalRolesEn: ['Junior Dev'],
    typicalRolesTa: ['இளநிலை டெவலப்பர்'],
    beginnerProject: {
      titleEn: 'Starter Project',
      titleTa: 'தொடக்க திட்டம்',
      descriptionEn: 'Project desc',
      descriptionTa: 'திட்ட விளக்கம்',
      deliverablesEn: ['Deliverable 1'],
      deliverablesTa: ['வெளியீடு 1'],
      estimatedWeeks: 3,
    },
    requiredSkills: [
      {
        skillId: 'javascript',
        skillNameEn: 'JavaScript',
        skillNameTa: 'ஜாவாஸ்கிரிப்ட்',
        requiredLevel: 2,
        weight: 3,
        category: 'core',
        reasonEn: 'Core language',
        reasonTa: 'முதன்மை மொழி',
      },
      {
        skillId: 'react',
        skillNameEn: 'React',
        skillNameTa: 'ரியாக்ட்',
        requiredLevel: 3,
        weight: 5,
        category: 'frontend',
        reasonEn: 'UI Framework',
        reasonTa: 'UI கட்டமைப்பு',
      },
      {
        skillId: 'sql_databases',
        skillNameEn: 'SQL',
        skillNameTa: 'SQL',
        requiredLevel: 2,
        weight: 2,
        category: 'backend',
        reasonEn: 'DB Querying',
        reasonTa: 'தரவுத்தளம்',
      },
    ],
  };

  it('calculates 0% readiness when student has 0 skills', () => {
    const analysis = calculateSkillGapAnalysis(sampleCareer, {});
    expect(analysis.readinessScore).toBe(0);
    expect(analysis.metCount).toBe(0);
    expect(analysis.partlyMetCount).toBe(0);
    expect(analysis.toDevelopCount).toBe(3);
    expect(analysis.totalWeight).toBe(10); // 3 + 5 + 2
    expect(analysis.weightedSum).toBe(0);
  });

  it('calculates 100% readiness when student meets or exceeds all required levels', () => {
    const studentSkills: Record<string, SkillLevel> = {
      javascript: 2, // 2/2 = 1.0 -> 3 pts
      react: 3,      // 3/3 = 1.0 -> 5 pts
      sql_databases: 2, // 2/2 = 1.0 -> 2 pts
    };
    const analysis = calculateSkillGapAnalysis(sampleCareer, studentSkills);
    expect(analysis.readinessScore).toBe(100);
    expect(analysis.metCount).toBe(3);
    expect(analysis.partlyMetCount).toBe(0);
    expect(analysis.toDevelopCount).toBe(0);
    expect(analysis.weightedSum).toBe(10);
  });

  it('caps skill contribution ratio at 1.0 even if student level is higher than required', () => {
    const studentSkills: Record<string, SkillLevel> = {
      javascript: 4, // 4/2 capped at 1.0 -> 3 pts
      react: 4,      // 4/3 capped at 1.0 -> 5 pts
      sql_databases: 4, // 4/2 capped at 1.0 -> 2 pts
    };
    const analysis = calculateSkillGapAnalysis(sampleCareer, studentSkills);
    expect(analysis.readinessScore).toBe(100);
    expect(analysis.weightedSum).toBe(10);
  });

  it('accurately computes partial weighted scores', () => {
    // Total weights = 3 + 5 + 2 = 10
    // JS: level 1 / req 2 = 0.5 * 3 = 1.5
    // React: level 0 / req 3 = 0.0 * 5 = 0
    // SQL: level 2 / req 2 = 1.0 * 2 = 2.0
    // Weighted sum = 1.5 + 0 + 2.0 = 3.5
    // Score = (3.5 / 10) * 100 = 35%
    const studentSkills: Record<string, SkillLevel> = {
      javascript: 1,
      react: 0,
      sql_databases: 2,
    };
    const analysis = calculateSkillGapAnalysis(sampleCareer, studentSkills);
    expect(analysis.readinessScore).toBe(35);
    expect(analysis.weightedSum).toBe(3.5);
    expect(analysis.metCount).toBe(1); // SQL
    expect(analysis.partlyMetCount).toBe(1); // JS
    expect(analysis.toDevelopCount).toBe(1); // React
  });

  it('ranks career recommendations based on skill fit and stated interests', () => {
    const profile: StudentProfile = {
      id: 'test_user',
      name: 'Test Student',
      educationLevel: 'btech_be',
      degreeField: 'CS',
      collegeOrCity: 'Chennai',
      graduationYear: 2026,
      preferredLanguage: 'en',
      careerInterests: ['data_analyst'],
      skills: {
        sql_databases: 3,
        data_viz: 3,
        excel_advanced: 3,
        pandas_numpy: 2,
      },
      updatedAt: new Date().toISOString(),
    };

    const recommendations = getCareerRecommendations(profile, SEEDED_CAREERS);
    expect(recommendations.length).toBe(SEEDED_CAREERS.length);

    // Data Analyst should be the top recommended role
    const topRec = recommendations[0];
    expect(topRec.career.id).toBe('data_analyst');
    expect(topRec.readinessScore).toBeGreaterThan(60);
    expect(topRec.matchReasonsEn.length).toBeGreaterThan(0);
  });
});
