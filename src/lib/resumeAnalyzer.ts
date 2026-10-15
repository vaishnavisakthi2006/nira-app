import { SEEDED_CAREERS, SEEDED_SKILLS } from '@/data/seedData';
import { ResumeAnalysisResult, ResumeDetectedSkill, SkillRequirement } from '@/types';

// Keyword dictionary mapping skill IDs to various aliases & frameworks in student resumes
const SKILL_KEYWORDS: Record<string, string[]> = {
  javascript: ['javascript', 'js', 'es6', 'es2015', 'ecmascript', 'vanilla js', 'dom manipulation'],
  typescript: ['typescript', 'ts'],
  react: ['react', 'react.js', 'reactjs', 'hooks', 'redux', 'zustand', 'next.js', 'nextjs'],
  html_css: ['html', 'html5', 'css', 'css3', 'flexbox', 'grid', 'responsive design', 'sass', 'scss'],
  tailwind_css: ['tailwind', 'tailwindcss', 'utility css', 'shadcn', 'bootstrap'],
  python: ['python', 'py', 'python3', 'django', 'flask', 'fastapi'],
  nodejs: ['node.js', 'nodejs', 'express', 'express.js', 'backend', 'npm', 'yarn'],
  sql_databases: ['sql', 'mysql', 'postgresql', 'postgres', 'sqlite', 'oracle db', 'mariadb', 'database query', 'rdbms', 'queries'],
  rest_apis: ['rest api', 'restful', 'apis', 'crud', 'endpoints', 'postman', 'http requests', 'json api'],
  auth_security: ['jwt', 'authentication', 'authorization', 'bcrypt', 'oauth', 'cors', 'security', 'session'],
  pandas_numpy: ['pandas', 'numpy', 'scipy', 'dataframe', 'data wrangling', 'data cleaning'],
  data_viz: ['powerbi', 'power bi', 'tableau', 'matplotlib', 'seaborn', 'data visualization', 'dashboards', 'charts', 'plots'],
  statistics: ['statistics', 'probability', 'hypothesis testing', 'a/b testing', 'regression analysis', 'variance'],
  excel_advanced: ['excel', 'advanced excel', 'pivot tables', 'vlookup', 'xlookup', 'google sheets', 'spreadsheets'],
  machine_learning: ['machine learning', 'ml', 'scikit-learn', 'sklearn', 'classification', 'regression', 'random forest', 'xgboost', 'svm'],
  deep_learning: ['deep learning', 'neural networks', 'pytorch', 'tensorflow', 'keras', 'cnn', 'rnn', 'transformers'],
  data_preprocessing: ['data preprocessing', 'feature engineering', 'encoding', 'imputation', 'scaling', 'normalization'],
  linear_algebra_math: ['linear algebra', 'calculus', 'matrix', 'vectors', 'eigenvalues', 'gradient descent'],
  flutter_dart: ['flutter', 'dart', 'cross-platform', 'mobile app', 'flutter widgets'],
  mobile_ui_ux: ['mobile ui', 'mobile ux', 'state management', 'bloc', 'provider', 'riverpod', 'screen navigation'],
  git_github: ['git', 'github', 'version control', 'gitlab', 'pull requests', 'commits', 'branches'],
  linux_cli: ['linux', 'bash', 'shell scripting', 'cli', 'ubuntu', 'terminal', 'ssh'],
  docker_containers: ['docker', 'dockerfile', 'docker-compose', 'containerization', 'containers', 'kubernetes'],
  cloud_basics: ['aws', 'azure', 'gcp', 'cloud', 's3', 'ec2', 'serverless', 'lambda', 'cloud computing'],
};

/**
 * Deterministically analyzes resume text against a target career's requirements.
 */
export function analyzeResumeText(
  resumeText: string,
  targetCareerId: string
): ResumeAnalysisResult {
  const career = SEEDED_CAREERS.find((c) => c.id === targetCareerId) || SEEDED_CAREERS[0];
  const lowerText = resumeText.toLowerCase();

  const detectedSkills: ResumeDetectedSkill[] = [];
  const matchedSkillIds = new Set<string>();

  // Check each known skill in our dictionary
  for (const [skillId, keywords] of Object.entries(SKILL_KEYWORDS)) {
    for (const kw of keywords) {
      const regex = new RegExp(`\\b${kw.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'i');
      const match = lowerText.match(regex);
      if (match && match.index !== undefined) {
        matchedSkillIds.add(skillId);
        const skillMeta = SEEDED_SKILLS.find((s) => s.id === skillId);

        // Extract a snippet around the keyword
        const start = Math.max(0, match.index - 30);
        const end = Math.min(resumeText.length, match.index + kw.length + 30);
        const contextSnippet = '...' + resumeText.slice(start, end).replace(/\s+/g, ' ').trim() + '...';

        detectedSkills.push({
          skillId,
          skillName: skillMeta?.nameEn || skillId,
          foundKeyword: kw,
          contextSnippet,
        });
        break; // matched this skill once
      }
    }
  }

  // Compare against target career requirements
  const matchedRequiredSkills: SkillRequirement[] = [];
  const missingRequiredSkills: SkillRequirement[] = [];

  for (const req of career.requiredSkills) {
    if (matchedSkillIds.has(req.skillId)) {
      matchedRequiredSkills.push(req);
    } else {
      missingRequiredSkills.push(req);
    }
  }

  const coveragePercentage =
    career.requiredSkills.length > 0
      ? Math.round((matchedRequiredSkills.length / career.requiredSkills.length) * 100)
      : 0;

  // Generate actionable Indian student resume improvement suggestions
  const suggestionsEn: string[] = [];
  const suggestionsTa: string[] = [];

  // Project links check
  if (!lowerText.includes('github.com') && !lowerText.includes('git')) {
    suggestionsEn.push(
      'Add live GitHub repository links and deployment URLs for each project so recruiters can view your code.'
    );
    suggestionsTa.
      push('உங்கள் திட்டங்களுக்கு நேரடி GitHub இணைப்புகள் மற்றும் இயங்கும் இணையதள முகவரிகளை (Live URLs) சேருங்கள்.');
  }

  // Quantifiable metrics check
  const hasNumbers = /\d+([%kK\+]|\s*(users|records|rows|ms|queries|tests))/.test(resumeText);
  if (!hasNumbers) {
    suggestionsEn.push(
      'Quantify your project outcomes (e.g. "reduced load time by 30%", "handled 5,000 mock records", "achieved 92% model accuracy").'
    );
    suggestionsTa.
      push('திட்டங்களில் அளவிடக்கூடிய முடிவுகளை சேருங்கள் (எ.கா. "30% வேகமான பதில் நேரம்", "5,000 தரவுகளை கையாண்டது").');
  }

  // Missing high-weight skills
  if (missingRequiredSkills.length > 0) {
    const topMissingNamesEn = missingRequiredSkills.slice(0, 3).map((s) => s.skillNameEn).join(', ');
    const topMissingNamesTa = missingRequiredSkills.slice(0, 3).map((s) => s.skillNameTa).join(', ');
    suggestionsEn.push(
      `Clearly highlight projects or coursework utilizing key required skills for this role: ${topMissingNamesEn}.`
    );
    suggestionsTa.
      push(`இந்த பணிக்கான முக்கிய திறன்களைப் பயன்படுத்தி நீங்கள் உருவாக்கிய திட்டங்களை தெளிவாக குறிப்பிடுங்கள்: ${topMissingNamesTa}.`);
  }

  // Action verbs check
  const actionVerbs = ['built', 'developed', 'designed', 'implemented', 'optimized', 'architected', 'created', 'trained'];
  const foundVerbs = actionVerbs.filter((v) => lowerText.includes(v));
  if (foundVerbs.length < 2) {
    suggestionsEn.push(
      'Start bullet points with strong technical action verbs (e.g., "Architected", "Engineered", "Optimized", "Integrated").'
    );
    suggestionsTa.
      push('உங்கள் பணி விளக்கங்களை வலுவான தொழில்நுட்ப வினைச்சொற்களுடன் (எ.கா., உருவாக்கினேன், மேம்படுத்தினேன்) தொடங்குங்கள்.');
  }

  const strengthsEn: string[] = [];
  const strengthsTa: string[] = [];

  if (matchedRequiredSkills.length > 0) {
    strengthsEn.push(
      `Detected ${matchedRequiredSkills.length} directly relevant skills matching the ${career.titleEn} profile.`
    );
    strengthsTa.
      push(`${career.titleTa} பணிக்கு தேவையான ${matchedRequiredSkills.length} திறன்கள் உங்கள் சுயவிவரத்தில் கண்டறியப்பட்டுள்ளன.`);
  }

  if (detectedSkills.length >= 5) {
    strengthsEn.push('Good breadth of technical keywords and tool mentions.');
    strengthsTa.push('பல்வேறு தொழில்நுட்ப கருவிகள் மற்றும் பயன்பாடுகள் குறிப்பிடப்பட்டுள்ளன.');
  }

  return {
    targetCareerId: career.id,
    targetCareerTitleEn: career.titleEn,
    targetCareerTitleTa: career.titleTa,
    detectedSkills,
    matchedRequiredSkills,
    missingRequiredSkills,
    coveragePercentage,
    strengthsEn,
    strengthsTa,
    improvementSuggestionsEn: suggestionsEn,
    improvementSuggestionsTa: suggestionsTa,
    disclaimerEn:
      'NIRA Resume Analyzer uses transparent keyword verification against seeded benchmarks for educational guidance. It does not store your resume text or guarantee recruiter selection.',
    disclaimerTa:
      'NIRA ரெஸ்யூம் பகுப்பாய்வி என்பது கல்வி வழிகாட்டலுக்கான மாதிரி சரிபார்ப்பு மட்டுமே. இது உங்கள் விவரங்களை சேமிக்காது அல்லது வேலை வாய்ப்பை உத்தரவாதம் செய்யாது.',
  };
}
