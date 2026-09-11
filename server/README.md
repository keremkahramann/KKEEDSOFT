# Kahraman Twin API iskeleti

React/Vite ve Tauri istemcisi için `/api/v1` altında TypeScript REST API.
Node.js 22+ ve mevcut proje bağımlılıkları yeterlidir; ek paket kurulmaz.

## Çalıştırma (PowerShell, proje kökünde)

```powershell
Copy-Item server/.env.example server/.env
node -e "console.log(require('node:crypto').randomBytes(32).toString('hex'))"
# Üretilen değeri server/.env içindeki API_DEV_TOKEN alanına yazın.
npm run api:dev
```

API varsayılan olarak `http://127.0.0.1:3001` üzerinde çalışır.
`api:dev` başlangıçta TypeScript derler ve derlenmiş JavaScript'i izler;
TypeScript değişiklikleri için başka terminalde `npx tsc -p server/tsconfig.json --watch`
çalıştırın veya `api:dev` komutunu yeniden başlatın.
Kontroller: `npm run api:test`, `npx tsc --noEmit`, `npm run build`.

Vite `/api` isteklerini bu sunucuya yönlendirir. Proxy değişikliği için mevcut
Vite sürecinin yeniden başlatılması gerekebilir. API sunucusu ayrıca çalışmalıdır.
Paketlenmiş Tauri uygulamasında build öncesinde `VITE_API_BASE_URL` tam API adresi
olmalıdır. İstemci origin'i `API_ALLOWED_ORIGINS` listesine eklenmelidir.

## Katmanlar

- `shared/api.ts`: ortak DTO, durum ve cevap tipleri.
- `server/app.ts`: route eşleştirme, kimlik/yetki kontrolü, CORS, hata yönetimi.
- `server/core/http.ts`: gövde sınırı, JSON doğrulama, sayfalama.
- `server/modules/repository.ts`: bellek deposu ve veri erişim sınırı.
- `server/modules/actions.ts`: aksiyon oluşturma, karar ve denetim kaydı.
- `server/index.ts`: yapılandırma, geliştirme kimliği, sunucu yaşam döngüsü.
- `src/api/client.ts`: tipli fetch istemcisi, token sağlayıcı ve zaman aşımı.

## Endpoint sözleşmesi

| Metot | Yol (`/api/v1` sonrası) | Davranış |
|---|---|---|
| GET | `/health` | Kimliksiz sağlık kontrolü |
| GET | `/auth/me` | Geçerli kimlik ve yetkiler |
| GET | `/dashboard` | Örnek depodan hesaplanan sayaçlar |
| GET | `/machines`, `/machines/:id` | Makineler; detayda `P07` veya `PRESS-07` |
| GET | `/work-orders`, `/work-orders/:id` | İş emirleri |
| GET | `/actions`, `/actions/:id` | Aksiyonlar |
| POST | `/actions` | `type`, `entityId`, `description` ile öneri oluşturma |
| POST | `/actions/:id/decision` | `decision: approved/rejected`, `reason` ile karar |
| GET | `/admin/audit` | `admin` yetkisiyle denetim kayıtları |

Liste sorguları: `page=1&pageSize=20` (en fazla 100); durum içeren listelerde
`status` filtresi. Makine ilişkilerinde kanonik ID (`P07`) kullanılır.
Tarihler ISO 8601; OEE yüzde, duruş süresi dakika cinsindedir.

Başarılı yanıt: `{ data, meta: { requestId, page?, pageSize?, total? } }`.
Hata: `{ error: { code, message, requestId } }`.
Başlıca kodlar: 400 doğrulama, 401 kimlik, 403 yetki/origin, 404 kayıt/yol,
405 metot, 409 aksiyon durumu, 413 gövde sınırı (64 KiB), 415 içerik türü,
501 uygulanmamış entegrasyon. `X-Request-Id` yanıt başlığı izleme için kullanılır.

Şu route'lar ayrılmıştır ve açıkça **501 NOT_IMPLEMENTED** döner:
GET `/operations`, `/planning`, `/problems`, `/quality`, `/cost`, `/documents`,
`/reports`, `/admin/users`, `/admin/data-sources`, `/notifications`;
POST `/chat/messages`. Bunlar için ERP/MES/QMS/CMMS, doküman, raporlama ve
LLM/RAG adaptörleri sonradan eklenmelidir.

## Frontend kullanımı

```ts
import { createApiClient } from './api/client';

const api = createApiClient({ getToken: () => sessionToken });
const { data: machines, meta } = await api.machines.list({ pageSize: 20 });
await api.actions.create({
  type: 'maintenance',
  entityId: 'P07',
  description: 'Hidrolik basınç kaybı için bakım talebi',
});
```

`sessionToken` gerçek kimlik akışının sağlayacağı, bellekte tutulan token'dır.
Ekranlar halen mevcut statik verileri kullanır; API istemcisi sonraki ekran
entegrasyonu için hazırdır. Mevcut giriş ekranı backend oturumu açmaz.

## Geliştirme kapsamı ve genişletme

Veriler bellektedir; yeniden başlatmada sıfırlanır. Örnek veri mevcut ekranlardan
alınmış küçük bir alt kümedir. Token yalnız geliştirme içindir, varsayılan token
yoktur ve `VITE_*` değişkenlerine konmamalıdır. Yerel kimlik `read`, `suggest`,
`admin` yetkileri taşır; onay yetkisi taşımaz. Onay akışı testlerde ayrı kimlikle
doğrulanır. İstek gövdesinden kullanıcı/yetki kabul edilmez.

Üretim için `createApp.authenticate` yerine doğrulanmış OIDC/JWT kimlik sağlayıcı,
repository yerine kalıcı veri erişimi eklenmelidir. Mevcut senkron array portu
veritabanına geçişte asenkron metotlara dönüştürülmeli; aksiyon kararı ve denetim
kaydı tek transaction içinde yazılmalıdır. Üretim modunda geliştirme sunucusu
başlatılmaz. Departman/tesis kapsamı, finans yetkileri, hız sınırlama ve kalıcı
denetim saklama kuralları gerçek kimlik ve veri katmanıyla tanımlanmalıdır.

Onay sadece aksiyonun durumunu değiştirir; makineye veya ERP/MES'e komut göndermez.
Gerçek uygulama servisi; yetki, ayrı onaylayan, idempotency ve transaction
kontrolleriyle ayrıca geliştirilmelidir. Offline senkronizasyon ve dosya yükleme
bu iskelette uygulanmamıştır.
