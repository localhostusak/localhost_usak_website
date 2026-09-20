# localhostusak CMS

Payload CMS 3 + Next.js + PostgreSQL. Yerel kurulum ve çalışma komutları için
[ana README'nin yerel geliştirme bölümüne](../README.md#%EF%B8%8F-kurulum-ve-yerel-geli%C5%9Ftirme)
bakın.

`docker compose -f docker-compose.development.yml up -d postgres` yalnızca geliştirme veritabanını başlatır.
`.env.development.example` dosyasını `.env.development.local` olarak kopyalayıp yerel `PAYLOAD_SECRET`
değerini doldurun; sonra `npm ci` ve `npm run dev` çalıştırın.

- Yönetim paneli: http://localhost:3000/admin
- REST API: http://localhost:3000/api

Yerel veritabanı canlı VDS verilerinden ayrıdır. `npm run seed` örnek içerik
oluşturur; yalnızca özellikle istediğinizde kullanın.
