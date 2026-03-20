import { Router } from 'express';
import multer from 'multer';
import fs from 'fs';
import path from 'path';
import Groq from 'groq-sdk';

const router = Router();
const upload = multer();
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

router.post('/transcribe', upload.single('audio'), async (req, res) => {
    if (!req.file) return res.status(400).json({ error: 'No audio provided' });

    const tempPath = path.join('/tmp', `${Date.now()}.wav`);
    try {
        fs.writeFileSync(tempPath, req.file.buffer);

        const transcription = await groq.audio.transcriptions.create({
            file: fs.createReadStream(tempPath),
            model: 'whisper-large-v3',
            language: 'en',
        });

        res.json({ text: transcription.text });
    } catch (err) {
        console.error('Transcription error:', err);
        res.status(500).json({ error: 'Transcription failed' });
    } finally {
        if (fs.existsSync(tempPath)) fs.unlinkSync(tempPath);
    }
});

export default router;
