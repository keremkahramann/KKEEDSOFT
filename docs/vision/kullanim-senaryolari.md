# Kullanım senaryoları

Aşağıdaki örnekler hedeflenen ürün davranışını anlatıyor. İlk merkezi entegrasyon senaryosu personel/operasyon performansıdır; diğerleri sonraki genişlemelerdir. XLSX analizi prototipte var; merkezi MySQL akışı henüz tamamlanmadı.

## Personel ve operasyon performansı nasıl karşılaştırılır?

1. Merkezdeki görev kaynak MySQL'den dönemsel kayıtları alır; kullanıcı bağlı olmasa da çalışır.
2. Kullanıcı EXE'de dönem seçer; istek LAN üzerinden Spring Boot API'sine gider.
3. API kullanıcının veri kapsamını doğrular ve son tutarlı aktarım verisinden hesaplar.
4. En yüksek/en düşük 5 personel ile yalnız P > 0 ölçümlerden en düşük 5 operasyon listelenir. Ölçüm sayısı ve veri güncelliği gösterilir.
5. Kaynak kesintisinde son başarılı veri açıkça eski olarak işaretlenir. Normal ekran yenilemesi kaynak aktarımını başlatmaz.

**Değerlendirme:** Kaynak örnekleriyle beklenen ortalamalar karşılaştırılır; sıfır/negatif, eksik kimlik, bozuk puan ve beşten az grup durumları denenir. Kurallar [performans belgesinde](../architecture/veri-aktarimi-ve-performans.md).

## Sipariş neden gecikiyor?

Kullanıcı bir siparişin gecikme nedenini öğrenmek ve seçeneklerini görmek istiyor.

**Varsayım:** Sipariş, iş emri, üretim planı ve gerçekleşmeler birbiriyle eşleştirilebiliyor. Stok, kalite ve duruş kayıtlarının bulunup bulunmadığı ayrıca kontrol edilmeli.

Beklenen akış:

1. Sipariş veya iş emri ve incelenecek dönem belirlenir. Birden fazla kayıt eşleşirse kullanıcıdan seçim istenir.
2. Kullanıcının erişebildiği ilgili kayıtlar bulunur; kaynakları ve güncellikleri gösterilir.
3. Planlanan ile gerçekleşen durum karşılaştırılır. Eksik ve çelişkili bilgiler açıklanır.
4. Olası nedenler dayanaklarıyla sıralanır. Aynı dönemde yaşanan bir duruş, tek başına gecikmenin kesin nedeni sayılmaz.
5. Veri yeterliyse alternatiflerin süre, kapasite, maliyet, kalite ve risk üzerindeki etkileri hesaplanır. Bilinmeyen etkiler açıkça belirtilir.
6. Kullanıcı bulguları ve öneriyi inceler. Bu akış kendi başına üretim planını değiştirmez.

Çıktıda kısa sonuç, kullanılan kayıtlar, hesaplama girdileri, olası nedenler, seçenekler ve eksik bilgiler bulunmalı.

**Değerlendirme önerisi:** Geçmiş bir gecikme örneği süreç sahibiyle birlikte incelensin. Bulgular kayıtlarla karşılaştırılsın; araştırma süresi ve kanıtsız iddialar ölçülsün.

## Geçen vardiyada bu makine neden durdu?

Kullanıcı duruş sürelerini, bilinen nedenleri ve araştırılması gereken noktaları görmek istiyor.

**Varsayım:** Seçilen makinenin çalışma ve duruş zamanları güvenilir biçimde alınabiliyor, vardiya takvimiyle eşleştirilebiliyor. Bağlamda adı geçen Howfit, Yamada Dobby ve Bruderer preslerin bağlantı ve sinyal envanteri henüz doğrulanmadı.

Beklenen akış:

1. Makine ve vardiya seçilir; verinin kapsadığı dönem ve son alınma zamanı gösterilir.
2. Duruş aralıkları incelenir. Veri bağlantısının kesilmesi doğrudan makinenin durması olarak yorumlanmaz.
3. Varsa alarm, operatör açıklaması, bakım ve iş emri kayıtlarıyla ilişki kurulur.
4. Duruş süresi hesap yöntemiyle birlikte sunulur. Nedeni bilinmeyen süreler ayrı gösterilir.
5. Kullanıcıya bulgular ve araştırılabilecek sonraki adımlar verilir.

İdeal çevrim, üretim ve kalite girdileri güvenilir değilse toplam ekipman etkinliği (OEE) veya kayıp parça sayısı kesin sonuç olarak verilmemeli.

**Değerlendirme önerisi:** Bir vardiyanın sonuçları sorumlu kişiyle kontrol edilsin. Süre hesabı, kayıt eşleşmeleri ve eksik veri karşısındaki davranış değerlendirilsin.

## Önerilen değişiklik nasıl uygulanacak?

Kullanıcı analizden sonra bir bakım talebi veya plan değişikliği hazırlamak istiyor. Bu akış, önerilen salt okunur pilotun sonrasında ele alınacak.

**Varsayım:** İlgili sistemin desteklediği bir işlem yöntemi ve şirketin belirlediği onay yetkileri bulunacak.

Beklenen akış:

1. Yapılacak değişiklik, etkilenen kayıtlar, gerekçe ve beklenen sonuç taslakta gösterilir.
2. Taslak kullanıcı onayına sunulur. Dış sisteme uygulama ayrıca uygun yetki ve açık onay gerektirir; taslağı incelemek uygulama izni sayılmaz.
3. İşlem öncesinde verilerin ve onayın hâlâ geçerli olduğu kontrol edilir. Koşullar değişmişse yeniden değerlendirme yapılır.
4. İşlem sonucu ilgili sistemden doğrulanır. Öneri, onay ve sonuç izlenebilir biçimde kaydedilir.
5. Başarısız veya sonucu belirsiz işlem açıkça gösterilir. Bağlantı geri geldi diye bekleyen kritik işlem kendiliğinden uygulanmaz; aynı işlem tekrar oluşturulmaz.

Makine emniyeti ve gerçek zamanlı koruma işlevleri bu akışın dışında kalır.
