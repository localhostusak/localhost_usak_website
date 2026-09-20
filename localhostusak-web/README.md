# localhostusak web

React + Vite frontend. Tam yerel kurulum için [ana README'nin yerel geliştirme
bölümüne](../README.md#%EF%B8%8F-kurulum-ve-yerel-geli%C5%9Ftirme) bakın.

```bash
npm ci
npm run dev
```

Web `http://localhost:5173` adresinde açılır. Varsayılan `/api` istekleri Vite
proxy üzerinden `http://localhost:3000` adresindeki yerel Payload CMS'e gider.
Yerel geliştirmede `.env.development.local` içindeki `VITE_API_URL=/api`
kullanılır (değişken boşsa da varsayılan budur). CMS ayrıca çalışıyor olmalıdır.
Production env ve Git akışı için [ENVIRONMENTS.md](../ENVIRONMENTS.md) dosyasına bakın.
