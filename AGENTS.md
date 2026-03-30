# Agent Guidelines — Product Management App

## Project Overview

React Native mobile app for product management with image upload and Arabic RTL support.
- **Root**: Expo-based app (primary codebase, JavaScript)
- **mobile-app/**: React Native CLI project (TypeScript, secondary)

## Build / Dev Commands

### Expo App (root)
```bash
npm start              # Start Expo dev server
npm run android        # Start with Android
npm run ios            # Start with iOS
npm run web            # Start with web
```

### mobile-app/ (React Native CLI)
```bash
npm start              # Start Metro bundler
npm run android        # Run on Android
npm run ios            # Run on iOS
npm test               # Run all tests (Jest)
npm run lint           # ESLint (.js,.jsx,.ts,.tsx)
npm run tsc            # TypeScript type checking (--noEmit)
```

### Running Single Test (mobile-app/)
```bash
npx jest --testPathPattern="ProductList"        # Specific test file
npx jest --testNamePattern="renders"            # Tests matching name
npx jest src/__tests__/ProductCard.test.tsx     # Exact file path
```

### CI/CD
PR validation order: `npm test` → `npm run lint` → `npm run tsc`

---

## Project Structure

```
src/
├── api/           # Axios clients, endpoint definitions
├── components/    # Reusable UI (AppButton, ProductCard, etc.)
├── config/        # apiConfig.js, appConfig.js
├── constants/     # colors.js, strings.js, constants.js
├── context/       # React contexts (AuthContext, NotificationContext)
├── hooks/         # Custom hooks (useProducts, useImageUpload, useOrders)
├── navigation/    # React Navigation config
├── screens/       # Screen components
├── services/      # authService, storageService, errorHandler, sessionManager
├── theme/         # Theme definitions
└── utils/         # formatters, validators, storage, fileUtils
```

---

## Code Style

### Naming Conventions
| Type | Convention | Example |
|------|-----------|---------|
| Components | PascalCase | `AppButton.js`, `ProductCard.tsx` |
| Hooks | `use` + camelCase | `useProducts.js`, `useImageUpload.js` |
| Services/utils | camelCase | `authService.js`, `errorHandler.js` |
| Constants | UPPER_SNAKE_CASE | `API_BASE_URL`, `STORAGE_KEYS` |
| Colors | camelCase nested | `COLORS.primary`, `COLORS.text.primary` |

### Import Order
1. React / core
2. Third-party (`axios`, `react-native-paper`, `@expo/vector-icons`)
3. Internal absolute (`../config`, `../services`, `../constants`)
4. Relative imports

```js
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS } from '../constants/colors';
import { getErrorMessage } from '../services/errorHandler';
```

### Component Pattern
- Functional components with hooks only
- Default exports for components, named exports for hooks/services
- Use `StyleSheet.create()` — never inline styles for reusable components
- Import colors from `../constants/colors` — never hardcode hex values

### Hooks Pattern
```js
export const useXxx = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  // ... methods with useCallback
  return { data, loading, error, refetch };
};
```

### TypeScript (mobile-app/)
- `interface` for object shapes, `type` for unions/primitives
- Strict mode enabled; avoid `any`
- Use optional chaining (`?.`) and nullish coalescing (`??`)

---

## Error Handling

Always use the centralized handler:
```js
import { getErrorMessage, parseError } from '../services/errorHandler';
try { await apiCall(); }
catch (error) {
  const msg = getErrorMessage(error, 'ComponentName:methodName');
  // show msg to user
}
```

Error categories: `NETWORK_ERROR`, `AUTH_ERROR`, `VALIDATION_ERROR`, `SERVER_ERROR`, `TIMEOUT_ERROR`, `NOT_FOUND_ERROR`, `FORBIDDEN_ERROR`

---

## API Client

`src/api/apiClient.js` — axios instance with interceptors:
- Auto-attaches `Authorization: Bearer <token>` from SecureStore
- Auto-injects `user_id` on POST requests
- 401 responses trigger `clearAuthData()` + auth event broadcast
- Public endpoints (`/login`, `/auth`, `/register`) skip token check

---

## Key Libraries
- **Navigation**: `@react-navigation/native`, `@react-navigation/native-stack`
- **HTTP**: `axios`
- **Storage**: `expo-secure-store` (native), `@react-native-async-storage/async-storage`
- **UI**: `@expo/vector-icons`, `react-native-paper` (mobile-app)
- **i18n**: `i18n-js` + `expo-localization` (root), `i18next` + `react-i18next` (mobile-app)
- **Images**: `expo-image-picker` (root), `react-native-image-picker` (mobile-app)

---

## Security
- API keys in env vars (`EXPO_PUBLIC_*` prefix), never commit secrets
- Tokens stored via `expo-secure-store` on native, `localStorage` on web
- Always validate user input before API calls
- Error messages must not expose internal details to users

## RTL Support
App forces Arabic RTL via `I18nManager.forceRTL(true)` in `App.js`. Use `StyleSheet.select()` for RTL-aware styles.

## Platform Handling
```js
import { Platform } from 'react-native';
if (Platform.OS === 'web' || !SecureStore) {
  // fallback to localStorage
}
```

## Production Build
Console logs are stripped in production via `babel-plugin-transform-remove-console` (keeps `console.error`).
