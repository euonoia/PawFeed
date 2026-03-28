#  PawFeed – MICROCONTROLLER-CONTROLLED AUTOMATED PET FOOD DESPENSER

PawFeed is a **full-stack IoT project** designed to automate and monitor pet nutrition with high precision. It integrates:

- **ESP32-based hardware controller**  
- **React Native (Expo) mobile application**  
- **Firebase Realtime Database** for real-time data sync and persistence  

The project demonstrates **reliable, production-grade IoT development**, focusing on **safety, modular architecture, and edge intelligence**.

---

## Safety & Reliability: The Feed Guard Protocol

PawFeed prioritizes pet safety through a multi-layer protocol:

* **Weight-Triggered Interlock:** Real-time weight check via HX711 load cell before dispensing.  
* **Closed-Loop Feedback:** Servo stops when the target portion is reached, regardless of kibble density.  
* **Safety Watchdog:** 30-second timeout prevents motor burnout in case of jams.  
* **Edge-Level Enforcement:** Firmware ensures safety even without internet connectivity.

---

##  System Architecture

### Mobile Application (React Native + TypeScript)
- **Service-Oriented Architecture:** Core business logic lives in Services, keeping UI components clean.  
- **Custom Hooks:** `useDeviceStatus` and `useFeedingSchedule` handle state and Firebase listeners.  
- **Responsive UX:** Adaptive onboarding and consistent experience across devices.  
- **Scalable:** Supports multi-device and multi-feeder environments.

### Firmware & Hardware (ESP32)
- **Local-First Scheduling:** Feeding schedules cached in non-volatile memory (`Preferences.h`).  
- **NTP Synchronization:** Maintains accurate internal clock for offline operation.  
- **Wi-Fi Provisioning:** Non-blocking captive portal for easy network setup.  
- **Asynchronous Execution:** Firmware remains responsive while syncing telemetry to Firebase.

---

## Technical Stack

* **Mobile:** React Native, Expo, TypeScript  
* **Firmware:** C++ (Arduino / ESP-IDF), ESP32 Microcontroller  
* **Cloud:** Firebase Realtime Database, Firebase Authentication  
* **Hardware:** HX711 Load Cell, MG996R Servo Motor  

> Demonstrates your ability to integrate **hardware, firmware, mobile apps, and cloud services** in a production-ready system.

---

##  Professional Development Standards

* **Modular Architecture:** Clear separation of Data, Logic, and View layers.  
* **Production-Ready Design:** Error handling, state recovery, and persistent scheduling logic.  
* **Scalable Cloud Structure:** Firebase schema designed to support multiple devices.  
* **Electrical & Hardware Safety:** Proper capacitors and fuses ensure stable operation.

---

## 📌 Why This Project Matters

PawFeed showcases:

- **Full-stack IoT skills** (mobile, firmware, cloud, hardware)  
- **Engineering mindset**: safety, edge intelligence, and deterministic logic  
- **Professional coding standards**: modularity, scalability, and production readiness  

This project has been a valuable learning experience, helping me **develop skills in IoT, embedded systems, and full-stack development**. Working on PawFeed taught me how to integrate hardware, firmware, mobile apps, and cloud services into a single, reliable system. I’m proud of how it demonstrates **my ability to design safe, scalable, and production-ready solutions**, and I see it as a foundation I can build on as I pursue a career in technology.
