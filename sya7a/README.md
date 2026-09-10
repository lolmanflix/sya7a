# Bus Tracker - Passenger App

A React Native mobile application built with Expo for tracking buses in real-time. The app provides users with live bus locations, ETAs, and company information.

## Features

- **Authentication**: Email/password and Google Sign-In
- **Real-time Bus Tracking**: Live bus locations on Google Maps
- **Search Functionality**: Search buses by line name or code
- **Company Directory**: Browse buses by company
- **Search History**: Keep track of recently viewed buses
- **Clean UI/UX**: Minimal design with white background and blue accents

## Tech Stack

- **Framework**: Expo (React Native)
- **Backend**: Firebase (Authentication, Realtime Database, Cloud Functions)
- **Maps**: Google Maps SDK + Google Directions API
- **Navigation**: React Navigation
- **State Management**: React Context API

## Setup Instructions

### Prerequisites

- Node.js (v16 or higher)
- Expo CLI (`npm install -g @expo/cli`)
- Firebase project
- Google Maps API key

### 1. Install Dependencies

```bash
npm install
```

### 2. Firebase Configuration

1. Create a Firebase project at [Firebase Console](https://console.firebase.google.com/)
2. Enable Authentication (Email/Password and Google Sign-In)
3. Create a Realtime Database
4. Update `src/config/firebase.ts` with your Firebase configuration:

```typescript
const firebaseConfig = {
  apiKey: "your-api-key",
  authDomain: "your-project.firebaseapp.com",
  databaseURL: "https://your-project-default-rtdb.firebaseio.com",
  projectId: "your-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "123456789",
  appId: "your-app-id"
};
```

### 3. Google Maps Configuration

1. Get a Google Maps API key from [Google Cloud Console](https://console.cloud.google.com/)
2. Enable the following APIs:
   - Maps SDK for Android
   - Maps SDK for iOS
   - Directions API
3. Update `app.json` with your API key:

```json
{
  "expo": {
    "ios": {
      "config": {
        "googleMapsApiKey": "YOUR_GOOGLE_MAPS_API_KEY"
      }
    },
    "android": {
      "config": {
        "googleMaps": {
          "apiKey": "YOUR_GOOGLE_MAPS_API_KEY"
        }
      }
    }
  }
}
```

### 4. Google Sign-In Configuration

1. In Firebase Console, enable Google Sign-In
2. Download the configuration files:
   - For iOS: `GoogleService-Info.plist`
   - For Android: `google-services.json`
3. Update the web client ID in `src/contexts/AuthContext.tsx`:

```typescript
GoogleSignin.configure({
  webClientId: 'your-web-client-id', // From Firebase Console
});
```

### 5. Firebase Database Structure

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

### 6. Run the App

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
- Google Maps integration
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



