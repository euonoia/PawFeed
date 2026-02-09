#include <ArduinoJson.h>
#define ENABLE_USER_AUTH
#define ENABLE_DATABASE

#include <Arduino.h>
#include <WiFi.h>
#include <WiFiClientSecure.h>
#include <ESP32Servo.h>
#include <FirebaseClient.h>
#include <time.h>
#include <Preferences.h>
#include <WebServer.h>
#include "HX711.h"

// ================= WIFI PROVISIONING SETTINGS =================
#define AP_SSID "PawFeed"
#define AP_PASS "pawfeed@admin"
Preferences prefs;
WebServer server(80);

// ================= Firebase =================
#define Web_API_KEY  "
#define DATABASE_URL "
#define USER_EMAIL   "
#define USER_PASS    "

// ================= Device & Pins =================
#define DEVICE_ID    "feeder_001"
#define SERVO_PIN    27
#define HX711_DOUT   26
#define HX711_SCK    25

Servo myServo;
HX711 scale;

// ================= Calibration & Settings =================
float calibration_factor = 419.64;
#define READ_SAMPLES      5
#define MIN_WEIGHT_CUTOFF 0.5

float currentWeight = 0.0;
int lastSentWeight  = -1;
int lastAngle       = -1;
int lastFedMinute   = -1;

// ================= Timing Intervals =================
unsigned long lastScheduleCheck = 0;
const unsigned long scheduleInterval = 20000; 
unsigned long lastServoCheck     = 0;
const unsigned long servoInterval    = 2000;
unsigned long lastHeartbeat      = 0;
const unsigned long heartbeatInterval = 10000;
unsigned long lastWeightCheck    = 0;
const unsigned long weightInterval   = 5000;
unsigned long lastCloudSync      = 0;
const unsigned long cloudSyncInterval = 60000; 

const unsigned long SERVO_HOLD_MS     = 2000;
const unsigned long MIN_FEED_INTERVAL = 2UL * 60 * 60 * 1000;

// ================= Firebase Objects =================
UserAuth userAuth(Web_API_KEY, USER_EMAIL, USER_PASS);
FirebaseApp app;
WiFiClientSecure sslClient;
AsyncClientClass aClient(sslClient);
RealtimeDatabase Database;

// ================= Declarations =================
bool connectToStoredWiFi();
void startProvisioningAP();
void setupTime();
void checkSchedule();
void syncScheduleFromFirebase();
void runScheduleItem(String id, int angle, int targetGrams, String lastRunStr);
void checkServoCommand();
void sendServoAngle(int);
void sendHeartbeat();
void processData(AsyncResult &);
void updateWeight();
float getFastWeight(int samples);
bool isFeeding = false; 

// ================= SETUP =================
void setup() {
  Serial.begin(115200);
  myServo.attach(SERVO_PIN, 500, 2500);
  myServo.write(0);
  
  scale.begin(HX711_DOUT, HX711_SCK);
  Serial.println("Initializing scale...");
  while (!scale.is_ready()) { delay(100); }
  
  scale.set_scale(calibration_factor);
  scale.tare();

  if (!connectToStoredWiFi()) {
    startProvisioningAP(); 
  }

  setupTime();

  sslClient.setInsecure();
  sslClient.setConnectionTimeout(2000);
  sslClient.setHandshakeTimeout(5000);

  initializeApp(aClient, app, getAuth(userAuth), processData, "authTask");
  app.getApp<RealtimeDatabase>(Database);
  Database.url(DATABASE_URL);

  sendServoAngle(0);
  sendHeartbeat();
  Serial.println("System Ready - Local Cache Mode");
}

// ================= LOOP =================
void loop() {
  if (WiFi.status() == WL_CONNECTED && app.ready()) {
    app.loop();
  }

  server.handleClient();
  unsigned long now = millis();

  if (now - lastCloudSync >= cloudSyncInterval) {
    lastCloudSync = now;
    syncScheduleFromFirebase();
  }

  if (now - lastScheduleCheck >= scheduleInterval) {
    lastScheduleCheck = now;
    checkSchedule();
  }

  if (now - lastServoCheck >= servoInterval) {
    lastServoCheck = now;
    checkServoCommand();
  }

  if (now - lastHeartbeat >= heartbeatInterval) {
    lastHeartbeat = now;
    sendHeartbeat();
  }

  if (now - lastWeightCheck >= weightInterval) {
    lastWeightCheck = now;
    updateWeight();
  }

  delay(5);
}

// ================= LOCAL STORAGE SYNC =================
void syncScheduleFromFirebase() {
  if (!app.ready()) return;
  String path = "/devices/" + String(DEVICE_ID) + "/schedule/items";
  String json = Database.get<String>(aClient, path);
  
  if (json.length() > 0 && json != "null") {
    prefs.begin("feeder", false);
    prefs.putString("sched_cache", json); 
    prefs.end();
    Serial.println("Local Flash Schedule Synced.");
  }
}

// ================= LOCAL SCHEDULE ENGINE =================
void checkSchedule() {
  time_t now = time(nullptr);
  struct tm *t = localtime(&now);
  if (t->tm_min == lastFedMinute) return; 

  prefs.begin("feeder", true);
  String itemsStr = prefs.getString("sched_cache", "");
  prefs.end();

  if (itemsStr.length() == 0) return;

  DynamicJsonDocument doc(2048);
  if (deserializeJson(doc, itemsStr)) return;

  JsonObject items = doc.as<JsonObject>();
  for (JsonPair kv : items) {
    String id = kv.key().c_str();
    JsonObject item = kv.value().as<JsonObject>();

    if (!item["active"]) continue;

    String timeStr   = item["time"].as<String>(); 
    int angle        = item["angle"];
    int targetGrams  = item["grams"];
    String lastRunStr = item["lastRun"].as<String>();

    int targetH = timeStr.substring(0, 2).toInt();
    int targetM = timeStr.substring(3, 5).toInt();

    if (t->tm_hour == targetH && t->tm_min == targetM) {
      if (targetGrams > 0) {
        runScheduleItem(id, angle, targetGrams, lastRunStr);
        lastFedMinute = t->tm_min; 
        break; 
      }
    }
  }
}

// ================= WEIGHT LOGIC =================
float getFastWeight(int samples) {
  if (!scale.is_ready()) return currentWeight;
  float raw = scale.get_units(samples);
  if (raw < MIN_WEIGHT_CUTOFF && raw > -MIN_WEIGHT_CUTOFF) raw = 0;
  return (raw < 0) ? 0 : raw;
}

void updateWeight() {
  float raw = getFastWeight(READ_SAMPLES);
  int grams = (int)round(raw);
  
  if (grams != lastSentWeight) {
    lastSentWeight = grams;
    currentWeight = (float)grams;
    if (app.ready()) {
      Database.set<int>(aClient, "/devices/" + String(DEVICE_ID) + "/weight", grams);
    }
  }
}

// ================= SERVO & HEARTBEAT =================
void runScheduleItem(String id, int angle, int targetGrams, String lastRunStr) {
  isFeeding = true; 
  Serial.println("--- FEEDING STARTED ---");
  float startW = currentWeight; 
  unsigned long startT = millis();
  
  myServo.write(angle); 
  
  while (true) {
    float currentW = scale.get_units(2); 
    float dispensed = currentW - startW;

    if (dispensed >= (float)targetGrams || (millis() - startT > 30000)) {
      break;
    }
    delay(100); 
  }

  myServo.write(0); 
  isFeeding = false;
  Serial.println("--- FEEDING FINISHED ---");
  Database.set<String>(aClient, "/devices/" + String(DEVICE_ID) + "/schedule/items/" + id + "/lastRun", String(time(nullptr)));
}

void checkServoCommand() {
 if (!app.ready() || isFeeding) return;
  int targetAngle = Database.get<int>(aClient, "/devices/" + String(DEVICE_ID) + "/servo/targetAngle");
  
  if (targetAngle < 0 || targetAngle > 180 || targetAngle == lastAngle) return;

  Serial.printf("Moving Servo to: %d\n", targetAngle);
  myServo.write(targetAngle);
  delay(500); 
  lastAngle = targetAngle;

  Database.set<int>(aClient, "/devices/" + String(DEVICE_ID) + "/servo/appliedAngle", targetAngle);
  Database.set<String>(aClient, "/devices/" + String(DEVICE_ID) + "/servo/status", "idle");
}

void sendServoAngle(int angle) {
  if (angle < 0 || angle > 180) return;
  Database.set<int>(aClient, "/devices/" + String(DEVICE_ID) + "/servo/appliedAngle", angle);
}

void sendHeartbeat() {
  if (!app.ready()) return;
  time_t now = time(nullptr);
  Database.set<bool>(aClient, "/devices/" + String(DEVICE_ID) + "/connectivity/online", true);
  Database.set<int>(aClient, "/devices/" + String(DEVICE_ID) + "/connectivity/lastSeen", (int)now);
  Database.set<float>(aClient, "/devices/" + String(DEVICE_ID) + "/weight", currentWeight);
}

// ================= UTILS =================
void setupTime() {
  configTime(8 * 3600, 0, "pool.ntp.org");
  time_t now = 0;
  while (now < 1700000000) { time(&now); delay(300); }
}

void processData(AsyncResult &r) { 
  if (r.isError()) Serial.println(r.error().message()); 
}

bool connectToStoredWiFi() {
  prefs.begin("wifi", true);
  String ssid = prefs.getString("ssid", "");
  String pass = prefs.getString("pass", "");
  prefs.end();
  if (ssid.isEmpty()) return false;
  WiFi.mode(WIFI_STA);
  WiFi.begin(ssid.c_str(), pass.c_str());
  unsigned long start = millis();
  while (WiFi.status() != WL_CONNECTED && millis() - start < 15000) { delay(500); }
  return (WiFi.status() == WL_CONNECTED);
}

// ================= PROVISIONING AP =================
void startProvisioningAP() {
  WiFi.mode(WIFI_AP); 
  WiFi.softAP(AP_SSID, AP_PASS);
  IPAddress apIP = WiFi.softAPIP();

 // Root Setup Page
  server.on("/", HTTP_GET, []() {
    String page = R"rawliteral(
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>PawFeed Setup</title>
        <style>
          :root { --primary: #007AFF; --bg: #f2f2f7; --card: #ffffff; --text: #1c1c1e; }
          body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; background: var(--bg); color: var(--text); display: flex; justify-content: center; align-items: center; min-height: 100vh; margin: 0; }
          .card { background: var(--card); padding: 32px; border-radius: 20px; box-shadow: 0 10px 25px rgba(0,0,0,0.05); width: 90%; max-width: 360px; }
          h2 { margin: 0 0 8px 0; text-align: center; font-size: 24px; }
          .subtitle { text-align: center; color: #8e8e93; font-size: 14px; margin-bottom: 24px; }
          
          .warning-box { background: #fff9e6; border: 1px solid #ffeeba; border-radius: 8px; padding: 12px; margin-bottom: 20px; font-size: 13px; color: #856404; text-align: center; }
          
          label { font-size: 12px; font-weight: 600; text-transform: uppercase; color: #8e8e93; margin-left: 4px; }
          .input-group { position: relative; margin-top: 6px; margin-bottom: 16px; }
          input { width: 100%; padding: 14px; border-radius: 12px; border: 1px solid #d1d1d6; box-sizing: border-box; font-size: 16px; transition: border 0.2s; }
          input:focus { outline: none; border-color: var(--primary); }
          
          .toggle-btn { position: absolute; right: 12px; top: 50%; transform: translateY(-50%); background: none; border: none; color: var(--primary); font-size: 12px; font-weight: 600; cursor: pointer; width: auto; margin: 0; padding: 5px; }
          
          .submit-btn { width: 100%; padding: 16px; margin-top: 10px; border-radius: 14px; background: var(--primary); color: white; border: none; font-size: 16px; font-weight: 600; cursor: pointer; transition: opacity 0.2s; }
          .submit-btn:active { opacity: 0.8; }
        </style>
      </head>
      <body>
        <div class="card">
          <h2>PawFeed</h2>
          <p class="subtitle">Connect your feeder to the cloud</p>
          
          <div class="warning-box">
            <strong>Notice:</strong> PawFeed requires a <b>2.4GHz</b> Wi-Fi network to operate.
          </div>

          <form action="/wifi" method="POST">
            <label>Network Name</label>
            <div class="input-group">
              <input type="text" name="ssid" placeholder="Enter Wi-Fi SSID" required>
            </div>

            <label>Password</label>
            <div class="input-group">
              <input type="password" id="pw" name="password" placeholder="Enter Password">
              <button type="button" class="toggle-btn" onclick="togglePW()">SHOW</button>
            </div>

            <button type="submit" class="submit-btn">Save and Connect</button>
          </form>
        </div>

        <script>
          function togglePW() {
            var x = document.getElementById("pw");
            var btn = document.querySelector(".toggle-btn");
            if (x.type === "password") {
              x.type = "text";
              btn.innerText = "HIDE";
            } else {
              x.type = "password";
              btn.innerText = "SHOW";
            }
          }
        </script>
      </body>
      </html>
    )rawliteral";
    server.send(200, "text/html", page);
  });

  // WiFi Saving
  server.on("/wifi", HTTP_POST, []() {
    String ssid = server.arg("ssid");
    String pass = server.arg("password");
    
    prefs.begin("wifi", false);
    prefs.putString("ssid", ssid);
    prefs.putString("pass", pass);
    prefs.end();

    String successPage = "<html><body style='font-family:sans-serif; display:flex; justify-content:center; align-items:center; height:100vh; text-align:center;'>";
    successPage += "<div><h1 style='color:#007AFF;'>Settings Saved</h1><p>PawFeed is restarting to connect to <b>" + ssid + "</b>...</p></div></body></html>";
    
    server.send(200, "text/html", successPage);
    delay(2000);
    ESP.restart();
  });

  // 1. Status Endpoint
  server.on("/status", HTTP_GET, []() {
    String json = "{\"status\":\"provisioning\",\"uptime_sec\":" + String(millis()/1000) + "}";
    server.send(200, "application/json", json);
  });

  // 2. Servo Endpoint (Usage: /servo?pos=90)
  server.on("/servo", HTTP_GET, []() {
    if (server.hasArg("pos")) {
      int pos = server.arg("pos").toInt();
      myServo.write(pos);
      server.send(200, "text/plain", "Moved to " + String(pos));
    } else {
      server.send(400, "text/plain", "Need ?pos= argument");
    }
  });

  // 3. Schedule Endpoint (Manual cache override)
  server.on("/schedule", HTTP_GET, []() {
    if (server.hasArg("time")) {
      String t = server.arg("time");
      prefs.begin("settings", false);
      prefs.putString("feedTime", t);
      prefs.end();
      server.send(200, "text/plain", "Scheduled: " + t);
    } else {
      server.send(400, "text/plain", "Need ?time= argument");
    }
  });

  // 4. Weight Endpoint
  server.on("/weight", HTTP_GET, []() {
    float w = getFastWeight(10);
    server.send(200, "text/plain", String(w) + "g");
  });

  server.begin();
  while (true) {
    server.handleClient();
    delay(10);
  }
}