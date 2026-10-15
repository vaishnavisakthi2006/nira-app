import { describe, expect, it } from 'vitest';
import { SEEDED_OPPORTUNITIES } from '@/data/seedData';
import { matchOpportunitiesForStudent } from '@/lib/opportunityMatcher';
import { StudentProfile } from '@/types';

describe('Opportunity Matching Engine', () => {
  const sampleProfile: StudentProfile = {
    id: 'test_opp_student',
    name: 'Ananya',
    educationLevel: 'btech_be',
    degreeField: 'IT',
    collegeOrCity: 'Chennai',
    graduationYear: 2027,
    preferredLanguage: 'en',
    targetCareerId: 'frontend_developer',
    careerInterests: ['frontend_developer'],
    skills: {
      react: 2,
      javascript: 3,
      html_css: 3,
    },
    updatedAt: new Date().toISOString(),
  };

  it('matches target career opportunities with higher scores and transparent reasons', () => {
    const matches = matchOpportunitiesForStudent(sampleProfile, {}, SEEDED_OPPORTUNITIES);
    expect(matches.length).toBeGreaterThan(0);

    // Top match should be a frontend role
    const topMatch = matches[0];
    expect(topMatch.targetRoles).toContain('frontend_developer');
    expect(topMatch.matchScore).toBeGreaterThanOrEqual(70);
    expect(topMatch.matchReasonEn).toBeDefined();
    expect(topMatch.matchReasonTa).toBeDefined();
    expect(topMatch.isDemoData).toBe(true);
  });

  it('correctly filters by opportunity type', () => {
    const internshipMatches = matchOpportunitiesForStudent(
      sampleProfile,
      { type: 'internship' },
      SEEDED_OPPORTUNITIES
    );
    expect(internshipMatches.length).toBeGreaterThan(0);
    expect(internshipMatches.every((m) => m.type === 'internship')).toBe(true);

    const courseMatches = matchOpportunitiesForStudent(
      sampleProfile,
      { type: 'course' },
      SEEDED_OPPORTUNITIES
    );
    expect(courseMatches.length).toBeGreaterThan(0);
    expect(courseMatches.every((m) => m.type === 'course')).toBe(true);
  });

  it('correctly filters by search query string', () => {
    const searchMatches = matchOpportunitiesForStudent(
      sampleProfile,
      { searchQuery: 'Chennai' },
      SEEDED_OPPORTUNITIES
    );
    expect(searchMatches.length).toBeGreaterThan(0);
  });
});
