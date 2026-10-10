# Bus Tracker - Passenger App

A React Native mobile application built with Expo for tracking buses in real-time. The app provides users with live bus locations, ETAs, and company information.

## Features

- **Authentication**: Email/password and Apple Sign-In
- **Real-time Bus Tracking**: Live bus locations on OpenFreeMap vector tiles
- **Search Functionality**: Search buses by line name or code
- **Company Directory**: Browse buses by company
- **Search History**: Keep track of recently viewed buses
- **Clean UI/UX**: Minimal design with white background and blue accents

## Admin testing

No credentials are documented or bundled with this app (dev_rules #3). Provision
admin/test accounts in the Firebase Console (Authentication → Users) or through
the app's own sign-up flow, then sign in normally.

Deploy [database.rules.json](database.rules.json) to Firebase Realtime Database before production. The included rules restrict bus and route editing to allowlisted admin accounts and allow a driver to write only their own live location and respond only to their own safety requests. Production audio/video requires a secure, consent-aware calling provider; this repository intentionally does not activate a driver's microphone or camera remotely.

## Tech Stack

- **Framework**: Expo (React Native)
- **Backend**: Firebase (Authentication, Realtime Database, Cloud Functions)
- **Maps**: OpenFreeMap vector tiles (MapLibre GL inside a WebView)
- **Navigation**: React Navigation
- **State Management**: React Context API

## Setup Instructions

### Prerequisites

- Node.js (v16 or higher)
- Expo CLI (`npm install -g @expo/cli`)
- Firebase project

### 1. Install Dependencies

```bash
npm install
```

### 2. Firebase Configuration

1. Create a Firebase project at [Firebase Console](https://console.firebase.google.com/)
2. Enable Authentication (Email/Password and Apple Sign-In)
3. Create a Realtime Database
4. Copy the template and fill in your project's values:

```bash
cp .env.example .env
```

```dotenv
EXPO_PUBLIC_FIREBASE_API_KEY=your-web-api-key
EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
EXPO_PUBLIC_FIREBASE_DATABASE_URL=https://your-project-default-rtdb.firebaseio.com
EXPO_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
EXPO_PUBLIC_FIREBASE_APP_ID=your-app-id
EXPO_PUBLIC_FIREBASE_MEASUREMENT_ID=G-XXXXXXX
```

`.env` is gitignored. Restart Metro with `npx expo start -c` after changes; the
app fails fast with a clear error listing any missing keys.

### 3. Google Sign-In (disabled)

Google Sign-In is currently disabled for Expo Go compatibility and no client IDs
are bundled. If re-enabled later, provide the web client ID through an
`EXPO_PUBLIC_*` env var — never hardcode it in `src/contexts/AuthContext.tsx`.

### 4. Firebase Database Structure

Set up the following structure in your Firebase Realtime Database:

```json
{
  "buses": {
    "bus1": {
      "lineName": "M554",
      "companyName": "Mwaslat Misr",
      "activeBusCount": 3,
      "eta": "5 mins"
    }
  },
  "busLocations": {
    "M554": {
      "bus1": {
        "latitude": 30.0444,
        "longitude": 31.2357,
        "lastUpdated": "2024-01-01T10:00:00Z",
        "eta": "6 mins"
      }
    }
  },
  "companies": {
    "cta": {
      "name": "CTA",
      "nameAr": "شركة أتوبيس القاهرة الكبرى",
      "busLines": ["M554", "N777", "304"]
    }
  }
}
```

### 5. Run the App

```bash
# Start the development server
npm start

# Run on iOS simulator
npm run ios

# Run on Android emulator
npm run android
```

## Project Structure

```
src/
├── components/          # Reusable components
│   └── SidebarMenu.tsx
├── config/             # Configuration files
│   └── firebase.ts
├── contexts/           # React contexts
│   └── AuthContext.tsx
├── screens/            # Screen components
│   ├── LoginScreen.tsx
│   ├── HomeScreen.tsx
│   ├── MapScreen.tsx
│   ├── CompaniesScreen.tsx
│   └── HistoryScreen.tsx
└── utils/              # Utility functions
    └── historyUtils.ts
```

## Features Implementation

### Authentication
- Email/password login and signup
- Google Sign-In integration
- Persistent authentication state

### Home Screen
- Search bar for bus lines
- Real-time active buses list
- Pull-to-refresh functionality

### Map Screen
- OpenFreeMap vector map (light/dark themes)
- Real-time bus markers
- Bus details on marker tap
- Save bus functionality

### Companies Screen
- List of bus companies
- Company-specific bus lines
- Navigation to map view

### History
- User search history (last 20 items)
- Quick access to previously viewed buses
- Clear history functionality

## Development Notes

- The app is optimized for low data usage with 5-10 second update intervals
- Supports both Arabic and English (i18n ready)
- Clean, minimal UI design
- Real-time updates via Firebase listeners

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.

