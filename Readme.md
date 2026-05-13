# 🚀 Drowsiness Detection System

A real-time **Driver Drowsiness Detection System** using **Computer Vision**, **TensorFlow**, and **OpenCV**.  
This project detects:
- 👁️ Eye Closure
- 😮 Yawning
- ⚠️ Driver Drowsiness in Real-Time

---

# 📌 Problem

The existing model files (`eye_model.h5`, `mouth_model.h5`) were trained using an older/incompatible Keras version and cannot be loaded with the current TensorFlow environment.

To fix this issue, retrain the models using the provided training scripts.

---

# 📂 Project Structure

```bash
Drowsiness-Detection/
│
├── dataset/
│   ├── eyes/
│   │   ├── close/
│   │   └── open/
│   │
│   └── mouth/
│       ├── normal/
│       └── yawning/
│
├── models/
│   ├── eye_model.h5
│   └── mouth_model.h5
│
├── train_eye.py
├── train_mouth.py
├── main.py
├── arduino.py
├── Requirement.txt
└── README.md
