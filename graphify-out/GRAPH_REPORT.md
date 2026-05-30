# Graph Report - chatbotmobileapp-main  (2026-05-24)

## Corpus Check
- 97 files · ~52,042 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 1163 nodes · 1539 edges · 68 communities (58 shown, 10 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS · INFERRED: 7 edges (avg confidence: 0.83)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `22a8244d`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- [[_COMMUNITY_Community 0|Community 0]]
- [[_COMMUNITY_Community 1|Community 1]]
- [[_COMMUNITY_Community 2|Community 2]]
- [[_COMMUNITY_Community 3|Community 3]]
- [[_COMMUNITY_Community 4|Community 4]]
- [[_COMMUNITY_Community 5|Community 5]]
- [[_COMMUNITY_Community 6|Community 6]]
- [[_COMMUNITY_Community 7|Community 7]]
- [[_COMMUNITY_Community 8|Community 8]]
- [[_COMMUNITY_Community 9|Community 9]]
- [[_COMMUNITY_Community 10|Community 10]]
- [[_COMMUNITY_Community 11|Community 11]]
- [[_COMMUNITY_Community 12|Community 12]]
- [[_COMMUNITY_Community 13|Community 13]]
- [[_COMMUNITY_Community 14|Community 14]]
- [[_COMMUNITY_Community 15|Community 15]]
- [[_COMMUNITY_Community 16|Community 16]]
- [[_COMMUNITY_Community 17|Community 17]]
- [[_COMMUNITY_Community 18|Community 18]]
- [[_COMMUNITY_Community 19|Community 19]]
- [[_COMMUNITY_Community 20|Community 20]]
- [[_COMMUNITY_Community 21|Community 21]]
- [[_COMMUNITY_Community 22|Community 22]]
- [[_COMMUNITY_Community 23|Community 23]]
- [[_COMMUNITY_Community 24|Community 24]]
- [[_COMMUNITY_Community 25|Community 25]]
- [[_COMMUNITY_Community 26|Community 26]]
- [[_COMMUNITY_Community 27|Community 27]]
- [[_COMMUNITY_Community 28|Community 28]]
- [[_COMMUNITY_Community 29|Community 29]]
- [[_COMMUNITY_Community 30|Community 30]]
- [[_COMMUNITY_Community 31|Community 31]]
- [[_COMMUNITY_Community 33|Community 33]]
- [[_COMMUNITY_Community 35|Community 35]]
- [[_COMMUNITY_Community 36|Community 36]]
- [[_COMMUNITY_Community 37|Community 37]]
- [[_COMMUNITY_Community 40|Community 40]]
- [[_COMMUNITY_Community 41|Community 41]]
- [[_COMMUNITY_Community 42|Community 42]]
- [[_COMMUNITY_Community 43|Community 43]]
- [[_COMMUNITY_Community 44|Community 44]]
- [[_COMMUNITY_Community 45|Community 45]]
- [[_COMMUNITY_Community 46|Community 46]]
- [[_COMMUNITY_Community 47|Community 47]]
- [[_COMMUNITY_Community 48|Community 48]]
- [[_COMMUNITY_Community 49|Community 49]]
- [[_COMMUNITY_Community 50|Community 50]]
- [[_COMMUNITY_Community 51|Community 51]]
- [[_COMMUNITY_Community 52|Community 52]]
- [[_COMMUNITY_Community 53|Community 53]]
- [[_COMMUNITY_Community 54|Community 54]]
- [[_COMMUNITY_Community 55|Community 55]]
- [[_COMMUNITY_Community 56|Community 56]]
- [[_COMMUNITY_Community 57|Community 57]]
- [[_COMMUNITY_Community 58|Community 58]]
- [[_COMMUNITY_Community 59|Community 59]]
- [[_COMMUNITY_Community 60|Community 60]]
- [[_COMMUNITY_Community 61|Community 61]]
- [[_COMMUNITY_Community 62|Community 62]]
- [[_COMMUNITY_Community 63|Community 63]]
- [[_COMMUNITY_Community 64|Community 64]]
- [[_COMMUNITY_Community 65|Community 65]]
- [[_COMMUNITY_Community 66|Community 66]]
- [[_COMMUNITY_Community 67|Community 67]]

## God Nodes (most connected - your core abstractions)
1. `product` - 22 edges
2. `product` - 22 edges
3. `expo` - 19 edges
4. `productDetails` - 19 edges
5. `COLORS` - 19 edges
6. `Product Management Mobile App` - 19 edges
7. `compilerOptions` - 16 edges
8. `N8N Login Workflow - Manual Setup Guide` - 15 edges
9. `common` - 14 edges
10. `common` - 14 edges

## Surprising Connections (you probably didn't know these)
- `Product Management Mobile App README` --references--> `API Configuration`  [EXTRACTED]
  mobile-app/README.md → src/config/apiConfig.js
- `Security Best Practices` --references--> `API Configuration`  [EXTRACTED]
  mobile-app/SECURITY.md → src/config/apiConfig.js
- `Expo App (Root)` --conceptually_related_to--> `Orders UI (HTML)`  [INFERRED]
  AGENTS.md → stitch_orders.html
- `AuthContext` --calls--> `N8N Login Workflow`  [INFERRED]
  GEMINI.md → docs/N8N_MANUAL_SETUP.md
- `Expo App (Root)` --references--> `n8n Webhooks Backend`  [EXTRACTED]
  AGENTS.md → GEMINI.md

## Communities (68 total, 10 thin omitted)

### Community 0 - "Community 0"
Cohesion: 0.57
Nodes (5): addCommentRule(), deleteCommentRule(), getCommentRules(), CommentReplyRulesScreen(), styles

### Community 1 - "Community 1"
Cohesion: 0.13
Nodes (12): SIZE_STYLES, styles, VARIANT_STYLES, styles, styles, API_TIMEOUT, COLORS, STRINGS (+4 more)

### Community 2 - "Community 2"
Cohesion: 0.06
Nodes (43): uploadImage(), uploadImages(), ImagePickerComponentProps, styles, ProductCardProps, { width }, API_ENDPOINTS, Config (+35 more)

### Community 3 - "Community 3"
Cohesion: 0.05
Nodes (43): backgroundColor, foregroundImage, adaptiveIcon, intentFilters, package, permissions, versionCode, projectId (+35 more)

### Community 4 - "Community 4"
Cohesion: 0.05
Nodes (45): changeLanguage(), getStoredLanguage(), initI18n(), setStoredLanguage(), app, name, title, common (+37 more)

### Community 5 - "Community 5"
Cohesion: 0.05
Nodes (44): dependencies, axios, expo, expo-av, expo-font, expo-image-picker, expo-linear-gradient, expo-localization (+36 more)

### Community 6 - "Community 6"
Cohesion: 0.05
Nodes (63): apiClient, err, urlLower, loginRequest(), confirmBooking(), deleteOrder(), dismissChatRequest(), getChatRequests() (+55 more)

### Community 7 - "Community 7"
Cohesion: 0.10
Nodes (20): product, actions, addProduct, addSuccess, chooseFromGallery, deleteConfirm, deleteSuccess, description (+12 more)

### Community 8 - "Community 8"
Cohesion: 0.08
Nodes (28): backgroundColor, foregroundImage, adaptiveIcon, package, permissions, displayName, expo, android (+20 more)

### Community 9 - "Community 9"
Cohesion: 0.07
Nodes (27): devDependencies, @babel/core, babel-jest, @babel/preset-env, @babel/runtime, eslint, jest, prettier (+19 more)

### Community 10 - "Community 10"
Cohesion: 0.04
Nodes (48): 1. Biometric Authentication, 1. Image Optimization, 1. Micro-Animations, 2. Certificate Pinning, 2. Haptic Feedback, 2. List Performance, 3. Code Splitting, 3. Gesture Improvements (+40 more)

### Community 11 - "Community 11"
Cohesion: 0.10
Nodes (20): compilerOptions, allowJs, allowSyntheticDefaultImports, baseUrl, esModuleInterop, isolatedModules, jsx, lib (+12 more)

### Community 12 - "Community 12"
Cohesion: 0.10
Nodes (19): description, devDependencies, @babel/core, babel-plugin-transform-remove-console, main, name, overrides, ip (+11 more)

### Community 13 - "Community 13"
Cohesion: 0.11
Nodes (23): connections, Extract User Record, Get User from DB, meta, pinData, POST /login, Respond - Auth Error, Respond - User Not Found (+15 more)

### Community 14 - "Community 14"
Cohesion: 0.12
Nodes (21): active, connections, Extract User Record, Get User from DB, POST /login, Respond - Auth Error, Respond - User Not Found, User Exists? (+13 more)

### Community 15 - "Community 15"
Cohesion: 0.11
Nodes (22): main, connections, Check Order Exists, Error Response - Not Found, Get Order Details, Success Response, Update Order Status, User Authorization Check (+14 more)

### Community 16 - "Community 16"
Cohesion: 0.14
Nodes (14): common, add, cancel, close, confirm, delete, dinar, edit (+6 more)

### Community 17 - "Community 17"
Cohesion: 0.14
Nodes (19): main, connections, check-user-exists, get-user, handle-password-error, login-webhook, respond-error, respond-user-not-found (+11 more)

### Community 18 - "Community 18"
Cohesion: 0.25
Nodes (8): errors, imageTooLarge, invalidImageType, invalidInput, networkError, serverError, unknownError, isValidImageType()

### Community 19 - "Community 19"
Cohesion: 0.16
Nodes (13): buildType, build, development, preview, production, cli, version, developmentClient (+5 more)

### Community 20 - "Community 20"
Cohesion: 0.18
Nodes (10): ANIMATION, BORDER_RADIUS, COLORS, LAYOUT, SHADOWS, SPACING, theme, TYPOGRAPHY (+2 more)

### Community 21 - "Community 21"
Cohesion: 0.11
Nodes (12): styles, TAB_CONFIG, API_METHODS, FORM_FIELDS, HTTP_STATUS, IMAGE_PICKER_OPTIONS, IMAGE_SOURCE, IMAGE_UPLOAD_FIELDS (+4 more)

### Community 22 - "Community 22"
Cohesion: 0.29
Nodes (6): imageFields, images, imagesJson, rows, safeDescription, safeName

### Community 23 - "Community 23"
Cohesion: 0.40
Nodes (4): assetsDir, buffer, fs, path

### Community 24 - "Community 24"
Cohesion: 0.50
Nodes (4): Mobile App (React Native CLI), Main Branch Build Workflow, PR Validation Workflow, Session Manager Service

### Community 25 - "Community 25"
Cohesion: 0.50
Nodes (3): OrderCard(), styles, formatDate()

### Community 26 - "Community 26"
Cohesion: 0.50
Nodes (4): n8n Add Product Webhook, n8n Delete Product Webhook, n8n Update Product Webhook, n8n Function Node - Render HTML

### Community 27 - "Community 27"
Cohesion: 0.67
Nodes (4): API Configuration, Product Management Mobile App README, Phase 2: Native Enhancements & Advanced Features, Security Best Practices

### Community 28 - "Community 28"
Cohesion: 0.67
Nodes (3): Expo App (Root), n8n Webhooks Backend, Orders UI (HTML)

### Community 31 - "Community 31"
Cohesion: 0.67
Nodes (3): AuthContext, N8N Login Workflow, DataTable: user_credentials

### Community 43 - "Community 43"
Cohesion: 0.04
Nodes (47): 1. API Authentication, 1. Man-in-the-Middle (MITM) Attacks, 1. n8n Webhook Protection, 2. Hardcoded Secrets, 2. Input Validation (Server), 2. Secure Storage, 3. Image Upload Security, 3. Input Validation & Sanitization (+39 more)

### Community 44 - "Community 44"
Cohesion: 0.05
Nodes (42): code:block1 (Respond - User Not Found → Handle Password Error → Respond E), code:bash (curl -X POST https://n8n-n8n.17m6co.easypanel.host/webhook/l), code:json ({), code:bash (curl -X POST https://n8n-n8n.17m6co.easypanel.host/webhook/l), code:json ({), code:bash (curl -X POST https://n8n-n8n.17m6co.easypanel.host/webhook/l), code:json ({), code:bash (curl -X POST https://n8n-n8n.17m6co.easypanel.host/webhook/l) (+34 more)

### Community 45 - "Community 45"
Cohesion: 0.05
Nodes (37): 1. ✅ Security & Configuration Management, 2. ✅ Global Error Handling Service, 3. ✅ Session Management Service, 4. ✅ Google Play Compliance Updates, 5. ✅ Production Deployment Checklist, 6. ✅ Code Quality Improvements, Before Google Play Upload, Before Submission to Google Play: (+29 more)

### Community 46 - "Community 46"
Cohesion: 0.06
Nodes (32): code:javascript (const { email, password } = $json.body;), code:json ({), code:block11 (email: user@example.com), code:javascript (const users = $json;), code:javascript (const userRecord = $json;), code:json ({), code:json ({), code:block6 (POST /login) (+24 more)

### Community 47 - "Community 47"
Cohesion: 0.07
Nodes (29): Agent Guidelines — Product Management App, API Client, Build / Dev Commands, CI/CD, Code Style, code:bash (npm start              # Start Expo dev server), code:bash (npm start              # Start Metro bundler), code:bash (npx jest --testPathPattern="ProductList"        # Specific t) (+21 more)

### Community 48 - "Community 48"
Cohesion: 0.07
Nodes (29): 1. CREATE USER CREDENTIALS TABLE IN N8N, 2. IMPLEMENT LOGIN WORKFLOW (POST /login), 3.1 Modify GET /Respond immediately, 3.2 Modify POST /add-product, 3.3 Modify POST /update-product, 3.4 Modify POST /delete-product, 3. MODIFY EXISTING PRODUCT ENDPOINTS FOR MULTI-TENANT, 4. FRONTEND INTEGRATION (ALREADY DONE) (+21 more)

### Community 49 - "Community 49"
Cohesion: 0.07
Nodes (28): Authentication Testing Guide, "Cannot GET /webhook/login" or "404", code:bash (curl -X POST https://n8n-n8n.17m6co.easypanel.host/webhook/l), code:json ({), code:json ({), code:bash (npm start), code:bash (curl -X POST https://n8n-n8n.17m6co.easypanel.host/webhook/g), code:bash (curl -X POST https://n8n-n8n.17m6co.easypanel.host/webhook/a) (+20 more)

### Community 50 - "Community 50"
Cohesion: 0.07
Nodes (27): 10. Advanced Search & Filters, 1. Offline-First Architecture, 2. Push Notifications, 3. Analytics & Crash Reporting, 4. Advanced Image Features, 5. Barcode Scanner, 6. Voice Input, 7. Multi-Language Support (+19 more)

### Community 51 - "Community 51"
Cohesion: 0.08
Nodes (25): 10. Production Readiness Final Review, 1. Security & Configuration, 2. Google Play Store Compliance, 3. Error Handling & Stability, 4. Authentication & Session Management, 5. Code Quality & Cleanup, 6. User Experience & UI/UX, 7. Multi-Tenant Support (+17 more)

### Community 52 - "Community 52"
Cohesion: 0.16
Nodes (12): dismissChatRequest(), getChatRequests(), getOrders(), styles, styles, AuthContext, NotificationContext, styles (+4 more)

### Community 53 - "Community 53"
Cohesion: 0.11
Nodes (17): code:bash (# Install dependencies), code:block2 (src/), code:javascript (export const API_BASE_URL = 'https://n8n-n8n.17m6co.easypane), code:bash (# Start Metro bundler), Configuration, Development, Features, Features Overview (+9 more)

### Community 54 - "Community 54"
Cohesion: 0.12
Nodes (15): 📝 API Endpoints, 📱 App Structure, code:block8 (mobile-app/), code:bash (# Run tests), 🚀 Features, 📸 Image Upload, 📄 License, 📋 Prerequisites (+7 more)

### Community 55 - "Community 55"
Cohesion: 0.17
Nodes (11): Backend Setup (n8n), 🏗️ Building and Running, code:plaintext (├── src/                  # Main source code (Expo App)), Development Commands, 📝 Development Conventions, GEMINI.md - Tekamul Product Management App, 🎯 Key Files, Prerequisites (+3 more)

### Community 56 - "Community 56"
Cohesion: 0.23
Nodes (5): useImageUpload(), ProductFormScreen(), styles, formatProductForDisplay(), sanitizeImageUrl()

### Community 57 - "Community 57"
Cohesion: 0.24
Nodes (8): styles, useProducts(), productDetails, styles, { width }, { width: SCREEN_WIDTH }, ProductDetailScreen(), styles

### Community 58 - "Community 58"
Cohesion: 0.22
Nodes (8): app, name, title, form, descriptionPlaceholder, namePlaceholder, pricePlaceholder, required

### Community 59 - "Community 59"
Cohesion: 0.22
Nodes (9): Android Build Issues, code:bash (npm start -- --reset-cache), code:bash (cd android), code:bash (cd ios), code:bash (# Android), iOS Build Issues, Metro Bundler Issues, RTL Not Working (+1 more)

### Community 60 - "Community 60"
Cohesion: 0.25
Nodes (8): 1. Install Dependencies, 2. Configure Environment, 3. iOS Setup (macOS only), code:bash (cd mobile-app), code:bash (cp .env.example .env), code:env (API_BASE_URL=https://n8n-n8n.17m6co.easypanel.host/webhook), code:bash (cd ios), 🛠️ Setup Instructions

### Community 61 - "Community 61"
Cohesion: 0.29
Nodes (7): errors, imageTooLarge, invalidImageType, invalidInput, networkError, serverError, unknownError

### Community 63 - "Community 63"
Cohesion: 0.50
Nodes (4): 4. Run the App, code:bash (npm run android), code:bash (npm run ios), code:bash (npm start)

### Community 64 - "Community 64"
Cohesion: 0.50
Nodes (4): Add New Language, Change Theme Colors, code:typescript (primary: '#4CAF50',  // Change primary green color), 🎨 Customization

### Community 65 - "Community 65"
Cohesion: 0.50
Nodes (4): Android APK, 📦 Building for Production, code:bash (cd android), iOS IPA

### Community 66 - "Community 66"
Cohesion: 0.67
Nodes (3): Android (Google Play Store), 🚀 Deployment, iOS (App Store)

### Community 67 - "Community 67"
Cohesion: 0.67
Nodes (3): 🤖 CI/CD Pipeline, Main Branch Build, PR Validation

## Knowledge Gaps
- **624 isolated node(s):** `name`, `slug`, `version`, `policy`, `sdkVersion` (+619 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **10 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `updateOrderStatus()` connect `Community 6` to `Community 15`?**
  _High betweenness centrality (0.025) - this node is a cross-community bridge._
- **Why does `productDetails` connect `Community 57` to `Community 1`, `Community 2`, `Community 4`, `Community 6`, `Community 21`?**
  _High betweenness centrality (0.023) - this node is a cross-community bridge._
- **What connects `name`, `slug`, `version` to the rest of the system?**
  _624 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Community 1` be split into smaller, more focused modules?**
  _Cohesion score 0.12873563218390804 - nodes in this community are weakly interconnected._
- **Should `Community 2` be split into smaller, more focused modules?**
  _Cohesion score 0.06095481670929241 - nodes in this community are weakly interconnected._
- **Should `Community 3` be split into smaller, more focused modules?**
  _Cohesion score 0.04756871035940803 - nodes in this community are weakly interconnected._
- **Should `Community 4` be split into smaller, more focused modules?**
  _Cohesion score 0.04717853839037928 - nodes in this community are weakly interconnected._