# PawFeed

PawFeed is a full-stack IoT ecosystem designed to automate and monitor pet nutrition with high precision. It integrates an **ESP32-based hardware controller** with a **React Native (Expo)** mobile application via **Firebase Realtime Database**.

The project demonstrates a production-grade approach to the "Internet of Things," prioritizing **system safety** and **modular software architecture**.

---

## 🛡️ Engineering for Safety: The "Feed Guard" Protocol
In automated pet care, overfeeding or mechanical failure is a critical risk. PawFeed implements a redundant safety layer called **Feed Guard**.

* **Weight-Triggered Interlock:** Utilizing an **HX711 load cell**, the system performs a real-time weight check before any dispensing action.
* **Safety Constraint:** Mechanical dispensing is strictly blocked if the bowl weight is **> 0.10g**.
* **Dual-Layer Validation:** This logic is enforced both at the **Firmware level (C++)** for edge-case reliability and at the **App Service level (TypeScript)** for UI state management.

---

## 🏗️ Architectural Overview

### Mobile Ecosystem (React Native & TypeScript)
The application is built using a **Modular Service-Oriented Architecture** to ensure maintainability and testability:
* **Centralized Logic:** Business rules (like the Feed Guard) are abstracted into dedicated **Services**, ensuring UI components remain readable and focused on presentation.
* **Custom Hook Pattern:** Utilizes specialized hooks (e.g., `useDeviceStatus`,`useSchedule`) to manage stateful logic independently of the view layer.
* **Responsive UX:** A custom-built, 5-step onboarding flow designed with adaptive layouts to ensure a consistent experience across diverse screen aspect ratios.

### Firmware & Hardware (ESP32)
* **Wi-Fi Provisioning:** Implemented a non-blocking captive portal for seamless network connection onboarding.
* **Real-time Synchronization:** Asynchronous Firebase integration to ensure the device remains responsive while syncing weight data and logs.
* **Deterministic Scheduling:** Local execution of feeding arrays to ensure reliability even during network latency or outages.

---

## 🛠️ Technical Stack
* **Language:** TypeScript (React Native / Expo), C++ (Arduino/ESP-IDF).
* **Cloud:** Firebase (Realtime Database, Authentication).
* **Hardware:** ESP32, HX711 Load Cell, PWM-controlled Servo Motors.

---

## 📈 Professional Implementation Standards
* **Separation of Concerns:** Strict decoupling of Data, Logic, and View layers.
* **Clean Code:** Follows industry-standard linting and naming conventions for high readability.
* **Scalability:** The Firebase schema and App services are designed to support multi-device environments in future iterations.
* **Production Readiness:** Focuses on error handling, connection persistence, and state recovery.
