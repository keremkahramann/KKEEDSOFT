# Merkez bilgisayara geçiş ve Spring profilleri

Güncelleme: 22 Eylül 2026. Bu dosya mevcut koddan üretim kurulumuna geçerken yapılacak işleri gösterir. **Üretim profili, gerçek kaynak bağlantısı ve otomatik aktarım henüz uygulanmış değildir.** Aşağıdaki üretim komutları ve isimleri hedef örneklerdir; yalnız dosyaları kopyalamak bu özellikleri oluşturmaz.

İlgili belgeler: [mimari](../architecture/merkezi-spring-boot.md), [LAN işletimi](lan-dagitim-ve-isletim.md), [yerel backend çalıştırma](../../backend/README.md).

## 1. `@Profile("local")` ne yapıyor?

Spring bir uygulama başlatırken controller, servis, repository ve configuration sınıflarından yönettiği nesneleri (bean) oluşturur. Bir bileşendeki `@Profile("local")`, o bileşenin **yalnız `local` profili aktifse** kaydedilmesini sağlar.

Mevcut örnek:

```java
@Repository
@Profile("local")
public class LocalReportingRepository implements ReportingRepository {
    // Gerçek kaynağa bağlanmadan örnek personel, operasyon ve ölçümler sağlar.
}
```

`local` aktifken bu depo kullanılabilir. Yalnız `prod` aktifken bu sınıf kaydedilmez; Spring onun yerine kendiliğinden gerçek bir veritabanı deposu oluşturmaz. O implementasyonun ayrıca yazılması gerekir.

`local` Spring'in özel ağ modu değildir; bizim verdiğimiz profil adıdır. `prod` da özel bir üretim sihri değil, kullanmayı planladığımız diğer profil adıdır. Profil **nerede** çalıştığını otomatik algılamaz; çalıştırma ayarından seçilir.

| Kavram | Ne belirler? |
| --- | --- |
| `@Profile("local")` | Hangi Spring bileşenlerinin kaydedileceğini. |
| `application-local.properties` | Local profil açıkken yüklenecek ek ayarları. |
| `spring.profiles.active=local` | Aktif profil seçimini. |
| `server.address=127.0.0.1` | HTTP sunucusunun yalnız aynı bilgisayardan erişilen loopback adresini dinlemesini. |
| Güvenlik duvarı, HTTPS, kullanıcı yetkileri | Ağ erişimi ve uygulama güvenliğini. |

**Profil ile localhost aynı şey değildir.** `local` profilini merkez bilgisayarda çalıştırırsan yine örnek verili geliştirme uygulaması açılır. LAN IP'sini dinleyecek şekilde değiştirmek örnek veriyi gerçek veriye çevirmez. Benzer şekilde `prod` profilindeki bir uygulama da 127.0.0.1 üzerinde dinleyecek şekilde ayarlanabilir.

## 2. Bu projede neden local kullanıldı?

- Gerçek veritabanı adresi, şeması, salt okunur hesabı ve kaynak alan eşleştirmesi henüz doğrulanmadı.
- Personel/operasyon kurallarını gerçek üretim verisine bağlanmadan geliştirmek ve test etmek gerekiyordu.
- İş emri yazma örnekleri yalnız bellek içindeki kayıtları değiştiriyor; üretim kayıtlarını değiştirmiyor.
- Yeni raporlama örnekleri `LOCAL_DEMO` olarak etiketleniyor; sync durumu `NOT_CONFIGURED`, son başarılı aktarım zamanı null dönüyor.
- Geliştirme hesabı ve test verisinin ileride üretimle karışmaması amaçlanıyor.

Bu nedenle şu anda **controller ve iş servisleri de local ile sınırlı**. Bu geçici geliştirme sınırıdır; kalıcı mimaride hesaplama ve HTTP sözleşmelerinin ortamdan bağımsız, örnek/gerçek depoların ise ortama göre seçilmesi hedeflenir.

Local bir güvenlik duvarı veya veritabanı erişim yetkisi değildir. Gerçek kaynağın koruması ayrıca veritabanı hesabı, ağ kuralları ve backend yetkilendirmesiyle sağlanır.

## 3. Profil nasıl seçilir?

Mevcut geliştirme akışı, `backend` klasöründe:

```powershell
# JDK 21 ve KKEEDSOFT_DEV_PASSWORD için backend README adımlarını tamamla.
.\mvnw.cmd spring-boot:run '-Dspring-boot.run.profiles=local'
```

Paketlenmiş JAR için, dosya adı dağıtılan sürüme göre değiştirilir:

```powershell
java -jar .\target\kahraman-twin-api-0.0.1-SNAPSHOT.jar --spring.profiles.active=local
```

Alternatif olarak `SPRING_PROFILES_ACTIVE=local` ortam değişkeni kullanılabilir. Komut satırında ayrıca profil verilirse standart Spring Boot ayar önceliğinde komut satırı değeri üstün gelir. Tek bir açık seçim yöntemi kullanmak işletimi kolaylaştırır.

- Ortak ayarlar `application.properties` dosyasından gelir; aktif profilin `application-{profil}.properties` ayarları bunları tamamlar veya ezer.
- `spring.profiles.active` seçimini `application-local.properties` veya `application-prod.properties` içine koyma; çalıştırma ortamında veya ortak yapılandırmada seç.
- `@Profile({"local", "prod"})` **local VEYA prod** anlamındadır; iki koşulun birlikte sağlanması gerekmez.
- Açık profil seçilmezse standart `default` profili kullanılır; `application-local.properties` var diye local otomatik açılmaz.
- `local,prod` profillerini birlikte açarak üretim eksiklerini giderme. Örnek ve gerçek bileşenlerin aynı anda kaydedilmesine neden olabilir.

Bugünkü projede yalnız `prod` seçilirse local controller'lar etkinleşmez; eksik veri kaynağı yapılandırması yüzünden uygulama açılışı da başarısız olabilir. Bu bir üretime geçiş yöntemi değildir.

Kaynak: [Spring Boot profil davranışı](https://docs.spring.io/spring-boot/reference/features/profiles.html).

## 4. Kodda hangi dosyalar değişecek?

Aşağıdaki Java yolları `backend/src/main/java/com/kkeedsoft/kahraman_twin_api/` altındadır. Önerilen yeni dosyalar henüz mevcut değildir.

| Dosya / bölüm | Bugünkü durum | Merkez sürümü için yapılacak iş |
| --- | --- | --- |
| [backend/pom.xml](../../backend/pom.xml) | Java 21; Spring Boot; PostgreSQL ve PostgreSQL Flyway bağımlılıkları. | Kaynak motor/sürümünü doğrula. Kaynak ve raporlama için gereken sürücüleri ve migration modülünü seç; mevcut bağımlılıkları gerçek ihtiyaca göre düzenle. |
| [application.properties](../../backend/src/main/resources/application.properties) | Ortak uygulama adı, hata ve health ayarları. | Ortak, sır içermeyen ayarları tut. Kaynak şifrelerini veya makineye özel yolları gömme. |
| [application-local.properties](../../backend/src/main/resources/application-local.properties) | 127.0.0.1:8080, geliştirme hesabı, kapalı DataSource/Hibernate/Flyway otomatik yapılandırması. | Geliştirme için koru; üretim dosyasına kopyalayıp yalnız profil adını değiştirme. |
| Önerilen `application-prod.properties` | Yok. | Dinleme adresi, port, HTTPS, log ve üretim bağlantı ayarlarını tanımla. Hassas ve sunucuya özel değerleri korumalı dış yapılandırmadan al. |
| Önerilen `config/SourceDataSourceConfig` ve `ReportingDataSourceConfig` | Yok. | Kaynak salt okunur ve raporlama yazılabilir iki bağlantıyı açıkça bağla; transaction ve migration hedeflerini ayır. İki özel properties öneki yazmak tek başına iki bağlantı oluşturmaz. |
| [LocalReportingRepository](../../backend/src/main/java/com/kkeedsoft/kahraman_twin_api/reporting/repository/LocalReportingRepository.java) | Sabit örnek kayıtlar, `@Profile("local")`. | Local olarak koru. Gerçek veriymiş gibi prod'da etkinleştirme. |
| [ReportingRepository](../../backend/src/main/java/com/kkeedsoft/kahraman_twin_api/reporting/repository/ReportingRepository.java) | Değişmez veri sürümü okuma sözleşmesi. | Gerçek raporlama adaptörü ekle; sorgu ölçeği, tutarlı veri sürümü ve dönem filtrelerini ele al. |
| `employee/controller`, `operation/controller`, `production/controller`, `performance/controller` | HTTP yolları local ile sınırlı. | Gerçek depo ve güvenlik hazırken ortak controller'ların profil koşulunu kaldır veya desteklenen profilleri açıkça belirle. |
| `reporting/service/CatalogService`, `production/service/MeasurementService`, `performance/service/PerformanceService` | Ortak iş mantığı local ile sınırlı. | Hazır bağımlılıklarıyla ortaklaştır. Personel ve operasyon formüllerini ortam değişiyor diye değiştirme. |
| [LocalSecurityConfig](../../backend/src/main/java/com/kkeedsoft/kahraman_twin_api/config/LocalSecurityConfig.java) | HTTP Basic ve yalnız DEVELOPER rolü. | Local için koru; üretim kimlik doğrulaması, rol/veri kapsamı ve gerekiyorsa CSRF/CORS politikasını ayrı yapılandır. |
| `auth/controller/CsrfController` | Local token endpoint'i. | Seçilen üretim oturum/kimlik yöntemine göre kullanılmasını belirle. Güvenlik kontrollerini yalnız bağlantı kurmak için kapatma. |
| `workorder/controller`, `WorkOrderService`, `InMemoryWorkOrderRepository` | Bellek içi örnek CRUD. | İlk salt okunur pilotta local tut. Gerçek iş emri yazma için ayrı kapsam ve veri adaptörü geliştirilmeden prod'a açma. |
| `sync/controller/SyncController`, `sync/service/SyncStatusService` | Henüz aktarım olmadığı bilgisini döndürüyor. | Kalıcı aktarım durumunu sunan üretim implementasyonu ekle. NOT_CONFIGURED değerini sabit olarak SUCCESS yapmak çözüm değil. |
| Önerilen `sync/job/SyncJob`, `sync/service/SyncService` | Yok. | Zamanlama, kilit, kayıt doğrulama, ekle/güncelle, silme takibi, yeniden deneme ve kalıcı ilerleme geliştir. |

**Tüm dosyalardaki `@Profile("local")` ifadelerini topluca silme veya prod ile değiştirme.** Ortak iş mantığı ile yalnız geliştirmede bulunması gereken bileşenler farklı ele alınmalı. Local testler çalışmaya devam etmeli; ayrıca gerçek üretim adaptörü ve profilinin başlama/erişim testleri eklenmeli.

## 5. Sunucuda hangi değerleri belirleyeceğim?

| Ayar | Belirlenecek değer |
| --- | --- |
| Aktif profil | Üretim implementasyonu tamamlandıktan sonra `prod`. |
| Java | JDK/runtime 21'in sunucudaki tam yolu; geliştirici bilgisayarındaki yolu varsayma. |
| Çalışma dizini ve JAR | Örneğin `C:\KKEEDSOFT` ve `app\api.jar`; servis/görev hesabının erişimi olmalı. |
| Kaynak | Gerçek DB motoru/sürümü, host, port/instance, DB adı, view'lar, salt okunur hesap ve TLS ayarları. |
| Raporlama deposu | Ayrı DB/şema, gerekli yazma hesabı, migration hedefi, yedek planı. |
| Aktarım | Sıklık, ilk aktarım dönemi, saat dilimi, parça boyutu, yeniden deneme ve veri eskime eşiği. |
| API erişimi | İç DNS, HTTPS sertifikası, port ve izinli ağlar. LAN'a doğrudan açılacaksa uygun arayüz; aynı sunucudaki ters vekilin arkasındaysa loopback kullanılabilir. |
| Güvenlik | Kullanıcı/rol kaynağı, kayıt kapsamı, oturum süresi; geliştirme hesabı üretimde kullanılmaz. |
| Log ve yedek | Yazılabilir yollar, döndürme/saklama süresi, geri yükleme sorumlusu. |

Kaynak önce MySQL olarak bildirildi; sonraki ekran görüntülerinde SQL Server araçları da var. Dosya adları aktif veritabanını kanıtlamaz. Bağlantı sürücüsü ve URL biçimi BT doğrulamasıyla seçilmeli; sırları dokümana veya Git'e yazma.

Kaynak şema üzerinde Hibernate otomatik DDL veya Flyway migration çalıştırma. Migration yalnız uygulamanın sahip olduğu raporlama şemasını yönetmeli.

## 6. Yapılandırma nerede bulunacak?

Önerilen sunucu yerleşimi:

```text
C:\KKEEDSOFT\
  app\api.jar
  config\application-prod.properties
  logs\
```

Üretim bileşenleri ve dış yapılandırma tamamlandıktan sonra örnek başlatma:

```powershell
# Yolları gerçek kurulumuna göre düzenle. Bu, mevcut local sürümü prod'a dönüştürmez.
& 'C:\Java\jdk-21\bin\java.exe' '-jar' 'C:\KKEEDSOFT\app\api.jar' '--spring.profiles.active=prod' '--spring.config.additional-location=file:C:/KKEEDSOFT/config/'
```

`spring.config.additional-location` standart yapılandırmaya ek bir konum sağlar; dizin yolunun sonundaki `/` korunur. Sunucuya özel yapılandırma sınırlı dosya izinleriyle tutulmalı; kaynak kod veya ortak ağ paylaşımına şifre bırakılmamalı. Servis/görev süreci kendi ortamını kullanır: geliştirici terminalinde ayarlanan bir değişkenin servis hesabında da bulunduğunu varsayma.

Kaynak: [Spring Boot dış yapılandırma](https://docs.spring.io/spring-boot/reference/features/external-config.html).

## 7. Windows'ta otomatik başlatma

NSSM/WinSW kullanmadan iki farklı yol vardır:

- **Görev Zamanlayıcı:** Windows başlangıcında Java'yı doğrudan çalıştırır; kullanıcı oturumu olmadan çalıştırma, uygun hesap, çalışma dizini, tekrar başlatma ve ikinci örneği engelleme ayarlanır. Uzun süre çalışmaya izin verilir. Bu gerçek bir Windows servisi değildir; zorla durdurma kontrollü Spring kapanışını garanti etmez.
- **Kendi Windows servis host'un:** Service Control Manager protokolünü karşılayan bir program Java sürecini yönetir. Başlatma, kontrollü durdurma, alt süreç takibi ve hata davranışı geliştirilir; `sc.exe` bu host'u kaydeder. `sc.exe create` ile doğrudan `java.exe -jar` kaydetmek Java'yı Windows servisine dönüştürmez.

İşletim sistemi API'yi başlatır ve çalışır tutar; Spring zamanlayıcısı API içindeki veri aktarımını tetikler. Birini yapılandırmak diğerini oluşturmaz. Sunucu kapalıyken kaçan aktarım aralığı, kalıcı son başarılı noktadan devam etmelidir.

## 8. EXE ve arayüzde değişecekler

| Dosya / bölüm | Gereken değişiklik |
| --- | --- |
| [LoginScreen.tsx](../../src/screens/LoginScreen.tsx) | Bağlantı/giriş simülasyonunu gerçek API isteğiyle değiştir; sunucu adresini kullanıcı veya BT ayarından al. |
| Yeni ortak HTTP istemcisi / ayarlar | Merkezi HTTPS adresi, kimlik/oturum, hata/zaman aşımı ve veri güncelliği davranışını uygula. EXE'deki localhost her kullanıcının kendi bilgisayarıdır. |
| [SpreadsheetFilter.tsx](../../src/components/SpreadsheetFilter.tsx) | Merkezi rapor akışını ayrı veri kaynağıyla bağla; yerel XLSX dosyasını sunucu aktarılmış veri gibi gösterme. |
| [tauri.conf.json](../../src-tauri/tauri.conf.json) | CSP/izinleri API erişimine uygun sınırlandır; internetsiz Windows kurulumu için WebView2 planını uygula. |
| `tauri.conf.json` içindeki `build.devUrl` | Bu Vite geliştirme adresidir, backend adresi değildir. Merkez API adresini buraya yazma; paketlenmiş EXE `frontendDist` içeriğini kullanır. |
| [index.css](../../src/index.css) | Google Fonts importlarını yerel font dosyalarıyla değiştir. |
| [API istek koleksiyonu](../../backend/requests/README.md) | Sunucu kabul testlerinde baseUrl ve gerçek kimlik yöntemini kullan; örnek parolayı üretime taşıma. |

Backend Java çalışma ortamı yalnız merkezde gerekir. İstemcilere kaynak veritabanı kullanıcı/parolası dağıtılmaz.

## 9. Taşımadan önce ve sonra kontrol listesi

- [ ] Kaynak türü/sürümü, alan eşleştirmeleri ve hesaplama örnekleri doğrulandı.
- [ ] Gerçek depo, üretim güvenliği ve prod profili geliştirildi; local örnek bileşenler prod'da yüklenmiyor.
- [ ] Kaynak salt okunur erişimi ve raporlama migration hedefi ayrıldı.
- [ ] Testler ve paketleme geliştirme/derleme ortamında tamamlandı; gerekli runtime ve dosyalar internetsiz kurulum için hazır.
- [ ] Sunucuda önce kontrollü başlatma ve log kontrolü yapıldı; ardından servis/görev tanımı eklendi.
- [ ] Ayrı kullanıcı bilgisayarından HTTPS, giriş, yetki ve gerçek performans endpoint'leri doğrulandı.
- [ ] Sonuçta LOCAL_DEMO etiketi yok; veri kaynağı/sürümü ve son başarılı aktarım gerçeği yansıtıyor. Yalnız etiketi değiştirmek kabul testi değildir.
- [ ] Aynı verilerle iki EXE aynı raporu görüyor; operasyon P > 0 ve ilk 5 kuralları kaynak kayıtlarla karşılaştırıldı.
- [ ] Merkez yeniden başlayınca kullanıcı oturumu olmadan API açılıyor; aktarım kayıtları çoğaltmadan devam ediyor.
- [ ] Kaynak/LAN kesintisi ve interneti kapalı temiz istemci kurulumu denendi.
- [ ] Yedek, geri yükleme ve önceki uygulama sürümüne dönüş planı hazır; migration geri dönüş uyumluluğu kontrol edildi.

Bu dosya geçiş planıdır. Gerçek üretim ayarlarını edinmeden aktif kodun profilini değiştirmez ve sunucu kurulumu yapmaz.
