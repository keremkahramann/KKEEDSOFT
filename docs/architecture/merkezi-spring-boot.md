# Merkezi Spring Boot mimarisi

Durum: Hedef tasarım, 21 Eylül 2026. [Dokümantasyon dizini](../README.md).

## Yerleşim

Spring Boot, MySQL'in içine kurulmaz. Sunucuda ayrı bir uygulama olarak çalışır ve bağlantı üzerinden veritabanını sorgular. Aynı fiziksel sunucuda bulunmaları mümkündür; tercih edilen yerleşim ayrı bir uygulama sunucusu veya sanal makinedir. Fiziksel yerleşim BT ile belirlenecektir.

```text
Kaynak MySQL (üretim sistemi)
           |
           | Salt okunur, periyodik sorgu
           v
Merkez sunucudaki Spring Boot uygulaması
  SyncJob -> SyncService -> Kaynak Repository
                  |
                  v
        Raporlama veritabanı
                  |
                  v
        PerformanceService -> REST Controller
                                  ^
                                  | LAN / HTTPS / JSON
                          Tauri EXE istemcileri
```

Bu gösterim veri ve sorumluluk akışıdır. MySQL sorgusunu başlatan merkezdeki aktarım görevi, HTTP isteğini başlatan EXE'dir.

## İki çalışma akışı

| Akış | Tetikleyici | Davranış |
| --- | --- | --- |
| Request–response | Kullanıcı ekran açar veya filtreyi değiştirir. | EXE API'ye istek gönderir; API yetkiyi kontrol edip raporlama verisinden sonucu döndürür. |
| Arka plan aktarımı | Merkezdeki zamanlayıcı. | Kullanıcı isteği olmadan kaynak MySQL okunur ve raporlama verisi güncellenir. |

Örnek: 10.00'da aktarım biter; 10.12'de ekran açan kullanıcı bu veriyi görür; 10.30'da hiç kullanıcı bağlı olmasa da yeni aktarım yapılır. Otuz dakika başlangıç önerisidir, kesin hizmet taahhüdü değildir.

Ekrandaki normal **Yenile** işlemi kaynak aktarımını başlatmaz. İzin verilirse ayrıca yöneticiye açık, eşzamanlı çalışmayı engelleyen bir aktarım tetikleme işlemi tasarlanabilir.

## Modüller ve teknoloji

İlk sürümde tek Spring Boot projesi ve tek dağıtılabilir uygulama yeterlidir. Aşağıdaki servisler Java sınıfları/modülleridir; ayrı mikroservis veya ayrı bilgisayar gerektirmez.

| Bileşen | Sorumluluk |
| --- | --- |
| React + TypeScript + Tailwind | Ekranlar, filtreler, yüklenme/hata ve veri güncelliği gösterimi. |
| Tauri | EXE ve Windows kurulumu; merkez adresinin istemci ayarı olarak saklanması. |
| Spring Web MVC / Controller | REST yolları, istek doğrulama, yanıt ve hata sözleşmeleri. |
| PerformanceService | Ortalamalar, uygun ölçüm seçimi, sıralama; tüm istemciler için ortak kurallar. |
| SyncJob (`@Scheduled`) | Zamanlama ve aktarım başlatma. |
| SyncService | Aktarım aralığı, doğrulama, tekrar işleme, kayıt ekleme/güncelleme ve son başarılı nokta. |
| Repository / JDBC | Sabit, parametreli SQL sorguları. Kaynak okumada JdbcTemplate veya JdbcClient önerilir. |
| Spring Security | Kimlik doğrulama, rol ve veri kapsamı kontrolleri. |
| Actuator ve uygulama logları | Servis sağlığı; aktarım güncelliği ayrıca raporlanır. |

Mevcut `backend/pom.xml` Java 21 ve Spring Boot 4.1.1 kullanır. PostgreSQL sürücüsü ve PostgreSQL Flyway modülü mevcut durumdur; MySQL bağlantısının hazır olduğunu göstermez. MySQL sürücüsü, gerekiyorsa uyumlu migration modülü ve iki veri kaynağı yapılandırması geliştirme adımlarıdır. JPA kaynak veritabanı okumak için zorunlu değildir.

## Veri kaynağı ayrımı

- **Kaynak MySQL:** Üretim sisteminin asıl verisidir; yalnız gerekli tablo/view'larda salt okunur hesap kullanılır.
- **Raporlama deposu:** Projenin kendi kayıtları, aktarım durumu ve analiz verisidir; ayrı yazma hesabı kullanılır. MySQL önerilir, nihai kurulum/sürüm açık konudur.
- Kaynak şemaya otomatik migration veya Hibernate şema değiştirme uygulanmaz. Migration yalnız uygulamanın sahip olduğu raporlama şemasına yöneltilir.
- EXE kaynak veritabanına bağlanmaz, SQL veya veritabanı parolası taşımaz. API'ye doğrulanan filtreler gönderir.
- Aktarım görevi kendi REST API'sini çağırmak zorunda değildir; SyncService'i doğrudan çağırabilir.

## Sınırlar

İlk entegrasyon kaynak sistemde veri değiştirmez. Mevcut `local` iş emri API'sinin bellek içi yazma yolları, ERP'ye yazma yeteneği değildir. Gerçek üretim yazma işlemleri bu controller'ın profilini açarak devreye alınmaz.

İlk sayısal analiz bir dil modeline bağlı değildir. Yerel yapay zekâ, kuyruk sistemi, dağıtık servisler ve yüksek erişilebilirlik ek bir ihtiyaç doğrulanırsa değerlendirilir.

## Referanslar

- [Spring SQL veritabanı desteği](https://docs.spring.io/spring-boot/reference/data/sql.html)
- [Spring zamanlanmış görevler](https://spring.io/guides/gs/scheduling-tasks)
- [Actuator izleme](https://docs.spring.io/spring-boot/reference/actuator/monitoring.html)
