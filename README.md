## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key
3. Run the app:
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

## Git ve GitHub Kullanımı

### İlk Kurulum (Sadece Bir Kez)

1. **Git repository'sini başlat**:
   ```bash
   git init
   ```

2. **Git kullanıcı bilgilerini ayarla**:
   ```bash
   git config user.email "your-email@example.com"
   git config user.name "your-username"
   ```

3. **Dosyaları ekle ve commit yap**:
   ```bash
   git add .
   git commit -m "initial commit"
   ```

4. **GitHub'da yeni repository oluştur**:
   - https://github.com/new adresine git
   - Repository adını gir
   - Public/Private seç
   - README, .gitignore ekleme (zaten var)
   - "Create repository" butonuna tıkla

5. **Remote repository'yi ekle ve push yap**:
   ```bash
   git remote add origin https://github.com/kullanici-adiniz/repo-adi.git
   git branch -M main
   git push -u origin main
   ```

### Günlük Kullanım

**Değişiklikleri commit et**:
```bash
git add .
git commit -m "açıklayıcı commit mesajı"
git push
```

**Değişiklikleri çek**:
```bash
git pull
```

**Durum kontrol et**:
```bash
git status
```

**Repository Linki**: [https://github.com/anilberkgureli/BiEksik](https://github.com/anilberkgureli/BiEksik)
