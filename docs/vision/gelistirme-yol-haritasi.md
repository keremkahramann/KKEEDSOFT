# KKEEDSOFT — Geliştirme yol haritası

Güncelleme: 21 Eylül 2026. Önceki yol haritası iş emri/gecikme senaryosunu ilk hedef olarak öneriyordu. Son görüşmelerle ilk merkezi entegrasyon odağı **personel ve operasyon performansı** olarak değişti. İş emri API çalışmaları korunuyor; gecikme, duruş ve yapay zekâ senaryoları sonraki aşamalara taşınıyor.

Takvim verilmedi; kaynak erişimi, veri hacmi ve ekip kapasitesi doğrulanmalı. Aşağıdaki hedefler tamamlanmış özellik değildir.

## Mevcut durum

- React/Tauri arayüzü ve XLSX üzerinden istemcide çalışan performans analizi var.
- `backend/` Java 21 / Spring Boot 4.1.1 kullanıyor; `local` profilde bellek içi iş emri CRUD API'si, güvenlik, doğrulama ve testler var. Gerçek üretim bağlantısı yok.
- 22 Eylül: Personel/operasyon modelleri, üretim ölçümleri, ID bazlı merkezi performans hesapları, kategorize controller'lar ve `/api/v1` istek koleksiyonu yerel örnek veriyle eklendi. [Güncel API sözleşmesi](../architecture/api-modelleri-ve-istekler.md). Aşağıdaki merkezi hesaplama adımının örnek veri kısmı tamamlandı; kaynakla karşılaştırma bekliyor.
- PostgreSQL bağımlılıkları hâlâ mevcut. Kaynak MySQL, ayrı raporlama bağlantısı ve aktarım zamanlayıcısı uygulanmadı.
- Giriş ve bağlantı göstergelerinde demo davranışlar bulunuyor. Üretim yetkilendirmesi, servis kurulumu ve tamamen internetsiz dağıtım doğrulanmadı.

## İzlenecek sıra

| Adım | Yapılacak iş | Tamamlanma koşulu |
| --- | --- | --- |
| 1. Kaynak ve kural keşfi | MySQL sürümü, tablo/view'lar, ID'ler, tarih alanları, E–F–I–P karşılıkları ve P formülü. | Süreç sahibi örnek kayıtlarla beklenen hesapları doğrular. |
| 2. Merkezi hesaplama | XLSX kurallarını PerformanceService'e taşı; örnek veriyle önerilen REST yollarını oluştur. | En yüksek/en düşük 5 personel ve P > 0 operasyon sonuçları testlerle doğrulanır. |
| 3. Kalıcı depo ve aktarım | İki veri kaynağı, gerekli sürücü/migration, salt okunur kaynak hesabı ve ID ile ekle/güncelle. | Kaynak örnekleri eşleşir; tekrar aktarım kayıt çoğaltmaz. |
| 4. Zamanlanmış işletim | SyncJob, kalıcı ilerleme, görev kilidi, hata/tekrar deneme, tutarlı veri yayını. | Kullanıcı bağlı olmadan aktarım; yeniden başlatma ve yarım aktarım doğru yönetilir. |
| 5. Gerçek istemci bağlantısı | EXE analiz ekranını API'ye bağla; tarih/kapsam, yüklenme, hata ve güncellik göster. | İki istemci aynı veri sürümünde aynı sonucu görür; normal yenileme kaynak taraması başlatmaz. |
| 6. Güvenlik ve LAN dağıtımı | Gerçek kimlik/rol/veri kapsamı, HTTPS, servis kurulumu, yerel fontlar ve WebView2. | Yetkisiz erişim reddedilir; interneti kapalı temiz bilgisayarda kurulum ve kullanım geçer. |
| 7. Pilot ve işletim | Sonuçları süreç sahibiyle karşılaştır; log, yedek ve geri yüklemeyi doğrula. | Kaynak kesintisi görünür, yedekten dönüş denenmiş, sonuç farkları açıklanmış olur. |

Gerçek şirket verisi kullanıcıya açılmadan güvenlik adımı tamamlanmalı; tablo sırası güvenliği erteleme izni değildir. İlk etaplar kontrollü yapay/veri örnekleriyle geliştirilebilir.

## İlk kodlama paketinin kapsamı

- Kaynak şema beklenirken kimliği, puanı ve tarihi belli test verileri hazırla.
- Mevcut `workorder` geliştirme modülünden ayrı bir `performance` modülü tanımla; önerilen endpoint'leri [sözleşmeye](../architecture/veri-aktarimi-ve-performans.md) göre geliştir.
- XLSX istemci sonuçlarıyla backend sonuçlarını aynı veri üzerinde karşılaştır. Hesap kuralları tek üretim otoritesi olarak merkezde tutulmalı.
- Aktarım ayarlarını `local` profiline ekleyip gerçek veriyi açma; ayrı çalışma profili ve kaynak/raporlama bağlantısı tasarla.
- MySQL sürücüsü ve raporlama migration seçimini mevcut PostgreSQL bağımlılıklarıyla birlikte değerlendir; kaynak şemada otomatik değişiklik çalıştırma.

## Kabul senaryoları

- Aynı operasyon için `0, -20, 40, 80` ölçümleri: operasyon ortalaması `60`, ölçüm adedi `2`.
- Personel ortalaması mevcut aritmetik kuralla korunur; negatiflerin iş anlamı süreç sahibiyle netleştirilir.
- Personel bilgisi eksik olan geçerli operasyon ölçümü operasyon hesabına katılır.
- Boş/geçersiz P, eşit puan, beşten az grup ve geçersiz dönem filtreleri anlaşılır sonuç verir.
- Tekrar aktarım ve geçmiş kayıt düzeltmesi çoğalma veya eski ortalama üretmez; silme senaryosu seçilen yöntemle denenir.
- API hatası demo veriyi gerçekmiş gibi göstermez; kaynak kesintisi son başarılı zamanı gizlemez.
- Kimlik değiştirerek başka bölüme erişim ve yetkisiz aktarım tetikleme reddedilir.
- Merkez yeniden başladığında kullanıcı oturumu olmadan servis çalışır; internet kapalıyken LAN akışı sürer.

## Sonraki genişlemeler

1. İş emri/plan bağlantıları ve gecikme analizi: mevcut yerel API'yi gerçek sözleşme ve kalıcı verilerle ele al.
2. Makine duruşu ve kalite: kaynak sinyalleri doğrula; veri bağlantısı kesintisini makine duruşuyla karıştırma.
3. Yerel önbellek: ihtiyaç, kullanıcı ayrımı ve saklama/oturum kuralları doğrulanırsa geliştir.
4. Yerel yapay zekâ: doğrulanmış analizleri açıklasın; sayısal sonuçları değiştirmesin. Temel raporlar model olmadan çalışmalı.
5. Onaylı işlemler: ayrı yetki, açık insan onayı, denetim ve tekrar deneme kurallarıyla tasarla. Mevcut demo yazma yollarını doğrudan üretime açma.

Makine emniyet devreleri ve gerçek zamanlı koruma kapsam dışında kalır. Ayrıntılar: [mimari](../architecture/merkezi-spring-boot.md), [işletim](../operations/lan-dagitim-ve-isletim.md), [başarı ve açık konular](basari-olcumu-ve-acik-konular.md).
