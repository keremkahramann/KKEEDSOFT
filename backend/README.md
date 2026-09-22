# KKEEDSOFT geliştirme API'si

Merkez bilgisayara taşırken değişecek dosyalar ve `@Profile("local")` açıklaması: [merkez bilgisayara geçiş ve profiller](../docs/operations/merkez-bilgisayara-gecis-ve-profiller.md). Mevcut local profil üretim profili değildir; yalnız isim değiştirerek gerçek veritabanı bağlantısı kurulmaz.

Java 21 / Spring Boot 4.1.1 üzerinde kategori bazlı personel, operasyon, üretim ölçümü, performans, senkronizasyon durumu ve iş emri API'leri var. `local` profili iş emirleri için üç yapay kayıt, raporlama için 6 personel, 6 operasyon ve 11 ölçüm yükler. Veri kaynağı `LOCAL_DEMO`; raporlama örnek tarihi `2026-09-21`. İş emri değişiklikleri uygulama kapanınca kaybolur. Gerçek kaynak bağlantısı, kalıcı veritabanı, otomatik aktarım ve üretim onay akışı henüz yoktur.

## Çalıştırma

Merkezi LAN kurulumu için [hedef Spring Boot mimarisi](../docs/architecture/merkezi-spring-boot.md), [aktarım ve performans kuralları](../docs/architecture/veri-aktarimi-ve-performans.md) ve [işletim planı](../docs/operations/lan-dagitim-ve-isletim.md) belgelendi. Performans endpoint'leri artık örnek veri üzerinde çalışıyor. Kaynak başlangıçta MySQL olarak belirtildi; paylaşılan sunucu görüntülerinde SQL Server bileşenleri de bulunduğundan gerçek tür/sürüm ve şema doğrulanmalı. Kaynak bağlantısı, `@Scheduled` aktarım ve üretim servis kurulumu uygulanmadı; PostgreSQL bağımlılıkları kodda duruyor.

JDK 21 kurulu olmalı ve `JAVA_HOME` geçerli JDK klasörünü göstermeli. PowerShell'de repository kökünden:

```powershell
cd backend
# Bu yolu kendi JDK 21 kurulumuna göre düzenle.
$env:JAVA_HOME = 'C:/Program Files/Android/openjdk/jdk-21.0.8'
$env:KKEEDSOFT_DEV_PASSWORD = Read-Host 'Yerel API için geliştirme parolası'
.\mvnw.cmd spring-boot:run '-Dspring-boot.run.profiles=local'
```

Adres `http://127.0.0.1:8080`, kullanıcı adı `developer`. Parola dosyada tutulmaz; ortam değişkeninden okunur. Uygulama bu profilde yalnızca loopback arayüzünü dinler; diğer LAN bilgisayarlarından erişilemez. Port gerekirse `SERVER_PORT` ortam değişkeniyle değiştirilebilir.

Maven kullanıcı deposunu yanlış yerde ararsa komuta `"-Dmaven.repo.local=$env:USERPROFILE/.m2/repository"` eklenebilir. Windows wrapper'daki boş bağlantı hedefi kontrolü de bu iskeletle düzeltildi.

Profil açıkça seçilmelidir. `local` dışında bu örnek controller, servis ve depo etkinleşmez; mevcut JPA/PostgreSQL bağımlılıkları için ayrıca gerçek yapılandırma gerekir. Yerel profilde veri kaynağı, Hibernate ve Flyway otomatik yapılandırmaları kapalıdır; bağımlılıklar gelecek veritabanı çalışması için korunmuştur.

## Katmanlar

```text
employee/controller/            Personel liste ve detay
operation/controller/           Operasyon liste ve detay
production/controller/          Üretim ölçümleri
performance/controller/         Personel ve operasyon performans raporları
reporting/                      Ortak veri sürümü, örnek depo ve okuma servisleri
sync/controller/                Aktarım durumu (şimdilik NOT_CONFIGURED)
auth/controller/                CSRF token
workorder/
  controller/WorkOrderController HTTP yolları ve istek doğrulama
  dto/                          Request ve response record'ları
  WorkOrderService              Listeleme ve miktar kontrolleri
  WorkOrder                     Başlangıç veri modeli
  WorkOrderRepository           Depo sözleşmesi
  InMemoryWorkOrderRepository    Yerel örnek veri deposu
common/
  ApiExceptionHandler           API hata yanıtları
config/
  LocalSecurityConfig           Yerel API erişimi
```

## İş emri istekleri

Yeni modellerin alanları, controller kategorileri, dönem/limit kuralları ve yanıt metadata'sı [API sözleşmesinde](../docs/architecture/api-modelleri-ve-istekler.md); çalıştırılabilir örnekler [istek koleksiyonunda](requests/README.md). Yeni yollar `/api/v1` önekini kullanır. Eski `/api/work-orders` ve `/api/csrf` yolları da geriye uyumlu olarak çalışır.

| Metot | Yol | İstek | Başarılı yanıt |
| --- | --- | --- | --- |
| GET | `/api/v1/work-orders` | `q`, `risk`, `page`, `size` sorgu alanları | `200`, `items/total/page/size` |
| GET | `/api/v1/work-orders/{id}` | İş emri kimliği | `200`, iş emri |
| POST | `/api/v1/work-orders` | `CreateWorkOrderRequest` | `201`, iş emri ve `Location` başlığı |
| PUT | `/api/v1/work-orders/{id}` | `UpdateWorkOrderRequest` | `200`, güncellenen iş emri |
| PATCH | `/api/v1/work-orders/{id}/progress` | `UpdateWorkOrderProgressRequest` | `200`, güncellenen iş emri |

Listeleme kimliğe göre sıralıdır. Arama kimlik, ürün ve müşteri alanlarında yapılır. `risk` seçenekleri `none`, `warning`, `critical`; sayfa numarası sıfırdan başlar, varsayılan boyut 20, üst sınır 100'dür. Veri bulunmazsa liste boş döner; tek kayıt bulunmazsa `404` döner.

Oluşturma ve plan güncelleme gövdesi:

```json
{
  "product": "TEST-001 Örnek ürün",
  "customer": "Örnek müşteri",
  "qty": 1000,
  "deadline": "2026-10-15",
  "machine": "TEST-01"
}
```

Bu alanların tamamı zorunludur. Metinler boş olamaz ve en fazla 200 karakter olabilir. `qty` pozitif tam sayı olmalı. Miktarlar JavaScript'in güvenli tam sayı aralığıyla sınırlıdır. API'deki tarihler `YYYY-MM-DD` biçimindedir; UI şu anda `GG.AA.YYYY` gösterdiği için HTTP bağlantısında dönüşüm yapılması gerekir. Frontend bu teslimatta API'ye bağlanmadı.

İlerleme gövdesi `{"done":250}` şeklindedir. Değer toplam tamamlanan miktardır; aynı isteği tekrar göndermek miktarı artırmaz. Negatif olamaz ve `qty` değerini aşamaz. Plan miktarı da mevcut `done` değerinin altına indirilemez. Hatalı işlem bellekteki kaydı değiştirmez.

Yeni kayıt kimliği `WO-LOCAL-` önekiyle sunucuda üretilir; `done=0`, `status=in_progress`, `risk=none` atanır. Bunlar yalnızca geliştirme varsayımlarıdır. `none` bir risk analizinin sonucu değildir. Miktarın tamamlanması otomatik durum değişikliği başlatmaz; iş emri yaşam döngüsü henüz kararlaştırılmadı. Geriye doğru miktar düzeltmeleri yerel örnekte mümkündür; gerçek kullanımın düzeltme, onay ve denetim kuralları ayrıca belirlenmelidir.

## İstekleri deneme

[work-orders.http](requests/work-orders.http) dosyasında sıralı örnekler var. VS Code REST Client kullanılacaksa VS Code sürecinin `KKEEDSOFT_DEV_PASSWORD` değişkenini görmesi gerekir. Başka bir HTTP istemcisinde aynı yollar ve JSON gövdeleri kullanılabilir.

Her istekte HTTP Basic ile `developer` ve seçilen parola gönderilir. Önce `GET /api/v1/auth/csrf` çağrılır. Yanıttaki `token`, yazma isteklerinde `X-CSRF-TOKEN` başlığına konur; yanıtla gelen `JSESSIONID` cookie'si de aynı istemcide korunur. Uygulama yeniden başlarsa token tekrar alınmalıdır. Yetkiler yalnızca geliştirme rolüne açıktır; bu rol şirketin gerçek yetki matrisi değildir.

Spring Security'nin [kimlik doğrulama yapılandırması](https://docs.spring.io/spring-boot/reference/web/spring-security.html) ve [CSRF desteği](https://docs.spring.io/spring-security/reference/servlet/exploits/csrf.html) kullanılıyor. CORS açılmadı; tarayıcı bağlantısı için izinli origin veya Vite proxy ayrı yapılandırılmalı. Kimlik bilgilerini frontend kaynak koduna yazmayın.

## Hata ve testler

Geçersiz gövde ve iş kuralı ihlalleri `400`, bulunamayan iş emri `404` döner. MVC hata yanıtları `application/problem+json` biçimindedir; alan doğrulamasında `errors` alanı da bulunur. Kimlik doğrulama ve erişim reddi, güvenlik filtresinden `401/403` olarak gelir; aynı problem gövdesini taşıması garanti edilmez.

```powershell
.\mvnw.cmd test
```

Testler `local` profilini ve yalnızca test için sabit bir parolayı kendileri seçer; PostgreSQL veya ERP gerekmez. İş emri işlemlerine ek olarak kategori erişimi, ID ile gruplama, pozitif operasyon puanları, tarih/saat dilimi sınırları, sayfalama, limitler, ondalık ortalama ve demo senkronizasyon durumu kapsanır.

Sonraki adım, API sözleşmesini gerçek veriyle doğrulayıp kalıcı depo ve şirketin yetki/onay modelini tasarlamak. Gerçek ERP yazma işlemleri bu geliştirme controller'ını doğrudan üretime açarak etkinleştirilmemeli.
