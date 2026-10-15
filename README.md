# NIRA (நிரா) • Explainable Bilingual Career-Readiness Platform

> **Bilingual (English / தமிழ்) Career-Readiness Platform for Indian College Students & Recent Graduates**  
> *Explainable Career Recommendation • Transparent Skill-Gap Analysis • Personalized 4-Week Roadmaps • Curated Demo Opportunities • Privacy-First Resume Skill Scanner*

---

## 🌟 Executive Summary & Core Innovation

**NIRA is not a general chatbot.** Its core innovation is an **explainable career-readiness loop**:

$$\text{Student Profile} \longrightarrow \text{Career Fit Scoring} \longrightarrow \text{Transparent Skill-Gap Analysis} \longrightarrow \text{Actionable 4-Week Roadmap} \longrightarrow \text{Opportunity Matching}$$

### 🎯 Key Differentiators:
1. **100% Explainable Mathematical Scoring**: No black-box guesses. Skill readiness is computed using a weighted skill coverage formula visible step-by-step to the student:
   $$\text{Readiness Score (\%)} = \left[ \frac{\sum \left(\text{Weight} \times \min\left(\frac{\text{Student Level}}{\text{Required Level}}, 1.0\right)\right)}{\sum \text{All Weights}} \right] \times 100$$
2. **Deep Bilingual Localization (English & தமிழ்)**: Seamless one-click toggle across navigation, headings, buttons, math formulas, roadmap tasks, and feedback.
3. **Interactive Simulation**: Adjust skill sliders on the fly to watch your readiness score recalculate in real-time.
4. **Zero Forced Keys or Logins**: Runs 100% offline out-of-the-box with deterministic algorithms, localStorage persistence, and sample datasets.
5. **Privacy-First Resume Analyzer**: Extracts keywords locally without storing resume text or transmitting it to external servers without user consent.
6. **Grounding & Trust**: Clear disclaimers that career guidance and demo opportunities represent educational models, not guaranteed employment.

---

## 🛠️ Technology Stack

- **Framework**: Next.js 16 (App Router, Turbopack, Server Components & Client Hooks)
- **Language**: TypeScript (Strict type safety)
- **Styling**: Tailwind CSS v4 (Modern responsive layout, glassmorphism, high-contrast accessible palettes)
- **Icons**: Lucide React
- **Celebration Animations**: Canvas Confetti
- **Testing Suite**: Vitest (Unit tests for mathematical scoring, edge cases, and opportunity matching)
- **State & Storage**: React Context + `localStorage` for offline persistence

---

## 🚀 Quick Start & Running Locally

### Prerequisites
- **Node.js**: v18.18+ or v20+ / v25+
- **npm** or **pnpm** or **yarn**

### 1. Clone & Install Dependencies
```bash
git clone <your-repo-url>
cd Hackthon
npm install
```

### 2. Run the Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### 3. Run the Automated Unit Tests
```bash
npm run test
```

### 4. Build for Production
```bash
npm run build
npm run start
```

---

## ⚙️ Optional Environment Variables

NIRA runs out-of-the-box with **zero API keys required** using high-quality deterministic fallback engines.

If you would like to optionally enable Google Gemini for natural-language explainers, create a `.env.local` file:

```env
# Optional: Google Gemini API Key for server-side explanations
GEMINI_API_KEY=your_gemini_api_key_here
```

> **Security Note:** Keys are only read server-side in `src/app/api/ai-explain/route.ts` and are never exposed to client-side bundles.

---

## 📂 Project Architecture

```
d:/Hackthon/
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   └── ai-explain/route.ts      # Server-side optional AI explainer with deterministic fallback
│   │   ├── careers/page.tsx             # Career recommendations & fit scores
│   │   ├── opportunities/page.tsx       # Matched demo opportunities & filters
│   │   ├── profile/page.tsx             # Student profile & self-assessed skill matrix
│   │   ├── resume/page.tsx              # Privacy-safe resume skill extractor & ATS feedback
│   │   ├── roadmap/page.tsx             # Personalized 4-week starter roadmap
│   │   ├── skill-gap/page.tsx           # Interactive skill-gap analysis & formula breakdown
│   │   ├── globals.css                  # Global Tailwind CSS styling
│   │   ├── layout.tsx                   # Root layout with Language & Profile providers
│   │   └── page.tsx                     # Dashboard with readiness gauge & quick actions
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Navbar.tsx               # Bilingual navigation header with active target status
│   │   │   └── Footer.tsx               # Educational disclaimer and trust statements
│   │   └── ui/
│   │       ├── FormulaBreakdownModal.tsx # Transparent step-by-step math dialog
│   │       ├── ReadinessGauge.tsx       # SVG circular readiness score gauge
│   │       └── SkillLevelSelector.tsx   # 0-4 discrete skill level rating component
│   ├── context/
│   │   ├── LanguageContext.tsx          # English / Tamil switching & translation helper
│   │   └── ProfileContext.tsx           # Profile, target career, and roadmap state persistence
│   ├── data/
│   │   └── seedData.ts                  # Seeded careers, skills, opportunities, and demo profiles
│   ├── lib/
│   │   ├── __tests__/
│   │   │   ├── opportunityMatcher.test.ts # Opportunity matching test suite
│   │   │   └── scoring.test.ts          # Mathematical scoring & edge case test suite
│   │   ├── opportunityMatcher.ts        # Opportunity matching logic
│   │   ├── resumeAnalyzer.ts            # Local regex skill extractor & resume coach
│   │   ├── roadmapGenerator.ts          # 4-week personalized curriculum builder
│   │   ├── scoring.ts                   # Weighted skill coverage engine
│   │   └── translations.ts              # Bilingual EN / TA translations dictionary
│   └── types/
│       └── index.ts                     # TypeScript data contracts & models
├── package.json
├── tsconfig.json
├── vitest.config.mts
└── README.md
```

---

## 📱 Detailed Feature Walkthrough

### 1. Dashboard (`/`)
- Welcoming overview displaying student's academic background and current target role.
- **Readiness Score Gauge**: High-contrast radial gauge illustrating readiness tier.
- **Top Skill Gaps Card**: Highlighting priority gaps weighted by real-world role demand.
- **Roadmap Progress**: Tracking completed weeks and micro-tasks with quick resume links.
- **Demo Presets**: 1-click loading for demo student profiles (Ananya - Frontend, Karthik - Data, Rithanya - AI/ML).

### 2. Student Profile (`/profile`)
- Collects name, education level, degree, graduation year, location preferences, and career interests.
- **Categorized Skills Matrix**: Discrete 0 to 4 rating system across Core Programming, Frontend, Backend, Data, AI/ML, and Cloud/DevOps.
- Ability to dynamically add custom skills.
- Persistent browser storage (`localStorage`).

### 3. Career Recommendations (`/careers`)
- Ranks 6 seeded technology career pathways:
  1. *Frontend Web Developer*
  2. *Data Analyst*
  3. *AI / Machine Learning Associate*
  4. *Backend & API Engineer*
  5. *Mobile App Developer (Flutter)*
  6. *Cloud & DevOps Associate*
- Provides role descriptions, Indian hiring market contexts, benchmark required skills, and sample beginner portfolio projects.
- "Set as Target Career" updates the student's dashboard and roadmap instantly.

### 4. Skill-Gap Analysis (`/skill-gap`) — *Core Feature*
- Compares student self-ratings against benchmark requirements.
- Categorizes skills into:
  - **Met / Exceeded** (Level $\ge$ Benchmark)
  - **Partly Met** ($0 < \text{Level} < \text{Benchmark}$)
  - **To Develop** ($\text{Level} = 0$)
- **Transparent Formula Modal**: Inspect the full fractional breakdown with individual weights and contribution points.
- **Interactive Live Sliders**: Adjust ratings on this page to simulate score changes before saving.

### 5. Personalized 4-Week Roadmap (`/roadmap`)
- Generates a customized 4-week starter plan focusing on the student's highest-weighted skill gaps.
- Each week includes:
  - Weekly Learning Goal
  - Hands-on Practice Exercise
  - Portfolio Milestone Deliverable
  - Estimated Time Commitment (~5–8 hrs/week)
  - Interactive Step-by-Step Task Checklist
- Progress tracking with confetti celebration on 100% completion.
- Markdown export button for saving to personal notes.

### 6. Opportunity Matching (`/opportunities`) — *Core Feature*
- Seeded database of sample opportunities clearly marked with `[DEMO DATA]`.
- Covers Internships, Free Verified Courses, Hackathons, and Open-Source Mentorships.
- Calculates transparent match percentages based on role alignment, skill overlap, and eligibility.
- Filters by Opportunity Type, Career Role, and Search Keywords.

### 7. Resume Analyzer (`/resume`)
- Paste plain text resume or upload `.txt` file.
- Scans for technical skills, libraries, databases, and tools.
- Evaluates benchmark coverage against chosen target role.
- Generates actionable advice (quantifiable metrics, GitHub URLs, key missing requirements).
- **Privacy Guarantee**: Resume text is never stored in `localStorage` or transmitted externally without user action. Clear button wipes state instantly.

### 8. English / Tamil Bilingual Support (EN / தமிழ்)
- Visible toggle button in top navigation.
- High-quality, culturally authentic Tamil translations for all navigation, headings, buttons, empty states, and explanations.

---

## 🧪 Testing Verification

Run the automated Vitest test suite:
```bash
npm run test
```

### Verified Test Cases:
- `calculates 0% readiness when student has 0 skills`
- `calculates 100% readiness when student meets or exceeds all required levels`
- `caps skill contribution ratio at 1.0 even if student level is higher than required`
- `accurately computes partial weighted scores`
- `ranks career recommendations based on skill fit and stated interests`
- `matches target career opportunities with higher scores and transparent reasons`
- `correctly filters by opportunity type`
- `correctly filters by search query string`

---

## 🚢 Deployment to Vercel

1. Push your repository to GitHub.
2. Go to [Vercel](https://vercel.com) and click **"Add New Project"**.
3. Import your GitHub repository.
4. Framework Preset will automatically detect **Next.js**.
5. *(Optional)* Add `GEMINI_API_KEY` under Environment Variables.
6. Click **Deploy**.

---

## 🛡️ Disclaimers & Ethics

- **Educational Guidance Only**: NIRA provides structured educational guidance based on sample benchmarks. It does not guarantee employment, placements, or specific hiring outcomes.
- **Sample Data**: All opportunities, company names, and salaries shown in demo listings are illustrative samples.
- **Privacy**: No user login or tracking database is required. All state is preserved locally on the user's client device.

---

*Developed for the Hackathon MVP — NIRA Career Readiness Platform.*
