from flask import Flask, render_template, request, jsonify, send_file
import os
import cv2
import numpy as np
from PIL import Image
import io
import base64
import json
from datetime import datetime
import uuid
from werkzeug.utils import secure_filename
import librosa
import matplotlib.pyplot as plt
import seaborn as sns
from accurate_deepfake_detector import AccurateDeepfakeDetector

app = Flask(__name__)
app.config['SECRET_KEY'] = 'deepshield-ai-secret-key-2024'
app.config['UPLOAD_FOLDER'] = 'uploads'
app.config['MAX_CONTENT_LENGTH'] = 16 * 1024 * 1024  # 16MB max file size

# Ensure upload directory exists
os.makedirs(app.config['UPLOAD_FOLDER'], exist_ok=True)

# Initialize the accurate deepfake detector
detector = AccurateDeepfakeDetector()

ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif', 'mp4', 'avi', 'mov', 'wav', 'mp3', 'm4a'}

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/detect', methods=['POST'])
def detect_deepfake():
    try:
        if 'file' not in request.files:
            return jsonify({'error': 'No file provided'}), 400
        
        file = request.files['file']
        if file.filename == '':
            return jsonify({'error': 'No file selected'}), 400
        
        if file and allowed_file(file.filename):
            # Save file temporarily
            filename = secure_filename(file.filename)
            filepath = os.path.join(app.config['UPLOAD_FOLDER'], f"{uuid.uuid4()}_{filename}")
            file.save(filepath)
            
            # Detect file type and process accordingly
            file_extension = filename.rsplit('.', 1)[1].lower()
            
            if file_extension in ['png', 'jpg', 'jpeg', 'gif']:
                result = detector.detect_image(filepath)
            elif file_extension in ['mp4', 'avi', 'mov']:
                result = detector.detect_video(filepath)
            elif file_extension in ['wav', 'mp3', 'm4a']:
                result = detector.detect_audio(filepath)
            else:
                return jsonify({'error': 'Unsupported file type'}), 400
            
            # Clean up temporary file
            os.remove(filepath)
            
            return jsonify(result)
        
        return jsonify({'error': 'Invalid file type'}), 400
    
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/live-detection')
def live_detection():
    return render_template('live_detection.html')

@app.route('/api/live-frame', methods=['POST'])
def process_live_frame():
    try:
        data = request.get_json()
        image_data = data['image']
        
        # Decode base64 image
        image_data = image_data.split(',')[1]
        image_bytes = base64.b64decode(image_data)
        image = Image.open(io.BytesIO(image_bytes))
        
        # Save temporarily and use detector
        temp_path = os.path.join(app.config['UPLOAD_FOLDER'], f"temp_{uuid.uuid4()}.jpg")
        image.save(temp_path)
        
        # Detect deepfake
        result = detector.detect_image(temp_path)
        
        # Clean up
        os.remove(temp_path)
        
        return jsonify(result)
    
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/dashboard')
def dashboard():
    return render_template('dashboard.html')

@app.route('/api/stats')
def get_stats():
    # Mock statistics for demonstration
    stats = {
        'total_analyses': 1250,
        'deepfakes_detected': 89,
        'accuracy_rate': 94.2,
        'recent_detections': [
            {'type': 'image', 'confidence': 87.5, 'timestamp': '2024-01-15 14:30:00'},
            {'type': 'video', 'confidence': 92.1, 'timestamp': '2024-01-15 14:25:00'},
            {'type': 'audio', 'confidence': 78.9, 'timestamp': '2024-01-15 14:20:00'},
        ]
    }
    return jsonify(stats)

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000) 