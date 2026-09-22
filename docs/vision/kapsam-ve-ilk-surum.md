# Kapsam ve ilk sürüm

## Ürünün kapsayabileceği işler

Bağlamda üretim planlama, kapasite, sipariş gecikmeleri, makine duruşları, kalite, bakım, maliyet, stok ve departmanlar arası problem analizi yer alıyor. Bunlar uzun vadeli çalışma alanları. Hepsini ilk sürüme almak için verilmiş bir karar yok.

Beklenen kaynaklar Dinamo ERP, üretim makineleri ve şirket dokümanları. Hangi bilginin nerede tutulduğu ve çelişki olduğunda hangi kaydın esas alınacağı şirket içinde doğrulanmalı. Makine markasının bilinmesi, gerekli sinyallere erişilebildiği anlamına gelmiyor.

## İlk entegrasyon odağı

Son görüşmelerle ilk veri entegrasyonu odağı **personel ve operasyon performansı** olarak güncellendi. XLSX prototipindeki analizler merkezi Spring Boot API'sine ve periyodik MySQL aktarımına taşınacak. Pilot kullanıcı grubu ve süreç sahibi henüz belirlenmedi.

Beklenen ilk sonuçlar: ortalama performansı en yüksek ve en düşük 5 personel; yalnız pozitif P ölçümleriyle ortalama performansı en düşük 5 operasyon. Beş uygun grup yoksa mevcut sonuçlar gösterilir. Sipariş/iş emri gecikme analizi sonraki genişleme adayıdır; mevcut yerel iş emri API'si geliştirme çalışması olarak korunur.

Seçim sırasında şu sorulara bakılmalı:

- Sorun ne sıklıkta yaşanıyor ve bugün çözümü ne kadar zaman alıyor?
- Gerekli verilere izinli biçimde erişebiliyor muyuz?
- Kayıtlar aynı sipariş, iş emri veya makineyle ilişkilendirilebiliyor mu?
- Sonucun doğru ve yararlı olduğunu kim değerlendirecek?
- Yanlış bir önerinin etkisini insan incelemesiyle sınırlayabiliyor muyuz?

## Önerilen pilot sınırı

| Alan | İlk sürüm önerisi |
| --- | --- |
| Kullanıcılar | Seçilen süreci bilen sınırlı bir grup. Departman ve kişi sayısı henüz belirlenmedi. |
| Veriler | On-premise MySQL üretim ölçümleri, personel/operasyon kimlikleri ve P puanının tanımı. |
| Analiz | Personel ve operasyon bazında doğrulanmış ortalamalar ve ilk 5 sıralamaları. |
| Çıktı | Ad/kod, ortalama puan, ölçüm sayısı, analiz dönemi ve son başarılı veri aktarımı. |
| Dış sistem erişimi | İlk pilotta salt okunur erişim. ERP'ye yazma ve operasyonel değişiklikler daha sonra değerlendirilir. |
| Kesinti davranışı | İnternet olmadan LAN kullanımı; kaynak kesilirse merkezdeki son başarılı verinin yaşı gösterilir. Merkez kesilirse yerel okuma kapsamı ayrıca seçilir. |

Bu tablo onaylanmış bir teslimat listesi değildir. Pilotun kesin kapsamı, veri incelemesi ve kullanıcı görüşmeleri sonrasında belirlenmeli.

## İlk sürümde ertelenmesi önerilenler

- Bütün departmanları ve makineleri aynı anda bağlamak.
- ERP'nin yerine geçmek veya tüm iş süreçlerini yeniden kurmak.
- Üretim planını otomatik değiştirmek ya da dış sistemlerde iş emri açmak.
- Modeli baştan eğitmek veya kullanıcı geri bildirimleriyle üretimde kendiliğinden değiştirmek.
- Veriyle doğrulanmadan bakım tahmini, kesin maliyet veya tasarruf sözü vermek.
- Ayrıntılı fiziksel simülasyon ve üç boyutlu fabrika modeli oluşturmak.

Onaysız kritik işlem yapmak ve makine emniyetini yönetmek, yalnızca ilk sürümün değil ürünün genel sınırları dışında kalır.

## Teknoloji seçimlerinin durumu

Teknik yön React + Tauri istemci ve merkezi Spring Boot backend'dir. Aynı backend içinde REST request–response akışı ile kullanıcı isteği beklemeyen zamanlanmış aktarım bulunur. Backend MySQL'in içinde değil, sunucuda ayrı süreç olarak çalışır. İşletim sistemi servisi backend'i açılışta başlatır; `@Scheduled` çalışan backend'de aktarımı tetikler.

Kaynak MySQL kullanıcı tarafından belirtildi. Raporlama için ayrı MySQL öneriliyor; kodda kalan PostgreSQL bağımlılıkları henüz uyarlanmadı. SQLite önbelleği, Python veya yerel model ilk veri analizinin ön koşulu değil. Ayrıntılar [merkezi mimaride](../architecture/merkezi-spring-boot.md) ve [veri kurallarında](../architecture/veri-aktarimi-ve-performans.md).
