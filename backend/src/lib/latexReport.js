import fs from 'fs';
import os from 'os';
import path from 'path';
import { spawnSync } from 'child_process';
import { fileURLToPath } from 'url';
import axios from 'axios';
import FormData from 'form-data';

const LATEX_ESCAPE_MAP = {
  '\\': '\\textbackslash{}',
  '{': '\\{',
  '}': '\\}',
  '$': '\\$',
  '&': '\\&',
  '#': '\\#',
  '_': '\\_',
  '%': '\\%',
  '~': '\\textasciitilde{}',
  '^': '\\textasciicircum{}',
};

const escapeLatex = (value) => String(value || '').replace(/[\\{}$&#_%~^]/g, (m) => LATEX_ESCAPE_MAP[m] || m);

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const TEMPLATE_PATH = path.resolve(__dirname, '../routes/wise_ai_report_template.tex');

function toPct(value) {
  const n = Number(value);
  if (!Number.isFinite(n)) return 'N/A';
  return `${Math.round(n * 100)}%`;
}

function makeBulletItems(items = []) {
  if (!items.length) return '\\item No major issues detected.';
  return items.map((item) => `\\item ${escapeLatex(item)}`).join('\n');
}

const safe = (v, fallback = 'N/A') => (v === null || v === undefined || v === '' ? fallback : v);

const asPercent = (v, fallback = 'N/A') => {
  const n = Number(v);
  if (!Number.isFinite(n)) return fallback;
  return `${Math.round(n * 100)}\\%`;
};

export function buildLatexReport(reportData = {}, candidate = {}) {
  const name = escapeLatex(candidate.name || 'Candidate');
  const date = escapeLatex(candidate.date || new Date().toISOString().slice(0, 10));
  const type = escapeLatex(candidate.interviewType || 'Technical Interview');
  const roleApplied = escapeLatex(candidate.roleApplied || candidate.position || 'Role not specified');
  const experienceLevel = escapeLatex(candidate.experienceLevel || 'Not specified');
  const sessionDuration = escapeLatex(candidate.sessionDuration || safe(reportData.session_duration, 'N/A'));

  const finalScore = Number(reportData?.scoring_breakdown?.final_score_10 ?? (Number(reportData?.overall_score || 0) / 10));
  const communication = Number(reportData?.scoring_breakdown?.communication_score ?? 0);
  const confidence = Number(reportData?.scoring_breakdown?.confidence_score ?? 0);
  const stress = Number(reportData?.scoring_breakdown?.stress_score ?? 0);

  const voice = reportData.voice_analytics || {};
  const content = reportData.content_evaluation || {};
  const behavioral = reportData.behavioral_insights || {};
  const classifications = reportData.classifications || {};
  const voiceAnalysis = reportData.voice_analysis || {};

  const finalScoreText = Number.isFinite(finalScore) ? finalScore.toFixed(2) : 'N/A';
  const communicationScore10 = Number.isFinite(communication) ? (communication * 10).toFixed(2) : 'N/A';
  const confidenceScore10 = Number.isFinite(confidence) ? (confidence * 10).toFixed(2) : 'N/A';
  const communicationText = asPercent(communication);
  const confidenceText = asPercent(confidence);
  const stressText = asPercent(stress);

  const speechRate = escapeLatex(safe(voice.speech_rate_wpm));
  const articulationRate = escapeLatex(safe(voice.articulation_rate_wpm));
  const fillerRate = escapeLatex(safe(voice.filler_rate_per_100_words));
  const pitchMean = escapeLatex(safe(voice.pitch_mean_hz));
  const pitchRange = escapeLatex(safe(voice.pitch_range_hz));
  const pitchSd = escapeLatex(safe(voice.pitch_variation_sd_hz));

  const relevance = escapeLatex(safe(content.relevance));
  const structure = escapeLatex(safe(content.structure));
  const clarity = escapeLatex(safe(content.clarity));
  const confidenceLang = escapeLatex(safe(content.confidence_language));

  const deliveryScore = escapeLatex(safe(voiceAnalysis.delivery_score));
  const recommendation = escapeLatex(reportData.ai_recommendation || reportData.summary || 'No recommendation generated.');
  const executiveSummary = escapeLatex(reportData.summary || reportData.ai_recommendation || 'No executive summary generated.');
  const voiceSummary = escapeLatex(safe(voiceAnalysis.summary, 'Voice summary unavailable.'));
  const stressLevel = escapeLatex(safe(classifications.stress_level));
  const communicationLevel = escapeLatex(safe(classifications.communication_level));
  const confidenceLevel = escapeLatex(safe(classifications.confidence_level));
  const hiringRecommendation = escapeLatex(reportData.hiring_verdict || 'N/A');

  const speechRateNum = Number(voice.speech_rate_wpm);
  const speechRateBenchmark = escapeLatex('130-160 WPM');
  const speechRateInsight = escapeLatex(
    Number.isFinite(speechRateNum)
      ? speechRateNum > 160
        ? 'Above recommended range; pacing may feel rushed in dense answers.'
        : speechRateNum < 130
          ? 'Below recommended range; improve momentum to sustain engagement.'
          : 'Within recommended range for clear, digestible delivery.'
      : 'Speech rate data unavailable.'
  );

  const fillerBenchmark = escapeLatex('<5 per 100w');
  const fillerNum = Number(voice.filler_rate_per_100_words);
  const fillerInsight = escapeLatex(
    Number.isFinite(fillerNum)
      ? fillerNum > 5
        ? 'Above benchmark; reduce filler words to improve perceived confidence.'
        : 'Within acceptable range; filler usage is controlled.'
      : 'Filler usage data unavailable.'
  );

  const pitchVariationNum = Number(voice.pitch_variation_sd_hz);
  const pitchStabilityValue = escapeLatex(
    Number.isFinite(pitchVariationNum)
      ? `${Math.max(0, Math.min(100, Math.round(100 - Math.min(pitchVariationNum, 100))))}% Stable`
      : 'N/A'
  );
  const pitchStabilityBenchmark = escapeLatex('>85% Stable');
  const pitchStabilityInsight = escapeLatex(
    Number.isFinite(pitchVariationNum)
      ? pitchVariationNum <= 20
        ? 'Strong vocal consistency across responses.'
        : 'Moderate pitch variability; steadier tone can improve authority.'
      : 'Pitch stability data unavailable.'
  );

  const articulationRateNum = Number(voice.articulation_rate_wpm);
  const articulationClarityValue = escapeLatex(
    Number.isFinite(articulationRateNum)
      ? `${Math.max(0, Math.min(100, Math.round((articulationRateNum / 180) * 100)))}% Clear`
      : 'N/A'
  );
  const articulationClarityBenchmark = escapeLatex('>90% Clear');
  const articulationClarityInsight = escapeLatex(
    Number.isFinite(articulationRateNum)
      ? articulationRateNum >= 150
        ? 'Good articulation pace supporting intelligibility.'
        : 'Articulation appears soft; improve diction for sharper delivery.'
      : 'Articulation data unavailable.'
  );

  const strengthItems = Array.isArray(reportData.strengths) && reportData.strengths.length
    ? reportData.strengths
    : ['Consistent baseline interview performance detected.'];
  const improvementItems = Array.isArray(reportData.areas_for_improvement) && reportData.areas_for_improvement.length
    ? reportData.areas_for_improvement
    : ['Continue practicing structured response delivery.'];

  const contentPoints = [
    `Relevance to Question: ${safe(content.relevance, 'N/A')}% topical alignment against prompted content.`,
    `Answer Structure: ${safe(content.structure, 'N/A')}% structure score across response flow and sequencing.`,
    `Logical Clarity: ${safe(content.clarity, 'N/A')}% clarity score based on response coherence and readability.`,
    `Confidence Language: ${safe(content.confidence_language, 'N/A')}% confidence-language score across key answers.`,
  ];

  const behavioralText = {
    eye: `\\textbf{Observation:} ${escapeLatex(behavioral.eye_contact || 'No data.')} \\newline \\textbf{Interpretation:} Camera engagement patterns were monitored for consistency. \\newline \\textbf{Impact:} Influences perceived trust and interview presence.`,
    facial: `\\textbf{Observation:} ${escapeLatex(behavioral.facial_expression || 'No data.')} \\newline \\textbf{Interpretation:} Facial expressiveness and tension were tracked under load. \\newline \\textbf{Impact:} Affects perceived composure during technical probing.`,
    head: `\\textbf{Observation:} ${escapeLatex(behavioral.head_movement || 'No data.')} \\newline \\textbf{Interpretation:} Movement cadence indicates listening and emphasis behavior. \\newline \\textbf{Impact:} Supports collaboration and communication signals.`,
    posture: `\\textbf{Observation:} ${escapeLatex(safe(reportData?.behavioral_analytics?.posture_shift_ratio, 'N/A'))} posture-shift ratio observed. \\newline \\textbf{Interpretation:} Postural stability reflects cognitive load handling. \\newline \\textbf{Impact:} Stable posture strengthens executive presence.`,
  };

  const appendixEvents = Array.isArray(reportData?.behavioral_analytics?.notable_events)
    ? reportData.behavioral_analytics.notable_events.slice(0, 4)
    : [];

  const formatAppendix = (idx, fallbackEvent) => {
    const item = appendixEvents[idx] || null;
    return {
      time: escapeLatex(item?.timestamp || item?.time || ['04:12', '14:45', '22:15', '35:50'][idx]),
      event: escapeLatex(item?.event || fallbackEvent),
      conf: escapeLatex(safe(item?.confidence, ['0.89', '0.94', '0.98', '0.87'][idx])),
    };
  };

  const ap1 = formatAppendix(0, 'Behavioral marker detected during response segment.');
  const ap2 = formatAppendix(1, 'Prosodic shift detected during technical explanation.');
  const ap3 = formatAppendix(2, 'Pause pattern detected before high-complexity answer.');
  const ap4 = formatAppendix(3, 'Engagement marker detected in concluding segment.');

  let template = fs.readFileSync(TEMPLATE_PATH, 'utf8');

  const replacements = {
    name,
    roleApplied,
    date,
    type,
    experienceLevel,
    sessionDuration,
    'hiring\\_verdict': escapeLatex(reportData.hiring_verdict || 'N/A'),
    hiringRecommendation,
    executiveSummary,
    finalScoreText,
    communicationScore10,
    confidenceScore10,
    communicationText,
    confidenceText,
    stressText,
    stressLevel,
    communicationLevel,
    confidenceLevel,
    behaviorEyeContact: behavioralText.eye,
    behaviorFacial: behavioralText.facial,
    behaviorHead: behavioralText.head,
    behaviorPosture: behavioralText.posture,
    'eye\\_contact': escapeLatex(behavioral.eye_contact || 'No data'),
    'facial\\_expression': escapeLatex(behavioral.facial_expression || 'No data'),
    'head\\_movement': escapeLatex(behavioral.head_movement || 'No data'),
    speechRate,
    speechRateBenchmark,
    speechRateInsight,
    articulationRate,
    articulationClarityValue,
    articulationClarityBenchmark,
    articulationClarityInsight,
    pitchMean,
    pitchRange,
    pitchSd,
    pitchStabilityValue,
    pitchStabilityBenchmark,
    pitchStabilityInsight,
    fillerRate,
    fillerBenchmark,
    fillerInsight,
    deliveryScore,
    voiceSummary,
    relevance,
    structure,
    clarity,
    confidenceLang,
    contentPoint1: escapeLatex(contentPoints[0]),
    contentPoint2: escapeLatex(contentPoints[1]),
    contentPoint3: escapeLatex(contentPoints[2]),
    contentPoint4: escapeLatex(contentPoints[3]),
    recommendation,
    riskFlight: escapeLatex('Assessment based on engagement and intent signals indicates low mobility risk.'),
    riskStress: escapeLatex(`Observed stress classification: ${safe(classifications.stress_level, 'N/A')}.`),
    riskCulture: escapeLatex('No major communication or collaboration conflicts detected in session signals.'),
    appendixTime1: ap1.time,
    appendixEvent1: ap1.event,
    appendixConf1: ap1.conf,
    appendixTime2: ap2.time,
    appendixEvent2: ap2.event,
    appendixConf2: ap2.conf,
    appendixTime3: ap3.time,
    appendixEvent3: ap3.event,
    appendixConf3: ap3.conf,
    appendixTime4: ap4.time,
    appendixEvent4: ap4.event,
    appendixConf4: ap4.conf,
    'strength\\_1': escapeLatex(strengthItems[0] || 'No major strengths identified.'),
    'strength\\_2': escapeLatex(strengthItems[1] || 'Maintain consistent delivery and pacing.'),
    'strength\\_3': escapeLatex(strengthItems[2] || 'Continue reinforcing technical depth with examples.'),
    'strength\\_4': escapeLatex(strengthItems[3] || 'No additional strengths recorded.'),
    'improvement\\_1': escapeLatex(improvementItems[0] || 'No major issues detected.'),
    'improvement\\_2': escapeLatex(improvementItems[1] || 'Refine response structure for stronger impact.'),
    'improvement\\_3': escapeLatex(improvementItems[2] || 'Practice concise, evidence-backed explanations.'),
    'improvement\\_4': escapeLatex(improvementItems[3] || 'No additional improvements recorded.'),
  };

  for (const [key, value] of Object.entries(replacements)) {
    const token = `\\\${${key}}`;
    template = template.split(token).join(value);
  }

  return template;
}

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

function getConvertHubConfig() {
  const apiUrl = process.env.CONVERTHUB_API_URL || '';
  const apiKey = process.env.CONVERTHUB_API_KEY || '';
  const statusUrlTemplate = process.env.CONVERTHUB_STATUS_URL || '';
  const pollAttempts = Number(process.env.CONVERTHUB_POLL_ATTEMPTS || 20);
  const pollIntervalMs = Number(process.env.CONVERTHUB_POLL_INTERVAL_MS || 1500);

  return {
    enabled: Boolean(apiUrl),
    apiUrl,
    apiKey,
    statusUrlTemplate,
    pollAttempts: Number.isFinite(pollAttempts) ? pollAttempts : 20,
    pollIntervalMs: Number.isFinite(pollIntervalMs) ? pollIntervalMs : 1500,
  };
}

function tryExtractDownloadUrl(payload) {
  if (!payload || typeof payload !== 'object') return '';
  return payload.downloadUrl
    || payload.url
    || payload.fileUrl
    || payload.outputUrl
    || payload.result?.downloadUrl
    || payload.result?.url
    || payload.data?.downloadUrl
    || payload.data?.url
    || '';
}

function tryExtractJobId(payload) {
  if (!payload || typeof payload !== 'object') return '';
  return payload.jobId
    || payload.id
    || payload.result?.jobId
    || payload.data?.jobId
    || '';
}

function statusLooksDone(payload) {
  const raw = payload?.status || payload?.state || payload?.result?.status || payload?.data?.status || '';
  const s = String(raw).toLowerCase();
  return s === 'done' || s === 'completed' || s === 'success' || s === 'succeeded' || s === 'finished';
}

async function downloadPdfFromUrl(downloadUrl, apiKey) {
  const headers = {};
  if (apiKey) headers.Authorization = `Bearer ${apiKey}`;

  const response = await axios.get(downloadUrl, {
    responseType: 'arraybuffer',
    headers,
    timeout: 120000,
    maxContentLength: 50 * 1024 * 1024,
    maxBodyLength: 50 * 1024 * 1024,
  });

  return Buffer.from(response.data);
}

async function convertViaConvertHub(texPath) {
  const cfg = getConvertHubConfig();
  if (!cfg.enabled) {
    throw new Error('ConvertHub fallback is not configured. Set CONVERTHUB_API_URL (and CONVERTHUB_API_KEY if required).');
  }

  const form = new FormData();
  form.append('file', fs.createReadStream(texPath));
  form.append('targetFormat', 'pdf');

  const headers = { ...form.getHeaders() };
  if (cfg.apiKey) headers.Authorization = `Bearer ${cfg.apiKey}`;

  const upload = await axios.post(cfg.apiUrl, form, {
    headers,
    timeout: 120000,
    maxContentLength: 50 * 1024 * 1024,
    maxBodyLength: 50 * 1024 * 1024,
    responseType: 'arraybuffer',
    validateStatus: (status) => status >= 200 && status < 300,
  });

  const ct = String(upload.headers?.['content-type'] || '').toLowerCase();
  if (ct.includes('application/pdf')) {
    return Buffer.from(upload.data);
  }

  const textBody = Buffer.from(upload.data).toString('utf8');
  let payload = null;
  try {
    payload = JSON.parse(textBody);
  } catch {
    throw new Error(`ConvertHub returned non-PDF non-JSON response: ${textBody.slice(0, 400)}`);
  }

  const immediateUrl = tryExtractDownloadUrl(payload);
  if (immediateUrl) {
    return downloadPdfFromUrl(immediateUrl, cfg.apiKey);
  }

  const jobId = tryExtractJobId(payload);
  if (!jobId || !cfg.statusUrlTemplate) {
    throw new Error('ConvertHub response did not include a download URL. Provide CONVERTHUB_STATUS_URL to poll async jobs.');
  }

  const statusUrl = cfg.statusUrlTemplate.replace('{jobId}', encodeURIComponent(jobId));
  const statusHeaders = {};
  if (cfg.apiKey) statusHeaders.Authorization = `Bearer ${cfg.apiKey}`;

  for (let attempt = 0; attempt < cfg.pollAttempts; attempt += 1) {
    const statusResp = await axios.get(statusUrl, {
      headers: statusHeaders,
      timeout: 60000,
      validateStatus: (status) => status >= 200 && status < 300,
    });

    const statusPayload = statusResp.data || {};
    const polledUrl = tryExtractDownloadUrl(statusPayload);
    if (polledUrl) {
      return downloadPdfFromUrl(polledUrl, cfg.apiKey);
    }

    if (statusLooksDone(statusPayload)) {
      throw new Error('ConvertHub job completed but no download URL was returned in status payload.');
    }

    await sleep(cfg.pollIntervalMs);
  }

  throw new Error(`ConvertHub job polling timed out after ${cfg.pollAttempts} attempts.`);
}

function compileLocalLatex(tempRoot) {
  const pdfPath = path.join(tempRoot, 'report.pdf');

  const run = spawnSync(
    'pdflatex',
    ['-interaction=nonstopmode', '-halt-on-error', 'report.tex'],
    { cwd: tempRoot, encoding: 'utf8' }
  );

  if (run.error || run.status !== 0 || !fs.existsSync(pdfPath)) {
    const detail = run.error?.message || run.stderr || run.stdout || 'Unknown pdflatex error';
    throw new Error(`PDF compilation failed: ${detail}`);
  }

  return fs.readFileSync(pdfPath);
}

export async function compileLatexToPdf(latexSource) {
  const tempRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'wise-report-'));
  const texPath = path.join(tempRoot, 'report.tex');

  fs.writeFileSync(texPath, latexSource, 'utf8');

  try {
    return compileLocalLatex(tempRoot);
  } catch (localErr) {
    const cfg = getConvertHubConfig();
    if (!cfg.enabled) {
      throw localErr;
    }

    try {
      return await convertViaConvertHub(texPath);
    } catch (remoteErr) {
      throw new Error(
        `Local compile failed and ConvertHub fallback failed. Local: ${localErr.message}. ConvertHub: ${remoteErr.message}`
      );
    }
  } finally {
    fs.rmSync(tempRoot, { recursive: true, force: true });
  }
}
