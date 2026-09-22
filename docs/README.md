# KKEEDSOFT dokümantasyonu

Son güncelleme: 22 Eylül 2026.

Bu belgeler ürün vizyonunu, mevcut uygulama durumunu ve son görüşmelerde belirlenen teknik yönü birlikte açıklar. Bir özelliğin burada tasarlanmış olması, kodda tamamlandığı anlamına gelmez.

## Okuma sırası

1. [Ürün vizyonu](vision/README.md): Amaç, kapsam ve kullanıcı ihtiyaçları.
2. [Merkezi Spring Boot mimarisi](architecture/merkezi-spring-boot.md): LAN, EXE, REST API, zamanlayıcı ve MySQL bağlantılarının sorumlulukları.
3. [Veri aktarımı ve performans kuralları](architecture/veri-aktarimi-ve-performans.md): Periyodik aktarım, alan eşleştirmeleri, hesaplama ve önerilen API sözleşmesi.
4. [LAN dağıtımı ve işletim](operations/lan-dagitim-ve-isletim.md): Servis kurulumu, internetsiz çalışma, erişim, kesinti ve yedekleme.
5. [Geliştirme yol haritası](vision/gelistirme-yol-haritasi.md): Uygulama sırası ve kabul kontrolleri.
6. [Mevcut backend'i çalıştırma](../backend/README.md): Bugün çalışan yerel geliştirme API'si.
7. [Merkez bilgisayara geçiş ve profiller](operations/merkez-bilgisayara-gecis-ve-profiller.md): Dosya bazlı değişiklikler, `@Profile("local")` açıklaması, sunucu ayarları ve taşınma kontrolleri.

## Teknik yön ve mevcut durum

| Konu | Hedef / karar yönü | Bugünkü durum |
| --- | --- | --- |
| Kullanıcı uygulaması | React + TypeScript, Tauri EXE; LAN API'sine bağlanır. | Arayüz ve Tauri yapılandırması var. |
| Merkezi backend | Tek Spring Boot uygulaması; REST API ve aktarım görevi ayrı modüller. | Java 21 / Spring Boot 4.1.1 ve `local` profilde bellek içi iş emri API'si var. |
| Kaynak | Kullanıcının belirttiği on-premise MySQL; periyodik, salt okunur erişim. | Kaynak bağlantısı, şema eşleştirmesi ve otomatik aktarım yok. |
| Raporlama deposu | Kaynaktan ayrı MySQL veritabanı| Maven'da PostgreSQL/Flyway bağımlılıkları bulunuyor; MySQL geçişi yapılmadı. |
| İlk veri analizi | Personelde en yüksek/en düşük 5; operasyonda pozitif ölçümlerden en düşük 5. | XLSX istemci analizi ve local örnek veriyle çalışan Spring Boot rapor endpoint'leri var; gerçek kaynak ve frontend HTTP bağlantısı bekliyor. |
| Çalışma ortamı | İnternet gerektirmeyen LAN; otomatik başlayan merkez servis. | Üretim servisi kurulumu, gerçek yetkilendirme ve internetsiz kabul testi tamamlanmadı. |

Önceki bağlamın tarihsel kaynağı [proje bağlamı](../KKEEDSOFT-Codex-Context.md) belgesidir. Son görüşmelerle değişen ilk senaryo ve mimari yönü bu dokümantasyonda güncellenmiştir. Dinamo ERP ile MySQL tablolarının ilişkisi ayrıca doğrulanacaktır.
