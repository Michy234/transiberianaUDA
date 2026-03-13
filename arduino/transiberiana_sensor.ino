/**
 * ============================================================
 *  TRANSIBERIANA D'ABRUZZO — Arduino Sensor Sketch
 *  Stazione: Castel di Sangro (793 m s.l.m.)
 * ============================================================
 *
 *  Sensori:
 *    - DHT22  → Temperatura (°C) + Umidità relativa (%)
 *    - BMP280 → Pressione atmosferica (hPa)
 *
 *  Connettività:
 *    - Arduino MKR WiFi 1010  (o ESP8266 / ESP32 — vedi istruzioni)
 *    - WiFiNINA library (MKR) oppure ESP8266WiFi / WiFi.h (ESP)
 *
 *  Protocollo:
 *    Ogni UPLOAD_INTERVAL_MS millisecondi, il microcontrollore
 *    costruisce un JSON e lo invia via HTTP POST all'endpoint
 *    configurato (SERVER_HOST / SERVER_PATH).
 *
 *  Librerie richieste (installabili da Arduino Library Manager):
 *    - DHT sensor library (Adafruit)
 *    - Adafruit Unified Sensor
 *    - Adafruit BMP280
 *    - WiFiNINA (per MKR) OPPURE ESP8266WiFi (per NodeMCU/Wemos)
 *
 *  Schema di collegamento DHT22:
 *    PIN 1 (VCC)  → 3.3V / 5V
 *    PIN 2 (DATA) → D4 (con resistore pull-up 10kΩ su VCC)
 *    PIN 4 (GND)  → GND
 *
 *  Schema di collegamento BMP280 (I²C):
 *    VCC  → 3.3V
 *    GND  → GND
 *    SCL  → A5  (Arduino Uno/MKR) oppure D1 (ESP8266)
 *    SDA  → A4  (Arduino Uno/MKR) oppure D2 (ESP8266)
 * ============================================================
 */

// ---- Scegli la tua board --- commenta/decommenta ----
#define BOARD_MKR_WIFI    // Arduino MKR WiFi 1010
// #define BOARD_ESP8266  // NodeMCU, Wemos D1 Mini, ecc.
// #define BOARD_ESP32    // ESP32 DevKit

#include <DHT.h>
#include <Adafruit_BMP280.h>
#include <Wire.h>
#include <ArduinoJson.h>

#ifdef BOARD_MKR_WIFI
  #include <WiFiNINA.h>
  #include <WiFiSSLClient.h>
#elif defined(BOARD_ESP8266)
  #include <ESP8266WiFi.h>
  #include <WiFiClientSecure.h>
#elif defined(BOARD_ESP32)
  #include <WiFi.h>
  #include <WiFiClientSecure.h>
#endif

// ============================================================
//  CONFIGURAZIONE UTENTE — modifica questi valori
// ============================================================
const char* WIFI_SSID     = "NOME_RETE_WIFI";      // ← Il tuo SSID
const char* WIFI_PASSWORD = "PASSWORD_WIFI";         // ← La tua password

// Server che riceve il JSON (puoi usare un Raspberry Pi, un VPS, ecc.)
const char* SERVER_HOST   = "192.168.1.100";         // ← IP o dominio del server
const int   SERVER_PORT   = 80;                       // 443 per HTTPS
const char* SERVER_PATH   = "/api/arduino-update";   // ← Endpoint POST

const char* STATION_NAME  = "Castel di Sangro";
const unsigned long UPLOAD_INTERVAL_MS = 60000UL;    // 60 secondi

// ============================================================
//  PIN E COSTANTI
// ============================================================
#define DHT_PIN  4          // Pin DATA del DHT22
#define DHT_TYPE DHT22

DHT         dht(DHT_PIN, DHT_TYPE);
Adafruit_BMP280 bmp;

float temperatureC = 0.0;
float humidityPct  = 0.0;
float pressureHPa  = 0.0;
bool  bmpOk        = false;

unsigned long lastUpload = 0;

// ============================================================
//  SETUP
// ============================================================
void setup() {
  Serial.begin(115200);
  while (!Serial && millis() < 3000);  // Attendi Serial (max 3s)

  Serial.println(F("\n=== Transiberiana d'Abruzzo — Stazione Meteo ==="));
  Serial.print(F("Stazione: ")); Serial.println(STATION_NAME);

  // DHT22
  dht.begin();
  Serial.println(F("DHT22 inizializzato."));

  // BMP280
  bmpOk = bmp.begin(0x76);  // prova 0x77 se 0x76 non funziona
  if (!bmpOk) {
    Serial.println(F("⚠️  BMP280 non trovato! Controlla I2C."));
  } else {
    bmp.setSampling(
      Adafruit_BMP280::MODE_NORMAL,
      Adafruit_BMP280::SAMPLING_X2,
      Adafruit_BMP280::SAMPLING_X16,
      Adafruit_BMP280::FILTER_X16,
      Adafruit_BMP280::STANDBY_MS_500
    );
    Serial.println(F("BMP280 inizializzato."));
  }

  // WiFi
  connectWiFi();
}

// ============================================================
//  LOOP
// ============================================================
void loop() {
  // Leggi sensori
  readSensors();

  // Stampa su Serial per debug
  Serial.print(F("🌡 Temp: ")); Serial.print(temperatureC, 1); Serial.print(F("°C  "));
  Serial.print(F("💧 Hum: "));  Serial.print(humidityPct, 0);  Serial.print(F("%  "));
  Serial.print(F("🌬 Pres: ")); Serial.print(pressureHPa, 1);  Serial.println(F(" hPa"));

  // Upload al server ogni UPLOAD_INTERVAL_MS
  unsigned long now = millis();
  if (now - lastUpload >= UPLOAD_INTERVAL_MS) {
    lastUpload = now;
    if (WiFi.status() != WL_CONNECTED) connectWiFi();
    uploadData();
  }

  delay(5000);  // Aggiornamento console ogni 5s
}

// ============================================================
//  LETTURA SENSORI
// ============================================================
void readSensors() {
  float t = dht.readTemperature();
  float h = dht.readHumidity();

  if (!isnan(t)) temperatureC = t;
  if (!isnan(h)) humidityPct  = h;

  if (bmpOk) pressureHPa = bmp.readPressure() / 100.0F;
}

// ============================================================
//  UPLOAD JSON via HTTP POST
// ============================================================
void uploadData() {
  // Costruisci JSON
  StaticJsonDocument<256> doc;
  doc["timestamp"]     = getISOTimestamp();
  doc["station"]       = STATION_NAME;
  doc["temperature_c"] = serialized(String(temperatureC, 1));
  doc["humidity_pct"]  = serialized(String(humidityPct, 0));
  doc["pressure_hpa"]  = serialized(String(pressureHPa, 1));

  String payload;
  serializeJson(doc, payload);

  Serial.print(F("📤 Upload a ")); Serial.print(SERVER_HOST); Serial.println(SERVER_PATH);

#ifdef BOARD_MKR_WIFI
  WiFiClient client;
#else
  WiFiClient client;  // sostituisci con WiFiClientSecure per HTTPS
#endif

  if (!client.connect(SERVER_HOST, SERVER_PORT)) {
    Serial.println(F("❌ Connessione al server fallita."));
    return;
  }

  // HTTP POST
  client.println("POST " + String(SERVER_PATH) + " HTTP/1.1");
  client.println("Host: " + String(SERVER_HOST));
  client.println("Content-Type: application/json");
  client.println("Content-Length: " + String(payload.length()));
  client.println("Connection: close");
  client.println();
  client.println(payload);

  // Leggi risposta
  unsigned long t0 = millis();
  while (client.available() == 0 && millis() - t0 < 5000);
  while (client.available()) {
    String line = client.readStringUntil('\r');
    if (line.startsWith("HTTP/1.1 2")) {
      Serial.println(F("✅ Upload riuscito!"));
      break;
    }
  }
  client.stop();
}

// ============================================================
//  WIFI CONNECTION
// ============================================================
void connectWiFi() {
  Serial.print(F("Connessione a WiFi: ")); Serial.println(WIFI_SSID);
  WiFi.begin(WIFI_SSID, WIFI_PASSWORD);
  unsigned long t0 = millis();
  while (WiFi.status() != WL_CONNECTED && millis() - t0 < 20000) {
    delay(500); Serial.print('.');
  }
  if (WiFi.status() == WL_CONNECTED) {
    Serial.println(F("\n✅ WiFi connesso!"));
    Serial.print(F("IP: ")); Serial.println(WiFi.localIP());
  } else {
    Serial.println(F("\n⚠️  WiFi: timeout connessione. Riprovo al prossimo ciclo."));
  }
}

// ============================================================
//  ISO 8601 TIMESTAMP (senza RTC — usa millis come fallback)
//  Per un timestamp preciso aggiungi un modulo RTC DS3231.
// ============================================================
String getISOTimestamp() {
  // Se hai un RTC, usa la sua libreria qui.
  // Fallback: timestamp con uptime in secondi
  unsigned long sec = millis() / 1000;
  char buf[32];
  snprintf(buf, sizeof(buf), "uptime+%lus", sec);
  return String(buf);
}
