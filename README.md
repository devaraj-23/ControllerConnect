```markdown
# 🌐 Offline Voice Assistant & ControllerConnect Ecosystem

This repository contains a full-stack IoT solution: a **React Native Mobile App** for BLE control and an **Offline Voice-Controlled ESP32 System**. Together, they demonstrate seamless hardware-software integration using modern communication protocols.

---

### 📂 Full Project Structure

```text
.
├── ControllerConnect/          # Mobile Application (React Native)
│   ├── App.tsx                 # Main entry point
│   ├── SearchPage.tsx          # BLE Discovery & Pairing
│   ├── ConnectedPage.tsx       # Hardware Control UI
│   ├── ios/                    # iOS Native Code
│   ├── android/                # Android Native Code
│   └── tsconfig.json           # TypeScript Config
│
├── Offline-Voice-Assistant/    # Embedded Firmware (C/C++)
│   ├── transmitter_code/       # ESP32 (ESP-IDF + ESP-Skainet)
│   ├── receiver_code/          # ESP8266 (Arduino/ESP-NOW)
│   └── docs/                   # Schematics & Circuit Diagrams
│
├── shared/                     # (Optional) Shared assets or protocols
└── README.md                   # Main Project Documentation
```

---

### 🛠️ Technical Specifications

| System | Component | Protocols / Tools |
| :--- | :--- | :--- |
| **Mobile App** | ControllerConnect | React Native, BLE, TypeScript |
| **Voice Processing** | ESP32 (Transmitter) | ESP-Skainet, I2S, ESP-IDF |
| **Peripheral Node** | ESP8266 (Receiver) | ESP-NOW, Arduino IDE |
| **Hardware** | Sensors & Actuators | INMP441 Mic, Relays, OLED I2C |

---

### ⚡ Key Features
* **Dual Control:** Control devices via **Offline Voice Commands** or the **BLE Mobile App**.
* **Zero Latency:** Uses **ESP-NOW** for lightning-fast transmitter-to-receiver communication.
* **Privacy First:** No cloud involvement; all voice processing and Bluetooth data stay local.
* **Cross-Platform:** Mobile app works on both **Android** and **iOS**.

---

### 🚀 Getting Started

#### 1. Setup the Mobile App
```bash
cd ControllerConnect
npm install
# For iOS: cd ios && pod install && cd ..
npm run android # or npm run ios
```

#### 2. Flash the Firmware
* **ESP32:** Open `transmitter_code` in VS Code with the **ESP-IDF** extension. Build and flash.
* **ESP8266:** Open `receiver_code` in the **Arduino IDE**. Install ESP8266 boards and flash.

---

### ⚙️ System Workflow
1. **User Action:** The user speaks a command ("Light ON") OR toggles a button in **ControllerConnect**.
2. **Processing:** - **Voice:** ESP32 captures audio via **INMP441** and processes it locally.
   - **App:** React Native sends a **BLE** packet to the ESP32.
3. **Execution:** The ESP32 sends a signal via **ESP-NOW** to the ESP8266, which triggers the **Relay**.
4. **Feedback:** Status is updated on the **OLED** display and the mobile app interface.

---

### 👨‍💻 Author
**Devaraj M**
*B.E. Instrumentation and Control Engineering*
*PSG College of Technology*

---

### 📜 License
This project is for academic and learning purposes. Feel free to fork and build upon it!
```
