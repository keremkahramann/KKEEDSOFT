# API modelleri ve istekler

Güncelleme: 22 Eylül 2026. Aşağıdaki controller'lar ve hesaplamalar **uygulandı**, ancak yalnız `local` profilde örnek kayıtlarla çalışır. Kaynak bağlantısı, kalıcı raporlama deposu, gerçek zamanlayıcı ve frontend HTTP bağlantısı bu değişikliğin kapsamında değildir. Veritabanı türü/sürümü ve şeması doğrulanana kadar JDBC/JPA entity eşlemesi yapılmadı.

## Paketler ve sorumluluklar

```text
employee/controller, model              Personel okuma
operation/controller, model             Operasyon okuma
production/controller, dto, model, service   Üretim ölçümleri
performance/controller, dto, service     Personel ve operasyon raporları
reporting/model, repository, service     Ortak veri sürümü ve okuma katmanı
sync/controller, model, service          Senkronizasyon durumu
auth/controller                         CSRF token
workorder/controller, dto                Mevcut iş emri akışı
common/dto                              Sayfalama ve hata sözleşmeleri
config                                  Güvenlik yapılandırması
```

Controller'lar istekleri doğrulayıp servise devreder. SQL, gruplama ve ortalama controller içinde bulunmaz. `ReportingRepository.snapshot()` tek bir değişmez veri sürümü döndürür. Üretim adaptörü geliştirildiğinde bu sözleşmenin atomik yayın ve ölçeklenebilir sorgulama ihtiyaçları yeniden ele alınmalıdır; tüm kaynak veriyi belleğe yüklemek üretim gereksinimi değildir.

## Veri modelleri

| Model | Alanlar ve anlam |
| --- | --- |
| Employee | `id`, `name`, `departmentCode`, `active`. Gruplama adla değil ID ile yapılır. |
| Operation | `id`, `code`, `name`, `active`. Excel E–F karşılığı kaynak eşleştirmesinde doğrulanır. |
| ProductionMeasurement | `sourceRecordId`, `employeeId`, `operationId`, `recordedAt`, `shiftId`, `machineId`, `workOrderId`, `performanceScore`, `quantity`, `actualDurationSeconds`, `standardDurationSeconds`, `sourceUpdatedAt`, `importedAt`. |
| ReportSnapshot | `dataSource`, `dataVersion`, `lastSuccessfulSyncAt`; personel, operasyon ve ölçüm listeleri. |
| SyncStatus | `state`, `dataSource`, `dataVersion`, `lastSuccessfulSyncAt`, `nextScheduledAt`, `message`. |

Puan/miktar/süre için BigDecimal, zaman damgaları için Instant kullanılır. Sayısal puan normalize edilmiş olmalı; API yüzdelik metin ayrıştırmaz. Geçersiz/eksik kaynak puanı `null`, gerçek sıfır `0` olur. İleride kaynak adaptörü ölçek ve veri kalitesini doğrulamalıdır. Ölçümlerde kişi/operasyon referansı eksik olabilir; ilgili rapor bunları dışlanan kimlik sayacında gösterir. Diğer analiz etkilenmez.

Yerel veride üretilmiş çalışma süresi, miktar veya iş emri ilişkisi yoktur; bilinmeyen alanlar null döner. `importedAt` ve son başarılı aktarım zamanı da null'dır. Kaynak modeli veritabanı tablosu/entity tanımı değildir.

## Yollar

| Controller | Metot ve yol | Parametreler |
| --- | --- | --- |
| EmployeeController | `GET /api/v1/employees`, `GET /api/v1/employees/{id}` | Liste: `q`, `page`, `size`. |
| OperationController | `GET /api/v1/operations`, `GET /api/v1/operations/{id}` | Liste: `q`, `page`, `size`. |
| ProductionMeasurementController | `GET /api/v1/production/measurements` | `from`, `to`, `employeeId`, `operationId`, `page`, `size`. |
| EmployeePerformanceController | `GET /api/v1/performance/employees/top`, `/bottom` | `from`, `to`, `employeeId`, `operationId`, `limit`. |
| OperationPerformanceController | `GET /api/v1/performance/operations/bottom` | Aynı performans filtreleri. |
| SyncController | `GET /api/v1/sync/status` | Yok. |
| CsrfController | `GET /api/v1/auth/csrf` | Yok. |
| WorkOrderController | `/api/v1/work-orders` | Mevcut GET/POST/PUT/PATCH sözleşmesi; [backend açıklaması](../../backend/README.md). |

`from` ve `to` ölçüm/performans yollarında zorunludur; ISO `YYYY-MM-DD` biçimindedir. **İki gün de dahil**, iş saat dilimi **Europe/Istanbul**. Filtre ölçümün `recordedAt` zamanına uygulanır. Örnek: 21 Eylül için 20 Eylül 21.00 UTC dahil, 21 Eylül 21.00 UTC hariçtir. İsteğe bağlı personel/operasyon filtreleri birlikte verilirse AND uygulanır.

`page` varsayılan 0, `size` varsayılan 20 ve en fazla 100; performans `limit` varsayılan 5, 1–100 arasıdır. Sayfalama yalnız ham ölçüm/listeleri etkiler; ortalama dönem içindeki tüm uygun kayıtlardan hesaplanır, sonra sıralama ve limit uygulanır.

Eksik/bozuk tarih, ters aralık ve aralık dışı limitler 400; bilinmeyen detay veya filtre ID'si 404; geçerli ama verisiz dönem boş liste döndürür. MVC hataları `application/problem+json`; kimlik/rol hataları 401/403'tür. Güvenlik hatalarının aynı problem gövdesini taşıması garanti değildir.

## Rapor yanıtı ve kurallar

`items`: `id`, `name`, `code` (personelde null), `averageScore`, `measurementCount`.

`metadata`: dönem, saat dilimi, seçilen filtreler, limit, `scoreRule`, `order`, eşleşen/dahil edilen/geçersiz puanlı/eksik kimlikli/pozitif olmayan ölçüm sayıları, `totalGroups`, `dataSource`, `dataVersion`, `calculationVersion`, `lastSuccessfulSyncAt`.

- Personel: `ALL_NUMERIC`; sıfır ve negatif sayısal puanlar dahil. En yüksek azalan, en düşük artan.
- Operasyon: `POSITIVE_ONLY`; P <= 0 önce çıkarılır, kalanların aritmetik ortalaması alınır.
- BigDecimal toplamı ve DECIMAL128 bölme kullanılır. Eşit ortalamalar Türkçe ad karşılaştırması ve ardından ID ile sıralanır.
- Dışlama sayaçları birbirini dışlar: önce null puan; operasyonda ardından P <= 0; ardından eksik/tanımsız grup kimliği. Toplamları ve dahil edilen ölçüm sayısı, eşleşen ölçüm sayısını verir. Sayaçlar ilk 5'e değil filtrelenmiş dönemin tamamına aittir.
- `dataVersion` istemcinin tabloların aynı sürümde olduğunu kontrol etmesini sağlar. Farklı sürüm görülürse istemci raporları yeniden istemelidir; birden fazla HTTP isteği kendi başına atomik değildir.
- Yerel senkronizasyon `NOT_CONFIGURED`, veri kaynağı `LOCAL_DEMO`, sonraki/son başarılı aktarım null. Aktarım tetikleyen sahte bir endpoint eklenmedi.

Örnek gün `2026-09-21`, örnek veri sürümü `demo-performance-v1`. OP-001 puanları `100, 0, -20`: operasyon ortalaması 100 ve ölçüm sayısı 1; personel EMP-001 ortalaması 80/3 ve ölçüm sayısı 3. Örnekler gerçek şirket performansı değildir.

## Uyumluluk ve güvenlik

Eski `/api/work-orders` ve `/api/csrf` yolları çalışmaya devam eder. Oluşturma Location başlığı sürümlü iş emri yolunu kullanır. Yerel HTTP Basic, DEVELOPER rolü ve yazmalarda CSRF korunmuştur; bu geliştirme yetkisi üretimdeki bölüm bazlı veri erişim yetkisinin yerine geçmez. Kaynak veritabanı kimlik bilgisi veya SQL metni HTTP isteğinde alınmaz.

İstek örnekleri: [kategori dizini](../../backend/requests/README.md). Bu özellikleri LAN'a açmadan önce gerçek kimlik doğrulaması, kayıt kapsamı yetkileri, kaynak bağlantısı ve üretim profili tamamlanmalı.
