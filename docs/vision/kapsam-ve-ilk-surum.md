# Kapsam ve ilk sürüm

## Ürünün kapsayabileceği işler

Bağlamda üretim planlama, kapasite, sipariş gecikmeleri, makine duruşları, kalite, bakım, maliyet, stok ve departmanlar arası problem analizi yer alıyor. Bunlar uzun vadeli çalışma alanları. Hepsini ilk sürüme almak için verilmiş bir karar yok.

Beklenen kaynaklar Dinamo ERP, üretim makineleri ve şirket dokümanları. Hangi bilginin nerede tutulduğu ve çelişki olduğunda hangi kaydın esas alınacağı şirket içinde doğrulanmalı. Makine markasının bilinmesi, gerekli sinyallere erişilebildiği anlamına gelmiyor.

## İlk sürüm için öneri

**Öneri:** İlk kullanılabilir sürüm (MVP), dar bir kullanıcı grubunun gerçek bir sorununu baştan sona ele alsın. Önce tek senaryo seçilsin; ikinci senaryo ancak verisi hazırsa ve değerlendirme yükü yönetilebiliyorsa eklensin.

**Varsayım:** Sipariş veya iş emri gecikme analizi iyi bir başlangıç olabilir. Bunun için ilgili kayıtların eşleştirilebildiğini ve bir süreç sahibinin sonucu kontrol edebildiğini görmemiz gerekiyor. İlk senaryo henüz seçilmedi.

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
| Veriler | Senaryo için gerekli, kaynağı ve güncelliği bilinen kayıtlar. |
| Analiz | Bulgular, dayanaklar, eksikler ve hesaplanabilen alternatifler. |
| Çıktı | Kullanıcının inceleyebileceği analiz ve öneri. Aksiyon taslağı kapsama alınırsa kullanıcı onayına sunulması. |
| Dış sistem erişimi | İlk pilotta salt okunur erişim. ERP'ye yazma ve operasyonel değişiklikler daha sonra değerlendirilir. |
| Kesinti davranışı | Bağlantı ve veri güncelliğinin gösterilmesi. Yerel okuma veya taslak saklama kapsamı kullanıcı ihtiyacına göre seçilir. |

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

Kodda React arayüzü, Tauri masaüstü başlangıcı ve Spring Boot sunucu başlangıcı var. Bunlar mevcut geliştirme durumunu gösteriyor. Bağlamda masaüstü kabuğunun nihai seçimi ve Spring Boot'un ilk sürümde zorunlu olup olmayacağı hâlâ açık konu olarak geçiyor.

PostgreSQL, SQLite, Python ve yerel model araçları gibi öneriler bu belgelerle kesinleştirilmiyor. Teknik kararlar gerektiğinde gerekçeleriyle ayrı karar kayıtlarına taşınmalı; bu aşamada ilgili klasörler açılmıyor.
