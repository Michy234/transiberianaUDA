#!/usr/bin/env python3
"""
Server Python per Stazione Meteo Arduino
- Legge dati JSON dalla porta seriale (USB)
- OPPURE espone un endpoint HTTP per ricevere dati via WiFi
- Salva/aggiorna weather_data.json
- Aggiunge storico ultimi 24h
"""

import json
import time
import threading
from datetime import datetime, timedelta
from pathlib import Path

# =====================
# CONFIGURAZIONE
# =====================
SERIAL_PORT   = "COM3"        # Windows: COM3, COM4 | Linux: /dev/ttyUSB0
BAUD_RATE     = 9600
JSON_OUTPUT   = "weather_data.json"
MAX_HISTORY   = 144           # Punti storici (144 x 10min = 24h)
USE_HTTP      = False         # True = ricevi via HTTP POST (ESP WiFi)
HTTP_PORT     = 5000          # Porta del server Flask (se USE_HTTP=True)

# =====================
# LETTURA DA SERIALE
# =====================
def read_serial():
    """Legge continuamente dalla porta seriale e aggiorna il JSON."""
    import serial
    
    print(f"Connessione a {SERIAL_PORT} @ {BAUD_RATE} baud...")
    
    while True:
        try:
            with serial.Serial(SERIAL_PORT, BAUD_RATE, timeout=2) as ser:
                print("Connesso! In ascolto...")
                while True:
                    line = ser.readline().decode("utf-8", errors="ignore").strip()
                    if line:
                        try:
                            data = json.loads(line)
                            update_json(data)
                            print(f"[{datetime.now().strftime('%H:%M:%S')}] "
                                  f"T={data.get('temperatura')}°C "
                                  f"U={data.get('umidita')}% "
                                  f"V={data.get('vento_kmh')}km/h")
                        except json.JSONDecodeError:
                            pass  # Ignora righe non-JSON (messaggi di debug Arduino)
        except Exception as e:
            print(f"Errore seriale: {e} — riprovo tra 5s...")
            time.sleep(5)

# =====================
# SERVER HTTP (WiFi ESP)
# =====================
def start_http_server():
    """Endpoint POST /api/update per ricevere dati via WiFi."""
    from flask import Flask, request, jsonify
    from flask_cors import CORS
    
    app = Flask(__name__)
    CORS(app)
    
    @app.route("/api/update", methods=["POST"])
    def receive_data():
        data = request.get_json()
        if data:
            update_json(data)
            return jsonify({"status": "ok"}), 200
        return jsonify({"status": "error"}), 400
    
    @app.route("/weather_data.json")
    def serve_json():
        """Serve il JSON direttamente (CORS abilitato)."""
        with open(JSON_OUTPUT) as f:
            return f.read(), 200, {"Content-Type": "application/json"}
    
    print(f"Server HTTP avviato su http://0.0.0.0:{HTTP_PORT}")
    app.run(host="0.0.0.0", port=HTTP_PORT)

# =====================
# AGGIORNA IL JSON
# =====================
def update_json(new_data: dict):
    """Aggiunge timestamp, aggiorna il file JSON con dati correnti + storico."""
    
    now = datetime.now()
    
    # Carica JSON esistente (o crea struttura vuota)
    output_path = Path(JSON_OUTPUT)
    if output_path.exists():
        with open(output_path) as f:
            weather = json.load(f)
    else:
        weather = {"corrente": {}, "storico": [], "meta": {}}
    
    # Aggiorna dati correnti
    weather["corrente"] = {
        "temperatura": new_data.get("temperatura", "--"),
        "umidita":     new_data.get("umidita", "--"),
        "vento_kmh":   new_data.get("vento_kmh", 0),
        "pioggia":     new_data.get("pioggia", False),
        "pioggia_pct": new_data.get("pioggia_pct", 0),
        "luce_pct":    new_data.get("luce_pct", 50),
        "pressione":   new_data.get("pressione", 1013),  # BMP280
        "timestamp":   now.isoformat(),
        "ora":         now.strftime("%H:%M"),
        "data":        now.strftime("%d/%m/%Y"),
    }
    
    # Determina condizione meteo automaticamente
    weather["corrente"]["condizione"] = get_condizione(weather["corrente"])
    
    # Aggiungi al storico
    storico_entry = {
        "ora":          now.strftime("%H:%M"),
        "temperatura":  new_data.get("temperatura"),
        "umidita":      new_data.get("umidita"),
        "vento_kmh":    new_data.get("vento_kmh"),
    }
    weather["storico"].append(storico_entry)
    
    # Mantieni solo gli ultimi MAX_HISTORY punti
    weather["storico"] = weather["storico"][-MAX_HISTORY:]
    
    # Meta informazioni
    weather["meta"] = {
        "stazione":       "San Salvo - Stazione Meteo Arduino",
        "ultimo_update":  now.isoformat(),
        "versione":       "1.0"
    }
    
    # Salva il file
    with open(output_path, "w") as f:
        json.dump(weather, f, ensure_ascii=False, indent=2)

def get_condizione(dati: dict) -> str:
    """Determina la condizione meteo dai valori dei sensori."""
    if dati.get("pioggia"):
        return "pioggia"
    vento = dati.get("vento_kmh", 0)
    if vento > 50:
        return "temporale"
    if vento > 20:
        return "ventoso"
    luce = dati.get("luce_pct", 50)
    if luce < 20:
        return "nuvoloso"
    if luce < 50:
        return "parzialmente_nuvoloso"
    return "soleggiato"

# =====================
# GENERA JSON DI DEMO
# =====================
def generate_demo_json():
    """Crea un weather_data.json di esempio per testare il sito."""
    import random
    
    now = datetime.now()
    storico = []
    
    for i in range(48):
        t = now - timedelta(minutes=30*i)
        storico.append({
            "ora": t.strftime("%H:%M"),
            "temperatura": round(18 + 8 * __import__('math').sin(i * 0.3) + random.uniform(-1, 1), 1),
            "umidita": round(55 + 20 * __import__('math').cos(i * 0.2) + random.uniform(-3, 3)),
            "vento_kmh": round(abs(10 + 15 * __import__('math').sin(i * 0.5) + random.uniform(-2, 2))),
        })
    
    storico.reverse()
    
    demo = {
        "corrente": {
            "temperatura": 22.4,
            "umidita": 63,
            "vento_kmh": 14,
            "pioggia": False,
            "pioggia_pct": 8,
            "luce_pct": 78,
            "pressione": 1018,
            "condizione": "soleggiato",
            "timestamp": now.isoformat(),
            "ora": now.strftime("%H:%M"),
            "data": now.strftime("%d/%m/%Y"),
        },
        "storico": storico,
        "meta": {
            "stazione": "San Salvo - Stazione Meteo Arduino",
            "ultimo_update": now.isoformat(),
            "versione": "1.0"
        }
    }
    
    with open(JSON_OUTPUT, "w") as f:
        json.dump(demo, f, ensure_ascii=False, indent=2)
    
    print(f"JSON demo creato: {JSON_OUTPUT}")

# =====================
# MAIN
# =====================
if __name__ == "__main__":
    import sys
    
    if len(sys.argv) > 1 and sys.argv[1] == "--demo":
        generate_demo_json()
        sys.exit(0)
    
    if USE_HTTP:
        # Modalità WiFi: server Flask
        start_http_server()
    else:
        # Modalità USB Serial
        read_serial()
