# Transiberiana d'Abruzzo — Sito Web

Sito web didattico come progetto di **Educazione Civica** a.s. 2025/26.  
Introduce gli utenti alla Transiberiana d'Abruzzo, le sue fermate, informazioni pratiche per il viaggio e una **dashboard meteorologica live** con dati Open-Meteo e sensori Arduino (utilizzati durante la gita alla medesima).

---

## Funzionalità

| Funzione | Dettaglio |
|---|---|
| Presentazione | Storia, fermate, come salire, info utili |
| Meteo live | Dati attuali dalle 3 stazioni (Open-Meteo API) |
| Grafico interattivo | Chart.js multi-linea, toggle per stazione/variabile/periodo |
| Arduino | Polling ogni 30s di `/data/arduino.json` aggiornato dal sensore |
| Statistiche | Media, Mediana, Moda calcolate su tutti i periodi |
| Responsive | Layout ottimizzato per mobile, tablet e desktop |

---

## Struttura del Progetto

```
EDUCAZIONE CIVICA TRANSIBERIANA/
├── index.html              ← Entry point SPA
├── vite.config.js
├── package.json
├── style/
│   ├── main.css            ← Design system, variabili CSS, base
│   ├── hero.css            ← Sezione hero + animazioni
│   ├── fermate.css         ← Card delle stazioni
│   ├── meteo.css           ← Dashboard meteo + tabella stats
│   └── responsive.css      ← Breakpoint mobile/tablet
├── src/
│   ├── main.js             ← Bootstrap app
│   ├── api/
│   │   ├── openmeteo.js    ← Fetch API Open-Meteo (storico + corrente)
│   │   └── arduino.js      ← Polling /data/arduino.json ogni 30s
## Struttura del Progetto

Il sito è configurato come una **Multi-Page Application (MPA)** per massimizzare il contenuto di ogni sezione.

- `index.html`: Home con Hero e anteprima fermate.
- `storia.html`: Storia dettagliata della ferrovia dal 1897.
- `fermate.html`: Dettaglio sulle 3 stazioni principali.
- `come-salire.html`: Guida alla prenotazione e al viaggio.
- `info-utili.html`: Consigli pratici per i viaggiatori.
- `meteo.html`: Dashboard interattiva con Chart.js.

## Installazione e Sviluppo

1. Clona la repository.
2. Installa le dipendenze:
   ```bash
   npm install
   ```
3. Avvia l'ambiente di sviluppo:
   ```bash
   npm run dev
   ```
4. Per generare la build di produzione:
   ```bash
   npm run build
   ```

## Tecnologie Utilizzate

- **Vite**: Bundler ultra-veloce configurato per MPA.
- **Chart.js v4**: Visualizzazione dati meteo con toggle dinamici.
- **Vanilla JS & CSS**: Struttura leggera e design system personalizzato.
- **Open-Meteo API**: Dati meteorologici storici e attuali.
** Open-Meteo è completamente gratuita.

Il sito usa due endpoint:

| Endpoint | Uso |
|---|---|
| `https://api.open-meteo.com/v1/forecast` | Dati ultime 24h / 7 giorni + previsioni |
| `https://archive-api.open-meteo.com/v1/archive` | Storico 30gg / 1 anno / 2 anni |

### Stazioni configurate

| Stazione | Lat | Lon | Quota |
|---|---|---|---|
| Sulmona | 42.049 | 13.930 | 375 m |
| Castel di Sangro | 41.783 | 14.108 | 793 m |
| Campo di Giove | 41.998 | 14.057 | 1060 m |

Per modificare le stazioni, edita `src/api/openmeteo.js` → costante `STATIONS`.

---

## Configurazione Arduino

### Hardware necessario

| Componente | Funzione |
|---|---|
| Arduino MKR WiFi 1010 (o ESP8266/ESP32) | Microcontrollore + WiFi |
| DHT22 | Temperatura (°C) + Umidità (%) |
| BMP280 | Pressione atmosferica (hPa) |
| Resistore 10kΩ | Pull-up per DHT22 DATA pin |

### Schema di collegamento

**DHT22:**
```
VCC  → 3.3V (o 5V)
DATA → Pin D4 (+ resistore 10kΩ su VCC)
GND  → GND
```

**BMP280 (I²C):**
```
VCC → 3.3V
GND → GND
SCL → A5 (Uno/MKR) | D1 (ESP8266) | GPIO22 (ESP32)
SDA → A4 (Uno/MKR) | D2 (ESP8266) | GPIO21 (ESP32)
```

### Librerie da installare (Arduino IDE → Library Manager)

1. `DHT sensor library` — Adafruit
2. `Adafruit Unified Sensor` — Adafruit
3. `Adafruit BMP280 Library` — Adafruit
4. `ArduinoJson` — Benoit Blanchon
5. `WiFiNINA` — Arduino (solo MKR WiFi 1010)

### Configurazione sketch (`arduino/transiberiana_sensor.ino`)

Apri lo sketch e modifica le costanti in cima al file:

```cpp
const char* WIFI_SSID     = "NOME_RETE_WIFI";
const char* WIFI_PASSWORD = "PASSWORD_WIFI";
const char* SERVER_HOST   = "192.168.1.100";   // IP del server
const int   SERVER_PORT   = 80;                  // 443 per HTTPS
const char* SERVER_PATH   = "/api/arduino-update";
const char* STATION_NAME  = "Castel di Sangro";
const unsigned long UPLOAD_INTERVAL_MS = 60000; // ogni 60 secondi
```

Scegli la board decommentando la `#define` corretta:
```cpp
#define BOARD_MKR_WIFI   // Arduino MKR WiFi 1010
// #define BOARD_ESP8266
// #define BOARD_ESP32
```

### Server endpoint (opzione Node.js/Express)

Il server che riceve il JSON dall'Arduino deve:
1. Accettare una richiesta `POST /api/arduino-update`
2. Salvare il body JSON in `data/arduino.json` nella root del sito

**Esempio minimo (Node.js + Express):**

```js
const express = require('express');
const fs      = require('fs');
const path    = require('path');
const app     = express();

app.use(express.json());

app.post('/api/arduino-update', (req, res) => {
  const data = { ...req.body, timestamp: new Date().toISOString() };
  fs.writeFileSync(
    path.join(__dirname, 'data', 'arduino.json'),
    JSON.stringify(data, null, 2)
  );
  res.json({ ok: true });
});

app.listen(80, () => console.log('Server Arduino in ascolto su porta 80'));
```

Salva questo file come `server.js` nella root e avvialo con:
```bash
node server.js
```

> **Nota:** Se il server gira sulla stessa macchina di Vite, assicurati che i due processi usino porte diverse (es. Vite → 5173, server Arduino → 80).

---

## Statistiche (Media, Mediana, Moda)

Le funzioni statistiche sono implementate in `src/stats/calculator.js`:

| Funzione | Formula | Implementazione |
|---|---|---|
| `media(arr)` | Σx / n | Somma divisa per il numero di valori |
| `mediana(arr)` | Valore centrale dell'array ordinato | Se n dispari: `a[n/2]`; se pari: media dei due centrali |
| `moda(arr)` | Valore più frequente | Frequenza di occorrenza, arrotondamento a 1 decimale |

I valori `null` e `NaN` vengono ignorati automaticamente.

---

## Personalizzazione

### Aggiungere nuovi sensori Arduino

1. Aggiorna il JSON schema in `data/arduino.json` con i nuovi campi.
2. Aggiungi la lettura nel loop di `transiberiana_sensor.ino`.
3. Aggiorna `src/api/arduino.js` per leggere i nuovi campi.
4. Aggiorna `src/sections/meteo.js` per visualizzarli nelle live cards.

### Cambiare colori

Modifica le variabili CSS in `style/main.css` → sezione `:root`:
```css
--color-primary: #c0392b;   /* rosso ferrovia */
--color-accent:  #f39c12;   /* oro montagna */
```

---

## Licenza e Credits

- **Dati meteo:** [Open-Meteo](https://open-meteo.com) — CC BY 4.0
- **Chart.js:** [chartjs.org](https://chartjs.org) — MIT
- **Fondazione FS:** Informazioni storiche sulla Transiberiana d'Abruzzo
- **Progetto didattico:** IIS Mattei Vasto, Educazione Civica 2025/26

---

*Progetto realizzato come componente del percorso di Educazione Civica — Classe 4BIN, a.s. 2025/26.*
