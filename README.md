# Product Management React Native App

A production-ready React Native mobile application for managing products with image upload capabilities and full Arabic RTL support.

## Features

- 📦 Product Management: Add, Edit, Delete products
- 🖼️ Image Upload: Upload up to 4 images per product using camera or gallery
- 🌐 RTL Support: Full Arabic language support with RTL layout
- 🔒 Secure API: API Key authentication for all API calls
- 📱 Mobile-First UI: Cards and lists optimized for mobile devices
- ⚡ Optimized Image Handling: Multipart upload for large images

## Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- React Native CLI
- Android Studio / Xcode for mobile development

## Installation

```bash
# Install dependencies
npm install

# For iOS
cd ios && pod install

# Run on Android
npm run android

# Run on iOS
npm run ios
```

## Project Structure

```
src/
├── api/              # API service layer
├── components/       # Reusable UI components
├── config/           # App configuration
├── constants/        # App constants and localized strings
├── contexts/         # React contexts
├── hooks/            # Custom React hooks
├── navigation/       # Navigation configuration
├── screens/          # Screen components
├── services/         # Business logic services
└── utils/            # Utility functions
```

## Configuration

Update the API endpoints and keys in `src/config/apiConfig.js`:

```javascript
export const API_BASE_URL = 'https://n8n-n8n.17m6co.easypanel.host/webhook';
export const API_KEY = 'your-api-key-here';
```

## Features Overview

### Product Management
- List all products in a card-based layout
- Add new products with images
- Edit existing products
- Delete products with confirmation

### Image Upload
- Select images from camera or gallery
- Upload up to 4 images per product
- Preview images before uploading
- Optimize images for mobile upload

### Security
- API Key authentication for all API calls
- Secure storage of sensitive data
- Request/response interceptors for error handling

### UX Improvements
- Loading states for all async operations
- Error handling with user-friendly messages
- Confirmation dialogs for destructive actions
- Smooth transitions and animations

## Development

```bash
# Start Metro bundler
npm start

# Run tests
npm test

# Lint code
npm run lint
```

## License

MIT
