import { Router } from 'express';
import Groq from 'groq-sdk';

const router = Router();
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

router.post('/feedback', async (req, res) => {
    const { history, resumeText } = req.body;

    try {
        const completion = await groq.chat.completions.create({
            messages: [{
                role: 'user',
                content: `Act as a Google Hiring Committee.
Analyze this interview transcript for the candidate based on their resume: ${resumeText}.
Transcript: ${JSON.stringify(history)}
Return ONLY a JSON object with this exact structure:
{
  "overall_score": 0-100,
  "detailed_metrics": {
    "technical_depth": 0-100,
    "communication_clarity": 0-100,
    "problem_solving": 0-100,
    "experience_relevance": 0-100
  },
  "section_analysis": {
    "experience": "Detailed review of how they explained past projects.",
    "technical_skills": "Evaluation of their theoretical core knowledge.",
    "achievements": "Assessment of the impact/scale of their accomplishments."
  },
  "strengths": ["specific strength 1", "specific strength 2"],
  "areas_for_improvement": ["specific area 1", "specific area 2"],
  "critical_missing_points": "List specific technical details they missed or failed to explain well.",
  "hiring_verdict": "Strong Hire / Hire / Leaning No / No Hire",
  "summary": "A 3-4 sentence professional summary of the candidate's performance."
}`,
            }],
            model: 'llama-3.1-8b-instant',
            response_format: { type: 'json_object' },
        });
        res.json(JSON.parse(completion.choices[0]?.message?.content));
    } catch (err) {
        console.error('Feedback error:', err);
        res.status(500).json({ error: 'Feedback generation failed' });
    }
});

export default router;
