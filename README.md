📱 ControllerConnect
ControllerConnect is a high-performance React Native mobile application designed to interface with ESP32 microcontrollers using Bluetooth Low Energy (BLE). This project serves as a robust foundation for IoT ecosystems, robotics, and smart home hardware control.

📌 Overview
The application bridges the gap between mobile interfaces and embedded hardware. By leveraging the BLE stack, it provides a low-latency, energy-efficient way to transmit commands and receive real-time telemetry from an ESP32 peripheral.

🎯 Features
🔍 Intelligent Scanning: Real-time BLE device discovery via SearchPage.tsx.

🔗 Seamless Connection: One-tap pairing with ESP32 peripherals.

🎮 Command Console: Dedicated interface for hardware manipulation in ConnectedPage.tsx.

📡 Bi-Directional Data: Support for Write/Notify operations (Send commands & receive status).

📱 Cross-Platform: Fully compatible with both Android and iOS.

🏗️ Scalable Architecture: Easily extensible to support multiple IoT devices.

🛠️ Tech Stack
Frontend: React Native (TypeScript)

State Management: React Hooks

Communication: BLE (Bluetooth Low Energy)

Embedded Target: ESP32 (C++/Arduino or ESP-IDF)

Styling: Styled Components / Flexbox

⚙️ How BLE Communication Works
Advertising: The ESP32 acts as a Peripheral, broadcasting its UUID.

Discovery: The React Native app (Central) scans and filters for the ESP32 service UUID.

GATT Connection: A secure connection is established to the Generic Attribute Profile (GATT).

Data Exchange:

Mobile → ESP32: Writing to specific characteristics to trigger hardware actions (e.g., toggling a GPIO).

ESP32 → Mobile: Sending notifications back to the app (e.g., sensor data updates).

📂 Project Structure
Plaintext
ControllerConnect/
├── App.tsx             # Root Navigation & Entry Point
├── SearchPage.tsx      # BLE Device Discovery Logic
├── ConnectedPage.tsx   # Dashboard & Command Controls
├── android/            # Native Android Build Files
├── ios/                # Native iOS Build Files (CocoaPods)
├── __tests__/          # Unit & Integration Tests
└── tsconfig.json       # TypeScript Configuration
🚀 Installation & Setup
1. Clone & Install
Bash
git clone https://github.com/devaraj-23/ControllerConnect.git
cd ControllerConnect
npm install
2. iOS Setup (macOS only)
Bash
cd ios
pod install
cd ..
3. Run the Application
Bash
# To start the Metro Bundler
npm start

# To run on Android
npm run android

# To run on iOS
npm run ios
Note: BLE functionality requires a physical device. Emulators/Simulators typically do not support Bluetooth hardware.

👨‍💻 Author
Devaraj M
B.E. Instrumentation and Control Engineering
PSG College of Technology
