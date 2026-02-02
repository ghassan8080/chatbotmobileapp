# Product Management Mobile App

React Native mobile application for managing products with n8n webhook integration.

## 🚀 Features

- ✅ Cross-platform (Android + iOS)
- ✅ RTL Arabic support
- ✅ Native camera & gallery image picker
- ✅ Product CRUD operations
- ✅ Secure API integration
- ✅ Material Design UI
- ✅ Image upload (Base64)
- ✅ Input validation
- ✅ Pull-to-refresh
- ✅ Search functionality

## 📋 Prerequisites

Before you begin, ensure you have:

- **Node.js** (v18 or higher)
- **npm** or **yarn**
- **React Native CLI** (`npm install -g react-native-cli`)
- **Android Studio** (for Android development)
- **Xcode** (for iOS development, macOS only)
- **CocoaPods** (for iOS, macOS only: `sudo gem install cocoapods`)

## 🛠️ Setup Instructions

### 1. Install Dependencies

```bash
cd mobile-app
npm install
```

### 2. Configure Environment

Copy the example environment file and update with your API credentials:

```bash
cp .env.example .env
```

Edit `.env` and add your n8n webhook URL and API key:

```env
API_BASE_URL=https://n8n-n8n.17m6co.easypanel.host/webhook
API_KEY=your-secret-api-key-here
```

### 3. iOS Setup (macOS only)

```bash
cd ios
pod install
cd ..
```

### 4. Run the App

**Android:**
```bash
npm run android
```

**iOS:**
```bash
npm run ios
```

**Start Metro Bundler (if not started automatically):**
```bash
npm start
```

## 📱 App Structure

```
mobile-app/
├── src/
│   ├── components/          # Reusable UI components
│   │   ├── ProductCard.tsx
│   │   └── ImagePicker.tsx
│   ├── screens/            # Main app screens
│   │   ├── ProductListScreen.tsx
│   │   ├── ProductFormScreen.tsx
│   │   └── ProductDetailScreen.tsx
│   ├── services/           # API integration
│   │   └── api.ts
│   ├── utils/              # Helper functions
│   │   ├── imageUtils.ts
│   │   ├── validation.ts
│   │   └── secureStorage.ts
│   ├── types/              # TypeScript types
│   │   └── product.ts
│   ├── i18n/               # Internationalization
│   │   ├── index.ts
│   │   └── locales/
│   │       ├── ar.json
│   │       └── en.json
│   ├── theme/              # App theme & styling
│   │   └── index.ts
│   ├── config/             # Configuration
│   │   └── api.config.ts
│   └── App.tsx             # Main app component
├── android/                # Android native code
├── ios/                    # iOS native code
└── package.json
```

## 🔐 Security Features

1. **API Key Authentication**: All requests include `X-API-Key` header
2. **Request Signing**: Timestamped requests (`X-Request-Time`)
3. **Input Validation**: Client-side validation before API calls
4. **Encrypted Storage**: Sensitive data stored securely
5. **Input Sanitization**: XSS prevention

## 🌍 RTL Support

The app fully supports Right-to-Left (RTL) layout for Arabic:

- Automatic RTL detection based on language
- RTL-aware components
- Proper text alignment
- Mirrored navigation

## 📸 Image Upload

- **Native camera access** with permissions
- **Gallery picker** for selecting existing photos
- **Image compression** before upload
- **Base64 encoding** for API transfer
- **Size validation** (max 5MB per image)
- **Up to 4 images** per product

## 🧪 Testing

```bash
# Run tests
npm test

# Type checking
npm run tsc

# Linting
npm run lint
```

## 📦 Building for Production

### Android APK

```bash
cd android
./gradlew assembleRelease
```

The APK will be at: `android/app/build/outputs/apk/release/app-release.apk`

### iOS IPA

1. Open `ios/ProductManagementApp.xcworkspace` in Xcode
2. Select your signing team
3. Archive the app (Product → Archive)
4. Export IPA for distribution

## 🔧 Troubleshooting

### Metro Bundler Issues

```bash
npm start -- --reset-cache
```

### Android Build Issues

```bash
cd android
./gradlew clean
cd ..
npm run android
```

### iOS Build Issues

```bash
cd ios
pod deintegrate
pod install
cd ..
npm run ios
```

### RTL Not Working

Make sure to rebuild the app after changing RTL settings:

```bash
# Android
npm run android

# iOS
npm run ios
```

## 🚀 Deployment

### Android (Google Play Store)

1. Generate a signing key
2. Configure `android/app/build.gradle`
3. Build signed APK or AAB
4. Upload to Google Play Console

### iOS (App Store)

1. Configure app in App Store Connect
2. Archive in Xcode
3. Upload via Xcode or Transporter
4. Submit for review

## 📝 API Endpoints

The app integrates with the following n8n webhooks:

- `POST /add-product` - Add new product
- `POST /update-product` - Update existing product
- `POST /delete-product` - Delete product
- `GET /get-products` (optional) - Fetch all products

## 🔄 State Management

Currently using React hooks and component state. For future scalability, consider:

- Redux Toolkit
- Zustand
- React Query (for API caching)

## 🎨 Customization

### Change Theme Colors

Edit `src/theme/index.ts`:

```typescript
primary: '#4CAF50',  // Change primary green color
secondary: '#FFC107', // Change secondary yellow color
```

### Add New Language

1. Add translations to `src/i18n/locales/`
2. Update `src/i18n/index.ts` to include new language

## 📚 Technologies Used

- **React Native** 0.73
- **TypeScript** 5.3
- **React Navigation** 6.x
- **React Native Paper** 5.x (Material Design)
- **i18next** (Internationalization)
- **Axios** (HTTP client)
- **React Native Image Picker** (Camera/Gallery)

## 📄 License

Private - All rights reserved

## 👥 Support

For issues or questions, contact the development team.

---

**Made with ❤️ using React Native**
