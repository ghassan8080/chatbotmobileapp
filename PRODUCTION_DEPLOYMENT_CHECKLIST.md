# Production Deployment Checklist

## Pre-Deployment Review (CRITICAL)

### 1. Security & Configuration
- [ ] **Environment Variables**
  - [ ] Create `.env.local` with production values
  - [ ] Set `EXPO_PUBLIC_API_BASE_URL` to production n8n endpoint
  - [ ] Set `EXPO_PUBLIC_API_KEY` to production API key (read-only key only)
  - [ ] Set `EXPO_PUBLIC_ENVIRONMENT=production`
  - [ ] Set `EXPO_PUBLIC_DEBUG_LOGGING=false`
  - [ ] Ensure `.env.local` is in `.gitignore` ✓ (done)
  - [ ] Rotate API keys used during testing; generate new ones for production

- [ ] **API Security**
  - [ ] Verify all hardcoded URLs removed ✓ (completed in refactoring)
  - [ ] All API endpoints use centralized config ✓ (completed)
  - [ ] API keys are non-sensitive, read-only for public clients
  - [ ] HTTPS enforced for all API calls
  - [ ] CORS properly configured on n8n backend
  - [ ] Rate limiting configured on n8n webhooks

- [ ] **Code Security**
  - [ ] No console.log statements in production code (consider using errorHandler service)
  - [ ] No sensitive data in comments
  - [ ] No credentials or tokens hardcoded anywhere
  - [ ] All imports are from production npm packages
  - [ ] No development-only packages bundled into app

### 2. Google Play Store Compliance
- [ ] **App Configuration** (Updated in app.json ✓)
  - [ ] App name is unique and compliant
  - [ ] Icon (192x192 and adaptive icon) are production-ready
  - [ ] Splash screen properly sized
  - [ ] Bundle ID follows reverse domain convention: `com.productmanagement.app`
  - [ ] Version code incremented: `versionCode: 1` (increment for each release)
  - [ ] Build number configured for iOS

- [ ] **Permissions** (Updated in app.json ✓)
  - [ ] Only necessary permissions requested
    - [ ] `INTERNET` ✓
    - [ ] `CAMERA` (if photo feature enabled) ✓
    - [ ] `READ_EXTERNAL_STORAGE` (for image selection) ✓
    - [ ] `WRITE_EXTERNAL_STORAGE` (for image save) ✓
    - [ ] `ACCESS_NETWORK_STATE` ✓
    - [ ] `ACCESS_WIFI_STATE` ✓
  - [ ] Each permission has user-facing explanation (in app.json infoPlist)

- [ ] **Privacy & Policy**
  - [ ] Privacy policy URL added to app.json ✓
  - [ ] Privacy policy covers:
    - [ ] Data collection practices
    - [ ] Secure token storage (expo-secure-store)
    - [ ] User ID usage for multi-tenant filtering
    - [ ] Third-party services (n8n webhooks)
    - [ ] Data retention policies
    - [ ] User rights and data deletion
  - [ ] Privacy Policy URL is publicly accessible
  - [ ] Terms of Service created and linked
  - [ ] GDPR compliance verified (if applicable)

- [ ] **Content Rating**
  - [ ] Content rating questionnaire completed
  - [ ] No inappropriate content in app
  - [ ] No ads or in-app purchases (unless disclosed)

- [ ] **App Review Guidelines**
  - [ ] App doesn't violate Google Play policies
  - [ ] No spam or low-effort apps
  - [ ] Adequate functionality for primary use case (product management)
  - [ ] No misleading descriptions or screenshots

### 3. Error Handling & Stability
- [ ] **Error Handling** (New errorHandler.js service ✓)
  - [ ] Global error handler service implemented ✓
  - [ ] All API calls wrap errors with errorHandler ✓
  - [ ] User-friendly error messages for all scenarios
  - [ ] Network errors handled gracefully
  - [ ] Timeout errors with retry logic
  - [ ] 401 Unauthorized triggers logout
  - [ ] 403 Forbidden shows permission error
  - [ ] 5xx Server errors show retry option

- [ ] **Stability**
  - [ ] No known crashes in testing
  - [ ] Memory leaks identified and fixed
  - [ ] App handles low memory gracefully
  - [ ] Large data sets paginated (products list)
  - [ ] Image compression implemented
  - [ ] Network reconnection handled

### 4. Authentication & Session Management
- [ ] **Authentication** (Updated auth & new sessionManager ✓)
  - [ ] Login flow works correctly
  - [ ] Logout clears all tokens and user data ✓
  - [ ] Token stored securely (expo-secure-store) ✓
  - [ ] Token expiration warning shown (sessionManager)
  - [ ] Session validation before API calls (sessionManager)

- [ ] **Session Management** (New sessionManager.js ✓)
  - [ ] Token expiration checking implemented ✓
  - [ ] Inactivity timeout configured (30 minutes) ✓
  - [ ] Session info available for debugging
  - [ ] Refresh token logic prepared (placeholder for n8n endpoint)
  - [ ] Last activity tracking implemented ✓

- [ ] **Multi-Tenant Security**
  - [ ] User IDs properly isolated
  - [ ] Verify users can only see their own data (user_id query param)
  - [ ] No cross-user data leakage
  - [ ] Backend validation enforces user_id filtering

### 5. Code Quality & Cleanup
- [ ] **File Organization**
  - [ ] Root markdown files cleaned up or moved to `/docs` folder
  - [ ] No debug or test files in production build
  - [ ] Unnecessary files removed
  - [ ] Project structure organized:
    ```
    src/
      api/          (API services)
      components/   (UI components)
      config/       (Configuration - .env based)
      constants/    (Constants & strings)
      context/      (React Context)
      hooks/        (Custom hooks)
      navigation/   (Navigation setup)
      screens/      (Screen components)
      services/     (Business logic services)
      theme/        (Styling)
      types/        (TypeScript types if using TS)
      utils/        (Utility functions)
    ```

- [ ] **Code Quality**
  - [ ] No console.log in production (use errorHandler)
  - [ ] Consistent naming conventions
  - [ ] Comments removed from production code
  - [ ] No commented-out code blocks
  - [ ] Cyclomatic complexity acceptable
  - [ ] No unused imports or variables
  - [ ] Proper error handling throughout

- [ ] **Dependencies**
  - [ ] No security vulnerabilities in dependencies: `npm audit`
  - [ ] All dependencies locked to specific versions
  - [ ] No dev dependencies bundled in production

### 6. User Experience & UI/UX
- [ ] **Loading States** (OrdersListScreen had these ✓)
  - [ ] Loading spinner shown during API calls
  - [ ] Pull-to-refresh implemented for lists ✓
  - [ ] Skeleton loaders for image loading
  - [ ] Proper loading message timing

- [ ] **Empty States** (OrdersListScreen had these ✓)
  - [ ] Empty products list shows helpful message
  - [ ] Empty orders list shows helpful message
  - [ ] "No results" message is user-friendly

- [ ] **Error States**
  - [ ] Error messages are clear and actionable
  - [ ] Retry buttons provided for failed operations
  - [ ] Error details logged (don't show to user)

- [ ] **Internationalization** (Arabic RTL ✓)
  - [ ] UI properly supports RTL (Arabic)
  - [ ] All text uses strings.js localization
  - [ ] Images don't have text embedded
  - [ ] Numbers and dates formatted correctly

### 7. Multi-Tenant Support
- [ ] **User Isolation**
  - [ ] user_id properly extracted from auth response
  - [ ] All API calls include user_id in query params ✓
  - [ ] Backend API validates user_id for authorization
  - [ ] No cross-tenant data access possible
  - [ ] User_id correctly passed to orders and products endpoints

- [ ] **Tenant-Specific URLs**
  - [ ] Same API base supports multiple tenants
  - [ ] No hardcoded user IDs or domain names
  - [ ] Dynamic tenant configuration from auth response

### 8. Build & Release Configuration
- [ ] **Build Configuration**
  - [ ] Build succeeds without warnings: `eas build --platform android`
  - [ ] APK/AAB generated successfully
  - [ ] App signing certificate configured
  - [ ] Version number incremented
  - [ ] Build metadata (name, description) correct

- [ ] **Release Process**
  - [ ] Versioning strategy established (X.Y.Z)
  - [ ] Release notes prepared
  - [ ] Changelog maintained (CHANGELOG.md)
  - [ ] Git tags created for releases

- [ ] **AAB for Google Play**
  - [ ] Android App Bundle (AAB) generated: `eas build --platform android --release`
  - [ ] Signing key securely stored
  - [ ] Keystore password documented (not in git)
  - [ ] Automatic signing configured in Google Play Console

- [ ] **iOS Build** (if applicable)
  - [ ] iOS build succeeds
  - [ ] Certificate and provisioning profile valid
  - [ ] App thinning enabled where possible

### 9. Testing & QA
- [ ] **Functional Testing**
  - [ ] Login flow works end-to-end
  - [ ] Products load correctly
  - [ ] Can create/edit/delete products
  - [ ] Orders display correctly
  - [ ] Can confirm pending orders
  - [ ] Logout clears session properly
  - [ ] Multi-language switching works (English/Arabic)

- [ ] **Device Testing**
  - [ ] Tested on various device sizes (phone, tablet)
  - [ ] Tested on minimum API level (Android 5.0+)
  - [ ] Tested on latest Android version
  - [ ] iOS testing (iPhone SE, iPhone 14, iPad)

- [ ] **Scenario Testing**
  - [ ] Network disconnection handled
  - [ ] Network reconnection works
  - [ ] App handles low memory
  - [ ] Long loading times handled
  - [ ] API timeout scenarios tested
  - [ ] 404/500 error responses handled

- [ ] **Performance Testing**
  - [ ] App startup time < 3 seconds
  - [ ] List scrolling smooth (60 fps)
  - [ ] No memory leaks (profiler check)
  - [ ] Image loading doesn't block UI
  - [ ] Responsive to user input

### 10. Production Readiness Final Review
- [ ] **Security Audit**
  - [ ] No plaintext secrets in code
  - [ ] HTTPS enforced
  - [ ] Certificate pinning considered
  - [ ] Sensitive data encrypted
  - [ ] API key is read-only/limited scope

- [ ] **Documentation**
  - [ ] README.md has production setup instructions
  - [ ] API documentation available
  - [ ] Deployment guide created
  - [ ] Troubleshooting guide available
  - [ ] Environment variables documented in .env.example ✓

- [ ] **Monitoring Preparation**
  - [ ] Error tracking service integrated (optional: Sentry, etc.)
  - [ ] Analytics configured (optional)
  - [ ] Logging strategy implemented ✓
  - [ ] User feedback mechanism (optional: crash reports)

- [ ] **Backup & Recovery**
  - [ ] User data backup strategy defined
  - [ ] Recovery procedures documented
  - [ ] Incident response plan prepared

---

## Deployment Steps

### Step 1: Prepare Production Environment
```bash
# Create production environment file
cp .env.example .env.production

# Edit with production values
nano .env.production  # OR your preferred editor

# Key values to set:
# EXPO_PUBLIC_API_BASE_URL=https://n8n.yourproduction.com/webhook
# EXPO_PUBLIC_API_KEY=your-production-api-key
# EXPO_PUBLIC_ENVIRONMENT=production
# EXPO_PUBLIC_DEBUG_LOGGING=false
```

### Step 2: Build & Generate AAB
```bash
# Install dependencies
npm install

# Build for Android (AAB for Play Store)
eas build --platform android --release

# Or build locally with expo
expo build:android -t app-bundle
```

### Step 3: Upload to Google Play Console
1. Go to [Google Play Console](https://play.google.com/console)
2. Create new app or select existing
3. Navigate to "Internal Testing" → "App releases"
4. Upload AAB file
5. Add release notes
6. Save and review

### Step 4: Monitor First Release
- [ ] Monitor crash rates first 24 hours
- [ ] Check user feedback
- [ ] Monitor error logs
- [ ] Have rollback plan ready

---

## Post-Deployment

- [ ] Create incident response procedures
- [ ] Set up monitoring alerts
- [ ] Plan regular maintenance windows
- [ ] Schedule security updates
- [ ] Monitor store ratings and reviews
- [ ] Track user engagement metrics

---

## Version Management

Update these for each release:

**Current Version: 1.0.0**
- Version Code (Android): 1
- Build Number (iOS): 1
- Package Name: `com.productmanagement.app`

When releasing:
- Patch (1.0.1): Bug fixes
- Minor (1.1.0): New features
- Major (2.0.0): Breaking changes

---

## Emergency Contacts & Escalation

- **Development Lead**: [Name & Contact]
- **Backend Team**: [n8n Admin Contact]
- **Google Play Support**: [Link to support]
- **Critical Issues**: [Escalation procedure]

---

## Sign-Off

- [ ] Product Manager Review: __________ Date: __________
- [ ] QA Lead: __________ Date: __________
- [ ] Security Review: __________ Date: __________
- [ ] DevOps/Release Manager: __________ Date: __________

Ready for Production: ☐ YES ☐ NO

If NO, list blockers:
1. 
2. 
3. 

---

## Additional Notes

- All hardcoded URLs have been refactored to use environment variables
- Error handling service implemented for consistent error management
- Session management service added for token expiration handling
- Privacy policy field added to app.json - update with actual URL
- Multi-tenant support verified with user_id filtering
- .env.local and other sensitive files are gitignored

