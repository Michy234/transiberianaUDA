#include <WiFi.h>
#include <HTTPClient.h>
#include <DHT.h>
#include <MQUnifiedsensor.h>
#include <Wire.h>
#include <LiquidCrystal_I2C.h>

// ── Configurazione ──────────────────────────────────────────
#define DHT_PIN     14
#define DHT_TYPE    DHT11
#define MQ_PIN      35
#define SOIL_PIN    34

#define SCREEN_SDA  21
#define SCREEN_SCL  22


#define Board                   ("ESP-32")
#define Pin                     (35) // GPIO 34 (Analogico ADC1)
#define Type                    ("MQ-135") 
#define Voltage_Resolution      (3.3) // ESP32 lavora a 3.3V
#define ADC_Bit_Resolution      (12)  // ESP32 ha 12-bit di risoluzione
#define RatioMQ135CleanAir      (3.6) 

MQUnifiedsensor MQ135(Board, Voltage_Resolution, ADC_Bit_Resolution, Pin, Type);

const char* ssid       = "ssid";
const char* password   = "pwd";
const char* SUPA_URL   = "https://amhbcbfxoosnakvvhclw.supabase.co/rest/v1/sensor_data";
const char* SUPA_KEY   = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFtaGJjYmZ4b29zbmFrdnZoY2x3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM0ODExMTIsImV4cCI6MjA4OTA1NzExMn0.X_xun96MRTFyFhKyMjfdXzfeDvFx6kkw4VivR88sjV8";  // anon key
// ────────────────────────────────────────────────────────────

DHT dht(DHT_PIN, DHT_TYPE);
LiquidCrystal_I2C lcd(0x27, 16, 2); 

void setup() {
  Serial.begin(115200);
  dht.begin();
  MQ135.setRegressionMethod(1); 
  MQ135.init();
  Wire.begin(SCREEN_SDA, SCREEN_SCL); 
  lcd.init(); 
  lcd.backlight();

  Serial.print("Riscaldamento e calibrazione...");
  lcd.setCursor(0, 0);
  lcd.print("Calibrazione");
  float calcR0 = 0;
  for(int i = 1; i<=10; i ++) {
    MQ135.update(); 
    calcR0 += MQ135.calibrate(RatioMQ135CleanAir);
    delay(100);
    lcd.setCursor(6, 1);
    lcd.print("%");
  }
  MQ135.setR0(calcR0/10);
  Serial.println(" Pronto!");
  lcd.setCursor(0, 1);
  lcd.print("Finita !!!");


  WiFi.begin(ssid, password);
  Serial.print("Connessione WiFi");
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  Serial.println(" OK — IP: " + WiFi.localIP().toString());
  lcd.clear();
  lcd.setCursor(0, 0);
  lcd.print("Pronto");
  delay(500);
  lcd.clear();
}

void loop() {
  MQ135.update();
  float temp     = dht.readTemperature();
  float humidity = dht.readHumidity();
  int   airRaw   = analogRead(MQ_PIN);
  int airMap = map(airRaw, 0, 4095, 0, 100);
  int soilRaw = analogRead(SOIL_PIN);
  int soilMoisture = map(soilRaw, 4095, 0, 0, 100);
  soilMoisture = constrain(soilMoisture, 0, 100);

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
    delay(200);
  }

  Serial.printf("T=%.1f°C  H=%.1f%%  CO2=%.2f  NH4=%.2f  Toluene=%.2f SoilMoisture=%d\n",
               temp, humidity, CO2, NH4, Toluene, soilMoisture);

  lcd.clear();
  lcd.setCursor(0, 0); 
  lcd.print("TEMP: ");
  lcd.setCursor(6, 0);
  lcd.print(temp);
  lcd.setCursor(10, 0);
  lcd.print((char)223);
  lcd.setCursor(11, 0);
  lcd.print("C");

  lcd.setCursor(0, 1); 
  lcd.print("RH: ");
  lcd.setCursor(4, 1);
  lcd.print(humidity);
  lcd.setCursor(6, 1);
  lcd.print("%");

  lcd.setCursor(7, 1); 
  lcd.print(" GAS: ");
  lcd.setCursor(13, 1);
  lcd.print(airMap);
  lcd.setCursor(15, 1);
  lcd.print("%");

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
                  ",\"toluene\":"     + String(Toluene, 2) + 
                  ",\"soil_moisture\":"+ String(soilMoisture) + "}";

    int code = http.POST(body);
    Serial.println(code == 201 ? "✓ Inviato" : "✗ Errore HTTP " + String(code));
    http.end();
}

  delay(5000);  // ogni 30 secondi
}
