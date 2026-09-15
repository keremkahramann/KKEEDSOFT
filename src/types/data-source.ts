/**
 * Bir verinin geldiği kaynak kaydı tanımlar.
 * Başlangıç uygulama modelidir; ERP alan eşlemesi henüz kesinleşmedi.
 */
export interface DataSourceReference {
  /** Kaynak sistemin uygulama içindeki kimliği. */
  sourceId: string;

  /** Kaynağın kullanıcıya gösterilecek adı. */
  sourceName: string;

  /** Kaynak sistemdeki kayıt kimliği; bilinmiyorsa null. */
  sourceRecordId: string | null;

  /**
   * Kaydın kaynak sistemdeki son güncellenme zamanı.
   * Saat dilimi içeren ISO 8601 metni; bilinmiyorsa null.
   * Uygulamanın veriyi aldığı veya analizi yaptığı zaman değildir.
   * Metnin biçimi API sınırında ayrıca doğrulanmalıdır.
   */
  sourceUpdatedAt: string | null;
}
