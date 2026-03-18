// =============================================
//  GSR Sensor Reader - ESP32
//  Con interpretazione in tempo reale
// =============================================

const int GSR_PIN       = 34;
const int SAMPLES       = 10;
const int SAMPLE_DELAY  = 5;
const float VCC         = 3.3;
const int ADC_RES       = 4095;
const float R_SENSE     = 10000.0;

// --- Baseline dinamica ---
float baseline       = 0;
float smoothed       = 0;
const float ALPHA    = 0.05;   // Quanto veloce si aggiorna la baseline (0.0–1.0)
bool calibrated      = false;
const int CALIB_SAMPLES = 30;  // ~6 secondi di calibrazione

// --- Soglie relative (µS di scarto dalla baseline) ---
const float THR_CALM       = 1.5;   // sotto baseline+1.5 → calmo
const float THR_ATTENTIVE  = 3.0;   // +1.5 a +3.0 → attento/concentrato  
const float THR_STRESSED   = 6.0;   // +3.0 a +6.0 → stressato/eccitato
                                     // oltre +6.0  → picco forte (sorpresa/paura)

// --- Soglie assolute (µS) per stato base ---
const float ABS_LOW        = 20.0;  // sotto → rilassato/sonnolento
const float ABS_MED_LOW    = 28.0;  // 20–28 → calmo
const float ABS_MED_HIGH   = 38.0;  // 28–38 → normale/sveglio  ← sei qui
const float ABS_HIGH       = 50.0;  // 38–50 → attivato
                                     // oltre → alta eccitazione

// -----------------------------------------------

float readGSR() {
  long sum = 0;
  for (int i = 0; i < SAMPLES; i++) {
    sum += analogRead(GSR_PIN);
    delay(SAMPLE_DELAY);
  }
  int raw = sum / SAMPLES;
  float voltage = (raw * VCC) / ADC_RES;
  if (voltage < 0.01) return 0;
  float resistance = (VCC - voltage) / (voltage / R_SENSE);
  return (1.0 / resistance) * 1e6;
}

String absoluteState(float uS) {
  if (uS < ABS_LOW)      return "RILASSATO/SONNOLENTO";
  if (uS < ABS_MED_LOW)  return "CALMO";
  if (uS < ABS_MED_HIGH) return "NORMALE/SVEGLIO";
  if (uS < ABS_HIGH)     return "ATTIVATO";
  return                        "ALTA ECCITAZIONE";
}

String relativeState(float delta) {
  if (delta < THR_CALM)      return "stabile";
  if (delta < THR_ATTENTIVE) return "leggera variazione";
  if (delta < THR_STRESSED)  return "AUMENTO STRESS/ATTENZIONE";
  return                            "** PICCO - RISPOSTA EMOTIVA FORTE **";
}

void setup() {
  Serial.begin(115200);
  analogReadResolution(12);
  analogSetAttenuation(ADC_11db);

  Serial.println("=== GSR Sensor - Calibrazione in corso... ===");
  Serial.println("Tieni ferma la mano e rilassati per 6 secondi.");
  Serial.println();

  // Calibrazione baseline
  float total = 0;
  for (int i = 0; i < CALIB_SAMPLES; i++) {
    float val = readGSR();
    total += val;
    Serial.print("  Campione calibrazione ");
    Serial.print(i + 1);
    Serial.print("/");
    Serial.print(CALIB_SAMPLES);
    Serial.print("  →  ");
    Serial.print(val, 2);
    Serial.println(" µS");
    delay(200);
  }
  baseline  = total / CALIB_SAMPLES;
  smoothed  = baseline;
  calibrated = true;

  Serial.println();
  Serial.print(">>> Baseline stabilita: ");
  Serial.print(baseline, 2);
  Serial.println(" µS");
  Serial.println("==============================================");
  Serial.println("µS\t\tStato Assoluto\t\t\tVariaz. da baseline\tInterpretazione");
  Serial.println("-----------------------------------------------------------------------------------------------");
  delay(500);
}

void loop() {
  float uS = readGSR();

  // Aggiorna baseline lentamente (deriva cutanea naturale)
  smoothed = (ALPHA * uS) + ((1.0 - ALPHA) * smoothed);
  float delta = uS - smoothed;
  if (delta < 0) delta = 0;  // Solo picchi verso l'alto sono significativi

  // Output
  Serial.print(uS, 2);
  Serial.print(" µS\t");

  String absS = absoluteState(uS);
  Serial.print(absS);
  // padding per allineare
  for (int i = absS.length(); i < 28; i++) Serial.print(" ");

  Serial.print("+");
  Serial.print(delta, 2);
  Serial.print(" µS\t\t");

  Serial.println(relativeState(delta));

  delay(200);
}
