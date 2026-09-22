# API istek koleksiyonu

Bu dosyalar VS Code REST Client biçimindedir. Backend `local` profilde çalışmalı; VS Code sürecinde `KKEEDSOFT_DEV_PASSWORD` bulunmalıdır. Veri kaynağı `LOCAL_DEMO` olup sunucudaki gerçek üretim verisi değildir. Örnek ölçüm günü **2026-09-21**.

| Kategori | Dosya | Controller |
| --- | --- | --- |
| Personel | [employees.http](employees.http) | EmployeeController |
| Operasyon | [operations.http](operations.http) | OperationController |
| Üretim ölçümleri | [production.http](production.http) | ProductionMeasurementController |
| Performans | [performance.http](performance.http) | EmployeePerformanceController, OperationPerformanceController |
| Senkronizasyon | [sync.http](sync.http) | SyncController |
| Kimlik/sağlık | [auth.http](auth.http) | CsrfController, Actuator |
| İş emirleri | [work-orders.http](work-orders.http) | WorkOrderController |

Önerilen deneme sırası: ana veri listeleri → ölçümler → performans → senkronizasyon. Bütün yollar yerel `DEVELOPER` rolünü gerektirir; bu rol üretim yetki matrisi değildir. POST/PUT/PATCH iş emri örnekleri için cookie saklama ve CSRF token gerekir. Yeni raporlama yolları salt okunurdur.

`/api/v1` güncel yol önekidir. `/api/work-orders` ve `/api/csrf` geriye uyumlu olarak korunur; iş emri oluşturma yanıtının `Location` başlığı `/api/v1/work-orders/{id}` döner.

Alanlar, tarih semantiği ve örnek sonuçlar: [API modelleri ve sözleşmesi](../../docs/architecture/api-modelleri-ve-istekler.md).
