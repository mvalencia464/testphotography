# HighLevel Integration Guide - Contacts & Media Gallery

This project is fully integrated with HighLevel (GHL) for both **Lead Generation** and **Cloud Media Storage**. 

**Status:** ✅ PRODUCTION READY
**API Version:** `2021-07-28`

## 🌟 Core Features

### 1. Contact Form (Lead Gen)
- **Direct CRM Entry:** Submissions create a Contact in HighLevel.
- **File Attachments:** Users can upload an image with their inquiry. The image is uploaded to GHL Media Library, and the link is saved to a custom field on the contact.
- **Tags:** Automatically applies tags (e.g., "Website Lead", "Service Type").

### 2. Admin Gallery (Cloud Storage)
- **Source of Truth:** The portfolio gallery is **synced 1:1 with the HighLevel Media Library**.
- **Uploads:** Admin uploads go directly to GHL.
- **Deletions:** Deleting a photo in the Admin dashboard permanently removes it from GHL storage.
- **Cross-Device Sync:** Changes made on one device appear on all devices immediately.

---

## 🛠️ Configuration & Setup

### Required Scopes
Your Private Integration Token must have these scopes enabled:
- `contacts.write` (Create leads)
- `contacts.read` (Check for existing)
- `medias.write` (Upload images)
- `medias.readonly` (Fetch gallery images)
- `businesses.read` (Location access)

### Environment Variables (`.env.local`)
```bash
VITE_HIGHLEVEL_TOKEN=pit-xxxx-xxxx-xxxx           # Private Integration Token
VITE_HIGHLEVEL_LOCATION_ID=xxxx-xxxx-xxxx         # Location ID
```

---

## 📡 API Implementation Details

The integration is centralized in `hooks/useHighLevel.ts`.

### 1. Fetching the Gallery
Retrieves all images associated with the location to build the portfolio.
- **Endpoint:** `GET /medias/files`
- **Params:** `altId={locationId}`, `altType=location`, `type=file`, `limit=100`
- **Cache Strategy:** `no-store` (Ensures fresh list on reload)

### 2. Uploading Files
Used by both the Contact Form and Admin Dashboard.
- **Endpoint:** `POST /medias/upload-file`
- **Body:** `FormData` with `file` field.
- **Returns:** `{ fileId, url, ... }`

### 3. Deleting Files
**⚠️ Important Implementation Detail:**
Deleting requires the same location context query parameters as fetching, or it will fail with 400/404 errors.
- **Endpoint:** `DELETE /medias/{fileId}`
- **Query Params:** `?altId={locationId}&altType=location`

### 4. Creating Contacts
- **Endpoint:** `POST /contacts/`
- **Headers:** `Version: 2021-07-28` (Critical)
- **Payload:** Includes `customFields` for storing the "Project Image URL".

---

## 📂 File Structure

- **`hooks/useHighLevel.ts`**: The brain. Contains all `fetch` calls to GHL.
- **`context/PortfolioContext.tsx`**: The state manager. Calls `fetchFiles` on mount and provides the photo list to the app.
- **`pages/Admin.tsx`**: UI for uploading/deleting. Optimistically updates UI while calling API.
- **`constants.ts`**: `INITIAL_PHOTOS` is empty (`[]`) to ensure we only show GHL images.

## 🐛 Troubleshooting

| Issue | Solution |
|-------|----------|
| **Photos reappear after delete** | Ensure `INITIAL_PHOTOS` in `constants.ts` is empty. The site should only render what comes from the API. |
| **Delete fails (400/404)** | Check `useHighLevel.ts`. The DELETE request **must** include `?altId=...&altType=location` in the URL string. |
| **Login not saving** | Authentication now uses `localStorage`. Ensure your browser isn't clearing storage on exit. |
