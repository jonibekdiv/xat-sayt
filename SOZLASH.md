# Sozlash yo'riqnomasi

## 1. Google Cloud (bir marta, ~10 daqiqa)
1. https://console.cloud.google.com → yuqorida **New Project** → nom: `xat-sayt`.
2. **APIs & Services → Library** → "Gmail API" → **Enable**.
3. **APIs & Services → OAuth consent screen** (yoki *Google Auth Platform*):
   - User type: **External**, ilova nomi: `Xat`, support email: o'zingizniki.
   - **Data Access / Scopes** → `.../auth/gmail.send` qo'shing.
   - **Audience → Test users** → **o'zingiz va ustozingizning Gmail manzilini** qo'shing.
   - Holat **Testing** bo'lib qolsin (nashr qilish shart emas).
4. **Credentials → Create Credentials → OAuth client ID** → *Web application*:
   - Authorized redirect URIs:
     - `http://localhost:3000/api/auth/callback/google`
     - `https://<SIZNING-SAYT>.vercel.app/api/auth/callback/google`
   - Chiqqan **Client ID** va **Client secret** ni nusxalang.

> Testing holatida Google har 7 kunda qayta kirishni so'rashi mumkin. Bu normal.

## 2. Kompyuterda sinash
```bash
cp .env.example .env.local   # va qiymatlarni to'ldiring
npm run dev                  # http://localhost:3000
```
`AUTH_SECRET` uchun: `openssl rand -base64 32`

## 3. Vercel'ga joylash
1. Kodni GitHub'ga yuklang, https://vercel.com → **Add New Project** → repo tanlang.
2. **Environment Variables**: `AUTH_SECRET`, `AUTH_GOOGLE_ID`, `AUTH_GOOGLE_SECRET`.
3. Deploy. Chiqqan manzilni 1-bosqichdagi redirect URI'ga qo'shing.
