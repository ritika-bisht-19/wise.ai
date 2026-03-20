import os
import time
import whisper
import numpy as np
from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
import tempfile
import re

app = FastAPI()

# Enable CORS for React frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load Whisper model once at startup
print("Loading Whisper model...")
model = whisper.load_model("base")
print("Model loaded.")

FILLER_WORDS = ["um", "uh", "like", "you know", "basically", "actually"]

def compute_metrics(result):
    segments = result["segments"]
    text = result["text"]
    
    # 1. Answer Length / Duration
    answer_duration = segments[-1]["end"] if segments else 0
    
    # 2. Total Words
    words = text.split()
    total_words = len(words)
    
    # 3. Speech Rate (Words per minute)
    speech_rate = (total_words / (answer_duration / 60)) if answer_duration > 0 else 0
    
    # 4. Pause Duration
    pauses = []
    for i in range(1, len(segments)):
        p = segments[i]["start"] - segments[i-1]["end"]
        if p > 0.1: # count as pause if > 100ms
            pauses.append(p)
    
    avg_pause = sum(pauses) / len(pauses) if pauses else 0
    max_pause = max(pauses) if pauses else 0
    
    # 5. Filler Word Density
    filler_count = sum(1 for w in words if w.lower().strip(",.?!") in FILLER_WORDS)
    filler_density = (filler_count / total_words * 100) if total_words > 0 else 0
    
    # 6. Quantification Score (Sentences with numbers / total sentences)
    # Using simple split by punctuation for sentences
    sentences = re.split(r'[.!?]+', text)
    sentences = [s.strip() for s in sentences if s.strip()]
    total_sentences = len(sentences)
    
    sentences_with_numbers = 0
    for s in sentences:
        if any(char.isdigit() for char in s) or any(keyword in s.lower() for keyword in ["percent", "percentage", "metric", "measurement"]):
            sentences_with_numbers += 1
            
    quantification_ratio = (sentences_with_numbers / total_sentences) if total_sentences > 0 else 0
    
    return {
        "transcript": text,
        "speech_rate": round(speech_rate, 1),
        "avg_pause": round(avg_pause, 2),
        "max_pause": round(max_pause, 2),
        "filler_density": round(filler_density, 1),
        "answer_duration": round(answer_duration, 1),
        "quantification_ratio": round(quantification_ratio, 2)
    }

@app.post("/analyze-speech")
async def analyze_speech(audio: UploadFile = File(...)):
    # Save uploaded file to a temporary location
    with tempfile.NamedTemporaryFile(delete=False, suffix=".wav") as tmp:
        tmp.write(await audio.read())
        tmp_path = tmp.name

    try:
        # Transcribe using local Whisper
        # fp16=False if running on CPU
        result = model.transcribe(tmp_path, fp16=False)
        metrics = compute_metrics(result)
        return metrics
    finally:
        if os.path.exists(tmp_path):
            os.remove(tmp_path)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
