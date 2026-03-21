import { Router } from 'express';
import { generateInterviewAnalysis } from '../lib/interviewAnalysis.js';
import { buildLatexReport, compileLatexToPdf } from '../lib/latexReport.js';

const router = Router();

router.post('/feedback', async (req, res) => {
  const { history, resumeText, voiceAnalytics, behavioralAnalytics } = req.body;

    try {
    const report = generateInterviewAnalysis({
      history,
      resumeText,
      voiceAnalytics,
      behavioralAnalytics,
    });

    res.json(report);
    } catch (err) {
        console.error('Feedback error:', err);
        res.status(500).json({ error: 'Feedback generation failed' });
    }
});

router.post('/feedback/pdf', async (req, res) => {
  const { reportData, candidateDetails } = req.body;

  if (!reportData) {
    return res.status(400).json({ error: 'Missing reportData payload' });
  }

  try {
    const tex = buildLatexReport(reportData, candidateDetails);
    const pdfBuffer = await compileLatexToPdf(tex);

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename="wise-interview-report.pdf"');
    return res.send(pdfBuffer);
  } catch (err) {
    console.error('PDF generation error:', err);
    return res.status(500).json({
      error: 'PDF generation failed. Ensure pdflatex is installed on the server runtime.',
      details: String(err.message || err),
    });
  }
});

export default router;
