const RESEARCH_RANGES = {
  blink_rate_bpm: { normalMin: 12, normalMax: 20, stressHigh: 25 },
  gaze_toward_camera_ratio: { normalMin: 0.6, normalMax: 0.7, stressOffScreen: 0.3 },
  speech_rate_wpm: { normalMin: 130, normalMax: 160, tooSlow: 110, tooFast: 180 },
  fillers_per_min: { normalMax: 5 },
};

const clamp = (v, lo = 0, hi = 1) => Math.min(Math.max(v, lo), hi);

const safeNum = (v, fallback = 0) => {
  const n = Number(v);
  return Number.isFinite(n) ? n : fallback;
};

const round = (v, d = 3) => Number(safeNum(v).toFixed(d));

function outOfRangeDeviation(value, min, max) {
  if (value >= min && value <= max) return 0;
  if (value < min) return (min - value) / Math.max(min, 1);
  return (value - max) / Math.max(max, 1);
}

function parseTurns(history = []) {
  const turns = [];
  let pendingQuestion = null;

  for (const msg of history) {
    if (msg?.sender === 'ai') {
      pendingQuestion = String(msg.text || '').trim();
      continue;
    }

    if (msg?.sender === 'user') {
      turns.push({
        question: pendingQuestion || '',
        answer: String(msg.text || '').trim(),
      });
    }
  }

  return turns;
}

function tokenize(text) {
  return String(text || '')
    .toLowerCase()
    .replace(/[^a-z0-9\s']/g, ' ')
    .split(/\s+/)
    .filter(Boolean);
}

function jaccardSimilarity(a, b) {
  const setA = new Set(tokenize(a));
  const setB = new Set(tokenize(b));
  if (!setA.size || !setB.size) return 0;

  let intersection = 0;
  for (const token of setA) {
    if (setB.has(token)) intersection += 1;
  }

  const union = setA.size + setB.size - intersection;
  return union > 0 ? intersection / union : 0;
}

function scoreStarStructure(answerText) {
  const txt = String(answerText || '').toLowerCase();
  const groups = {
    situation: /\b(situation|context|at that time|in that role|background)\b/.test(txt),
    task: /\b(task|responsibility|goal|objective|target|challenge)\b/.test(txt),
    action: /\b(i\s+did|i\s+implemented|i\s+built|i\s+designed|i\s+led|i\s+created|i\s+optimized|action)\b/.test(txt),
    result: /\b(result|outcome|impact|improved|reduced|increased|delivered|achieved|%|percent)\b/.test(txt),
  };

  const matched = Object.values(groups).filter(Boolean).length;
  return matched / 4;
}

function scoreClarity(answerText) {
  const answer = String(answerText || '').trim();
  if (!answer) return 0;

  const tokens = tokenize(answer);
  const wordCount = tokens.length;
  if (!wordCount) return 0;

  const sentences = answer.split(/[.!?]+/).map((s) => s.trim()).filter(Boolean);
  const sentenceCount = Math.max(sentences.length, 1);
  const avgSentenceLen = wordCount / sentenceCount;

  const lengthScore = clamp(1 - Math.abs(avgSentenceLen - 16) / 16);
  const punctuationScore = clamp(sentenceCount / Math.max(wordCount / 14, 1));
  const completenessScore = /[.!?]$/.test(answer) ? 1 : 0.7;

  return clamp(0.5 * lengthScore + 0.25 * punctuationScore + 0.25 * completenessScore);
}

function scoreConfidenceLanguage(answerText) {
  const txt = String(answerText || '').toLowerCase();
  const uncertain = (txt.match(/\b(maybe|perhaps|probably|i\s+guess|i\s+think|not\s+sure|kind\s+of|sort\s+of)\b/g) || []).length;
  const assertive = (txt.match(/\b(i\s+will|i\s+can|i\s+did|i\s+delivered|definitely|confident|clearly|achieved)\b/g) || []).length;
  const total = uncertain + assertive;

  if (!total) return 0.6;
  return clamp((assertive + 1) / (total + 2));
}

function buildNlpScores(history = []) {
  const turns = parseTurns(history);
  if (!turns.length) {
    return {
      structure_score: 0.45,
      relevance_score: 0.45,
      clarity_score: 0.45,
      confidence_language_score: 0.45,
      turns_analyzed: 0,
    };
  }

  const structureVals = turns.map((t) => scoreStarStructure(t.answer));
  const relevanceVals = turns.map((t) => jaccardSimilarity(t.question, t.answer));
  const clarityVals = turns.map((t) => scoreClarity(t.answer));
  const confidenceVals = turns.map((t) => scoreConfidenceLanguage(t.answer));

  const avg = (arr) => arr.reduce((s, x) => s + x, 0) / Math.max(arr.length, 1);

  return {
    structure_score: round(avg(structureVals), 3),
    relevance_score: round(avg(relevanceVals), 3),
    clarity_score: round(avg(clarityVals), 3),
    confidence_language_score: round(avg(confidenceVals), 3),
    turns_analyzed: turns.length,
  };
}

function classifyStress(stressScore) {
  if (stressScore > 0.7) return 'High Stress';
  if (stressScore >= 0.4) return 'Moderate Stress';
  return 'Low Stress';
}

function classifyCommunication(communicationScore) {
  if (communicationScore > 0.75) return 'Strong';
  if (communicationScore >= 0.5) return 'Average';
  return 'Needs Improvement';
}

function buildImprovementTips(metrics) {
  const tips = [];

  if (metrics.blink_rate_bpm_avg > RESEARCH_RANGES.blink_rate_bpm.stressHigh) {
    tips.push('Practice controlled breathing and take short visual breaks before interviews to reduce blink bursts.');
  }

  if (metrics.gaze_toward_camera_ratio < RESEARCH_RANGES.gaze_toward_camera_ratio.normalMin) {
    tips.push('Focus your attention on the camera lens to improve perceived eye contact and engagement.');
  }

  if (metrics.speech_rate_wpm > RESEARCH_RANGES.speech_rate_wpm.tooFast) {
    tips.push('Slow your pace by inserting deliberate 1–2 second pauses between key points.');
  }

  if (metrics.speech_rate_wpm < RESEARCH_RANGES.speech_rate_wpm.tooSlow) {
    tips.push('Increase speaking tempo slightly and use concise sentence framing to sound more decisive.');
  }

  if (metrics.structure_score < 0.55) {
    tips.push('Use STAR framing for each answer: Situation, Task, Action, and measurable Result.');
  }

  if (metrics.facial_tension_ratio > 0.4) {
    tips.push('Use jaw and facial relaxation drills before interviews to reduce visible tension.');
  }

  if (metrics.filler_per_min > RESEARCH_RANGES.fillers_per_min.normalMax) {
    tips.push('Replace filler words with silent pauses and pre-plan transitions between ideas.');
  }

  if (!tips.length) {
    tips.push('Maintain current delivery while adding more quantified outcomes to strengthen impact.');
  }

  return tips.slice(0, 5);
}

function buildStrengths(metrics) {
  const strengths = [];

  if (metrics.gaze_toward_camera_ratio >= RESEARCH_RANGES.gaze_toward_camera_ratio.normalMin) {
    strengths.push('Consistent camera-facing gaze supports strong interviewer engagement.');
  }

  if (
    metrics.speech_rate_wpm >= RESEARCH_RANGES.speech_rate_wpm.normalMin &&
    metrics.speech_rate_wpm <= RESEARCH_RANGES.speech_rate_wpm.normalMax
  ) {
    strengths.push('Speech rate stayed in an effective professional range.');
  }

  if (metrics.structure_score >= 0.65) {
    strengths.push('Answers followed a structured pattern with clear action/result sequencing.');
  }

  if (metrics.clarity_score >= 0.65) {
    strengths.push('Responses were generally clear, coherent, and easy to follow.');
  }

  if (metrics.pause_ratio >= 0.1 && metrics.pause_ratio <= 0.3) {
    strengths.push('Pause usage was balanced, enabling better pacing and comprehension.');
  }

  if (!strengths.length) {
    strengths.push('Demonstrated baseline consistency across multimodal interview signals.');
  }

  return strengths.slice(0, 4);
}

function buildVerdict(finalScore10) {
  if (finalScore10 >= 8.5) return 'Strong Hire';
  if (finalScore10 >= 7.0) return 'Hire';
  if (finalScore10 >= 5.5) return 'Leaning No';
  return 'No Hire';
}

export function generateInterviewAnalysis({ history = [], resumeText = '', voiceAnalytics = {}, behavioralAnalytics = {} }) {
  const nlp = buildNlpScores(history);

  const blinkRate = safeNum(behavioralAnalytics.blink_rate_bpm_avg, 18);
  const gazeToward = clamp(safeNum(behavioralAnalytics.gaze_toward_camera_ratio, 0.58));
  const facialTensionRatio = clamp(safeNum(behavioralAnalytics.facial_tension_ratio, 0.3));
  const postureShiftRatio = clamp(safeNum(behavioralAnalytics.posture_shift_ratio, 0.25));

  const speechRateWpm = safeNum(voiceAnalytics.speech_rate_wpm, 135);
  const pauseRatio = clamp(safeNum(voiceAnalytics.pause_ratio, 0.18));
  const pitchSd = safeNum(voiceAnalytics.pitch_variation_sd_hz, 24);
  const totalRecordedSec = safeNum(voiceAnalytics.total_recorded_sec, 0);
  const fillerRatePer100 = safeNum(voiceAnalytics.filler_rate_per_100_words, 0);
  const fillerPerMin = totalRecordedSec > 0
    ? safeNum(voiceAnalytics.filler_word_count, 0) / (totalRecordedSec / 60)
    : 0;

  const blinkDeviation = clamp(outOfRangeDeviation(blinkRate, 12, 20));
  const gazeInstability = clamp(1 - gazeToward);
  const voiceTremor = clamp(Math.abs(pitchSd - 28) / 35);
  const pauseIrregularity = clamp(0.6 * Math.abs(pauseRatio - 0.18) / 0.18 + 0.4 * (fillerPerMin / 10));

  const stressScore = clamp(
    0.2 * blinkDeviation +
    0.2 * gazeInstability +
    0.2 * facialTensionRatio +
    0.2 * voiceTremor +
    0.2 * pauseIrregularity
  );

  const speechClarity = nlp.clarity_score;
  const pitchStability = clamp(1 - Math.abs(pitchSd - 28) / 28);
  const postureStability = clamp(1 - postureShiftRatio);
  const eyeContact = gazeToward;

  const confidenceScore = clamp(
    0.3 * speechClarity +
    0.25 * pitchStability +
    0.25 * postureStability +
    0.2 * eyeContact
  );

  const fluency = clamp(1 - (fillerRatePer100 / 18) - (Math.abs(speechRateWpm - 145) / 120));
  const communicationScore = clamp(
    0.4 * nlp.structure_score +
    0.35 * nlp.relevance_score +
    0.25 * fluency
  );

  const finalScore = clamp(
    0.35 * communicationScore +
    0.35 * confidenceScore +
    0.3 * (1 - stressScore)
  );

  const finalScore10 = round(finalScore * 10, 2);
  const overallScore100 = Math.round(finalScore * 100);

  const stressLevel = classifyStress(stressScore);
  const communicationLevel = classifyCommunication(communicationScore);
  const confidenceLevel = classifyCommunication(confidenceScore);

  const metricsForTips = {
    blink_rate_bpm_avg: blinkRate,
    gaze_toward_camera_ratio: gazeToward,
    speech_rate_wpm: speechRateWpm,
    structure_score: nlp.structure_score,
    facial_tension_ratio: facialTensionRatio,
    filler_per_min: fillerPerMin,
    clarity_score: nlp.clarity_score,
    pause_ratio: pauseRatio,
  };

  const areasForImprovement = buildImprovementTips(metricsForTips);
  const strengths = buildStrengths({
    ...metricsForTips,
    pause_ratio: pauseRatio,
  });

  const criticalMissingPoints = [
    nlp.structure_score < 0.55 ? 'Responses lacked complete STAR progression in multiple answers.' : null,
    nlp.relevance_score < 0.45 ? 'Several answers drifted from the exact question objective.' : null,
    nlp.confidence_language_score < 0.45 ? 'Language included uncertainty markers that reduced decisiveness.' : null,
  ].filter(Boolean).join(' ');

  const hiringVerdict = buildVerdict(finalScore10);

  const recommendation = `Candidate performance indicates ${communicationLevel.toLowerCase()} communication and ${confidenceLevel.toLowerCase()} confidence with ${stressLevel.toLowerCase()}. Prioritize structured storytelling, camera-focused delivery, and controlled pacing to improve interview impact.`;

  return {
    overall_score: overallScore100,
    detailed_metrics: {
      technical_depth: Math.round(clamp(0.45 * nlp.relevance_score + 0.55 * nlp.structure_score) * 100),
      communication_clarity: Math.round(nlp.clarity_score * 100),
      problem_solving: Math.round(clamp(0.6 * nlp.structure_score + 0.4 * nlp.confidence_language_score) * 100),
      experience_relevance: Math.round(nlp.relevance_score * 100),
    },
    section_analysis: {
      experience: `Structure score ${Math.round(nlp.structure_score * 100)} suggests ${nlp.structure_score >= 0.65 ? 'strong' : 'partial'} use of context-action-impact storytelling.`,
      technical_skills: `Relevance score ${Math.round(nlp.relevance_score * 100)} reflects how directly answers addressed technical prompts.`,
      achievements: `Confidence language score ${Math.round(nlp.confidence_language_score * 100)} indicates ${nlp.confidence_language_score >= 0.6 ? 'assertive' : 'inconsistent'} articulation of outcomes.`,
    },
    strengths,
    areas_for_improvement: areasForImprovement,
    voice_analysis: {
      delivery_score: Math.round(clamp(0.4 * fluency + 0.3 * pitchStability + 0.3 * (1 - pauseIrregularity)) * 100),
      summary: `Speech pacing averaged ${Math.round(speechRateWpm)} WPM with pause ratio ${Math.round(pauseRatio * 100)}%. Filler frequency was ${fillerPerMin.toFixed(1)} per minute and pitch variation measured ${pitchSd.toFixed(1)} Hz.`,
      focus_areas: areasForImprovement.slice(0, 2),
    },
    content_evaluation: {
      relevance: Math.round(nlp.relevance_score * 100),
      structure: Math.round(nlp.structure_score * 100),
      clarity: Math.round(nlp.clarity_score * 100),
      confidence_language: Math.round(nlp.confidence_language_score * 100),
    },
    scoring_breakdown: {
      stress_score: round(stressScore, 3),
      confidence_score: round(confidenceScore, 3),
      communication_score: round(communicationScore, 3),
      final_score_10: finalScore10,
    },
    classifications: {
      stress_level: stressLevel,
      communication_level: communicationLevel,
      confidence_level: confidenceLevel,
    },
    behavioral_insights: {
      eye_contact: `Gaze toward camera ratio: ${(gazeToward * 100).toFixed(1)}%.`,
      facial_expression: `Facial tension ratio: ${(facialTensionRatio * 100).toFixed(1)}%, smile presence ratio: ${(safeNum(behavioralAnalytics.smile_presence_ratio, 0) * 100).toFixed(1)}%.`,
      head_movement: `Head nod index: ${safeNum(behavioralAnalytics.head_nod_rate_bpm_avg, 0).toFixed(2)}, posture shift ratio: ${(postureShiftRatio * 100).toFixed(1)}%.`,
    },
    research_benchmarks: RESEARCH_RANGES,
    critical_missing_points: criticalMissingPoints || 'No critical blockers detected, but stronger evidence-based examples would improve decisions.',
    hiring_verdict: hiringVerdict,
    summary: recommendation,
    ai_recommendation: recommendation,
    voice_analytics: voiceAnalytics || {},
    behavioral_analytics: behavioralAnalytics || {},
    resume_excerpt: String(resumeText || '').slice(0, 400),
  };
}
