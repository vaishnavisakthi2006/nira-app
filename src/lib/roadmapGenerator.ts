import { Career, RoadmapProgress, RoadmapTask, RoadmapWeek, SkillGapAnalysis } from '@/types';

interface RoadmapSkillTemplate {
  weekGoalEn: string;
  weekGoalTa: string;
  smallTaskEn: string;
  smallTaskTa: string;
  projectMilestoneEn: string;
  projectMilestoneTa: string;
  estimatedHours: number;
  tasks: { titleEn: string; titleTa: string; type: RoadmapTask['type'] }[];
}

// Tailored curriculum templates per skill
const SKILL_CURRICULUM: Record<string, RoadmapSkillTemplate> = {
  javascript: {
    weekGoalEn: 'Master Modern JavaScript fundamentals: ES6+ syntax, asynchronous programming (Promises/Async-Await), and Array methods.',
    weekGoalTa: 'நவீன ஜாவாஸ்கிரிப்ட் அடிப்படைகள்: ES6+ விதிகள், Async/Await மற்றும் வரிசை (Array) செயல்பாடுகளில் தேர்ச்சி.',
    smallTaskEn: 'Write a utility script that fetches JSON from a public API, filters by date, and handles errors with try/catch.',
    smallTaskTa: 'பொது API-யில் இருந்து JSON தரவை பெற்று வடிகட்டி பிழைகளை கையாளும் ஜாவாஸ்கிரிப்ட் ஸ்கிரிப்ட் எழுதுங்கள்.',
    projectMilestoneEn: 'Set up your project repository and build the data fetching & state store layer.',
    projectMilestoneTa: 'உங்கள் திட்டத்திற்கான GitHub களஞ்சியத்தை உருவாக்கி தரவு பெறும் அடுக்கை கட்டமைக்கவும்.',
    estimatedHours: 6,
    tasks: [
      { titleEn: 'Review ES6+ arrow functions, destructuring, and spread operators', titleTa: 'ES6+ அம்புக்குறி செயல்பாடுகள் மற்றும் ஸ்ப்ரெட் ஆபரேட்டர்களை கற்றல்', type: 'concept' },
      { titleEn: 'Practice array methods (.map, .filter, .reduce, .find) on mock student data', titleTa: 'மாணவர் மாதிரி தரவுகளில் .map, .filter, .reduce பயிற்சிகள் செய்தல்', type: 'hands_on' },
      { titleEn: 'Implement async fetch with try/catch and loading state handling', titleTa: 'Async/Await உடன் API அழைப்புகள் மற்றும் ஏற்றுதல் நிலையை அமைத்தல்', type: 'hands_on' },
      { titleEn: 'Commit clean code to GitHub with descriptive commit messages', titleTa: 'விளக்கமான குறிப்புகளுடன் Git-ல் பதிவேற்றம் செய்தல்', type: 'project' },
    ],
  },
  react: {
    weekGoalEn: 'Build reusable React functional components, manage state with useState and useEffect, and handle user events.',
    weekGoalTa: 'மறுபயன்பாட்டு ரியாக்ட் கூறுகள், useState & useEffect மூலம் தரவு மேலாண்மை மற்றும் நிகழ்வு கையாளுதல்.',
    smallTaskEn: 'Create an interactive filterable card list with search, category pills, and empty state display.',
    smallTaskTa: 'தேடல் மற்றும் பிரிவுகள் கொண்ட வடிகட்டக்கூடிய அட்டைப் பட்டியலை ரியாக்டில் உருவாக்குங்கள்.',
    projectMilestoneEn: 'Build the core responsive UI layouts, navigation, and interactive component state.',
    projectMilestoneTa: 'முக்கிய பக்க வடிவமைப்புகள் மற்றும் பயனர் தொடர்புகளை முழுமையாக உருவாக்குதல்.',
    estimatedHours: 8,
    tasks: [
      { titleEn: 'Understand component props, JSX rules, and unidirectional data flow', titleTa: 'Props மற்றும் ஒருவழி தரவு பாய்வு விதிகளை புரிந்துகொள்ளுதல்', type: 'concept' },
      { titleEn: 'Build custom hooks for local storage persistence and window resize', titleTa: 'லோக்கல் ஸ்டோரேஜ் தரவை நிர்வகிக்க பிரத்யேக ரியாக்ட் ஹூக் உருவாக்குதல்', type: 'hands_on' },
      { titleEn: 'Implement component modularity (split into Card, Header, FilterBar)', titleTa: 'பாகங்களை தனித்தனி கூறுகளாக பிரித்து கட்டமைத்தல்', type: 'hands_on' },
      { titleEn: 'Test component rendering across both desktop and mobile viewports', titleTa: 'கணினி மற்றும் மொபைல் திரைகளில் வடிவமைப்பு பிழையின்றி இயங்குவதை உறுதிசெய்தல்', type: 'review' },
    ],
  },
  html_css: {
    weekGoalEn: 'Master semantic HTML5 markup, CSS Flexbox & CSS Grid, and responsive media queries for accessible UI.',
    weekGoalTa: 'HTML5 கட்டமைப்பு, CSS Flexbox, CSS Grid மற்றும் மொபைலுக்கு ஏற்ற வடிவமைப்பு முறைகள்.',
    smallTaskEn: 'Recreate a mobile-first responsive landing page header and 3-column pricing card layout without frameworks.',
    smallTaskTa: 'மொபைல் மற்றும் கணினிக்கு ஏற்ற 3-நெடுவரிசை அட்டவணை பக்கத்தை CSS Grid மூலம் உருவாக்குங்கள்.',
    projectMilestoneEn: 'Finalize accessible typography, color tokens, and smooth responsive CSS breakpoints.',
    projectMilestoneTa: 'அனைத்து திரைகளுக்கும் ஏற்ற எழுத்துரு மற்றும் வண்ண அமைப்புகளை இறுதி செய்தல்.',
    estimatedHours: 5,
    tasks: [
      { titleEn: 'Learn semantic HTML (<header>, <main>, <nav>, <section>, <article>, <aside>)', titleTa: 'பொருளுள்ள HTML5 குறிச்சொற்களை கற்றல்', type: 'concept' },
      { titleEn: 'Master Flexbox alignment (justify-content, align-items, flex-grow/shrink)', titleTa: 'Flexbox சீரமைப்பு முறைகளை பயிற்சி செய்தல்', type: 'hands_on' },
      { titleEn: 'Build a responsive 12-column Grid with auto-fit and minmax()', titleTa: 'CSS Grid கொண்டு தானியங்கி அளவுகளை அமைத்தல்', type: 'hands_on' },
      { titleEn: 'Audit web accessibility (contrast, ARIA roles, screen-reader alt tags)', titleTa: 'இணைய அணுகல் (Accessibility) தரநிலைகளை சரிபார்த்தல்', type: 'review' },
    ],
  },
  typescript: {
    weekGoalEn: 'Add strong type safety, custom interfaces, generics, and strict compile-time error checking.',
    weekGoalTa: 'டைப்ஸ்கிரிப்ட் இடைமுகங்கள் (Interfaces), Generics மற்றும் பிழையற்ற வகை அமைப்புகளை கற்றல்.',
    smallTaskEn: 'Refactor an untyped JavaScript utility module to strict TypeScript with zero `any` usage.',
    smallTaskTa: 'ஜாவாஸ்கிரிப்ட் கோப்பை எந்தவொரு `any` வகையும் இன்றி முழுமையான TypeScript-ஆக மாற்றுங்கள்.',
    projectMilestoneEn: 'Type all API response contracts, component props, and shared domain models.',
    projectMilestoneTa: 'அனைத்து API தரவுகள் மற்றும் பயனர் கூறுகளுக்கு துல்லியமான வகை மாதிரிகளை அமைத்தல்.',
    estimatedHours: 6,
    tasks: [
      { titleEn: 'Learn primitive types, Union types, and Type aliases vs Interfaces', titleTa: 'அடிப்படை வகைகள் மற்றும் Interfaces பயன்பாடுகளை கற்றல்', type: 'concept' },
      { titleEn: 'Type React component Props, Children, and Event Handlers (MouseEvent/ChangeEvent)', titleTa: 'ரியாக்ட் நிகழ்வுகளுக்கு துல்லியமான வகைகளை அமைத்தல்', type: 'hands_on' },
      { titleEn: 'Write generic functions for API fetching: `fetchData<T>(url: string): Promise<T>`', titleTa: 'பொதுவான Generics செயல்பாடுகளை உருவாக்குதல்', type: 'hands_on' },
      { titleEn: 'Run `tsc --noEmit` and resolve all compiler type warnings', titleTa: 'அனைத்து டைப்ஸ்கிரிப்ட் எச்சரிக்கைகளையும் நீக்குதல்', type: 'review' },
    ],
  },
  sql_databases: {
    weekGoalEn: 'Master SQL schema design, complex multi-table JOINs, subqueries, and aggregate metrics.',
    weekGoalTa: 'SQL அட்டவணை வடிவமைப்பு, பல அட்டவணை கூட்டு தேடல்கள் (JOINs) மற்றும் சுருக்க வினவல்கள்.',
    smallTaskEn: 'Write 5 SQL queries answering real business questions (top revenue items, monthly active users, customer retention).',
    smallTaskTa: 'மாதாந்திர விற்பனை மற்றும் வாடிக்கையாளர் வருகையை கணக்கிடும் 5 SQL வினவல்களை எழுதுங்கள்.',
    projectMilestoneEn: 'Design normalized 3NF database schema and populate seed records with constraints.',
    projectMilestoneTa: 'முழுமையான தரவுத்தள அட்டவணைகளை உருவாக்கி மாதிரி தரவுகளை உள்ளீடு செய்தல்.',
    estimatedHours: 6,
    tasks: [
      { titleEn: 'Study relational modeling (Primary Keys, Foreign Keys, 1:N & N:M relations)', titleTa: 'முதன்மை விசைகள் (Primary Keys) மற்றும் உறவுகளை கற்றல்', type: 'concept' },
      { titleEn: 'Practice INNER, LEFT, and FULL OUTER JOINs on retail orders and customers tables', titleTa: 'பல்வேறு வகையான JOIN வினவல்களை பயிற்சி செய்தல்', type: 'hands_on' },
      { titleEn: 'Write aggregate queries with GROUP BY, HAVING, and window functions (ROW_NUMBER, RANK)', titleTa: 'GROUP BY மற்றும் Window Functions மூலம் பகுப்பாய்வு செய்தல்', type: 'hands_on' },
      { titleEn: 'Benchmark query performance and add database indexes to search columns', titleTa: 'தேடல் வேகத்தை அதிகரிக்க Database Index உருவாக்குதல்', type: 'review' },
    ],
  },
  data_viz: {
    weekGoalEn: 'Build clear, interactive business dashboards in PowerBI/Tableau or Python Seaborn with insightful storytelling.',
    weekGoalTa: 'PowerBI அல்லது Python மூலம் வணிக நிர்வாகிகளுக்கான கவர்ச்சிகரமான விளக்கப்படங்களை உருவாக்குதல்.',
    smallTaskEn: 'Transform a raw CSV into an interactive dashboard featuring KPI cards, bar charts, and slicers.',
    smallTaskTa: 'எளிய CSV தரவிலிருந்து KPI அட்டைகள் மற்றும் வடிகட்டிகள் கொண்ட டேஷ்போர்டை உருவாக்குங்கள்.',
    projectMilestoneEn: 'Deliver a finished executive dashboard with drill-down filters and key insights.',
    projectMilestoneTa: 'வணிக முடிவுகளை எடுக்க உதவும் முழுமையான காட்சி விளக்கப்பட அறிக்கையை வழங்குதல்.',
    estimatedHours: 6,
    tasks: [
      { titleEn: 'Understand chart selection rules (when to use Bar, Line, Scatter, Treemap)', titleTa: 'எந்த தரவுக்கு எந்த விளக்கப்படம் சிறந்தது என்பதை அறிதல்', type: 'concept' },
      { titleEn: 'Design clean layout with high contrast, clear axis labels, and metric callouts', titleTa: 'எளிதில் புரியும் வகையில் தலைப்புகள் மற்றும் குறிப்புகளை அமைத்தல்', type: 'hands_on' },
      { titleEn: 'Implement interactive date and category slicers for dynamic filtering', titleTa: 'தேதி மற்றும் வகைகளுக்கு ஏற்ப மாறும் வடிகட்டிகளை அமைத்தல்', type: 'hands_on' },
      { titleEn: 'Export executive summary slides with 3 clear data-backed action items', titleTa: 'தரவு சார்ந்த 3 முக்கிய பரிந்துரைகளுடன் கூடிய சுருக்கத்தை தயாரித்தல்', type: 'project' },
    ],
  },
  pandas_numpy: {
    weekGoalEn: 'Perform automated data cleaning, missing value imputation, group summaries, and vector operations.',
    weekGoalTa: 'பைத்தான் பாண்டாஸ் மூலம் தரவு சுத்தம் செய்தல் மற்றும் புள்ளியியல் கணக்கீடுகள்.',
    smallTaskEn: 'Write a Python script that cleans a messy 10,000-row dataset, handles null values, and exports cleaned CSV.',
    smallTaskTa: 'பிழைகள் உள்ள தரவை சரிசெய்து சுத்தமான CSV கோப்பாக மாற்றும் பைத்தான் ஸ்கிரிப்ட் எழுதுங்கள்.',
    projectMilestoneEn: 'Complete end-to-end Exploratory Data Analysis (EDA) notebook with statistical findings.',
    projectMilestoneTa: 'முழுமையான தரவு ஆய்வு (EDA) நோட்புக்கை முடித்து முடிவுகளை ஆவணப்படுத்துதல்.',
    estimatedHours: 7,
    tasks: [
      { titleEn: 'Understand DataFrame indexing, slicing, and column transformations', titleTa: 'பாண்டாஸ் DataFrames கையாளுதல் முறைகளை கற்றல்', type: 'concept' },
      { titleEn: 'Clean missing data using .fillna(), .dropna(), and outlier boundary checks', titleTa: 'விடுபட்ட மதிப்புகளை கண்டறிந்து சரிசெய்தல்', type: 'hands_on' },
      { titleEn: 'Use .groupby() and .pivot_table() to calculate aggregate business metrics', titleTa: '.groupby() மூலம் சுருக்க கணக்கீடுகளை மேற்கொள்வது', type: 'hands_on' },
      { titleEn: 'Document findings in markdown cells with clear interpretations', titleTa: 'கண்டறிந்த முடிவுகளை விளக்கக் குறிப்புகளுடன் பதிவு செய்தல்', type: 'project' },
    ],
  },
  machine_learning: {
    weekGoalEn: 'Understand core ML algorithms (Linear/Logistic Regression, Decision Trees, Random Forests) & cross-validation.',
    weekGoalTa: 'இயந்திர கற்றல் வழிமுறைகள் (Regression, Random Forest) மற்றும் மாடல் மதிப்பீட்டு முறைகள்.',
    smallTaskEn: 'Train a Scikit-Learn classification model, evaluate with confusion matrix and ROC-AUC curve.',
    smallTaskTa: 'Scikit-Learn மூலம் ஒரு முன்கணிப்பு மாடலை உருவாக்கி அதன் துல்லியத்தை கணக்கிடுங்கள்.',
    projectMilestoneEn: 'Train baseline and tuned models with hyperparameter optimization (GridSearchCV).',
    projectMilestoneTa: 'மாடலின் செயல்திறனை உயர்த்த அளவுருக்களை (Hyperparameters) மாற்றியமைத்தல்.',
    estimatedHours: 8,
    tasks: [
      { titleEn: 'Learn supervised vs unsupervised learning paradigms and evaluation metrics (Precision, Recall, F1)', titleTa: 'மேற்பார்வை கற்றல் மற்றும் F1-Score மதிப்பீடுகளை புரிந்துகொள்ளுதல்', type: 'concept' },
      { titleEn: 'Split data properly into Train, Validation, and Test sets (avoid data leakage)', titleTa: 'தரவு கசிவை தவிர்த்து பயிற்சி மற்றும் சோதனை தொகுதிகளாக பிரித்தல்', type: 'hands_on' },
      { titleEn: 'Train Decision Tree and Random Forest classifiers using Scikit-Learn', titleTa: 'Random Forest வழிமுறையை பயிற்றுவித்தல்', type: 'hands_on' },
      { titleEn: 'Plot feature importances to explain which factors drive model decisions', titleTa: 'எந்த காரணிகள் முடிவுகளை தீர்மானிக்கின்றன என்பதை வரைபடமாக காட்டுதல்', type: 'review' },
    ],
  },
  git_github: {
    weekGoalEn: 'Master Git command line workflow, branch strategies, pull requests, and professional repo documentation.',
    weekGoalTa: 'Git கட்டளைகள், கிளைகள் (Branches), Pull Requests மற்றும் சிறந்த README ஆவணங்களை தயாரித்தல்.',
    smallTaskEn: 'Create a GitHub repo with a clean README, feature branch, commit history, and merged PR.',
    smallTaskTa: 'விளக்கமான README மற்றும் கிளைகளுடன் கூடிய புதிய GitHub களஞ்சியத்தை உருவாக்குங்கள்.',
    projectMilestoneEn: 'Publish all project code with descriptive commit history and open-source license.',
    projectMilestoneTa: 'அனைத்து திட்டக் குறியீடுகளையும் பொதுமக்களுக்கு பயன்படும் வகையில் கிட்ஹப்பில் வெளியிடுதல்.',
    estimatedHours: 4,
    tasks: [
      { titleEn: 'Understand Git internal concepts: working directory, staging area, commit history', titleTa: 'Git இயங்கும் முறைகளை முழுமையாக புரிந்துகொள்ளுதல்', type: 'concept' },
      { titleEn: 'Practice branch creation, merging, and resolving simulated merge conflicts', titleTa: 'கிளைகளை இணைத்தல் மற்றும் பிழைகளை நீக்கும் பயிற்சி', type: 'hands_on' },
      { titleEn: 'Write a compelling project README with badges, screenshots, setup steps, and architecture diagram', titleTa: 'படங்கள் மற்றும் அமைவு முறைகளுடன் சிறந்த README எழுதுதல்', type: 'project' },
      { titleEn: 'Configure .gitignore to ensure sensitive env keys and node_modules are never committed', titleTa: 'ரகசிய சாவிகள் பதிவேற்றப்படாமல் இருக்க .gitignore அமைத்தல்', type: 'review' },
    ],
  },
  linux_cli: {
    weekGoalEn: 'Master Linux terminal navigation, file permissions, process management, and bash shell scripting.',
    weekGoalTa: 'லினக்ஸ் கட்டளைகள், கோப்பு அனுமதிகள், செயல்முறை மேலாண்மை மற்றும் ஷெல் ஸ்கிரிப்டிங்.',
    smallTaskEn: 'Write a bash script that checks server memory, backs up a directory, and logs timestamped status.',
    smallTaskTa: 'சர்வர் நினைவகத்தை சரிபார்த்து கோப்புகளை காப்பகப்படுத்தும் எளிய Bash ஸ்கிரிப்ட் எழுதுங்கள்.',
    projectMilestoneEn: 'Set up remote server access, configure firewall rules, and automate routine tasks.',
    projectMilestoneTa: 'பாதுகாப்பான சர்வர் அணுகல் மற்றும் தானியங்கி பணிகளை கட்டமைத்தல்.',
    estimatedHours: 5,
    tasks: [
      { titleEn: 'Learn essential CLI commands (grep, awk, sed, find, curl, tar, chmod, chown)', titleTa: 'முக்கியமான லினக்ஸ் டெர்மினல் கட்டளைகளை கற்றல்', type: 'concept' },
      { titleEn: 'Write automated bash backup and cleanup scripts with cron schedule triggers', titleTa: 'தானியங்கி பணிகளுக்கான Bash ஸ்கிரிப்ட் எழுதுதல்', type: 'hands_on' },
      { titleEn: 'Understand SSH keys generation and secure remote server logins', titleTa: 'SSH சாவிகள் மூலம் பாதுகாப்பாக சர்வரில் உள்நுழைதல்', type: 'hands_on' },
      { titleEn: 'Inspect system resource utilization using top, htop, and df -h', titleTa: 'கணினி வளங்களின் பயன்பாட்டை கண்காணித்தல்', type: 'review' },
    ],
  },
  docker_containers: {
    weekGoalEn: 'Master containerization: write multi-stage Dockerfiles, manage image layers, and orchestrate with Docker Compose.',
    weekGoalTa: 'டாக்கர் கன்டெய்னர்கள்: பல அடுக்கு Dockerfile எழுதுதல் மற்றும் Docker Compose கட்டமைப்பு.',
    smallTaskEn: 'Containerize a web app with its database using docker-compose.yml and persistent volume mounts.',
    smallTaskTa: 'இணையதளம் மற்றும் தரவுத்தளத்தை Docker Compose மூலம் ஒரே கட்டளையில் இயங்க வையுங்கள்.',
    projectMilestoneEn: 'Package the complete capstone portfolio project into production-ready lightweight Docker images.',
    projectMilestoneTa: 'உங்கள் முழு திட்டத்தையும் இலகுரக டாக்கர் இமேஜ்களாக மாற்றி சோதித்தல்.',
    estimatedHours: 6,
    tasks: [
      { titleEn: 'Understand container vs virtual machine architecture and layer caching', titleTa: 'கன்டெய்னர்களின் அடிப்படை நன்மைகள் மற்றும் இயங்குமுறையை கற்றல்', type: 'concept' },
      { titleEn: 'Write a production-grade multi-stage Dockerfile minimizing image size (<150MB)', titleTa: 'குறைந்த அளவு கொண்ட பல அடுக்கு Dockerfile உருவாக்குதல்', type: 'hands_on' },
      { titleEn: 'Configure docker-compose with environment variables and network isolation', titleTa: 'சுற்றுச்சூழல் மாறிகளுடன் docker-compose கட்டமைத்தல்', type: 'hands_on' },
      { titleEn: 'Push verified image to Docker Hub with automated semantic tags', titleTa: 'சரிபார்க்கப்பட்ட இமேஜை Docker Hub-ல் பதிவேற்றுதல்', type: 'project' },
    ],
  },
};

// Generic fallback template if a specific skill doesn't have an explicit template
function getFallbackTemplate(skillNameEn: string, skillNameTa: string): RoadmapSkillTemplate {
  return {
    weekGoalEn: `Build foundational competence in ${skillNameEn} through guided documentation, syntax drills, and applied exercises.`,
    weekGoalTa: `${skillNameTa} திறனில் அடிப்படை அறிவை கோட்பாடுகள் மற்றும் செய்முறை பயிற்சிகள் மூலம் வளர்த்துக் கொள்ளுங்கள்.`,
    smallTaskEn: `Complete 3 hands-on practical exercises demonstrating core ${skillNameEn} concepts.`,
    smallTaskTa: `${skillNameTa} சார்ந்த 3 செய்முறை பயிற்சிகளை முடித்து சரிபாருங்கள்.`,
    projectMilestoneEn: `Integrate ${skillNameEn} features into your portfolio project milestone.`,
    projectMilestoneTa: `உங்கள் திட்டத்தில் ${skillNameTa} செயல்பாடுகளை இணைத்து முழுமைப்படுத்துங்கள்.`,
    estimatedHours: 6,
    tasks: [
      { titleEn: `Study official documentation and fundamental concepts for ${skillNameEn}`, titleTa: `${skillNameTa} அதிகாரப்பூர்வ கையேடு மற்றும் கருத்துக்களை படித்தல்`, type: 'concept' },
      { titleEn: `Build an isolated mini-prototype exercising ${skillNameEn}`, titleTa: `${skillNameTa} பயன்படுத்தி ஒரு சிறிய முன்மாதிரியை உருவாக்குதல்`, type: 'hands_on' },
      { titleEn: `Debug edge cases and optimize execution`, titleTa: `பிழைகளை நீக்கி செயல்திறனை மேம்படுத்துதல்`, type: 'hands_on' },
      { titleEn: `Write summary learnings in your engineering log`, titleTa: `கற்றறிந்த விஷயங்களை பொறியியல் குறிப்பேட்டில் ஆவணப்படுத்துதல்`, type: 'review' },
    ],
  };
}

/**
 * Generates a personalized 4-week starter roadmap targeting the student's top skill gaps.
 */
export function generatePersonalizedRoadmap(
  career: Career,
  gapAnalysis: SkillGapAnalysis,
  existingProgress?: RoadmapProgress
): RoadmapProgress {
  // Select top 4 focus skills from gaps; if fewer gaps, fill with highest weight required skills
  const focusGaps = [...gapAnalysis.topGaps];

  // If student has fewer than 4 gaps, add other required skills to complete 4 weeks of learning
  if (focusGaps.length < 4) {
    for (const comp of gapAnalysis.comparisons) {
      if (!focusGaps.some((g) => g.skillId === comp.skillId)) {
        focusGaps.push(comp);
      }
      if (focusGaps.length >= 4) break;
    }
  }

  // Ensure we have exactly 4 weeks
  const selectedSkills = focusGaps.slice(0, 4);

  const weeks: RoadmapWeek[] = selectedSkills.map((skillComp, idx) => {
    const weekNum = idx + 1;
    const template = SKILL_CURRICULUM[skillComp.skillId] || getFallbackTemplate(skillComp.skillNameEn, skillComp.skillNameTa);

    const existingWeek = existingProgress?.weeks?.find((w) => w.weekNumber === weekNum && w.focusSkillId === skillComp.skillId);

    const tasks: RoadmapTask[] = template.tasks.map((t, tIdx) => {
      const taskId = `w${weekNum}_task_${tIdx + 1}`;
      const existingTask = existingWeek?.tasks?.find((et) => et.id === taskId);
      return {
        id: taskId,
        titleEn: t.titleEn,
        titleTa: t.titleTa,
        type: t.type,
        completed: existingTask ? existingTask.completed : false,
      };
    });

    const isWeekCompleted = tasks.length > 0 && tasks.every((t) => t.completed);

    return {
      weekNumber: weekNum,
      focusSkillId: skillComp.skillId,
      focusSkillNameEn: skillComp.skillNameEn,
      focusSkillNameTa: skillComp.skillNameTa,
      goalEn: template.weekGoalEn,
      goalTa: template.weekGoalTa,
      smallTaskEn: template.smallTaskEn,
      smallTaskTa: template.smallTaskTa,
      projectMilestoneEn: template.projectMilestoneEn,
      projectMilestoneTa: template.projectMilestoneTa,
      estimatedHours: template.estimatedHours,
      tasks,
      completed: isWeekCompleted,
    };
  });

  const totalTasksCount = weeks.reduce((sum, w) => sum + w.tasks.length, 0);
  const completedTasksCount = weeks.reduce(
    (sum, w) => sum + w.tasks.filter((t) => t.completed).length,
    0
  );
  const completedWeeksCount = weeks.filter((w) => w.completed).length;
  const completionPercentage = totalTasksCount > 0 ? Math.round((completedTasksCount / totalTasksCount) * 100) : 0;

  return {
    careerId: career.id,
    careerTitleEn: career.titleEn,
    careerTitleTa: career.titleTa,
    generatedAt: existingProgress?.generatedAt || new Date().toISOString(),
    weeks,
    completedWeeksCount,
    totalTasksCount,
    completedTasksCount,
    completionPercentage,
  };
}
