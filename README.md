# OpenMusic API V3

Submission akhir kelas "Belajar Fundamentals Aplikasi Back-End". Proyek ini telah dipisahkan menjadi dua aplikasi independen sesuai spesifikasi submission:
1. **Open Music API** (`openmusic_api`) - Main RESTful API.
2. **Consumer App** (`openmusic_consumer`) - Message broker consumer untuk fitur ekspor playlist.

## Struktur Project
```
.
├── openmusic_api/         # API Application
│   ├── src/
│   ├── package.json
│   └── .env              # Environment variable untuk API
├── openmusic_consumer/    # Consumer Application
│   ├── src/
│   ├── package.json
│   └── .env              # Environment variable untuk Consumer
├── docker-compose.yml     # Infrastructure (Redis & RabbitMQ)
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

2. **Setup Open Music API (`openmusic_api`)**
   - Masuk ke folder `openmusic_api`.
   - Install dependencies.
   - Buat file `.env` (bisa copy dari `.env.example` atau lihat konfigurasi default).
   - Jalankan migration database.
   ```bash
   cd openmusic_api
   npm install
   # Setup .env dahulu
   npm run migrate up
   ```

3. **Setup Consumer (`openmusic_consumer`)**
   - Masuk ke folder `openmusic_consumer`.
   - Install dependencies.
   - Buat file `.env`.
   ```bash
   cd openmusic_consumer
   npm install
   # Setup .env dahulu
   ```

## Cara Menjalankan

Aplikasi ini membutuhkan 2 terminal berjalan bersamaan.

**Terminal 1 (Open Music API):**
```bash
cd openmusic_api
npm run start
# atau untuk development:
npm run dev
```
Server berjalan di port 5000.

**Terminal 2 (Consumer App):**
```bash
cd openmusic_consumer
npm run start
```
Consumer akan berjalan dan menunggu pesan dari antrian antrian RabbitMQ.
