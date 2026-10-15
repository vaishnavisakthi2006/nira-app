import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      promptType = 'readiness_explanation',
      careerTitle = 'Software Engineer',
      readinessScore = 50,
      metCount = 0,
      totalSkills = 6,
      topGaps = [],
      language = 'en',
    } = body;

    const geminiKey = process.env.GEMINI_API_KEY || process.env.NEXT_PUBLIC_GEMINI_API_KEY;

    // Deterministic fallback generator
    const generateFallback = () => {
      const topGapNames = topGaps.slice(0, 3).map((g: { name: string }) => g.name).join(', ') || 'specialized tools';

      if (language === 'ta') {
        if (readinessScore >= 80) {
          return `${careerTitle} பணிக்கான உங்கள் தயார் நிலை ${readinessScore}%. நீங்கள் தேவையான ${totalSkills} திறன்களில் ${metCount} திறன்களை சிறப்பாக பெற்றுள்ளீர்கள். உங்கள் திட்டங்களை GitHub-ல் ஆவணப்படுத்தி மாதிரி நேர்காணல்களுக்கு தயாராகுங்கள். (குறிப்பு: இது மாதிரி வழிகாட்டுதல் மட்டுமே).`;
        }
        if (readinessScore >= 50) {
          return `${careerTitle} பணிக்கு உங்கள் தற்போதைய தயார் நிலை ${readinessScore}%. ${topGapNames} போன்ற முக்கிய திறன்களை மேலும் 3-4 வாரங்கள் பயிற்சி செய்வதன் மூலம் உங்கள் வாய்ப்புகளை கணிசமாக உயர்த்தலாம்.`;
        }
        return `${careerTitle} பணிக்கு உங்கள் தற்போதைய தயார் நிலை ${readinessScore}%. தொடக்கநிலையில் இருக்கும் நீங்கள் ${topGapNames} ஆகியவற்றில் அடிப்படை அறிவை வளர்க்க 4 வார கற்றல் வழிகாட்டியை பின்பற்றுங்கள்.`;
      }

      if (readinessScore >= 80) {
        return `Your readiness score for ${careerTitle} is ${readinessScore}%. You have satisfied ${metCount} of ${totalSkills} core benchmark competencies. Polish your GitHub project commits and prepare for technical case discussions. (Educational guidance only).`;
      }
      if (readinessScore >= 50) {
        return `Your readiness score for ${careerTitle} stands at ${readinessScore}%. Prioritizing hands-on projects in ${topGapNames} over the next 3-4 weeks will bridge the remaining gap effectively.`;
      }
      return `Your readiness score for ${careerTitle} is currently ${readinessScore}%. As a beginner, focus systematically on core syntax and guided projects for ${topGapNames} following your weekly roadmap.`;
    };

    // If Gemini key is available, attempt call
    if (geminiKey) {
      try {
        const aiPrompt = `You are NIRA, an explainable bilingual career advisor for Indian college students.
Language: ${language === 'ta' ? 'Tamil' : 'English'}
Task: Provide a concise, encouraging 2-3 sentence explanation of the student's readiness score.
Role: ${careerTitle}
Readiness Score: ${readinessScore}%
Met Skills: ${metCount}/${totalSkills}
Top Skill Gaps: ${topGaps.map((g: { name: string }) => g.name).join(', ')}

Important rules:
1. Ground strictly in the provided metrics.
2. DO NOT promise jobs, salaries, or guaranteed outcomes.
3. Be clear, student-friendly, and actionable.`;

        const response = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${geminiKey}`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              contents: [{ parts: [{ text: aiPrompt }] }],
              generationConfig: { maxOutputTokens: 200, temperature: 0.3 },
            }),
          }
        );

        if (response.ok) {
          const data = await response.json();
          const aiText = data.candidates?.[0]?.content?.parts?.[0]?.text;
          if (aiText && aiText.trim().length > 0) {
            return NextResponse.json({
              explanation: aiText.trim(),
              isAiGenerated: true,
              modelUsed: 'gemini-1.5-flash',
            });
          }
        }
      } catch (aiErr) {
        console.warn('AI API call failed, falling back to deterministic explanation:', aiErr);
      }
    }

    // Default fallback
    return NextResponse.json({
      explanation: generateFallback(),
      isAiGenerated: false,
      modelUsed: 'deterministic-rule-engine',
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    return NextResponse.json(
      { error: 'Internal server error', details: message },
      { status: 500 }
    );
  }
}
