# KKEEDSOFT — Geliştirme yol haritası

İlk hedefimiz, kullanıcının bir iş emrini seçip ilgili kayıtları ve gecikme durumunu kaynaklarıyla görebilmesi olsun. Bu küçük akış; arayüz, sunucu, veri ve hesaplama parçalarını birlikte geliştirmek için somut bir başlangıç sağlar.

Bu yol haritası bir **öneridir**. Gecikme analizinin ilk senaryo olacağı ve mevcut Spring Boot başlangıcının kullanılacağı **varsayılıyor**. Senaryo, veri erişimi ve ürün sahibi doğrulandığında sıra güncellenebilir. Ekip kapasitesi ve veri hazırlığı bilinmediği için takvim veya teslim tarihi verilmedi. Aşağıdaki işler henüz tamamlanmış sayılmıyor.

## Bugün nerede duruyoruz?

Arayüzde birçok ekran var. `src/screens/ChatScreen.tsx` içindeki `sendMessage`, zamanlayıcı sonrasında sabit `DEMO_RESPONSE` içeriğini gösteriyor. Buradaki hesap, kaynak etiketleri ve güven yüzdeleri gerçek analiz çıktısı olarak kabul edilemez.

`backend/` altında Spring Boot başlangıcı var; incelenen Java kaynaklarında iş emri veya analiz servisi henüz yok. `application.properties` yalnızca uygulama adını içeriyor. `src-tauri/src/lib.rs` masaüstü uygulamasını başlatıyor; yerel veri veya model işlevi göstermiyor.

Bu nedenle ilk kodlama işi, bir ekranı kontrollü bir veri kaynağına bağlayıp anlamlı sonuç üretmesini sağlamak olmalı. `AppShell.tsx` gezinme ve yerleşim için kullanılabilir; analiz kuralları bu bileşene konulmamalı.

## İzlenecek sıra

| Adım | Ortaya çıkacak sonuç | Tamamlanma koşulu |
| --- | --- | --- |
| 1. Senaryoyu daralt | Bir soru, örnek kayıtlar ve beklenen sonuçlar. | Süreci bilen kişi, örnek sonuçları kontrol edebiliyor. |
| 2. Örnek veriyle ekran akışı | İş emri seçimi, ayrıntılar, kaynak ve hata durumları. | Farklı kayıtlarda farklı sonuç; boş ve hatalı durumda anlaşılır mesaj. |
| 3. Sunucu üzerinden okuma | Ekranın geliştirme API'sinden kayıt alması. | Tarayıcıdan sunucuya istek gidiyor; kayıt ve hata doğru gösteriliyor. |
| 4. Hesaplama ve kanıt | Kurallarla hesaplanan gecikme durumu. | Beklenen sonuçlar testlerden geçiyor; eksik veriyle kesin neden üretilmiyor. |
| 5. Gerçek veri ve erişim | Yetkili, salt okunur veri akışı ve kalıcı kayıtlar. | Kaynakla tutarlılık ve sunucu tarafındaki yetki denetimi doğrulanıyor. |
| 6. İlk pilot | Sınırlı kullanıcı grubuyla ölçülebilen iş akışı. | Süreç sahibi sonuçları değerlendiriyor; hata ve fayda ölçülüyor. |
| 7. Yapay zekâ desteği | Doğrulanmış analizleri açıklayan ve izinli araçları kullanan yardımcı. | Sayılar ve kaynaklar korunuyor; kapsam dışı sorularda sınırlar açıklanıyor. |
| 8. İhtiyaca göre genişlet | Çevrimdışı işlevler, makine verisi veya onaylı işlemler. | Her özellik kendi veri, yetki ve hata kontrolleriyle doğrulanıyor. |

## 1. Bir soruyu ve beklenen cevabı seç

İlk soru için öneri: “Bu iş emrinde planlanan bitiş aşıldı mı, bunu hangi kayıtlarla söyleyebiliyoruz?” Gecikmenin kesin nedenini bulmak daha fazla veri gerektirebilir; ilk teslimatta durum tespiti ve eldeki kanıtlarla başlayabiliriz.

En azından zamanında ilerleyen, gecikmiş ve verisi eksik üç yapay örnek hazırla. İş emri kimliği, planlanan bitiş, durum, varsa gerçekleşen bitiş, kaynak kimliği ve güncelleme zamanı başlangıç alanları olabilir. Bunlar **önerilen uygulama alanlarıdır**; Dinamo ERP'nin gerçek şeması olarak kabul edilmemeli.

Süreç sahibiyle “gecikme” tanımını netleştir: tamamlanmış ve açık iş emirleri nasıl değerlendiriliyor, takvim süresi mi çalışma süresi mi kullanılıyor, hangi saat dilimi esas alınıyor? Bilinmeyenleri iş kuralı olarak kodlama.

**Bittiğinde:** Her örneğin beklenen sonucu, gerekçesi ve bilinmeyenleri belli olmalı. Gerçek kayıtlar henüz yoksa örneklerin yapay olduğu görünür kalmalı.

## 2. Örnek veriyi ekrandan ayır

İlk ekran olarak `src/screens/WorkOrderScreen.tsx` içindeki mevcut yapı incelenip kullanılabilir. Önce iş emri seçimi ve ayrıntılarını çalıştır; sohbeti bu akışa daha sonra bağla.

Ekran veriyi bir erişim arayüzünden istesin. Başlangıçta bu arayüz yapay kayıtlar döndürsün; sonra aynı sözleşmeyi kullanan HTTP uygulaması eklenebilsin. Yalnızca seçilen senaryonun ihtiyaç duyduğu işlemleri tanımla; bütün ürünün veri katmanını baştan tasarlamak gerekmiyor.

Yükleniyor, kayıt bulunamadı, veri eksik, sunucuya ulaşılamıyor ve başarılı sonuç durumlarını göster. Kaynak ve güncelleme zamanı cevabın parçası olsun. Sunucu hatasında sessizce örnek veriye dönülmemeli.

**Bittiğinde:** Kayıt seçimi değişince ayrıntılar değişmeli; örnek veri açıkça etiketlenmeli ve başarısız istek kullanıcıya başarı gibi görünmemeli.

## 3. Aynı akışı Spring Boot üzerinden çalıştır

Mevcut Spring Boot başlangıcını kullanmak bu yol haritasının önerisi; nihai mimari kararı değil. İlk geliştirme API'si yalnızca yapay kayıtlar döndürebilir.

İş emri listesi ve ayrıntısı için küçük bir okuma API'si oluştur. `GET /api/work-orders` ve `GET /api/work-orders/{id}` olası adreslerdir; henüz var olan uç noktalar değiller. İstek/yanıt alanlarını, boş sonuçları ve hata biçimini açıkça tanımla. Arayüzde API adresi ortam ayarından gelsin.

Mevcut JPA, Flyway ve güvenlik bağımlılıklarının uygulamanın açılışına etkisini kontrol et. Yapay veri için geliştirme profili gerekiyorsa bunu açıkça ayır; bu profil gerçek şirket verilerine erişmesin. Genel güvenliği kapatarak bağlantı sorununu çözmeye çalışma.

**Bittiğinde:** Arayüz gerçekten API'den veri almalı. Bilinmeyen kimlik ve sunucu kesintisi doğru gösterilmeli. API sözleşmesi ilgili entegrasyon testleriyle kontrol edilmeli.

## 4. Analiz kurallarını ayrı bir serviste yaz

Gecikme hesabını sunucuda, iş emri verisini alan ayrı bir servis yapsın. Arayüz sonucu göstersin. Yapay zekâ eklendiğinde de aynı hesaplama kullanılabilsin.

Analiz cevabı; durum, kullanılan girdiler, hesap yöntemi, kaynaklar, eksik bilgiler ve analiz zamanını taşısın. Planlanan tarihin aşılması ile gecikmenin kök nedeni ayrı bulgular olarak ele alınmalı. Duruş kaydı yoksa duruş nedeni uydurulmamalı.

Testlerde zamanında bitiş, geç bitiş, açık iş emri, eksik tarih ve çelişkili kayıt yer alsın. Hesapta kullanılan “şimdi” değeri testlerde sabitlenebilsin. Kaynak doğruluğu için henüz bir ölçüm yapılmadıysa güven yüzdesi üretme.

**Bittiğinde:** Örneklerin beklenen sonuçları testlerle doğrulanmalı; aynı girdiler aynı sonucu vermeli. Kritik hesaplar bir dil modelinin cevabına bağlı olmamalı.

## 5. Gerçek veriyi kontrollü biçimde ekle

Bu adımdan önce Dinamo ERP sürümü, desteklenen erişim yöntemi ve veri sahipliği öğrenilmeli. Kaynak alanları uygulama alanlarıyla eşleştirilmeli. Erişim bekleniyorsa önceki adımlar yapay verilerle sürdürülebilir.

**Öneri:** Senaryonun gerektirdiği kayıtlar için PostgreSQL ve sürümlü veritabanı değişiklikleri değerlendirilsin. Tüm ERP'yi kopyalamak yerine gerekli kayıtlar ve kaynak bilgileriyle başlansın. Saklama süresi ve hassas alanlar netleştirilsin.

Gerçek şirket verisi kullanılmadan sunucuda kimlik doğrulama ve veri erişim denetimi uygulanmalı. Arayüzde düğme gizlemek yetkilendirme değildir. ERP erişimi sunucudaki salt okunur adaptörden yürüsün; masaüstü uygulamasına veritabanı parolası yerleştirilmesin.

Tekrar gelen kayıtların çoğalmaması, kısmi aktarım hataları, son başarılı güncelleme ve eski veri durumu ele alınmalı. Bir kullanıcının başka yetki alanındaki kaydı kimliğini değiştirerek alamadığı test edilmeli.

**Bittiğinde:** Seçilen örnekler kaynak kayıtlarla eşleşmeli. Yetkisiz erişim reddedilmeli, veri kesintisi görünür olmalı ve kayıtlar yeniden başlatma sonrasında korunmalı.

## 6. Küçük bir pilotla işe yarayıp yaramadığını ölç

Süreci bilen sınırlı kullanıcılarla gerçek sorular üzerinde çalış. Veri bulma ve araştırma süresini mevcut yöntemle karşılaştır. Yanlış sonuçları, eksik veri davranışını ve kullanıcının öneriyi neden kabul veya reddettiğini kaydet.

Ölçüm önerileri [başarı ölçümü belgesinde](basari-olcumu-ve-acik-konular.md) yer alıyor. Kabul eşikleri ve değerlendirme dönemi pilot öncesinde belirlenmeli. Bu aşamadaki hedef, bir iş akışının yararlı ve güvenilir olduğunu göstermek.

**Bittiğinde:** Süreç sahibinin değerlendirdiği sonuçlar ve önceliklendirilmiş düzeltmeler bulunmalı. Pilot başarısı varsayılmamalı; sonuçlara göre önceki adımlara dönülebilmeli.

## 7. Yapay zekâyı doğrulanmış akışa bağla

İlk yapay zekâ görevi, mevcut analiz sonucunu anlaşılır dille açıklamak olabilir. Sonraki adımda kullanıcı sorusunu uygun ve izinli sorguya çevirebilir. Sayısal sonuçları hesaplama servisinden, güncel kayıtları yetkili API'den almalı.

`ChatScreen.tsx` içindeki sabit demo yanıtı bu aşamada gerçek yanıt akışıyla değiştirilebilir. Model bulunamaması, zaman aşımı, yanlış iş emri seçimi ve kapsam dışı soru açıkça ele alınmalı. Kayıt belirsizse kullanıcıdan seçim istenmeli.

Doküman araması gerektiğinde kaynak gösteren bilgi erişimi eklenebilir. Önce doküman sürümü ve erişim hakları korunmalı. Model eğitimi, ayrı Python servisi veya çoklu ajan düzeni ancak ölçülmüş bir ihtiyaç ortaya çıktığında değerlendirilmeli. Kullanılacak model ve donanım henüz seçilmedi.

**Bittiğinde:** Hazırlanmış sorularla değerlendirme yapılmalı; cevaplar sayıları değiştirmemeli, kaynak uydurmamalı ve kullanıcı yetkisini aşmamalı. Model çalışmasa da iş emri ekranı ve temel hesaplama kullanılabilmeli.

## 8. Sonraki özellikleri ihtiyaç sırasına koy

Bu başlıkların birbirini sırayla beklemesi şart değil; pilotun gösterdiği ihtiyaç önceliği belirlemeli.

| Özellik | Başlamak için gereken | Tamamlanma kontrolü |
| --- | --- | --- |
| Masaüstü ve çevrimdışı kullanım | Minimum yerel işlevler, tutulabilecek veriler ve oturum kuralları. | Tauri paketinde temel akış; kesintide eski veri etiketi; yeniden bağlantıda tutarlı güncelleme. SQLite ancak yerel veri ihtiyacı doğrulanırsa seçilir. |
| Makine verisi | Bir makinenin sinyal envanteri ve iş emriyle eşleştirme yöntemi. | Veri kaybı ile makine duruşu ayrılır; tekrar gelen olaylar sonucu bozmaz; zaman damgaları doğrulanır. |
| Onaylı işlemler | Yetki matrisi, desteklenen yazma yöntemi ve işlem sonucu doğrulaması. | Taslak, onay ve uygulama ayrı izlenir; değişen koşullarda yeniden onay alınır; tekrar deneme mükerrer işlem üretmez. |

Makine emniyet devreleri ve gerçek zamanlı koruma bu genişlemenin de dışında kalır.

## İlk kodlama oturumu için somut işler

Aşağıdaki yollar **önerilen başlangıç yerleridir**. Bu belgeyle yeni kod dosyası oluşturulmadı.

| Sıra | Yer | Yapılacak iş |
| --- | --- | --- |
| 1 | `src/screens/WorkOrderScreen.tsx` | Mevcut ekranı incele; liste, seçim ve ayrıntı için gereken verileri çıkar. |
| 2 | Önerilen `src/features/work-orders/types.ts` | İş emri özeti, ayrıntısı, kaynak ve eksik veri alanlarını tanımla. |
| 3 | Önerilen `src/features/work-orders/fixtures.ts` | Beklenen sonucu belli yapay örnekleri oluştur. |
| 4 | Önerilen `src/features/work-orders/workOrderGateway.ts` | Liste ve ayrıntı okuma sözleşmesini, örnek veri uygulamasını oluştur. |
| 5 | `src/screens/WorkOrderScreen.tsx` | Ekranı bu sözleşmeye bağla; yüklenme, hata, boş ve başarılı durumları göster. |
| 6 | Mevcut `backend/src/main/java/` paketi altında önerilen `workorder/` | Aynı sözleşme için geliştirme API'sini ekle; ardından HTTP erişimini bağla. |

İlk küçük teslimatın hedefi: **Yapay verilerle çalışan iş emri listesi ve ayrıntısı; görünür kaynak/güncelleme bilgisi ve anlaşılır hata durumları.** Ardından aynı akış sunucuya taşınır ve analiz eklenir.

Her teslimatta değişen davranışa uygun kontroller çalıştırılmalı: arayüz için derleme ve etkileşim kontrolü, sunucu için ilgili API testleri, hesaplama için iş kuralı testleri. Yalnızca derlemenin geçmesi, gecikme hesabının veya erişim sınırlarının doğru olduğunu kanıtlamaz.

Teknik kararlar netleştikçe ayrı karar kayıtlarına taşınması önerilir. Bu yol haritası mevcut `docs/vision/` içinde tutuldu; diğer dokümantasyon klasörleri henüz açılmadı.
