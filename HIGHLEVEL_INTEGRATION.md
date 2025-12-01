# HighLevel Integration Guide - PROVEN WORKING SETUP ✅

This guide explains how to integrate your [APP_NAME] React form with HighLevel using Private Integrations.

**🎉 STATUS: SUCCESSFULLY TESTED AND WORKING**
This integration has been tested and confirmed working with real HighLevel credentials, including image upload to Media Library. Follow these exact steps for guaranteed success.

**🆕 NEW: Image Upload Feature**
The form now supports uploading project images directly to HighLevel's Media Library with full contact association!

## ⚠️ CRITICAL: DO NOT MODIFY THESE WORKING FILES

**The following files are configured correctly and WORKING. Do not modify unless absolutely necessary:**

### Core Integration Files (DO NOT CHANGE):
- `hooks/useHighLevel.ts` - API communication logic + image upload
- `components/Contact.tsx` - Form component with validation + image UI
- `utils/formValidation.ts` - Validation rules + image validation
- `.env.local` - Environment variables (only change values, not structure)

### Key Configuration Values (PROVEN WORKING):
```javascript
// API Endpoint (DO NOT CHANGE)
const HIGHLEVEL_API_BASE = 'https://services.leadconnectorhq.com';

// API Version (DO NOT CHANGE)
const API_VERSION = '2021-07-28';

// Headers (DO NOT CHANGE)
'Authorization': `Bearer ${token}`,
'Content-Type': 'application/json',
'Version': '2021-07-28',
'Accept': 'application/json'

// Endpoints (DO NOT CHANGE)
POST /contacts/  // Note the trailing slash!
POST /medias/upload-file  // For image uploads
```

### Environment Variable Names (DO NOT CHANGE):
```bash
VITE_HIGHLEVEL_TOKEN=    # Must start with VITE_
VITE_HIGHLEVEL_LOCATION_ID=    # Must start with VITE_
```

## 🔑 CRITICAL SUCCESS FACTORS

### Why This Setup Works (Unlike Others)
1. **Proper API Version**: Uses `Version: 2021-07-28` header (many tutorials miss this)
2. **Correct Endpoints**: Uses `/contacts/` and `/medias/upload-file` correctly
3. **Proper Authorization**: Uses `Bearer` token format correctly
4. **Field Mapping**: Maps React form fields to exact HighLevel API expectations
5. **Error Handling**: Comprehensive error handling prevents silent failures
6. **Environment Variables**: Uses Vite's `VITE_` prefix for client-side access
7. **Controlled Components**: React form uses controlled inputs for reliable state management
8. **Real-time Validation**: Prevents API errors by validating before submission
9. **Image Upload Integration**: Seamlessly uploads to Media Library with contact association
10. **Duplicate Prevention**: Prevents double uploads and submissions

## 🚀 EXACT SETUP STEPS (TESTED & WORKING)

### Step 1: HighLevel Private Integration Setup
**⚠️ CRITICAL: Follow these exact steps**

1. **Navigate to Private Integrations:**
   - Login to HighLevel
   - Go to Settings → Other Settings → Private Integrations
   - Click "Create new Integration"

2. **Configure Integration (EXACT SETTINGS):**
   ```
   Name: [APP_NAME] Website
   Description: React form integration for website leads
   ```

3. **Select Required Scopes (MINIMUM REQUIRED):**
   - ✅ `contacts.write` (REQUIRED - creates contacts)
   - ✅ `contacts.read` (OPTIONAL - but recommended)
   - ✅ `businesses.read` (REQUIRED - for location access)
   - ✅ `medias.write` (EXPERIMENTAL - for image upload to media library)

4. **Save and Copy Credentials:**
   - Click "Save"
   - Copy the Private Integration Token (starts with `pit-`)
   - Note your Location ID (found in Settings → Business Profile)

### Step 2: Environment Configuration
**⚠️ CRITICAL: Use exact variable names**

1. **Create/Edit `.env.local` file in project root:**
   ```bash
   # HighLevel Private Integration Configuration
   VITE_HIGHLEVEL_TOKEN=pit-your-actual-token-here
   VITE_HIGHLEVEL_LOCATION_ID=your-actual-location-id-here
   ```

2. **IMPORTANT NOTES:**
   - Must use `VITE_` prefix for Vite to expose to client
   - Token format: `pit-xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx`
   - Location ID format: Usually alphanumeric string
   - NO quotes around values in .env file
   - NO spaces around the = sign

3. **Restart Development Server:**
   ```bash
   # Kill existing server (Ctrl+C)
   npm run dev
   ```

## 📋 Features Implemented

### ✅ Form Integration
- **Real-time validation** with field-level error display
- **Loading states** with spinner during submission
- **Success/error handling** with user-friendly messages
- **Data sanitization** and phone number formatting
- **Controlled form inputs** with proper state management
- **Image upload interface** with drag-and-drop functionality
- **File validation** (type, size, format)

### ✅ HighLevel Integration
- **Contact creation** via HighLevel API v2.0
- **Custom fields** for project details and lead source
- **Automatic tagging** for lead organization
- **Phone number formatting** for international compatibility
- **Error handling** for API failures
- **Image upload** to HighLevel Media Library
- **File association** with contact records
- **Media URL storage** in custom fields