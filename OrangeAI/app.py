from flask import Flask, render_template, request, jsonify
import os
import numpy as np
import json
import uuid
from datetime import datetime

# TensorFlow / Keras
os.environ['TF_CPP_MIN_LOG_LEVEL'] = '3'
import tensorflow as tf
from tensorflow.keras.models import load_model
from tensorflow.keras.preprocessing import image as keras_image

app = Flask(__name__)
app.config['UPLOAD_FOLDER'] = 'static/uploads'
app.config['MAX_CONTENT_LENGTH'] = 10 * 1024 * 1024  # 10MB

# ── Load model CNN & class names ──────────────────────────────
print("Loading model CNN...")
model = load_model('model_cnn_jeruk.h5')

with open('class_names.json', 'r') as f:
    CLASS_NAMES = json.load(f)

# Mapping nama folder → label tampilan
LABEL_MAP = {
    'freshoranges'  : 'SEGAR',
    'rottenoranges' : 'BUSUK',
    'blackspot'     : 'BINTIK HITAM',
    'berpenyakit'   : 'BERPENYAKIT',
    'fresh'         : 'SEGAR',
    'rotten'        : 'BUSUK',
}

# Deskripsi per kelas
DESC_MAP = {
    'freshoranges'  : 'Fresh Orange — Layak konsumsi',
    'rottenoranges' : 'Rotten Orange — Tidak layak konsumsi',
    'blackspot'     : 'Black Spot — Terdeteksi bintik hitam jamur',
    'berpenyakit'   : 'Berpenyakit — Terdeteksi gejala canker/greening',
    'fresh'         : 'Fresh Orange — Layak konsumsi',
    'rotten'        : 'Rotten Orange — Tidak layak konsumsi',
}

# Warna per kelas (untuk frontend)
COLOR_MAP = {
    'freshoranges'  : 'segar',
    'rottenoranges' : 'busuk',
    'blackspot'     : 'blackspot',
    'berpenyakit'   : 'berpenyakit',
    'fresh'         : 'segar',
    'rotten'        : 'busuk',
}

print(f"Model loaded! Kelas: {CLASS_NAMES}")

# Riwayat (in-memory)
history = []


def prediksi_gambar(img_path):
    """Prediksi gambar menggunakan CNN MobileNetV2"""
    img       = keras_image.load_img(img_path, target_size=(224, 224))
    img_array = keras_image.img_to_array(img) / 255.0
    img_array = np.expand_dims(img_array, axis=0)

    proba    = model.predict(img_array, verbose=0)[0]
    pred_idx = int(np.argmax(proba))
    raw_label= CLASS_NAMES[pred_idx]
    confidence= float(proba[pred_idx]) * 100

    # Semua probabilitas per kelas
    all_proba = {
        CLASS_NAMES[i]: round(float(proba[i]) * 100, 1)
        for i in range(len(CLASS_NAMES))
    }

    return raw_label, confidence, all_proba


@app.route('/')
def index():
    return render_template('index.html', class_names=CLASS_NAMES)


@app.route('/klasifikasi', methods=['POST'])
def klasifikasi():
    if 'file' not in request.files:
        return jsonify({'error': 'Tidak ada file yang diupload'}), 400

    file = request.files['file']
    if file.filename == '':
        return jsonify({'error': 'File kosong'}), 400

    ext = file.filename.rsplit('.', 1)[-1].lower()
    if ext not in ['jpg', 'jpeg', 'png']:
        return jsonify({'error': 'Format tidak didukung. Pakai JPG/PNG'}), 400

    # Simpan file
    unique_name = f"{uuid.uuid4().hex[:8]}_{file.filename}"
    filepath    = os.path.join(app.config['UPLOAD_FOLDER'], unique_name)
    file.save(filepath)

    try:
        raw_label, confidence, all_proba = prediksi_gambar(filepath)

        label     = LABEL_MAP.get(raw_label, raw_label.upper())
        label_full= DESC_MAP.get(raw_label, raw_label)
        color     = COLOR_MAP.get(raw_label, 'busuk')

        result = {
            'success'    : True,
            'filename'   : file.filename,
            'image_url'  : f"/static/uploads/{unique_name}",
            'raw_label'  : raw_label,
            'label'      : label,
            'label_full' : label_full,
            'color'      : color,
            'confidence' : round(confidence, 1),
            'all_proba'  : all_proba,
            'waktu'      : datetime.now().strftime('%H:%M:%S WIB')
        }

        history.insert(0, {
            'filename'  : file.filename,
            'label'     : label,
            'color'     : color,
            'confidence': round(confidence, 1)
        })
        if len(history) > 10:
            history.pop()

        return jsonify(result)

    except Exception as e:
        return jsonify({'error': str(e)}), 500


@app.route('/riwayat')
def riwayat():
    return jsonify(history)
@app.route('/riwayat-page')
def riwayat_page():
    return render_template('riwayat.html')

@app.route('/statistik-page')
def statistik_page():
    return render_template('statistik.html')

@app.route('/tentang-page')
def tentang_page():
    return render_template('tentang.html')

@app.route('/riwayat-clear', methods=['POST'])
def riwayat_clear():
    global history
    history = []
    return jsonify({'success': True}) 

@app.route('/api/statistik')
def api_statistik():  
    if not history:
        return jsonify({
            'total': 0,
            'per_kelas': {},
            'avg_confidence': {},
            'tertinggi': None
            
        })

    per_kelas = {}
    conf_sum  = {}
    conf_count= {}

    for item in history:
        lbl = item['label']
        per_kelas[lbl]  = per_kelas.get(lbl, 0) + 1
        conf_sum[lbl]   = conf_sum.get(lbl, 0) + item['confidence']
        conf_count[lbl] = conf_count.get(lbl, 0) + 1

    avg_confidence = {
        k: round(conf_sum[k] / conf_count[k], 1)
        for k in conf_sum
    }

    tertinggi = max(history, key=lambda x: x['confidence'])

    return jsonify({
        'total'         : len(history),
        'per_kelas'     : per_kelas,
        'avg_confidence': avg_confidence,
        'tertinggi'     : tertinggi,
        'riwayat'       : history
    })

import atexit
import glob

def bersihkan_uploads():
    """Hapus semua file di folder uploads saat server dimatikan"""
    files = glob.glob('static/uploads/*')
    for f in files:
        try:
            os.remove(f)
        except Exception as e:
            print(f"Gagal hapus {f}: {e}")
    print(f"Berhasil membersihkan {len(files)} file di static/uploads/")

atexit.register(bersihkan_uploads)

if __name__ == '__main__':
    os.makedirs('static/uploads', exist_ok=True)
    print("Starting Flask server...")
    app.run(debug=True, port=5000, host='0.0.0.0')
    print("Server stopped.")