# OpenMusic API V3

Submission akhir kelas "Belajar Fundamentals Aplikasi Back-End". Proyek ini telah dipisahkan menjadi dua aplikasi independen sesuai spesifikasi submission:
1. **Open Music API** (`v3`) - Main RESTful API.
2. **Consumer App** (`consumer`) - Message broker consumer untuk fitur ekspor playlist.

## Struktur Project
```
.
├── v3/                 # API Application
│   ├── src/
│   ├── package.json
│   └── .env           # Environment variable untuk API
├── consumer/           # Consumer Application
│   ├── package.json
│   └── .env           # Environment variable untuk Consumer
├── docker-compose.yml  # Infrastructure (Redis & RabbitMQ)
└── README.md
```

## Requirements
- Node.js
- Docker (untuk Redis & RabbitMQ)

## Instalasi & Konfigurasi

1. **Jalankan Infrastructure (Redis & RabbitMQ)**
   Jalankan perintah ini di root folder:
   ```bash
   docker-compose up -d
   ```

2. **Setup Open Music API (`v3`)**
   - Masuk ke folder `v3`.
   - Install dependencies.
   - Buat file `.env` (bisa copy dari `.env.example`).
   - Jalankan migration database.
   ```bash
   cd v3
   npm install
   # Setup .env dahulu
   npm run migrate up
   ```

3. **Setup Consumer (`consumer`)**
   - Masuk ke folder `consumer`.
   - Install dependencies.
   - Buat file `.env`.
   ```bash
   cd consumer
   npm install
   # Setup .env dahulu
   ```

## Cara Menjalankan

Aplikasi ini membutuhkan 2 terminal berjalan bersamaan.

**Terminal 1 (Open Music API):**
```bash
cd v3
npm run start
# atau untuk development:
npm run dev
```
Server berjalan di port 5000.

**Terminal 2 (Consumer App):**
```bash
cd consumer
npm run start
```
Consumer akan berjalan dan menunggu pesan dari antrian antrian RabbitMQ.
