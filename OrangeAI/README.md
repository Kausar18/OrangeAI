# 🍊 OrangeAI — Klasifikasi Kualitas Buah Jeruk

Sistem klasifikasi kualitas buah jeruk berbasis Deep Learning menggunakan **CNN MobileNetV2 Transfer Learning** dengan implementasi web menggunakan **Flask**.

---

## 📊 Hasil Model

| Metrik | Nilai |
|---|---|
| **Akurasi Testing** | **99.30%** |
| Loss | 0.0319 |
| Total Dataset | 4.942 gambar |
| Jumlah Kelas | 4 kelas |
| Epoch Training | 29 epoch |

---

## 🏷️ Kelas Output

| # | Label | Keterangan |
|---|---|---|
| 1 | ✅ **SEGAR** | Fresh Orange — Layak konsumsi |
| 2 | ❌ **BUSUK** | Rotten Orange — Tidak layak konsumsi |
| 3 | 🟡 **BINTIK HITAM** | Black Spot — Terdeteksi bintik jamur |
| 4 | 🟠 **BERPENYAKIT** | Canker/Greening — Terdeteksi penyakit |

---

## 🛠️ Teknologi

- **Backend** : Python + Flask
- **Model CNN** : TensorFlow / Keras + MobileNetV2 (Transfer Learning)
- **Frontend** : HTML, CSS, JavaScript
- **Dataset** : Kaggle Fresh & Rotten + Orange Diseases Dataset

---

## 🚀 Cara Menjalankan

### 1. Clone repository ini
```bash
git clone https://github.com/USERNAME/OrangeAI.git
cd OrangeAI
```

### 2. Aktifkan environment & install dependencies
```bash
pip install -r requirements.txt
```

### 3. Download file model
> ⚠️ File model tidak disertakan di repository karena ukurannya besar.

Download file berikut dari Google Drive:
- `model_cnn_jeruk.h5`
- `class_names.json` *(sudah tersedia di repo)*

**Link Google Drive:** `[GANTI DENGAN LINK DRIVE KAMU]`

Taruh file `model_cnn_jeruk.h5` di folder `OrangeAI/` (sejajar dengan `app.py`).

### 4. Jalankan server
```bash
python app.py
```

### 5. Buka browser
```
http://127.0.0.1:5000
```

---

## 📁 Struktur Folder

```
OrangeAI/
├── app.py                  ← Server Flask + routing
├── class_names.json        ← Nama kelas output model
├── model_cnn_jeruk.h5      ← Download dari Google Drive
├── requirements.txt
├── static/
│   ├── style.css
│   ├── script.js
│   ├── profile/            ← Foto profil tim
│   └── uploads/            ← Folder upload sementara
└── templates/
    ├── index.html          ← Halaman Klasifikasi
    ├── riwayat.html        ← Halaman Riwayat Analisis
    ├── statistik.html      ← Halaman Dashboard Statistik
    └── tentang.html        ← Halaman Tentang
```

---

## 📦 Dataset

| Dataset | Sumber | Kelas |
|---|---|---|
| Fruits Fresh and Rotten | [Kaggle - sriramr](https://www.kaggle.com/datasets/sriramr/fruits-fresh-and-rotten-for-classification) | Fresh, Rotten |
| Orange Diseases Dataset | [Kaggle - jonathansilva2020](https://www.kaggle.com/datasets/jonathansilva2020/orange-diseases-dataset) | Blackspot, Canker, Greening |

---

## 👥 Tim

| Nama | NPM |
|---|---|
| Maulana Malik Ibrahim | 065123069 |
| Adriansyah Juliandi | 065123102 |

**Universitas Pakuan — Ilmu Komputer FMIPA**  
**Mata Kuliah: Pengolahan Citra Digital — 2025**
