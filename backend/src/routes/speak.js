import { Router } from 'express';
import axios from 'axios';

const router = Router();

const VOICE_MAP = {
    adam: { id: 'pNInz6obpgDQGcFmaJgB', label: 'Adam' },
    rachel: { id: '21m00Tcm4TlvDq8ikWAM', label: 'Rachel' },
    bella: { id: 'EXAVITQu4vr4xnSDxMaL', label: 'Bella' },
    antoni: { id: 'ErXwobaYiN019PkySvjV', label: 'Antoni' },
};

router.post('/speak', async (req, res) => {
    const { text, voiceKey = 'adam' } = req.body;
    if (!text) return res.status(400).json({ error: 'No text provided' });

    const selectedVoice = VOICE_MAP[voiceKey] ?? VOICE_MAP.adam;
    const VOICE_ID = selectedVoice.id;

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
        console.error('TTS error:', selectedVoice.label, err.response?.status, err.message);
        res.status(500).json({ error: 'TTS generation failed' });
    }
});

export default router;
