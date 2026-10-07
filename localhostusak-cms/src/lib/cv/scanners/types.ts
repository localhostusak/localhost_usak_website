// Tarayıcı sözleşmesi. Yeni bir motor (ör. ileride ClamAV) bu arayüzü uygulayıp
// scanners/index.ts içindeki listeye eklenerek devreye alınır; başka kod değişmez.

// Red türleri: kullanıcıya gösterilecek mesaj bu türe göre seçilir.
// active: aktif içerik (JS, Launch …) · encrypted: parola/izin korumalı · embedded: gömülü dosya
// invalid: geçerli/denetlenebilir PDF değil (nesne sayısı ve iç içe derinlik aşımı dahil)
// risky_codec: JBIG2/JPX içeren PDF. Tanımlı ama v1'de kullanılmaz (bkz. PDF_RISKY_CODEC_ACTION)
export type ScanRejectCode = 'active' | 'encrypted' | 'embedded' | 'invalid' | 'risky_codec'

// Uyarılar reddetmez; yalnızca loga yazılır (kişisel veri içermez).
// jbig2 / jpx: riskli görüntü kodeği · many_objects: nesne sayısı log eşiğini aştı
export type ScanWarningCode = 'jbig2' | 'jpx' | 'many_objects'

export type ScanVerdict =
  | { ok: true; reasons: []; warnings?: ScanWarningCode[] }
  | {
      ok: false
      code: ScanRejectCode
      // Yalnızca geliştirici teşhisi içindir; kullanıcıya ve loglara yazılmaz.
      reasons: string[]
    }

export interface CvScanner {
  name: string
  // deadline: epoch ms. Uzun süren tarayıcılar bu süreyi aşınca hata fırlatmalıdır.
  scan(input: Buffer, deadline: number): Promise<ScanVerdict>
}

// scanCv sonucu: tarayıcı kodlarına ek olarak boyut aşımı ve tarama hatası (fail-closed)
export type ScanResultCode = 'clean' | ScanRejectCode | 'too_large' | 'scan_error'

export type ScanResult = {
  ok: boolean
  code: ScanResultCode
  engines: string[]
  reasons: string[]
  // Reddetmeyen ama loglanacak sinyaller (tüm tarayıcıların birleşimi)
  warnings: ScanWarningCode[]
}
