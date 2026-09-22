# LAN dağıtımı ve işletim

Durum: Kurulum planı; üretim kurulumu yapılmadı. [Mimari](../architecture/merkezi-spring-boot.md).

Hangi dosyaların ve ayarların değişeceği, local/prod ayrımı ve dış servis aracı kullanmadan Windows'ta başlatma seçenekleri için [merkez bilgisayara geçiş rehberine](merkez-bilgisayara-gecis-ve-profiller.md) bakın.

## Kurulum modeli

- Sürekli açık merkez bilgisayar/VM: Spring Boot paketi, uyumlu Java çalışma ortamı, servis tanımı ve raporlama deposu.
- Kullanıcı bilgisayarları: Tauri EXE/kurulum paketi ve merkez API adresi. Java ve MySQL parolası istemciye dağıtılmaz.
- Kaynak MySQL'e yalnız merkezden, gerekli tablo/view'lara salt okunur bağlantı açılır. Raporlama yazma hesabı ayrıdır.
- Merkezin işletim sistemi henüz kesinleşmedi. Windows seçilirse uygun servis sarmalayıcısıyla Windows Service, Linux seçilirse systemd gibi işletim sistemi servisi kullanılır.

Spring Boot MySQL içinde çalışmaz. İşletim sistemi sunucu açılışında uygulamayı başlatır; `@Scheduled` ise çalışan uygulamanın içindeki aktarımı tetikler. Sadece `java -jar` komutunu açık terminalde çalıştırmak üretim servis kurulumu sayılmaz.

Servis için otomatik başlangıç, kontrollü kapanış, hata sonrası yeniden başlatma, kısıtlı servis hesabı ve log saklama ayarlanmalı. Sunucu kapalıyken kaçırılan aralık, açılışta son başarılı noktadan tamamlanmalıdır.

## Ağ ve kimlik

- İç DNS adı veya ayrılmış adres kullan; API adresini EXE kaynak koduna sabitleme.
- HTTPS kullan ve şirket içi sertifikayı istemcilerin güven deposuna dağıt. Sertifika doğrulamasını kapatma.
- Güvenlik duvarında istemci → API ve merkez → kaynak MySQL yollarını gerekli portlarla sınırla. Veritabanını kullanıcı bilgisayarlarına açma.
- Veritabanı sırları merkezde, servis hesabının erişebildiği korumalı yapılandırmada bulunmalı; Git ve frontend paketine girmemeli.
- API'de kimlik doğrulama ve kayıt kapsamı yetkilendirmesi yapılmalı. Arayüzde düğme gizlemek yetki kontrolü değildir.
- Tauri içerik/bağlantı politikası, yetenek izinleri ve gerekiyorsa CORS izinli adreslerle yapılandırılır. CORS kimlik doğrulamanın yerine geçmez.
- Geliştirme kullanıcısı ve `local` profil üretim yetki modeli değildir. Mevcut profil `127.0.0.1` üzerinde çalışır; LAN dağıtımı için ayrı üretim yapılandırması gerekir.

## İnternetsiz çalışma

1. Font, ikon, JavaScript ve CSS dosyalarını uygulama paketinde tut. Mevcut `src/index.css` Google Fonts importları yerelleştirilmeli.
2. WebView2'nin temiz Windows bilgisayarına internet olmadan kurulmasını sağla: uygun çevrimdışı kurulum veya önceden yönetilen runtime dağıtımı seç.
3. Backend paketi ve Java runtime merkezde hazır bulunmalı. Maven/NPM/Cargo indirmeleri geliştirme/derleme ihtiyacıdır; son kullanıcı açılışında yapılmamalı.
4. Güncellemeleri LAN dağıtım noktası veya kontrollü kurulum paketiyle yap; dış güncelleme, telemetri veya model servislerine çalışma bağımlılığı bırakma.
5. İnternet çıkışı kapalı temiz bilgisayarda kurulum, giriş ve analiz testlerini yap. Geliştirme ortamındaki önbellekler testin yerine geçmez.

[Tauri Windows kurulum seçenekleri](https://v2.tauri.app/distribute/windows-installer/).

## Kesinti davranışı

| Durum | Beklenen davranış |
| --- | --- |
| İnternet yok, LAN ve merkez çalışıyor | Normal kullanım. |
| Kaynak MySQL erişilemiyor | Merkez son başarılı veriyi sunar; aktarım hatası ve veri yaşı görünür. |
| Merkez/API erişilemiyor | Açık bağlantı hatası; yerel önbellek yalnız ayrıca geliştirilip yetkilendirilirse eski veri etiketiyle sunulur. |
| Aktarım yarıda kesildi | Son tutarlı veri korunur; kısmi sonuç güncel/tamamlanmış olarak sunulmaz. |
| Merkez yeniden başladı | Servis otomatik açılır, aktarım kalıcı ilerleme noktasından devam eder. |

Yerel önbellek mevcut özellik kabul edilmez. Geliştirilirse saklanacak alanlar, kullanıcı ayrımı, oturum süresi, temizleme ve yetki iptali davranışı belirlenmeli. Kesinti sırasında yeni analiz veya yeni veri varmış gibi gösterilmemeli.

## İzleme, yedekleme ve kabul

- İzlenecekler: son başarılı aktarım, veri yaşı, aktarım süresi, okunan/eklenen/güncellenen/reddedilen kayıtlar, bağlantı hataları, API yanıt süreleri ve disk kullanımı.
- Aktuator sağlık yanıtı tek başına verilerin güncel olduğunu kanıtlamaz. Yönetim endpoint'leri yetkili erişimle sınırlandırılmalı.
- Yedek kapsamı: raporlama verisi, aktarım durumu, uygulama yapılandırması ve gerekli anahtar/sertifikalar. Kaynak MySQL yedek sorumluluğu ayrıca BT'ye aittir.
- Yedek aynı tek diskle sınırlı kalmamalı; kontrollü geri yükleme testi yapılmalı. Kabul edilen veri kaybı ve toparlanma süresi belirlenmeli.
- Pilot kabulü: iki ayrı EXE aynı dönem ve veri sürümünde aynı sonuçları görür; merkez kullanıcı oturumu açılmadan çalışır; kaynak kesintisi görünürdür; yetkisiz kullanıcı diğer veri kapsamını alamaz.

BT'den beklenenler: MySQL sürümü/şeması, yetkili view'lar, ağ erişimi, sunucu işletim sistemi, sertifika yöntemi, aktarım aralığı, saklama süresi, yedek ve işletim sorumluları.
