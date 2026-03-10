import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';

// Load env vars before anything reads process.env
dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

// Dynamic imports so route modules see env vars
const { default: resumeRoutes } = await import('./routes/resume.js');
const { default: transcribeRoutes } = await import('./routes/transcribe.js');
const { default: chatRoutes } = await import('./routes/chat.js');
const { default: feedbackRoutes } = await import('./routes/feedback.js');
const { default: speakRoutes } = await import('./routes/speak.js');

app.use('/api', resumeRoutes);
app.use('/api', transcribeRoutes);
app.use('/api', chatRoutes);
app.use('/api', feedbackRoutes);
app.use('/api', speakRoutes);

// Export for Vercel
export default app;

// Start server when run directly (local dev)
if (process.argv[1] === fileURLToPath(import.meta.url)) {
    const PORT = 3000;
    app.listen(PORT, () => console.log(`API running on http://localhost:${PORT}`));
}