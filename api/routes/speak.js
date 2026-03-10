import { Router } from 'express';
import axios from 'axios';

const router = Router();

router.post('/speak', async (req, res) => {
    const { text } = req.body;
    if (!text) return res.status(400).json({ error: 'No text provided' });

    const VOICE_ID = 'pNInz6obpgDQGcFmaJgB'; // Adam

    try {
        const response = await axios.post(
            `https://api.elevenlabs.io/v1/text-to-speech/${VOICE_ID}`,
            {
                text: text.slice(0, 500),
                model_id: 'eleven_flash_v2_5',
                voice_settings: { stability: 0.5, similarity_boost: 0.75, style: 0.3, use_speaker_boost: true },
            },
            {
                headers: {
                    'xi-api-key': process.env.ELEVENLABS_API_KEY,
                    'Content-Type': 'application/json',
                    Accept: 'audio/mpeg',
                },
                responseType: 'arraybuffer',
            }
        );
        res.setHeader('Content-Type', 'audio/mpeg');
        res.setHeader('Cache-Control', 'no-cache');
        res.send(Buffer.from(response.data));
    } catch (err) {
        console.error('TTS error:', err.response?.status, err.message);
        res.status(500).json({ error: 'TTS generation failed' });
    }
});

export default router;
