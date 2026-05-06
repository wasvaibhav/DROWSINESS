# 🚀 Drowsiness Detection - Setup Guide

## Issue
Your existing models (eye_model.h5, mouth_model.h5) were created with an incompatible Keras version and cannot be loaded with the current TensorFlow setup.

## Solution: Retrain Your Models

### Step 1: Prepare Your Dataset
The script expects this folder structure:
```
dataset/
├── eyes/
│   ├── close/          (images of closed eyes)
│   └── open/           (images of open eyes)
└── mouth/
    ├── normal/         (images of normal mouth)
    └── yawning/        (images of yawning mouth)
```

**Recommended Dataset**: NTHU Yawning Dataset (mentioned in README.md)
- Download from: https://www.kaggle.com/
- Or prepare your own images

### Step 2: Place Images in Dataset Folders
- Download and extract dataset images into the appropriate folders
- Ensure each folder has training images

### Step 3: Train Eye Model
```bash
python train_eye.py
```
✓ This will create `models/eye_model.h5`

### Step 4: Train Mouth Model
```bash
python train_mouth.py
```
✓ This will create `models/mouth_model.h5`

### Step 5: Run Detection
```bash
python main.py
```
✓ Press 'q' to exit the video feed

## 🎯 What Each Script Does

| File | Purpose |
|------|---------|
| `train_eye.py` | Trains CNN model to detect open/closed eyes |
| `train_mouth.py` | Trains CNN model to detect yawning |
| `main.py` | Real-time drowsiness detection using webcam |
| `arduino.py` | Send alerts to Arduino (to be configured) |

## 📋 Environment
- Python: 3.10
- TensorFlow: 2.16.1
- OpenCV: 4.8.0.76
- All dependencies in `Requirement.txt`

## ✅ Status Check
Run this to verify your setup:
```bash
python -c "from tensorflow.keras.models import load_model; print('✓ TensorFlow OK')"
python -c "import cv2; print('✓ OpenCV OK')"
python -c "import numpy as np; print('✓ NumPy OK')"
```

---
**Need help?** Check the error messages in main.py output for specific guidance.
