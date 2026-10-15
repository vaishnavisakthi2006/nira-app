import { SEEDED_CAREERS } from '@/data/seedData';
import {
  Career,
  CareerRecommendation,
  Language,
  SkillComparison,
  SkillGapAnalysis,
  SkillLevel,
  SkillStatus,
  StudentProfile,
} from '@/types';

/**
 * Calculates transparent skill gap analysis for a specific target career.
 * Formula: sum(weight * min(student_level / required_level, 1)) / sum(all weights) * 100
 */
export function calculateSkillGapAnalysis(
  career: Career,
  studentSkills: Record<string, SkillLevel> = {}
): SkillGapAnalysis {
  let totalWeight = 0;
  let weightedSum = 0;

  let metCount = 0;
  let partlyMetCount = 0;
  let toDevelopCount = 0;

  const formulaParts: string[] = [];
  const comparisons: SkillComparison[] = [];

  for (const req of career.requiredSkills) {
    const studentLevel = (studentSkills[req.skillId] ?? 0) as SkillLevel;
    const reqLevel = req.requiredLevel || 1;
    const weight = req.weight || 1;

    totalWeight += weight;

    // Ratio capped at 1.0
    const ratio = Math.min(studentLevel / reqLevel, 1.0);
    const contribution = weight * ratio;
    weightedSum += contribution;

    formulaParts.push(`(${weight} × min(${studentLevel}/${reqLevel}, 1))`);

    let status: SkillStatus = 'to_develop';
    if (studentLevel >= reqLevel) {
      status = 'met';
      metCount++;
    } else if (studentLevel > 0) {
      status = 'partly_met';
      partlyMetCount++;
    } else {
      status = 'to_develop';
      toDevelopCount++;
    }

    const percentageMet = Math.round(ratio * 100);

    // Advice generation
    let adviceEn = '';
    let adviceTa = '';

    if (status === 'met') {
      adviceEn = `Solid proficiency! You meet or exceed the benchmark (Level ${studentLevel}/${reqLevel}). Continue practicing through end-to-end portfolio projects.`;
      adviceTa = `சிறப்பான நிலை! நீங்கள் தேவையான நிலையை (நிலை ${studentLevel}/${reqLevel}) எட்டியுள்ளீர்கள். சுயாதீன திட்டங்கள் மூலம் தொடர்ந்து பயிற்சி செய்யுங்கள்.`;
    } else if (status === 'partly_met') {
      adviceEn = `Good foundation (Level ${studentLevel}/${reqLevel}). Upgrade your practical depth by building real-world mini-features and debugging complex state.`;
      adviceTa = `நல்ல தொடக்கம் (நிலை ${studentLevel}/${reqLevel}). உண்மையான சிறு திட்டங்களை உருவாக்கி பிழைகளை திருத்துவதன் மூலம் உங்கள் திறனை மேம்படுத்துங்கள்.`;
    } else {
      adviceEn = `Priority area to build from scratch (Level 0/${reqLevel}). Start with core syntax and guided hands-on exercises in Week 1-2.`;
      adviceTa = `முதலில் கற்க வேண்டிய பகுதி (நிலை 0/${reqLevel}). அடிப்படை கோட்பாடுகள் மற்றும் எளிய பயிற்சிகள் மூலம் தொடங்கவும்.`;
    }

    comparisons.push({
      skillId: req.skillId,
      skillNameEn: req.skillNameEn,
      skillNameTa: req.skillNameTa,
      studentLevel,
      requiredLevel: req.requiredLevel,
      weight: req.weight,
      status,
      percentageMet,
      weightedContribution: Number(contribution.toFixed(2)),
      adviceEn,
      adviceTa,
    });
  }

  const rawScore = totalWeight > 0 ? (weightedSum / totalWeight) * 100 : 0;
  const readinessScore = Math.round(rawScore);

  const formulaString =
    totalWeight > 0
      ? `[${formulaParts.join(' + ')}] / ${totalWeight} = ${weightedSum.toFixed(2)} / ${totalWeight} × 100 = ${readinessScore}%`
      : '0%';

  // Top skill gaps ordered by weight (highest weight missing first)
  const topGaps = comparisons
    .filter((c) => c.status !== 'met')
    .sort((a, b) => {
      // Prioritize higher weight, then lower student level
      if (b.weight !== a.weight) return b.weight - a.weight;
      return a.studentLevel - b.studentLevel;
    });

  // Plain-language summary
  let summaryEn = '';
  let summaryTa = '';

  if (readinessScore >= 80) {
    summaryEn = `Strong alignment (${readinessScore}% match). You meet ${metCount} of ${career.requiredSkills.length} core requirements. Focus your energy on polishing a standout portfolio project and interviewing preparation.`;
    summaryTa = `மிகச் சிறந்த பொருத்தம் (${readinessScore}% மதிப்பெண்). தேவையான ${career.requiredSkills.length} திறன்களில் ${metCount} திறன்களை நீங்கள் நிறைவு செய்துள்ளீர்கள். சிறந்த திட்டங்களை ஆவணப்படுத்துவதில் கவனம் செலுத்துங்கள்.`;
  } else if (readinessScore >= 50) {
    summaryEn = `Promising baseline (${readinessScore}% match). You have established fundamentals in ${metCount + partlyMetCount} areas, but need focused depth in ${topGaps.length} priority skills before applying for roles.`;
    summaryTa = `நல்ல தொடக்க நிலை (${readinessScore}% மதிப்பெண்). ${metCount + partlyMetCount} திறன்களில் அடிப்படை உள்ளது. இன்னும் ${topGaps.length} முக்கிய திறன்களை மேம்படுத்தினால் இலக்கை அடையலாம்.`;
  } else {
    summaryEn = `Starter stage (${readinessScore}% match). You have ${topGaps.length} primary skill gaps to develop. Follow the structured 4-week roadmap to build your foundational abilities systematically.`;
    summaryTa = `தொடக்க நிலை (${readinessScore}% மதிப்பெண்). நீங்கள் வளர்த்துக் கொள்ள வேண்டிய திறன்கள் ${topGaps.length} உள்ளன. 4 வார கற்றல் வழிகாட்டியை பின்பற்றி படிப்படியாக முன்னேறுங்கள்.`;
  }

  return {
    careerId: career.id,
    careerTitleEn: career.titleEn,
    careerTitleTa: career.titleTa,
    readinessScore,
    totalWeight,
    weightedSum: Number(weightedSum.toFixed(2)),
    formulaString,
    metCount,
    partlyMetCount,
    toDevelopCount,
    comparisons,
    summaryEn,
    summaryTa,
    topGaps,
  };
}

/**
 * Recommends careers ranked by combined Readiness + Expressed Interests.
 */
export function getCareerRecommendations(
  profile: StudentProfile,
  allCareers: Career[] = SEEDED_CAREERS
): CareerRecommendation[] {
  const recommendations: CareerRecommendation[] = [];

  for (const career of allCareers) {
    const gapAnalysis = calculateSkillGapAnalysis(career, profile.skills || {});
    const readinessScore = gapAnalysis.readinessScore;

    const isStatedInterest = profile.careerInterests?.includes(career.id) ?? false;
    // Boost score slightly if student expressed interest (up to 15 points, normalized)
    const interestBonus = isStatedInterest ? 15 : 0;
    const overallFitScore = Math.min(100, Math.round(readinessScore * 0.85 + interestBonus));

    const matchReasonsEn: string[] = [];
    const matchReasonsTa: string[] = [];

    if (isStatedInterest) {
      matchReasonsEn.push(`Matches your stated career interest in ${career.titleEn}.`);
      matchReasonsTa.push(`உங்கள் விருப்பப் பட்டியலுடன் (${career.titleTa}) நேரடியாகப் பொருந்துகிறது.`);
    }

    if (gapAnalysis.metCount > 0) {
      matchReasonsEn.push(`You already meet ${gapAnalysis.metCount} of ${career.requiredSkills.length} key required skills.`);
      matchReasonsTa.push(`தேவையான ${career.requiredSkills.length} திறன்களில் ${gapAnalysis.metCount} திறன்களை ஏற்கனவே பெற்றுள்ளீர்கள்.`);
    }

    if (gapAnalysis.partlyMetCount > 0) {
      matchReasonsEn.push(`You have partial foundations in ${gapAnalysis.partlyMetCount} additional required areas.`);
      matchReasonsTa.push(`மேலும் ${gapAnalysis.partlyMetCount} திறன்களில் அடிப்படை அறிவு உள்ளது.`);
    }

    if (matchReasonsEn.length === 0) {
      matchReasonsEn.push(`Great structured career path for beginners in engineering/computing.`);
      matchReasonsTa.push(`புதிதாக தொடங்கும் மாணவர்களுக்கான சிறந்த தொழில்முறை பாதை.`);
    }

    const topStrengthsEn = gapAnalysis.comparisons
      .filter((c) => c.status === 'met')
      .map((c) => `${c.skillNameEn} (Lvl ${c.studentLevel})`);

    const topStrengthsTa = gapAnalysis.comparisons
      .filter((c) => c.status === 'met')
      .map((c) => `${c.skillNameTa} (நிலை ${c.studentLevel})`);

    const criticalGapsEn = gapAnalysis.topGaps
      .slice(0, 3)
      .map((c) => `${c.skillNameEn} (Needs Lvl ${c.requiredLevel}, currently Lvl ${c.studentLevel})`);

    const criticalGapsTa = gapAnalysis.topGaps
      .slice(0, 3)
      .map((c) => `${c.skillNameTa} (தேவை: நிலை ${c.requiredLevel}, தற்போது: நிலை ${c.studentLevel})`);

    recommendations.push({
      career,
      readinessScore,
      interestMatchScore: isStatedInterest ? 100 : 30,
      overallFitScore,
      matchReasonsEn,
      matchReasonsTa,
      topStrengthsEn,
      topStrengthsTa,
      criticalGapsEn,
      criticalGapsTa,
    });
  }

  // Sort by overall fit descending
  return recommendations.sort((a, b) => b.overallFitScore - a.overallFitScore);
}

/**
 * Returns a human-friendly plain-language explanation of a specific student readiness score.
 */
export function getReadinessScoreExplanation(
  score: number,
  careerTitle: string,
  lang: Language = 'en'
): string {
  if (lang === 'ta') {
    if (score >= 80) {
      return `${careerTitle} பணிக்கு நீங்கள் 80%+ தயார் நிலையில் உள்ளீர்கள்! இது உங்கள் சுய மதிப்பீட்டின் அடிப்படையிலான மாதிரி வழிகாட்டுதல் மட்டுமே, வேலை வாய்ப்புக்கான உத்தரவாதம் அல்ல.`;
    }
    if (score >= 50) {
      return `${careerTitle} பணிக்கு உங்கள் தற்போதைய தயார் நிலை ${score}%. முக்கிய திறன்களை இன்னும் மேம்படுத்தினால் வாய்ப்புகள் அதிகரிக்கும்.`;
    }
    return `${careerTitle} பணிக்கு உங்கள் தற்போதைய தயார் நிலை ${score}%. கவலைப்பட வேண்டாம், திட்டமிட்ட 4 வார வழிகாட்டி மூலம் அடிப்படை திறன்களை வளர்த்துக் கொள்ளலாம்.`;
  }

  if (score >= 80) {
    return `You have an 80%+ readiness score for ${careerTitle}! Note that this is calculated from your self-assessment as educational guidance, not a guarantee of employment.`;
  }
  if (score >= 50) {
    return `Your current readiness score for ${careerTitle} is ${score}%. Strengthening your top 2-3 skill gaps will substantially increase your readiness.`;
  }
  return `Your current readiness score for ${careerTitle} is ${score}%. Don't worry—follow your personalized 4-week roadmap to build essential foundations step-by-step.`;
}
