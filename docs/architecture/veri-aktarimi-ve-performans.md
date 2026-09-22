# Veri aktarımı ve performans kuralları

Durum: Hedef sözleşme; MySQL şeması henüz görülmedi. [Mimari](merkezi-spring-boot.md).

## Öncelikli veriler

İlk senaryo personel ve operasyon performansıdır. Üretim gerçekleşmeleri, performans puanının formülü/birimi ve personel/operasyon kimlikleri önce alınır. Duruşlar, iş emirleri, plan ve kalite verileri sonraki açıklayıcı analizler için genişletilir.

Aşağıdaki isimler önerilen uygulama alanlarıdır; kaynak MySQL kolonları değildir:

| Alan | Kullanım |
| --- | --- |
| `source_record_id` | Kaynakta benzersiz kayıt; tekrar aktarımları birleştirme. |
| `employee_id`, `employee_name` | Personel eşleştirmesi ve görünür ad. |
| `operation_id`, `operation_code`, `operation_name` | Operasyon eşleştirmesi; Excel E–F anlamları doğrulanmalı. |
| `performance_score` | Excel P karşılığı; birim ve ölçek açık olmalı. |
| `recorded_at`, `shift_id` | Analiz dönemi ve vardiya. |
| `machine_id`, `work_order_id` | Makine ve iş emri bağlantısı. |
| `quantity`, `actual_duration`, `standard_duration` | Puan formülünü doğrulama ve olası ağırlıklı analizler. |
| `source_updated_at`, `imported_at` | Kaynak değişikliği ve aktarım takibi. |

Personel adları benzersiz anahtar değildir. Mevcut XLSX prototipi I sütunundaki adla gruplar; merkezi sürüm doğrulanmış ID kullanmalıdır. Saat dilimi, süre ve miktar birimleri veri sözlüğünde tanımlanır.

## İlk yükleme ve sonraki aktarımlar

1. Pilot için kararlaştırılan tarih aralığını ilk kez aktar. Son 30 gün başlangıç önerisidir.
2. Kalıcı aktarım durumundan son başarılı noktayı oku ve tek aktif görev kilidini al.
3. Kaynaktan sınırları belirlenmiş bir aralıktaki kayıtları parçalar halinde al. Güvenilir güncellenme alanı ve benzersiz ID ile kararlı sayfalama kullan.
4. Kimlik, sayı, zaman ve zorunlu alanları doğrula; hatalı satırları nedenleriyle say ve takip et.
5. Kaynak ID üzerinden ekle/güncelle. Aynı aralığı yeniden çalıştırmak kayıt sayısını artırmamalı.
6. Tamamlanan veri grubunu tutarlı biçimde yayımla. Kullanıcılar yarım aktarımı tamamlanmış rapor olarak görmemeli.
7. Veri kaydıyla uyumlu biçimde son başarılı noktayı ilerlet; aktarım süresi, sonuç ve sayaçları kaydet.

`@Scheduled` yalnız tetikleyicidir; kalıcı ilerleme, kilit, yeniden deneme ve yeniden başlatma sonrası devam ayrıca uygulanır. Birden fazla backend kopyasında görev sahipliği merkezî olarak korunur.

`updated_at` her değişiklikte güncellenmiyorsa tarih filtresi güvenilir değildir. Geç tamamlanan işlemler için örtüşen aralık ve tekrar işleme, ayrıca dönemsel kaynak karşılaştırması planlanmalı; bunlar kaynak işlem semantiği bilinmeden kayıpsızlık garantisi sayılmaz. Fiziksel silmeler yalnız güncelleme tarihiyle yakalanamaz; silme işareti/günlüğü, karşılaştırma veya gerekirse değişiklik yakalama yöntemi seçilmeli.

Hata durumunda son başarılı veri korunur, ilerleme noktası hatalı aralığın sonuna taşınmaz. Sınırlı, aralıklı tekrar deneme uygulanır. Hatalı satırları sessizce atlayıp aktarımı eksiksiz olarak işaretleme.

## Performans kuralları

| Tablo | Gruplama | Hesaba giren ölçümler | Sıralama |
| --- | --- | --- | --- |
| En yüksek 5 personel | Prototipte I; merkezde personel ID. | Geçerli sayısal P; mevcut davranışta sıfır ve negatif değerler dahil. | Ortalama azalan. |
| En düşük 5 personel | Aynı. | Aynı. | Ortalama artan. |
| En düşük 5 operasyon | Prototipte E–F çifti; merkezde doğrulanmış operasyon anahtarı. | **Yalnız P > 0**. | Ortalama artan. |

- Her grubun ortalaması, uygun ölçümlerin toplamı / uygun ölçüm adedidir. Operasyonda sıfır/negatif eleme ortalamadan **önce** yapılır.
- Örnek: aynı operasyonun P değerleri `0, -20, 40, 80` ise operasyon ortalaması `60`, ölçüm sayısı `2` olur. Aynı personelin mevcut aritmetik ortalaması `25` olur.
- Boş ve sayısal olmayan P değerleri ortalamaya girmez; sıfırmış gibi yorumlanmaz.
- Personel adı eksik olması, operasyon bilgisi geçerliyse operasyon hesabını engellemez; tersi de geçerlidir.
- Yeterli grup varsa her tabloda 5 satır; daha az varsa mevcut sonuçlar gösterilir.
- Eşit ortalamalar ada göre, merkezde gerekirse ID ile kararlı biçimde sıralanır. Gösterim yuvarlaması sıralamadan sonra yapılır.
- Ölçüm sayısı, tarih aralığı, dışlanan kayıtlar ve veri güncelliği gösterilir.
- `0,85`, `85`, `%85` aynı ölçek varsayılmaz; kaynak formatı doğrulanıp tek ölçeğe dönüştürülür.
- Negatif personel puanlarının iş açısından anlamı ve sıfırın gerçek ölçüm mü eksik veri mi olduğu açık konudur. Operasyonun `P > 0` kuralı kullanıcı isteğidir.
- Ağırlıklı ortalamaya kendiliğinden geçilmez. Süre/miktar ağırlığı gerekirse formül ayrıca kararlaştırılır. Günlük ortalamalar farklı kayıt sayıları varken eşit ağırlıkla birleştirilmez.

## API — yerel örnek veriyle uygulandı

22 Eylül 2026: Aşağıdaki yollar `local` profilde eklendi. Kaynak aktarımı uygulanmadı; sync yanıtı `NOT_CONFIGURED` döner. Alan ve davranışların güncel kaynağı [uygulanan API sözleşmesidir](api-modelleri-ve-istekler.md).

| Metot / yol | Amaç |
| --- | --- |
| `GET /api/v1/performance/employees/top` | En yüksek personel ortalamaları. |
| `GET /api/v1/performance/employees/bottom` | En düşük personel ortalamaları. |
| `GET /api/v1/performance/operations/bottom` | Pozitif ölçümlere göre en düşük operasyon ortalamaları. |
| `GET /api/v1/sync/status` | Son başarılı/başarısız aktarım, güncellik ve sonraki planlanan çalışma. |

Uygulanan filtreler: zorunlu `from`, `to`, varsayılan `limit=5` (1–100), isteğe bağlı `employeeId`, `operationId`. Tarihler Europe/Istanbul takviminde iki uç dahil; filtreler AND ile birleşir. Bölüm/ vardiya filtreleri ve üretim veri kapsamı yetkilendirmesi sonraki iştir. Yerel yollar DEVELOPER rolüyle korunur. İstemciden SQL alınmaz.

Yanıtta `items` yanında dönem, `lastSuccessfulSyncAt`, `dataVersion`, `calculationVersion` ve dışlanan kayıt sayaçları bulunması önerilir. Üç tablonun aynı veri sürümünden üretilebilmesi sağlanmalı. Sunucu hatasında demo veriye sessizce dönülmez.

Mevcut iş emri API'si `/api/v1/work-orders` altında korunur; `/api/work-orders` eski yolu da çalışır. Kategori bazlı controller ve istek listesi [backend README](../../backend/README.md) ve [istek koleksiyonunda](../../backend/requests/README.md).
