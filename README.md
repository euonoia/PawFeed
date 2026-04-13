# PawFeed – Microcontroller-Controlled Automated Pet Food Dispenser

PawFeed is a **full-stack IoT system** developed for a Technopreneurship course. It automates and monitors pet feeding with high precision, combining embedded systems, mobile development, and cloud integration.

The system is built with a strong focus on **safety, modular architecture, and reliable edge computing**, demonstrating production-grade IoT engineering principles.

---

##  Key Features

- Automated pet food dispensing with precision control  
- Real-time monitoring via mobile application  
- Offline-capable firmware with local scheduling  
- Cloud-synced data for remote access and control  
- Safety-first design with hardware and firmware safeguards  

---

##  Feed Guard Protocol (Safety System)

PawFeed ensures safe and reliable operation through multiple safety layers:

- **Weight-Triggered Interlock**  
  Uses an HX711 load cell to verify food dispensing in real time before and during operation.

- **Closed-Loop Feedback Control**  
  Automatically stops the servo motor once the target food portion is reached, regardless of kibble size or density.

- **Safety Watchdog Timer**  
  Prevents motor overheating or mechanical damage by enforcing a 30-second execution timeout.

- **Edge-Level Enforcement**  
  Critical safety logic runs directly on the ESP32, ensuring operation even without internet connectivity.

---

##  System Architecture

### 📱 Mobile Application (React Native + TypeScript)

- Service-oriented architecture separating UI and business logic  
- Custom hooks (`useDeviceStatus`, `useFeedingSchedule`) for state management  
- Real-time Firebase synchronization  
- Responsive and scalable UI for multi-device support  

---

###  Firmware & Hardware (ESP32)

- Local-first scheduling stored in non-volatile memory (`Preferences.h`)  
- NTP time synchronization for accurate scheduling  
- Wi-Fi captive portal for easy device provisioning  
- Asynchronous execution for non-blocking sensor and network operations  

---

##  Technical Stack

- **Mobile:** React Native, Expo, TypeScript  
- **Firmware:** C++ (Arduino / ESP-IDF), ESP32  
- **Cloud:** Firebase Realtime Database, Firebase Authentication  
- **Hardware Components:**
  - ESP32 Microcontroller  
  - HX711 Load Cell Sensor  
  - MG996R Servo Motor  

---

##  Engineering Principles

- Modular architecture (Separation of Data, Logic, and UI layers)  
- Production-ready error handling and state recovery  
- Scalable Firebase data modeling for multi-device support  
- Embedded system safety design with electrical protection considerations  

---

## Project Highlights

PawFeed demonstrates:

- Full-stack IoT development (hardware + firmware + mobile + cloud)  
- Edge computing and offline-first design principles  
- Real-time data synchronization with Firebase  
- Practical embedded systems engineering and hardware integration  
- Safe, deterministic control systems for physical devices  

---

##  Demo & Documentation

- 📂 Project Files & Documentation:  
  [Google Drive Access](https://drive.google.com/drive/folders/1KZQINj7UBuk8-JGip1rTF9GDk0xdqzXl?usp=sharing)

---

##  Learning Outcomes

This project strengthened my ability to design and integrate complete IoT systems. It improved my skills in:

- Embedded systems programming  
- Full-stack mobile development  
- Cloud database integration  
- Hardware-software co-design  
- System reliability and safety engineering  

---

## Author Reflection

PawFeed represents a foundational step in my journey toward building production-ready technology systems. It demonstrates my capability to design **safe, scalable, and modular IoT solutions** by integrating multiple engineering disciplines into a single working product.

---
