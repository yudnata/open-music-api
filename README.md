# OpenMusic API V3

Submission akhir kelas "Belajar Fundamentals Aplikasi Back-End". Aplikasi ini menggunakan **Express**, **PostgreSQL**, **Redis**, dan **RabbitMQ**.

## Requirements
- Node.js
- Docker (untuk Redis & RabbitMQ)

## Instalasi & Konfigurasi

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Setup Environment Variable**
   - Buat file `.env` di root folder.
   - Copy isi dari `.env.example`.
   - Isi konfigurasi database (`PGUSER`, `PGPASSWORD`, dll) dan SMTP untuk email.

3. **Jalankan Services (Redis & RabbitMQ)**
   Gunakan docker-compose biar praktis:
   ```bash
   docker-compose up -d
   ```

4. **Database Migration**
   ```bash
   npm run migrate up
   ```

## Cara Menjalankan

Aplikasi ini butuh 2 terminal jalan bersamaan:

**Terminal 1 (Main Server):**
```bash
npm run start
```
Server jalan di port 5000.

**Terminal 2 (Consumer Listener):**
```bash
npm run consumer
```
Consumer ini buat handle antrian kirim email (export playlist).

