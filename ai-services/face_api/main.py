from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import face_recognition
import numpy as np
import cv2
import tempfile
import ast
import os
from pydantic import BaseModel
import uvicorn
import io

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

registered_encodings = {}

@app.post("/api/register-face")
async def register_face(file: UploadFile = File(...)):
    contents = await file.read()
    nparr = np.frombuffer(contents, np.uint8)
    img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
    rgb_img = img[:, :, ::-1]

    encodings = face_recognition.face_encodings(rgb_img)
    if not encodings:
        raise HTTPException(status_code=400, detail="No face detected in the photo.")

    registered_encodings["default"] = encodings[0].tolist() 
    return {"status": "success", "message": "Face registered."}

@app.post("/api/verify-face")
async def verify_face(file: UploadFile = File(...)):
    if "default" not in registered_encodings:
        raise HTTPException(status_code=400, detail="No registered face found.")
        
    reference_enc = np.array(registered_encodings["default"])

    contents = await file.read()
    nparr = np.frombuffer(contents, np.uint8)
    frame = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
    rgb_frame = frame[:, :, ::-1]

    face_locations = face_recognition.face_locations(rgb_frame)
    current_encodings = face_recognition.face_encodings(rgb_frame, face_locations)

    if not current_encodings:
        return {"match": False, "status": "no_face_detected", "distance": 1.0}
        
    for current_enc in current_encodings:
        dist = face_recognition.face_distance([reference_enc], current_enc)[0]
        if dist < 0.5:
            return {"match": True, "status": "match", "distance": float(dist)}
            
    return {"match": False, "status": "mismatch", "distance": float(dist)}

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8001)
