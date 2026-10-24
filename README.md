# Bi Eksik? 🛒

Akıllı alışveriş listesi uygulaması - React + Capacitor ile geliştirilmiştir.

## Uygulama Yapısı

Bu uygulama **Progressive Web App (PWA)** olarak geliştirilmiş ve **Capacitor** ile Android'e paketlenmiştir.

### Teknoloji Stack

```
📱 Bi Eksik Uygulaması
├── 🌐 Web Tarafı (Ana Uygulama)
│   ├── React + TypeScript
│   ├── Vite (Build Tool)
│   ├── Tailwind CSS
│   └── localStorage (Veri Depolama)
│
└── 📱 Android Wrapper
    ├── Capacitor (Web-to-Native Bridge)
    └── MainActivity.java (Android Entry Point)
```

### Mimari Özellikleri

- ✅ **Frontend Only**: Sunucu gerektirmez, tüm işlemler local
- ✅ **Offline First**: İnternet bağlantısı olmadan çalışır
- ✅ **localStorage**: Tüm veriler cihazda güvenle saklanır
- ✅ **Cross-Platform**: Aynı kod tabanı web ve mobil için kullanılır
- ❌ **Backend Yok**: Sunucu maliyeti yok, tamamen bağımsız

### Java Dosyaları Hakkında

`android/app/src/main/java/com/bieksik/app/MainActivity.java` dosyası:
- Sadece Android için gerekli bir "wrapper"
- Backend kodu değildir
- Web uygulamasını Android'de native gibi gösterir
- Capacitor tarafından otomatik yönetilir

## Run Locally


**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Run the app:
   `npm run dev`

## Android Build

Prerequisites:
- Android Studio
- Android SDK

1. Build the web resources:
   ```bash
   npm run build
   ```

2. Sync the web assets to the Android project:
   ```bash
   npx cap sync
   ```

3. Open the Android project in Android Studio:
   ```bash
   npx cap open android
   ```

4. Inside Android Studio:
   - Wait for Gradle to sync.
   - Go to **Build** > **Generate Signed Bundle / APK** to create a production build.
   - Or press **Run** (Play button) to deploy to a connected device/emulator.

## Android Resource Folders

### Neden Birden Fazla Drawable Klasörü Var?

Android projelerinde `res` klasörü altında birden fazla `drawable-*` klasörü görmek normaldir ve bu sistem, farklı cihaz özelliklerine göre optimize edilmiş kaynaklar sağlamak için kullanılır.

#### Screen Density Qualifiers (Ekran Yoğunluğu)

Android cihazlar çok farklı ekran yoğunluklarına sahiptir. Sistem, cihazın özelliklerine göre otomatik olarak uygun klasörden kaynakları seçer:

- **mdpi** (Medium) - ~160 dpi - Düşük çözünürlüklü cihazlar
- **hdpi** (High) - ~240 dpi - Orta seviye cihazlar
- **xhdpi** (Extra High) - ~320 dpi - Yüksek çözünürlüklü cihazlar
- **xxhdpi** (Extra Extra High) - ~480 dpi - Çok yüksek çözünürlüklü cihazlar
- **xxxhdpi** (Extra Extra Extra High) - ~640 dpi - Flagship cihazlar

#### Orientation Qualifiers (Oryantasyon)

- **drawable-land-*** : Yatay (landscape) mod için kaynaklar
- **drawable-port-*** : Dikey (portrait) mod için kaynaklar

#### Faydaları

✅ **Performans**: Düşük çözünürlüklü cihazlarda gereksiz büyük dosyalar kullanılmaz  
✅ **Kalite**: Yüksek çözünürlüklü cihazlarda görseller bulanık görünmez  
✅ **APK Boyutu**: Android, hedef cihaza göre sadece gerekli kaynakları indirir (App Bundle kullanıldığında)

> **Not**: Capacitor ile çalışırken bu klasörler otomatik olarak oluşturulur. Özel launcher icon veya splash screen eklemiyorsanız, genellikle bu klasörlere manuel müdahale gerekmez.

**Repository Linki**: [https://github.com/anilberkgureli/BiEksik](https://github.com/anilberkgureli/BiEksik)
