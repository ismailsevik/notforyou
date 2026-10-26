# 🚫 Twitter/X "Sana Özel" (For You) Sekmesini Gizleme Kodu (Brave Browser)

Brave Browser kullanıcıları için Twitter/X (`x.com` & `twitter.com`) üzerindeki algoritma destekli **"Sana Özel" (For You)** sekmesini tamamen gizleyen ve doğrudan **"Takip Edilenler" (Following)** akışına yönlendiren açık kaynaklı eklenti, UserScript ve Brave Shields filtre kuralı.

---

## 🚀 Özellikler

- ✅ **Sana Özel Sekmesini Tamamen Gizler:** Algoritmanın dayattığı tweetler yerine temiz kronolojik akış sağlar.
- ✅ **Otomatik Yönlendirme:** Sayfa açıldığında doğrudan "Takip Edilenler" sekmesine geçer.
- ✅ **Brave Shields Uyumlu:** Eklentisiz, %100 dahili reklam engelleyici (Cosmetic Filter) kuralları içerir.
- ✅ **Grok ve Premium Temizliği:** Sol menüdeki Grok sekmesini ve reklam butonlarını gizler.
- ✅ **Sıfır Ekran Titremesi (Anti-Flicker):** CSS ön yükleme ile sekme yüklenirken gözüküp kaybolmaz.

---

## 🛠️ Kurulum Yöntemleri (Brave Browser)

### Yöntem 1: Brave Shields İçerik Filtreleme (Önerilen & Kodsuz)

1. Brave adres çubuğuna `brave://adblock` yazın.
2. En aşağıya inin ve **Özel Filtreler (Custom Filters)** kutusunu bulun.
3. `brave-shields-rules.txt` dosyasındaki kuralları yapıştırın ve **Kaydet** butonuna basın.

---

### Yöntem 2: Brave Geliştirici Modu ile Eklenti Yükleme

1. Bu depoyu indirin (`git clone` veya ZIP indir).
2. Brave tarayıcınızda adres çubuğuna `brave://extensions` yazın.
3. Sağ üst köşedeki **Geliştirici Modu (Developer Mode)** anahtarını açın.
4. **Paketlenmemiş öge yükle (Load Unpacked)** butonuna tıklayıp bu klasörü seçin.

---

### Yöntem 3: UserScript (Violentmonkey / Tampermonkey)

1. Brave Tarayıcınıza **Violentmonkey** veya **Tampermonkey** eklentisini kurun.
2. `twitter-hide-foryou.user.js` dosyasının Raw bağlantısını ekleyin.

---

## 📁 Proje Yapısı

```text
.
├── manifest.json       # Chrome/Brave Manifest V3 eklenti tanımı
├── content.js          # DOM takipçisi ve sekme değiştirici JS
├── styles.css          # Anti-flicker CSS gizleme kuralları
├── twitter-hide-foryou.user.js # Tek dosya UserScript sürümü
├── brave-shields-rules.txt     # Brave Shields reklam engelleyici kuralı
└── README.md           # Proje rehberi
```

---

## 🤝 Katkıda Bulunma

Hata bildirimleri ve geliştirmeler için Pull Request göndermekten çekinmeyin!

**Lisans:** MIT
