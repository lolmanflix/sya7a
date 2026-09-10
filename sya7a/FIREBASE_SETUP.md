# Firebase Setup Guide for Bus Tracker

## Your Firebase Project Details
- **Project ID**: tracking-72393
- **Project Name**: tracking-72393
- **Auth Domain**: tracking-72393.firebaseapp.com

## Required Firebase Configuration Steps

### 1. Enable Authentication Methods

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project: **tracking-72393**
3. Navigate to **Authentication** > **Sign-in method**
4. Enable the following providers:
   - **Email/Password**: Click "Email/Password" and enable both options
   - **Google**: Click "Google" and enable it

### 2. Get Google Sign-In Web Client ID

1. In Firebase Console, go to **Authentication** > **Sign-in method**
2. Click on **Google** provider
3. In the **Web SDK configuration** section, copy the **Web client ID**
4. Update `src/contexts/AuthContext.tsx` with the actual web client ID:

```typescript
GoogleSignin.configure({
  webClientId: 'YOUR_ACTUAL_WEB_CLIENT_ID.apps.googleusercontent.com',
});
```

### 3. Set Up Realtime Database

1. In Firebase Console, go to **Realtime Database**
2. Click **Create Database**
3. Choose **Start in test mode** (for development)
4. Select a location (choose the closest to your users)
5. Import the sample data from `firebase-sample-data.json`

### 4. Database Rules (for production)

Update your database rules in Firebase Console > Realtime Database > Rules:

```json
{
  "rules": {
    "buses": {
      ".read": "auth != null",
      ".write": "auth != null"
    },
    "busLocations": {
      ".read": "auth != null",
      ".write": "auth != null"
    },
    "companies": {
      ".read": "auth != null",
      ".write": "auth != null"
    },
    "users": {
      "$uid": {
        ".read": "$uid === auth.uid",
        ".write": "$uid === auth.uid"
      }
    }
  }
}
```

### 5. Import Sample Data

1. In Firebase Console, go to **Realtime Database**
2. Click the **Import JSON** button
3. Upload the `firebase-sample-data.json` file from this project
4. This will populate your database with sample bus data

### 6. Test Authentication

1. Run your app: `npm start`
2. Try creating an account with email/password
3. Test Google Sign-In (you'll need the web client ID first)

## Google Maps Setup

You still need to:
1. Get a Google Maps API key from [Google Cloud Console](https://console.cloud.google.com/)
2. Enable Maps SDK for Android and iOS
3. Update `app.json` with your API key

## Current Status

✅ Firebase project configured  
✅ Database URL set  
✅ Authentication methods need to be enabled  
⏳ Google Sign-In web client ID needed  
⏳ Google Maps API key needed  

## Next Steps

1. Enable Email/Password and Google authentication in Firebase Console
2. Get the Google Sign-In web client ID and update AuthContext.tsx
3. Set up Google Maps API key
4. Import sample data to Firebase
5. Test the app!



