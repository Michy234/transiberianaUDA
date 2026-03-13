/*
 * Stazione Meteo Arduino
 * Sensori: DHT22 (temp + umidità), BMP280 (pressione), sensore pioggia, anemometro
 * Invia dati JSON via Serial/WiFi (ESP8266/ESP32)
 */

#include <ArduinoJson.h>
#include <DHT.h>
// Se usi ESP8266/ESP32 con WiFi:
// #include <ESP8266WiFi.h>
// #include <ESP8266HTTPClient.h>

// ---- PIN CONFIG ----
#define DHT_PIN       2
#define DHT_TYPE      DHT22
#define RAIN_PIN      A0   // Sensore pioggia analogico
#define WIND_PIN      A1   // Anemometro analogico
#define LIGHT_PIN     A2   // Sensore luce LDR

// ---- WIFI CONFIG (solo ESP8266/ESP32) ----
// const char* SSID     = "TUA_RETE";
// const char* PASSWORD = "TUA_PASSWORD";
// const char* SERVER   = "http://tuosito.it/api/update";

DHT dht(DHT_PIN, DHT_TYPE);

unsigned long lastSend = 0;
const unsigned long INTERVAL = 60000; // Ogni 60 secondi

void setup() {
  Serial.begin(9600);
  dht.begin();
  
  // WiFi setup (ESP):
  // WiFi.begin(SSID, PASSWORD);
  // while (WiFi.status() != WL_CONNECTED) delay(500);
  
  Serial.println("Stazione meteo pronta!");
}

void loop() {
  unsigned long now = millis();
  
  if (now - lastSend >= INTERVAL) {
    lastSend = now;
    sendData();
  }
}

void sendData() {
  // Leggi sensori
  float temperatura = dht.readTemperature();
  float umidita     = dht.readHumidity();
  
  // Controlla errori DHT22
  if (isnan(temperatura) || isnan(umidita)) {
    Serial.println("ERRORE: DHT22 non risponde");
    return;
  }
  
  // Leggi valori analogici e convertili
  int rainRaw   = analogRead(RAIN_PIN);
  int windRaw   = analogRead(WIND_PIN);
  int lightRaw  = analogRead(LIGHT_PIN);
  
  float pioggia   = map(rainRaw, 0, 1023, 100, 0);  // 0=asciutto, 100=bagnato
  float vento     = map(windRaw, 0, 1023, 0, 120);  // km/h stimati
  float luce      = map(lightRaw, 0, 1023, 0, 100); // percentuale
  
  // Crea JSON con ArduinoJson
  StaticJsonDocument<256> doc;
  doc["temperatura"]  = round(temperatura * 10) / 10.0;
  doc["umidita"]      = round(umidita);
  doc["pioggia"]      = pioggia > 20 ? true : false;
  doc["pioggia_pct"]  = pioggia;
  doc["vento_kmh"]    = vento;
  doc["luce_pct"]     = luce;
  doc["timestamp"]    = millis() / 1000; // secondi dall'avvio
  
  // ---- OPZIONE 1: Invia via Serial (poi Python legge la porta COM) ----
  serializeJson(doc, Serial);
  Serial.println(); // newline per delimitare i messaggi
  
  // ---- OPZIONE 2: Invia via HTTP POST (ESP8266/ESP32) ----
  // HTTPClient http;
  // http.begin(SERVER);
  // http.addHeader("Content-Type", "application/json");
  // String jsonStr;
  // serializeJson(doc, jsonStr);
  // int code = http.POST(jsonStr);
  // http.end();
}
