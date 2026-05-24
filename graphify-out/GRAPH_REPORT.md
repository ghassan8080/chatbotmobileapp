# Graph Report - .  (2026-05-24)

## Corpus Check
- cluster-only mode — file stats not available

## Summary
- 640 nodes · 961 edges · 40 communities (34 shown, 6 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS · INFERRED: 4 edges (avg confidence: 0.83)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `e7a09e15`
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
- [[_COMMUNITY_Community 39|Community 39]]

## God Nodes (most connected - your core abstractions)
1. `product` - 20 edges
2. `productDetails` - 20 edges
3. `product` - 20 edges
4. `expo` - 19 edges
5. `COLORS` - 17 edges
6. `compilerOptions` - 16 edges
7. `common` - 14 edges
8. `common` - 14 edges
9. `logError()` - 14 edges
10. `getUserId()` - 13 edges

## Surprising Connections (you probably didn't know these)
- `Expo App (Root)` --conceptually_related_to--> `Orders UI (HTML)`  [INFERRED]
  AGENTS.md → stitch_orders.html
- `AuthContext` --calls--> `N8N Login Workflow`  [INFERRED]
  GEMINI.md → docs/N8N_MANUAL_SETUP.md
- `Expo App (Root)` --references--> `n8n Webhooks Backend`  [EXTRACTED]
  AGENTS.md → GEMINI.md
- `Mobile App (React Native CLI)` --references--> `PR Validation Workflow`  [EXTRACTED]
  AGENTS.md → .github/workflows/pr-validation.yml
- `Mobile App (React Native CLI)` --implements--> `Session Manager Service`  [EXTRACTED]
  AGENTS.md → docs/PRODUCTION_READINESS_SUMMARY.md

## Communities (40 total, 6 thin omitted)

### Community 0 - "Community 0"
Cohesion: 0.07
Nodes (31): dismissChatRequest(), getChatRequests(), SIZE_STYLES, styles, VARIANT_STYLES, styles, styles, styles (+23 more)

### Community 1 - "Community 1"
Cohesion: 0.06
Nodes (35): ImagePickerComponentProps, styles, ProductCardProps, { width }, Config, productDetails, styles, styles (+27 more)

### Community 2 - "Community 2"
Cohesion: 0.08
Nodes (32): err, urlLower, loginRequest(), addCommentRule(), deleteCommentRule(), getCommentRules(), confirmBooking(), deleteOrder() (+24 more)

### Community 3 - "Community 3"
Cohesion: 0.04
Nodes (47): app, name, title, common, add, cancel, close, confirm (+39 more)

### Community 4 - "Community 4"
Cohesion: 0.05
Nodes (41): foregroundImage, adaptiveIcon, intentFilters, package, permissions, versionCode, projectId, expo (+33 more)

### Community 5 - "Community 5"
Cohesion: 0.05
Nodes (39): dependencies, axios, expo, expo-av, expo-font, expo-image-picker, expo-linear-gradient, expo-localization (+31 more)

### Community 6 - "Community 6"
Cohesion: 0.10
Nodes (26): APP_CONFIG, PAGINATION_CONFIG, PRODUCT_FORM_CONFIG, STORAGE_KEYS, UI_CONFIG, emitAuth(), listeners, subscribeAuth() (+18 more)

### Community 7 - "Community 7"
Cohesion: 0.08
Nodes (26): foregroundImage, adaptiveIcon, package, permissions, displayName, expo, android, assetBundlePatterns (+18 more)

### Community 8 - "Community 8"
Cohesion: 0.07
Nodes (27): devDependencies, @babel/core, babel-jest, @babel/preset-env, @babel/runtime, eslint, jest, prettier (+19 more)

### Community 9 - "Community 9"
Cohesion: 0.19
Nodes (19): clearAuthData(), getUserToken(), storeUserToken(), ERROR_CATEGORIES, ERROR_MESSAGES, getErrorMessage(), logError(), parseError() (+11 more)

### Community 10 - "Community 10"
Cohesion: 0.11
Nodes (13): addProduct(), deleteProduct(), getProducts(), updateProduct(), OrderCard(), styles, ProductCard(), ProductDetailScreen() (+5 more)

### Community 11 - "Community 11"
Cohesion: 0.10
Nodes (20): compilerOptions, allowJs, allowSyntheticDefaultImports, baseUrl, esModuleInterop, isolatedModules, jsx, lib (+12 more)

### Community 12 - "Community 12"
Cohesion: 0.10
Nodes (19): description, devDependencies, @babel/core, babel-plugin-transform-remove-console, main, name, overrides, ip (+11 more)

### Community 13 - "Community 13"
Cohesion: 0.17
Nodes (16): connections, Extract User Record, Get User from DB, meta, pinData, POST /login, Respond - Auth Error, Respond - User Not Found (+8 more)

### Community 14 - "Community 14"
Cohesion: 0.12
Nodes (17): product, actions, addProduct, addSuccess, chooseFromGallery, deleteConfirm, deleteSuccess, description (+9 more)

### Community 15 - "Community 15"
Cohesion: 0.20
Nodes (14): active, connections, Extract User Record, Get User from DB, POST /login, Respond - Auth Error, Respond - User Not Found, User Exists? (+6 more)

### Community 16 - "Community 16"
Cohesion: 0.21
Nodes (13): connections, Check Order Exists, Error Response - Not Found, Get Order Details, Success Response, User Authorization Check, Validate Data, meta (+5 more)

### Community 17 - "Community 17"
Cohesion: 0.14
Nodes (14): common, add, cancel, close, confirm, delete, dinar, edit (+6 more)

### Community 18 - "Community 18"
Cohesion: 0.24
Nodes (12): connections, check-user-exists, get-user, handle-password-error, login-webhook, respond-error, respond-user-not-found, validate-credentials (+4 more)

### Community 19 - "Community 19"
Cohesion: 0.20
Nodes (11): buildType, build, development, preview, production, cli, version, developmentClient (+3 more)

### Community 20 - "Community 20"
Cohesion: 0.18
Nodes (10): ANIMATION, BORDER_RADIUS, COLORS, LAYOUT, SHADOWS, SPACING, theme, TYPOGRAPHY (+2 more)

### Community 21 - "Community 21"
Cohesion: 0.29
Nodes (6): imageFields, images, imagesJson, rows, safeDescription, safeName

### Community 22 - "Community 22"
Cohesion: 0.29
Nodes (7): errors, imageTooLarge, invalidInput, networkError, serverError, unknownError, isValidImageType()

### Community 23 - "Community 23"
Cohesion: 0.40
Nodes (4): assetsDir, buffer, fs, path

### Community 24 - "Community 24"
Cohesion: 0.40
Nodes (5): form, descriptionPlaceholder, namePlaceholder, pricePlaceholder, required

### Community 25 - "Community 25"
Cohesion: 0.50
Nodes (4): Mobile App (React Native CLI), Main Branch Build Workflow, PR Validation Workflow, Session Manager Service

### Community 26 - "Community 26"
Cohesion: 0.83
Nodes (3): changeLanguage(), getStoredLanguage(), initI18n()

### Community 27 - "Community 27"
Cohesion: 0.50
Nodes (3): app, name, title

### Community 28 - "Community 28"
Cohesion: 0.67
Nodes (3): Expo App (Root), n8n Webhooks Backend, Orders UI (HTML)

### Community 30 - "Community 30"
Cohesion: 0.67
Nodes (3): AuthContext, N8N Login Workflow, DataTable: user_credentials

## Knowledge Gaps
- **328 isolated node(s):** `name`, `slug`, `version`, `policy`, `sdkVersion` (+323 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **6 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `productDetails` connect `Community 1` to `Community 0`, `Community 10`, `Community 14`?**
  _High betweenness centrality (0.081) - this node is a cross-community bridge._
- **Why does `product` connect `Community 14` to `Community 1`, `Community 27`?**
  _High betweenness centrality (0.053) - this node is a cross-community bridge._
- **What connects `name`, `slug`, `version` to the rest of the system?**
  _328 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Community 0` be split into smaller, more focused modules?**
  _Cohesion score 0.06948051948051948 - nodes in this community are weakly interconnected._
- **Should `Community 1` be split into smaller, more focused modules?**
  _Cohesion score 0.06458635703918723 - nodes in this community are weakly interconnected._
- **Should `Community 2` be split into smaller, more focused modules?**
  _Cohesion score 0.08418367346938775 - nodes in this community are weakly interconnected._
- **Should `Community 3` be split into smaller, more focused modules?**
  _Cohesion score 0.04343971631205674 - nodes in this community are weakly interconnected._