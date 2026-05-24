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
    if img is None:
        raise HTTPException(status_code=400, detail="Invalid image file.")

    # cv2 channel flip via slicing can create non-contiguous arrays that dlib rejects.
    rgb_img = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)

    face_locations = face_recognition.face_locations(rgb_img, model="hog")
    print("Faces detected during registration:", len(face_locations))
    encodings = face_recognition.face_encodings(rgb_img, face_locations)
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
    if frame is None:
        raise HTTPException(status_code=400, detail="Invalid image file.")

    rgb_frame = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)

    # Resize image for better detection speed + accuracy
    small_frame = cv2.resize(rgb_frame, (0, 0), fx=0.5, fy=0.5)
    face_locations = face_recognition.face_locations(
        small_frame,
        model="hog"
    )
    print("Faces detected during verification:", len(face_locations))
    current_encodings = face_recognition.face_encodings(
        small_frame,
        face_locations
    )

    if not current_encodings:
        return {"match": False, "status": "no_face_detected", "distance": 1.0}
        
    for current_enc in current_encodings:
        dist = face_recognition.face_distance([reference_enc], current_enc)[0]
        if dist < 0.5:
            return {"match": True, "status": "match", "distance": float(dist)}
            
    return {"match": False, "status": "mismatch", "distance": float(dist)}

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8001)
