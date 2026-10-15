export type Language = 'en' | 'ta';

export type SkillLevel = 0 | 1 | 2 | 3 | 4;

export interface Skill {
  id: string;
  nameEn: string;
  nameTa: string;
  category: 'frontend' | 'backend' | 'data' | 'ai_ml' | 'mobile' | 'cloud' | 'core';
  descriptionEn: string;
  descriptionTa: string;
}

export interface SkillRequirement {
  skillId: string;
  skillNameEn: string;
  skillNameTa: string;
  requiredLevel: SkillLevel; // 1 - 4
  weight: number; // 1 - 5 importance
  category: string;
  reasonEn: string;
  reasonTa: string;
}

export interface BeginnerProject {
  titleEn: string;
  titleTa: string;
  descriptionEn: string;
  descriptionTa: string;
  deliverablesEn: string[];
  deliverablesTa: string[];
  estimatedWeeks: number;
}

export interface Career {
  id: string;
  titleEn: string;
  titleTa: string;
  categoryEn: string;
  categoryTa: string;
  iconName: string;
  descriptionEn: string;
  descriptionTa: string;
  marketContextEn: string;
  marketContextTa: string;
  requiredSkills: SkillRequirement[];
  beginnerProject: BeginnerProject;
  typicalRolesEn: string[];
  typicalRolesTa: string[];
}

export type EducationLevel =
  | 'diploma'
  | 'btech_be'
  | 'bca_bsc'
  | 'mtech_me'
  | 'mca_msc'
  | 'other';

export interface StudentProfile {
  id: string;
  name: string;
  educationLevel: EducationLevel;
  degreeField: string;
  collegeOrCity: string;
  graduationYear: number;
  skills: Record<string, SkillLevel>;
  careerInterests: string[];
  preferredLanguage: Language;
  locationPreference?: string;
  targetCareerId?: string;
  updatedAt: string;
}

export type SkillStatus = 'met' | 'partly_met' | 'to_develop';

export interface SkillComparison {
  skillId: string;
  skillNameEn: string;
  skillNameTa: string;
  studentLevel: SkillLevel;
  requiredLevel: SkillLevel;
  weight: number;
  status: SkillStatus;
  percentageMet: number;
  weightedContribution: number;
  adviceEn: string;
  adviceTa: string;
}

export interface SkillGapAnalysis {
  careerId: string;
  careerTitleEn: string;
  careerTitleTa: string;
  readinessScore: number;
  totalWeight: number;
  weightedSum: number;
  formulaString: string;
  metCount: number;
  partlyMetCount: number;
  toDevelopCount: number;
  comparisons: SkillComparison[];
  summaryEn: string;
  summaryTa: string;
  topGaps: SkillComparison[];
}

export interface CareerRecommendation {
  career: Career;
  readinessScore: number;
  interestMatchScore: number;
  overallFitScore: number;
  matchReasonsEn: string[];
  matchReasonsTa: string[];
  topStrengthsEn: string[];
  topStrengthsTa: string[];
  criticalGapsEn: string[];
  criticalGapsTa: string[];
}

export interface RoadmapTask {
  id: string;
  titleEn: string;
  titleTa: string;
  type: 'concept' | 'hands_on' | 'project' | 'review';
  completed: boolean;
}

export interface RoadmapWeek {
  weekNumber: number;
  focusSkillId: string;
  focusSkillNameEn: string;
  focusSkillNameTa: string;
  goalEn: string;
  goalTa: string;
  smallTaskEn: string;
  smallTaskTa: string;
  projectMilestoneEn: string;
  projectMilestoneTa: string;
  estimatedHours: number;
  tasks: RoadmapTask[];
  completed: boolean;
}

export interface RoadmapProgress {
  careerId: string;
  careerTitleEn: string;
  careerTitleTa: string;
  generatedAt: string;
  weeks: RoadmapWeek[];
  completedWeeksCount: number;
  totalTasksCount: number;
  completedTasksCount: number;
  completionPercentage: number;
}

export type OpportunityType = 'internship' | 'course' | 'competition' | 'opensource';

export interface Opportunity {
  id: string;
  titleEn: string;
  titleTa: string;
  organizationEn: string;
  organizationTa: string;
  type: OpportunityType;
  targetRoles: string[];
  targetSkills: string[];
  requiredSkillLevel: SkillLevel;
  eligibilityEn: string;
  eligibilityTa: string;
  locationEn: string;
  locationTa: string;
  mode: 'Remote' | 'Hybrid' | 'On-site';
  stipendOrBenefitEn: string;
  stipendOrBenefitTa: string;
  url: string;
  isDemoData: true;
  matchScore?: number;
  matchReasonEn?: string;
  matchReasonTa?: string;
  tags: string[];
}

export interface ResumeDetectedSkill {
  skillId: string;
  skillName: string;
  foundKeyword: string;
  contextSnippet: string;
}

export interface ResumeAnalysisResult {
  targetCareerId: string;
  targetCareerTitleEn: string;
  targetCareerTitleTa: string;
  detectedSkills: ResumeDetectedSkill[];
  matchedRequiredSkills: SkillRequirement[];
  missingRequiredSkills: SkillRequirement[];
  coveragePercentage: number;
  strengthsEn: string[];
  strengthsTa: string[];
  improvementSuggestionsEn: string[];
  improvementSuggestionsTa: string[];
  disclaimerEn: string;
  disclaimerTa: string;
}
