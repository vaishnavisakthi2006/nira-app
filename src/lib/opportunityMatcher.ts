import { SEEDED_OPPORTUNITIES } from '@/data/seedData';
import { Opportunity, OpportunityType, SkillLevel, StudentProfile } from '@/types';

export interface MatchFilterOptions {
  type?: OpportunityType | 'all';
  targetRole?: string | 'all';
  minMatchScore?: number;
  searchQuery?: string;
}

/**
 * Matches opportunities to a student profile with explainable scores and transparent reasons.
 */
export function matchOpportunitiesForStudent(
  profile: StudentProfile,
  options: MatchFilterOptions = {},
  opportunities: Opportunity[] = SEEDED_OPPORTUNITIES
): Opportunity[] {
  const targetCareerId = profile.targetCareerId;
  const studentSkills = profile.skills || {};

  const scoredOpportunities = opportunities.map((opp) => {
    let score = 0;
    const reasonsEn: string[] = [];
    const reasonsTa: string[] = [];

    // 1. Role alignment (up to 40 pts)
    const isTargetRole = targetCareerId ? opp.targetRoles.includes(targetCareerId) : false;
    const isInterestRole = profile.careerInterests?.some((interest) => opp.targetRoles.includes(interest)) ?? false;

    if (isTargetRole) {
      score += 40;
      reasonsEn.push('Direct match for your selected target career.');
      reasonsTa.push('உங்கள் தேர்ந்தெடுக்கப்பட்ட இலக்கு பணிக்கு நேரடியாக பொருந்துகிறது.');
    } else if (isInterestRole) {
      score += 30;
      reasonsEn.push('Matches one of your stated career interests.');
      reasonsTa.push('உங்கள் விருப்பப்பட்டியலில் உள்ள பணிக்கு பொருந்துகிறது.');
    } else {
      score += 15;
      reasonsEn.push('Valuable adjacent engineering experience.');
      reasonsTa.push('கூடுதல் பொறியியல் அனுபவத்திற்கான சிறந்த வாய்ப்பு.');
    }

    // 2. Skill overlap (up to 40 pts)
    const oppSkills = opp.targetSkills || [];
    let studentMatchingSkillPoints = 0;
    let matchingSkillCount = 0;

    for (const skillId of oppSkills) {
      const studentLvl = (studentSkills[skillId] ?? 0) as SkillLevel;
      if (studentLvl > 0) {
        matchingSkillCount++;
        // Higher level gives better match
        const skillFraction = Math.min(studentLvl / opp.requiredSkillLevel, 1.2);
        studentMatchingSkillPoints += (40 / Math.max(oppSkills.length, 1)) * skillFraction;
      }
    }

    score += Math.min(40, Math.round(studentMatchingSkillPoints));

    if (matchingSkillCount > 0) {
      reasonsEn.push(`Matches ${matchingSkillCount} of ${oppSkills.length} relevant skills in your profile.`);
      reasonsTa.push(`உங்கள் சுயவிவரத்தில் உள்ள ${oppSkills.length} திறன்களில் ${matchingSkillCount} திறன்கள் பொருந்துகின்றன.`);
    } else {
      reasonsEn.push('Beginner-friendly: gives you an early sandbox to learn the required skills.');
      reasonsTa.push('தொடக்கநிலைக்கு ஏற்றது: தேவையான திறன்களை கற்றுக் கொள்ள உதவும்.');
    }

    // 3. Level eligibility (up to 20 pts)
    // If student meets or is close to required level, give full 20 pts
    let averageSkillLvl = 0;
    if (oppSkills.length > 0) {
      const totalLvl = oppSkills.reduce((sum, s) => sum + (studentSkills[s] ?? 0), 0);
      averageSkillLvl = totalLvl / oppSkills.length;
    }

    if (averageSkillLvl >= opp.requiredSkillLevel) {
      score += 20;
      reasonsEn.push(`You comfortably satisfy the required skill baseline (Level ${opp.requiredSkillLevel}).`);
      reasonsTa.push(`தேவையான அடிப்படை தகுதியை (நிலை ${opp.requiredSkillLevel}) நீங்கள் நிறைவு செய்துள்ளீர்கள்.`);
    } else if (averageSkillLvl >= Math.max(1, opp.requiredSkillLevel - 1)) {
      score += 15;
      reasonsEn.push(`Close to required benchmark; ideal for fast skill acceleration.`);
      reasonsTa.push(`தேவையான தகுதிக்கு மிக அருகில் உள்ளீர்கள்; விரைவான பயிற்சிக்கு ஏற்றது.`);
    } else {
      score += 10;
      reasonsEn.push(`Stated eligibility is beginner-friendly for college students.`);
      reasonsTa.push(`கல்லூரி மாணவர்களின் தொடக்கநிலைக்கு ஏற்ற தகுதி வரம்பு.`);
    }

    const finalMatchScore = Math.min(98, Math.max(25, Math.round(score)));

    return {
      ...opp,
      matchScore: finalMatchScore,
      matchReasonEn: reasonsEn.join(' '),
      matchReasonTa: reasonsTa.join(' '),
    };
  });

  // Apply filter options
  return scoredOpportunities
    .filter((opp) => {
      if (options.type && options.type !== 'all' && opp.type !== options.type) {
        return false;
      }
      if (options.targetRole && options.targetRole !== 'all' && !opp.targetRoles.includes(options.targetRole)) {
        return false;
      }
      if (options.minMatchScore && (opp.matchScore ?? 0) < options.minMatchScore) {
        return false;
      }
      if (options.searchQuery && options.searchQuery.trim().length > 0) {
        const q = options.searchQuery.toLowerCase();
        const matchesTitle = opp.titleEn.toLowerCase().includes(q) || opp.titleTa.toLowerCase().includes(q);
        const matchesOrg = opp.organizationEn.toLowerCase().includes(q) || opp.organizationTa.toLowerCase().includes(q);
        const matchesTags = opp.tags.some((t) => t.toLowerCase().includes(q));
        if (!matchesTitle && !matchesOrg && !matchesTags) return false;
      }
      return true;
    })
    .sort((a, b) => (b.matchScore ?? 0) - (a.matchScore ?? 0));
}
