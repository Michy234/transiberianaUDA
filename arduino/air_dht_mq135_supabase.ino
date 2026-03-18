#include <WiFi.h>
#include <HTTPClient.h>
#include <DHT.h>
#include <MQUnifiedsensor.h>

// ── Configurazione ──────────────────────────────────────────
#define DHT_PIN     4
#define DHT_TYPE    DHT11
#define MQ_PIN      35

#define Board                   ("ESP-32")
#define Pin                     (35) // GPIO 34 (Analogico ADC1)
#define Type                    ("MQ-135") 
#define Voltage_Resolution      (3.3) // ESP32 lavora a 3.3V
#define ADC_Bit_Resolution      (12)  // ESP32 ha 12-bit di risoluzione
#define RatioMQ135CleanAir      (3.6) 

MQUnifiedsensor MQ135(Board, Voltage_Resolution, ADC_Bit_Resolution, Pin, Type);

const char* ssid       = "IISMATTEI";
const char* password   = "BlackSheep29*";
const char* SUPA_URL   = "https://amhbcbfxoosnakvvhclw.supabase.co/rest/v1/sensor_data";
const char* SUPA_KEY   = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFtaGJjYmZ4b29zbmFrdnZoY2x3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM0ODExMTIsImV4cCI6MjA4OTA1NzExMn0.X_xun96MRTFyFhKyMjfdXzfeDvFx6kkw4VivR88sjV8";  // anon key
// ────────────────────────────────────────────────────────────

DHT dht(DHT_PIN, DHT_TYPE);

void setup() {
  Serial.begin(115200);
  dht.begin();
  MQ135.setRegressionMethod(1); 
  MQ135.init(); 

  Serial.print("Riscaldamento e calibrazione...");
  float calcR0 = 0;
  for(int i = 1; i<=10; i ++) {
    MQ135.update(); 
    calcR0 += MQ135.calibrate(RatioMQ135CleanAir);
    delay(100);
  }
  MQ135.setR0(calcR0/10);
  Serial.println(" Pronto!");

  WiFi.begin(ssid, password);
  Serial.print("Connessione WiFi");
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  Serial.println(" OK — IP: " + WiFi.localIP().toString());
}

void loop() {
  MQ135.update();
  float temp     = dht.readTemperature();
  float humidity = dht.readHumidity();
  int   airRaw   = analogRead(MQ_PIN);
  int airMap = map(35, 0, 1023, 0, 100);

  // Stima CO2
  MQ135.setA(110.47); MQ135.setB(-2.862); 
  float CO2 = MQ135.readSensor();

  // Stima Ammoniaca
  MQ135.setA(102.2); MQ135.setB(-2.473);
  float NH4 = MQ135.readSensor();

  // Stima Toluene
  MQ135.setA(44.947); MQ135.setB(-3.445);
  float Toluene = MQ135.readSensor();

  Serial.printf("CO2: %.2f PPM | NH4: %.2f PPM | Toluene: %.2f PPM\n", CO2, NH4, Toluene);


  if (isnan(temp) || isnan(humidity)) {
    Serial.println("Errore DHT11, riprovo...");
    delay(5000);
    return;
  }

  Serial.printf("T=%.1f°C  H=%.1f%%  CO2=%.2f  NH4=%.2f  Toluene=%.2f\n",
               temp, humidity, CO2, NH4, Toluene);

  if (WiFi.status() == WL_CONNECTED) {
    HTTPClient http;
    http.begin(SUPA_URL);
    http.addHeader("Content-Type", "application/json");
    http.addHeader("apikey", SUPA_KEY);
    http.addHeader("Authorization", String("Bearer ") + SUPA_KEY);
    http.addHeader("Prefer", "return=minimal");

    String body = "{\"temp\":"        + String(temp, 1) +
                  ",\"humidity\":"    + String(humidity, 1) +
                  ",\"air_quality\":" + String(airMap) +
                  ",\"co2\":"         + String(CO2, 2) +
                  ",\"nh4\":"         + String(NH4, 2) +
                  ",\"toluene\":"     + String(Toluene, 2) + "}";

    int code = http.POST(body);
    Serial.println(code == 201 ? "✓ Inviato" : "✗ Errore HTTP " + String(code));
    http.end();
  }

  delay(30000);  // ogni 30 secondi
}
