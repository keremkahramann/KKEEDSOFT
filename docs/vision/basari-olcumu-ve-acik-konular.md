# Başarı ölçümü ve açık konular

## Faydayı nasıl anlayacağız?

Önce seçilen işin bugün nasıl yapıldığını ölçmeliyiz. Ardından benzer işleri KKEEDSOFT ile değerlendirerek araştırmanın hızlanıp hızlanmadığına ve sonuçların güvenilirliğine bakabiliriz. Başlangıç verisi olmadan tasarruf yüzdesi, doğruluk oranı veya teslim tarihi hedefi belirlemiyoruz.

Aşağıdaki ölçümler **öneridir**. Ölçüm dönemi, örnek sayısı, değerlendirecek kişiler ve kabul eşikleri pilot öncesinde seçilmeli. Arayüzdeki örnek sayılar bu ölçümlerin başlangıç değeri değildir.

| Ölçüt | Nasıl ölçülebilir? | Hedef durumu |
| --- | --- | --- |
| Problem araştırma süresi | Sorunun ele alınmasından, dayanaklarıyla incelemeye hazır sonuca kadar geçen süre. | Mevcut durum ölçüldükten sonra belirlenecek. |
| Veri bulma süresi | Gerekli kayıtları bulmak ve ilişkilendirmek için harcanan süre. | Başlangıç ölçümü bekleniyor. |
| Karar hazırlama süresi | Bulgular hazır olduktan sonra seçenekleri karşılaştırıp öneriyi onaya sunmaya kadar geçen süre. | Seçilen senaryoya göre belirlenecek. |
| Bulguların doğruluğu | Kaynak kayıtlarla doğrulanan bulguların, değerlendirilen bulgulara oranı. | Değerlendirme yöntemi ve eşik açık. |
| Yanlış veya kanıtsız cevap oranı | Yanlış bilgi ya da dayanağı olmayan kesin iddia içeren cevapların, incelenen cevaplara oranı. | Örneklem ve eşik açık. |
| Öneri kabul oranı | Yararlı ve uygulanabilir bulunan önerilerin, değerlendirilen önerilere oranı; ret nedenleriyle birlikte. | Tek başına doğruluk kanıtı sayılmayacak. |
| Veri gecikmesi | Kaydın kaynakta oluşması ile uygulamada kullanılabilir olması arasındaki süre. | Kabul edilebilir gecikme kaynak bazında belirlenecek. |
| Veri kalite hatası oranı | Eksik, çelişkili veya eşleştirilemeyen kayıtların, incelenen kayıtlara oranı. | Hata türleri ayrılarak ölçülecek. |
| Onaysız kritik işlem sayısı | Gerekli açık onay olmadan uygulanan kritik değişikliklerin sayısı. | Hedef sıfır; bağlamdaki ürün sınırı. |

Plansız duruş, teslim tarihi sapması ve hurda/yeniden işleme oranları uzun vadede izlenebilir. Bu sonuçlardaki her değişim KKEEDSOFT'tan kaynaklanmaz; üretim hacmi, ürün çeşidi ve diğer süreç değişiklikleri de değerlendirmeye katılmalı.

## Pilot değerlendirmesi

**Öneri:** Hem verisi yeterli hem de eksik, eski veya çelişkili kayıt içeren örnekler seçilsin. Süreç sahibi bulguları kontrol etsin. Kaynağa ulaşılabilmesi, hesapların yeniden yapılabilmesi, yetkisiz verinin gösterilmemesi ve bağlantı kesintisinin doğru açıklanması değerlendirmeye alınsın.

Salt okunur bir pilotta kritik işlem yapılmaması, gelecekteki onay ve yazma işlevlerinin doğrulandığı anlamına gelmez. Dış sistemlere işlem yapma yeteneği eklenirse ayrıca değerlendirilmelidir.

## Doğrulanacak varsayımlar

| Varsayım | Nasıl doğrulanacak? | Yanlış çıkarsa ne değişir? |
| --- | --- | --- |
| Bilgi toplamak bugün önemli zaman alıyor. | Yakın tarihli bir sorunun çözüm adımları ve süreleri incelenir. | İlk değer önerisi ve senaryo önceliği yeniden ele alınır. |
| Gecikme analizi için kayıtlar eşleştirilebilir. | Örnek sipariş, iş emri, plan ve gerçekleşme kayıtları karşılaştırılır. | Veri hazırlığı gerekir veya başka senaryo seçilir. |
| En az bir makineden güvenilir duruş verisi alınabilir. | Makine envanteri ve örnek sinyaller incelenir. | Makine analizi ertelenir ya da veri toplama ihtiyacı ayrıca planlanır. |
| Kullanıcının kesintide yerel işlevlere ihtiyacı var. | İnternet ve şirket sunucusu kesintileri ayrı ayrı konuşulur. | Minimum çevrimdışı kapsam değişir. |
| Pilot kullanıcıları çıktıyı değerlendirebilir. | Bir örnek analiz birlikte incelenir. | Çıktı biçimi veya değerlendirme süreci uyarlanır. |

## Henüz netleşmeyen konular

| Konu | Öğrenilmesi veya kararlaştırılması gerekenler |
| --- | --- |
| İlk sürüm | İlk senaryo, pilot kullanıcılar, ürün sahibi ve süreç sahibi. |
| Departmanlar | Gerçek organizasyon, öncelikli ihtiyaçlar ve veri sahipleri. |
| Dinamo ERP | Sürüm, desteklenen entegrasyon yöntemi, erişilebilir alanlar ve hangi bilginin esas kaynağı olduğu. |
| Makineler | Kontrolör, protokol, sinyal ve sensör envanteri; üretici ve güvenlik sınırları. |
| Ağ ve donanım | Üretim ağı ile kurumsal ağın ayrımı, sunucu ve GPU kapasitesi. |
| Çevrimdışı kullanım | Minimum işlevler, yerelde tutulabilecek veriler ve yeniden bağlantı davranışı. |
| Veri yönetimi | Kabul edilebilir gecikme, saklama ve silme süreleri. |
| Teknoloji | Masaüstü kabuğunun nihai seçimi, Spring Boot'un ilk sürümdeki rolü ve kullanılacak yerel model. |
| Yetki ve onay | Kimlerin hangi veriyi göreceği, taslakları ve uygulamayı kimlerin onaylayacağı. |
| Başarı hedefleri | Başlangıç ölçümleri, pilot örneklemi, değerlendirme dönemi ve kabul eşikleri. |

Yanıtlar geldikçe ilgili varsayımlar ve kapsam önerileri güncellenmeli. Teknik bir karar alındığında gerekçesinin ayrı bir karar kaydında tutulması önerilir; o dokümantasyon bölümü kullanıcı talebiyle daha sonra açılacaktır.
