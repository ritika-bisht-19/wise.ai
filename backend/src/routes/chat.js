import { Router } from 'express';
import Groq from 'groq-sdk';

const router = Router();
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

// Interview stage roadmap
const STAGES = [
    { range: [0, 0], stage: 'INTRODUCTION', goal: 'Briefly welcome the candidate. Ask for a short intro and their core tech stack.' },
    { range: [1, 3], stage: 'EXPERIENCE', goal: 'Pick a specific role/project from the resume. Ask about implementation details, trade-offs, or a challenge. DO NOT repeat a topic discussed in previous turns.' },
    { range: [4, 6], stage: 'SKILLS', goal: 'Identify a technical skill (React, Node, SQL, etc.) from the resume. Ask a "how it works internally" theory question.' },
    { range: [7, 9], stage: 'ACHIEVEMENTS', goal: 'Ask about a specific Rank, Award, or Hackathon win. Ask about the hardest technical hurdle faced to achieve it.' },
    { range: [10, 11], stage: 'GENERAL/SYSTEM DESIGN', goal: 'Ask a behavioral question or a system design question related to their background.' },
];

router.post('/chat', async (req, res) => {
    const { history, resumeText } = req.body;
    const turnCount = Math.floor(history.length / 2);

    const stageEntry = STAGES.find(s => turnCount >= s.range[0] && turnCount <= s.range[1]);
    if (!stageEntry) {
        return res.json({ reply: 'Thank you for your time. That concludes our interview.' });
    }

    const systemInstruction = `
ROLE: Software Engineer
INTERVIEW STAGE: ${stageEntry.stage} (Turn ${turnCount}/12).
GOAL: ${stageEntry.goal}
RESUME CONTEXT: """${resumeText}"""
STRICT RULES:
1. **NO INTRODUCTIONS**: After turn 0, never ask "tell me about yourself."
2. **DYNAMIC TOPICS**: Check history. If you just asked about "Role A," you MUST switch to "Role B" or "Project C" now.
3. **SPECIFICITY**: Mention specific nouns (Company/Project/Skill names) found in the RESUME CONTEXT.
4. **BREVITY**: Keep questions under 2 sentences. No meta-talk like "Moving to the next stage."
`;

    try {
        const completion = await groq.chat.completions.create({
            messages: [
                { role: 'system', content: systemInstruction },
                ...history.map(m => ({
                    role: m.sender === 'user' ? 'user' : 'assistant',
                    content: m.text,
                })),
            ],
            model: 'llama-3.1-8b-instant',
            temperature: 0.4,
        });
        res.json({ reply: completion.choices[0]?.message?.content });
    } catch (err) {
        console.error('Chat error:', err);
        res.status(500).json({ error: 'AI error' });
    }
});

export default router;
