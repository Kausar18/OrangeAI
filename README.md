# 🍊 OrangeAI — Klasifikasi Kualitas Buah Jeruk

Sistem klasifikasi kualitas buah jeruk berbasis Deep Learning 
menggunakan CNN MobileNetV2 Transfer Learning dengan implementasi 
web menggunakan Flask.

## Kelas Output
| Kelas | Label | Keterangan |
|---|---|---|
| 1 | ✅ SEGAR | Fresh Orange — Layak konsumsi |
| 2 | ❌ BUSUK | Rotten Orange — Tidak layak konsumsi |
| 3 | 🟡 BINTIK HITAM | Black Spot — Terdeteksi bintik jamur |
| 4 | 🟠 BERPENYAKIT | Canker/Greening — Terdeteksi penyakit |

## Hasil Model
| Metrik | Nilai |
|---|---|
| Akurasi Testing | **99.30%** |
| Loss | 0.0319 |
| Total Dataset | 4.942 gambar |
| Jumlah Kelas | 4 kelas |
| Epoch | 29 epoch |

## Teknologi
- **Backend**: Python + Flask
- **Model**: TensorFlow/Keras + MobileNetV2 (Transfer Learning)
- **Frontend**: HTML, CSS, JavaScript
- **Dataset**: Kaggle Fresh&Rotten + Orange Diseases Dataset

## Cara Menjalankan

### 1. Clone / Download repository ini

### 2. Install dependencies
pip install flask tensorflow numpy

### 3. Download model
Download file model_cnn_jeruk.h5 dan class_names.json  
dari Google Drive: **[LINK DRIVE DI SINI]**  
Taruh di folder OrangeAI/

### 4. Jalankan server
python app.py

### 5. Buka browser
http://127.0.0.1:5000

## Struktur Folder
OrangeAI/
├── app.py
├── class_names.json
├── model_cnn_jeruk.h5 ← download dari Drive
├── static/
│ ├── style.css
│ ├── script.js
│ └── uploads/
└── templates/
├── index.html
├── riwayat.html
├── statistik.html
└── tentang.html

## Dataset
- [Fruits Fresh and Rotten - Kaggle](https://www.kaggle.com/datasets/sriramr/fruits-fresh-and-rotten-for-classification)
- [Orange Diseases Dataset - Kaggle](https://www.kaggle.com/datasets/jonathansilva2020/orange-diseases-dataset)

## Tim
- **Maulana Malik Ibrahim** — 065123069
- **Adriansyah Juliandi** — 065123102

**Universitas Pakuan • Pengolahan Citra Digital • 2025**
