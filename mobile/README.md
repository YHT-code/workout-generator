# Workout Generator Mobile

The native iOS and Android edition of Workout Generator, built with Expo SDK 57, React Native, TypeScript, and Expo Router.

## Native Features

- Native bottom-tab navigation for Home, Session, and Workouts
- Personalized workout generation by split, goal, level, equipment, and duration
- Interactive workout completion tracking with native haptic feedback
- Offline saved workouts and body-profile persistence using AsyncStorage
- Animated oval light/dark theme control using the RepForge color palette
- Production identifiers and EAS profiles for iOS and Android store builds

## Run Locally

```bash
npm install
npx expo start
```

Scan the QR code with Expo Go, or press `a` for an Android emulator. A local iOS simulator requires macOS; physical iOS devices can use Expo Go.

## Quality Checks

```bash
npx tsc --noEmit
npx expo lint
npx expo-doctor
```

## Preview Build

```bash
npx eas-cli@latest login
npx eas-cli@latest build --profile preview --platform android
```

## Production Builds

```bash
npx eas-cli@latest build --profile production --platform all
```

Production submission requires an Apple Developer Program membership and a Google Play Console developer account. EAS will guide you through signing credentials during the first build.

## Submit to Stores

```bash
npx eas-cli@latest submit --platform ios
npx eas-cli@latest submit --platform android
```

Before submission, provide store screenshots and copy, host a privacy-policy URL, and complete each store's data-safety questionnaire. Branded app icon and splash assets are already configured.
