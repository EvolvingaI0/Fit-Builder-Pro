# FitBuilder Pro - Mobile App

This is the Expo React Native client application for FitBuilder Pro.

## 🚀 Getting Started

### Prerequisites

- Node.js (LTS version recommended)
- A Supabase project.
- An account with an AI provider (like Google AI for Gemini) to get an API key for the server.
- [Expo Go](https://expo.dev/expo-go) app on your physical device or an Android/iOS simulator.

### Client Setup

1.  **Install Dependencies:**
    ```bash
    npm install
    ```

2.  **Set Up Environment Variables:**
    Copy the example environment file to a new `.env` file:
    ```bash
    cp .env.example .env
    ```
    Now, open `.env` and fill in the required values:
    - `EXPO_PUBLIC_SUPABASE_URL`: Your Supabase project URL.
    - `EXPO_PUBLIC_SUPABASE_ANON_KEY`: Your Supabase project's `anon` key.
    - `EXPO_PUBLIC_API_BASE_URL`: The URL of your running backend server (e.g., `http://localhost:8080/api` for local development).

3.  **Run the App:**
    ```bash
    npx expo start
    ```
    Scan the QR code with the Expo Go app on your phone, or press `a` or `i` to run on a simulator.

### Building for Production

This app is configured for builds with [Expo Application Services (EAS)](https://expo.dev/eas).

1.  **Install EAS CLI:**
    ```bash
    npm install -g eas-cli
    ```

2.  **Log in to your Expo account:**
    ```bash
    eas login
    ```

3.  **Configure the project:**
    ```bash
    eas build:configure
    ```

4.  **Start a build:**
    For example, to build an Android APK for preview:
    ```bash
    eas build -p android --profile preview
    ```

## Backend Setup

Instructions for setting up the backend server are located in the `server/README.md` file. You must have the backend running for the app to function correctly.
