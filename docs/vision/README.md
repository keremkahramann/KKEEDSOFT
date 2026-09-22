# KKEEDSOFT — Ürün vizyonu

KKEEDSOFT, Kahraman Kalıp'ta üretim ve iş süreçleriyle ilgili bilgileri bir araya getirerek karar hazırlamayı kolaylaştırmayı amaçlıyor. Bu bölüm, ürünün neden geliştirildiğini, kimlere yardımcı olacağını ve ilk sürümün nereden başlayabileceğini anlatır.

Belgeler [KKEEDSOFT proje bağlamı](../../KKEEDSOFT-Codex-Context.md), mevcut kod ve 21 Eylül 2026'ya kadar yapılan görüşmelerle güncellenmiştir. Hedefler tamamlanmış özellikler olarak okunmamalıdır. Tüm teknik belgeler için [dokümantasyon dizinine](../README.md) bakın.

## Nereden başlamalı?

1. [Ürün vizyonu](urun-vizyonu.md): Çözmek istediğimiz problem ve ürünün temel ilkeleri.
2. [Kapsam ve ilk sürüm](kapsam-ve-ilk-surum.md): İlk sürüm önerisi ve ürünün sınırları.
3. [Paydaşlar ve kullanıcı ihtiyaçları](paydaslar-ve-kullanici-ihtiyaclari.md): Olası kullanıcılar ve görüşmelerde öğrenmemiz gerekenler.
4. [Kullanım senaryoları](kullanim-senaryolari.md): Günlük işlerden örnekler ve beklenen davranışlar.
5. [Başarı ölçümü ve açık konular](basari-olcumu-ve-acik-konular.md): Faydayı nasıl ölçeceğimiz ve henüz bilmediklerimiz.
6. [Geliştirme yol haritası](gelistirme-yol-haritasi.md): Kodlamaya nereden başlayacağımız, geliştirme sırası ve her adımın tamamlanma koşulu.

## Neyi biliyoruz, neyi henüz bilmiyoruz?

Şirket ve ürünle ilgili bilgiler aktarılan bağlama dayanıyor; şirket içinde ayrıca doğrulanmış değiller. **Varsayım** olarak işaretlenen noktalar görüşme veya veri incelemesi gerektiriyor. **Öneri** olarak sunulan yaklaşımlar ise henüz alınmış kararlar değil. Karar bekleyen konular başarı ölçümü ve açık konular belgesinde bir araya getirildi.

## Repository'deki başlangıç

İncelemede kök dizindeki `AGENTS.md` kuralları esas alındı. `CLAUDE.md` de aynı dosyaya yönlendiriyor.

| Bölüm | Dosyalarda görülen durum |
| --- | --- |
| `src/` | React, TypeScript, Vite ve Tailwind ile hazırlanmış arayüz. `src/App.tsx` içinde sohbet, planlama, makineler, kalite, maliyet ve onay gibi ekranlara geçişler var. |
| `src/screens/` | Dashboard göstergeleri kod içinde tanımlı; giriş ve sohbet gibi ekranlarda zamanlayıcıyla oluşturulan örnek davranışlar bulunuyor. Bu göstergeler şirketin gerçek performans ölçümleri değil. |
| `src-tauri/` | Tauri masaüstü başlangıcı var. Bu, çevrimdışı veri ve model işlevlerinin tamamlandığını göstermiyor. |
| `backend/` | Java 21 / Spring Boot 4.1.1; `local` profilde bellek içi iş emri API'si, doğrulama, güvenlik ve testler var. PostgreSQL bağımlılıkları mevcut; hedef kaynak MySQL bağlantısı ve periyodik aktarım henüz yok. |
| `src/lib/spreadsheetAnalysis.ts` | XLSX personel/operasyon ortalamaları istemcide hesaplanıyor. Backend'de artık yerel örnek veriyle çalışan sürümlü performans API'si var; frontend henüz ona bağlanmadı. |

Bu belgelerde ürün adı KKEEDSOFT olarak kullanılıyor. Kodda kalan önceki adlar, ürün adı hakkında yeni bir karar olarak yorumlanmıyor.

## Son görüşmelerin teknik yönü

İlk entegrasyon odağı personel ve operasyon performansıdır. Kaynak on-premise MySQL'den periyodik veri alınacak; merkezi Spring Boot uygulaması LAN içindeki Tauri EXE'lerine sonuç sunacak. İnternet, normal çalışma için gerekmeyecek. Raporlama deposu olarak ayrı MySQL öneriliyor; fiziksel yerleşim ve kaynak şeması henüz kesinleşmedi.

[Merkezi mimari](../architecture/merkezi-spring-boot.md), [veri aktarımı ve performans](../architecture/veri-aktarimi-ve-performans.md) ile [LAN işletimi](../operations/lan-dagitim-ve-isletim.md) bu yönü ayrıntılandırır. İş emri gecikmesi ve makine duruşu senaryoları sonraki genişlemeler olarak korunur.
