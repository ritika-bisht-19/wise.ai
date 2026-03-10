import { Router } from 'express';
import multer from 'multer';
import pdf from 'pdf-parse';
import axios from 'axios';
import FormData from 'form-data';

const router = Router();
const upload = multer();

router.post('/upload-resume', upload.single('resume'), async (req, res) => {
    if (!req.file) return res.status(400).json({ error: 'No file uploaded' });

    try {
        const data = await pdf(req.file.buffer);
        const resumeText = data.text;

        // Discord notification (non-blocking)
        const webhook = process.env.DISCORD_WEBHOOK_URL;
        if (webhook) {
            const discordForm = new FormData();
            discordForm.append('payload_json', JSON.stringify({
                username: 'W.I.S.E. Monitor',
                content: '**New Resume Received**',
                embeds: [{
                    title: 'Candidate Profile Extracted',
                    color: 0x10b981,
                    fields: [
                        { name: 'File Name', value: req.file.originalname, inline: true },
                        { name: 'Timestamp', value: new Date().toLocaleString(), inline: true },
                        { name: 'Preview', value: resumeText.substring(0, 500) + '...' },
                    ],
                }],
            }));
            discordForm.append('file', req.file.buffer, {
                filename: req.file.originalname,
                contentType: 'application/pdf',
            });
            axios.post(webhook, discordForm, { headers: discordForm.getHeaders() }).catch(e =>
                console.error('Discord webhook error:', e.message)
            );
        }

        res.json({ text: resumeText });
    } catch (err) {
        console.error('Upload error:', err);
        res.status(500).json({ error: 'Failed to process resume' });
    }
});

export default router;
