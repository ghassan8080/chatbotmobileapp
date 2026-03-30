# GEMINI.md - Tekamul Product Management App

This project is a React Native mobile application built with Expo (SDK 51), designed for product management with image upload capabilities and a backend powered by n8n workflows.

## 🚀 Project Overview

- **Name:** Tekamul (Slug: `tekamul`)
- **Type:** Mobile Application (React Native / Expo)
- **Backend:** n8n Webhooks (Serverless/Automation approach)
- **Language Support:** Full Arabic RTL (Right-to-Left) support.
- **Key Features:** Product CRUD, Multi-image upload (up to 4 images), Order management, Authentication via API Keys/JWT.

## 🛠️ Tech Stack

- **Frontend:** React Native, Expo SDK 51, React Navigation, Expo Secure Store, Expo Image Picker.
- **Backend:** n8n (Workflows as API endpoints).
- **State Management:** React Context API (`AuthContext`, `NotificationContext`).
- **Styling:** Custom constants and theme-based styling (`src/constants/colors.js`).

## 📁 Project Structure

```plaintext
├── src/                  # Main source code (Expo App)
│   ├── api/              # API client and endpoint definitions
│   ├── components/       # Reusable UI components (AppButton, AppInput, etc.)
│   ├── config/           # Application and API configuration
│   ├── constants/        # Global constants (Colors, Strings)
│   ├── context/          # React Contexts (Auth, Notifications)
│   ├── hooks/            # Custom hooks (useImageUpload, useProducts, etc.)
│   ├── navigation/       # AppNavigator and screen routing
│   ├── screens/          # Application screens (Login, ProductList, etc.)
│   ├── services/         # Business logic (Auth, Session, Storage)
│   └── utils/            # Utility functions
├── mobile-app/           # Alternative/Bare React Native version (Phase 2)
├── assets/               # Static assets (icons, splash screen)
├── docs/                 # Project documentation
└── [root]/*.json         # n8n workflow exports (Backend logic)
```

## 🏗️ Building and Running

### Prerequisites
- Node.js (v18+)
- Expo CLI (`npm install -g expo-cli`)

### Development Commands
- **Install Dependencies:** `npm install`
- **Start Expo:** `npx expo start`
- **Run on Android:** `npx expo start --android`
- **Run on iOS:** `npx expo start --ios`
- **Run on Web:** `npx expo start --web`

### Backend Setup (n8n)
- Import the `.json` workflow files from the root directory into your n8n instance.
- Update `src/config/apiConfig.js` with your n8n instance URL.

## 📝 Development Conventions

- **RTL Support:** The app is forced to RTL for Arabic support. Check `src/App.js` for `I18nManager` configuration.
- **Environment Variables:** Use `EXPO_PUBLIC_` prefix in `.env` for variables to be accessible in the app (e.g., `EXPO_PUBLIC_API_BASE_URL`).
- **Security:** Sensitive data like API keys should be stored using `src/services/authService.js` which utilizes `expo-secure-store`.
- **API Pattern:** Centralized API client in `src/api/apiClient.js` using Axios.
- **Image Upload:** Products support up to 4 images. Configured in `src/config/apiConfig.js` (`IMAGE_UPLOAD_CONFIG`).

## 🎯 Key Files
- `src/App.js`: Root component and providers.
- `src/config/apiConfig.js`: API endpoints and configuration.
- `src/navigation/AppNavigator.js`: Main navigation flow.
- `n8n-auth-workflow.json`: Primary authentication logic for the backend.
