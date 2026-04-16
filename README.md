# ControllerConnect

**ControllerConnect** is a **React Native** mobile application that communicates with an **ESP32** microcontroller using **Bluetooth Low Energy (BLE)**.

## Overview

Users can:

- **Search for nearby BLE devices**
- **Connect to ESP32**
- **Send commands for controlling hardware**
- **Receive feedback or status updates**

This project demonstrates **mobile-to-embedded communication via BLE** and can be used in **IoT projects, robotics, or home automation**.

## Features

- **BLE scanning and connection** (`SearchPage.tsx`)
- **Control connected devices** (`ConnectedPage.tsx`)
- **Real-time communication** with ESP32
- **Extensible interface** for multiple devices
- **Cross-platform support:** Android & iOS

## Installation & Setup

1. **Clone the repository**
```bash
git clone https://github.com/devaraj-23/ControllerConnect.git
cd ControllerConnect`

Install dependencies
npm install
Run the app
npm start
Use Expo Go for mobile testing or run via React Native CLI
Ensure Bluetooth is enabled on your device
How BLE Communication Works
ESP32 advertises as a BLE peripheral
Mobile app scans for devices (SearchPage.tsx)
User selects ESP32 and connects (ConnectedPage.tsx)
Mobile app writes data to BLE characteristics
ESP32 executes commands and optionally sends responses back


## Project Structure

```text
ControllerConnect/
│
├─ App.tsx                  # Main app entry point
├─ ConnectedPage.tsx        # Interface for controlling connected devices
├─ SearchPage.tsx           # Interface for scanning and connecting to BLE devices
├─ __tests__/               # Test files
├─ android/                 # Android project files
├─ ios/                     # iOS project files
├─ .eslintrc.js             # ESLint configuration
├─ .gitignore               # Git ignore rules
├─ .prettierrc.js           # Prettier configuration
├─ Gemfile                  # Ruby dependencies (for iOS)
├─ README.md                # Project documentation
├─ app.json                 # App configuration
├─ babel.config.js          # Babel configuration
├─ index.js                 # App entry for React Native
├─ jest.config.js           # Jest configuration for testing
├─ metro.config.js          # Metro bundler config
├─ package.json             # Project dependencies and scripts
├─ package-lock.json        # Lockfile for npm dependencies
└─ tsconfig.json            # TypeScript configuration
