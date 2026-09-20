# Geliştirme ve production ayrımı

Uygulama kodu ortaktır; veritabanı, parolalar ve API adresleri ortama göre verilir.

## Yerel geliştirme

- CMS: `localhostusak-cms/.env.development.local`
- Frontend: `localhostusak-web/.env.development.local`
- Bu dosyalar Git tarafından yok sayılır. Repodaki `.example` dosyaları yalnızca şablondur; uygulama bunları otomatik okumaz.
- Next.js ve Vite, geliştirme modunda `.env.development.local` dosyalarını okur. Production build/start bu dosyaları okumaz.
- Yerel CMS veritabanı `127.0.0.1` üzerindedir; frontend `/api` üzerinden Vite'ın yerel CMS proxy'sini kullanır.

Bu Mac'te PostgreSQL ve yerel env dosyaları hazır. Repo kökünden:

```bash
brew services start postgresql@16
# Ayrı terminal:
npm run cms
# Ayrı terminal:
npm run dev
```

Docker alternatifinde CMS klasöründe `docker compose -f docker-compose.development.yml up -d postgres` kullanılır. Homebrew ve Docker veritabanlarını aynı 5432 portunda birlikte başlatmayın.

Payload CLI/seed gibi Next.js dışında çalışan araçlar `.env.development.local` dosyasını otomatik yüklemeyebilir. Örneğin yalnızca yerel veritabanı için:

```bash
cd localhostusak-cms
DOTENV_CONFIG_PATH=.env.development.local NODE_OPTIONS=--require=dotenv/config npm run payload -- migrate:status
```

Geliştirme sırasında Payload yerel şemayı otomatik güncelleyebilir. Collection alanlarını değiştirince production için gerekli migration dosyalarını ayrıca üretip inceleyin. Production migration'ları başlangıçta çalıştırdığı için migration değişiklikleri de canlı veriyi etkileyebilir.

## Production — Coolify

- CMS'in gerçek `DATABASE_URL`, `PAYLOAD_SECRET`, `PORT` ve `NODE_ENV` değerleri Coolify'da tutulur.
- Frontend `VITE_API_URL=https://cms.localhostusak.tech/api` değerini build sırasında Coolify'dan alır. Bu değer frontend paketine gömülür; değiştirmek yeniden build gerektirir.
- `.env.production.example` dosyaları gerekli alanları gösterir; gerçek production şifreleri bu dosyalara yazılmaz.
- Coolify/Railpack production build/start komutlarını kullanır. `docker-compose.development.yml` yerel geliştirme içindir.
- Yerelde production build denemek için ayrıca `.env.production.local` ve ayrı bir yerel deneme veritabanı hazırlayın. Canlı veritabanı bağlantısını yerel build'e vermeyin. Geliştirme env'si artık production build için otomatik kaynak değildir.

## Git akışı

Coolify şu anda `main` güncellemelerini production'a dağıtır. Günlük geliştirmeyi ayrı dallarda yapın:

```bash
git switch -c feat/degisiklik-adi
# Geliştirme ve yerel kontrol sonrası:
git push -u origin feat/degisiklik-adi
```

Bu dalı inceleme ve gerekli build/test kontrollerinden sonra PR ile `main` dalına birleştirin. Env ayrımı ayarların karışmasını önler; kod ve migration hatalarına karşı garanti değildir. Birleştirme yine production dağıtımını başlatır. Branch protection veya zorunlu CI kontrolleri bu çalışma kapsamında yapılandırılmadı.
