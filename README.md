# CQ… Nothing.

**Kurzwellenfunk verstehen durch Fehleranalyse**
*Understanding HF Radio by Debugging QSOs*

Ein interaktives Lernwerkzeug für Amateurfunk-Einsteiger, das erklärt, warum HF-Funkverbindungen manchmal scheitern.

## Was ist das?

"CQ… Nothing." simuliert typische Situationen, in denen ein Funkamateur ruft – aber keine Antwort bekommt. Anstatt Frustration zu erzeugen, hilft dieses Tool dabei, die physikalischen und technischen Gründe zu verstehen:

- Ausbreitungsbedingungen (Skip-Zone, D-Layer-Absorption, MUF)
- Zeitabhängige Faktoren (Tageszeit, Jahreszeit)
- Technische Aspekte (Antennen, Leistung, Störungen)
- Betriebliche Faktoren (Timing, Frequenzwahl)

## Features

- 16 realistische Szenarien mit unterschiedlichen Schwierigkeitsgraden
- 23 mögliche Ursachen in 5 Kategorien
- Plausibilitätsbewertung (sehr wahrscheinlich → unwahrscheinlich)
- Zweisprachig: Deutsch (Standard) und Englisch
- Keine Bestrafung – Fokus auf Verständnis und "Aha-Momente"
- Responsive Design für Desktop und Mobile
- Barrierefreiheit (ARIA, Tastaturnavigation)

## Live Demo

**https://cqnothing.oeradio.at/**

## Entwicklung

### Voraussetzungen

- Node.js 18+
- npm

### Installation

```bash
git clone https://github.com/achildrenmile/cqnothing.git
cd cqnothing
npm install
```

### Development Server

```bash
npm run dev
```

Öffnet http://localhost:5173

### Production Build

```bash
npm run build
```

Output in `dist/`

### Preview Production Build

```bash
npm run preview
```

## Projektstruktur

```
cqnothing/
├── public/
│   └── config.json          # Runtime-Konfiguration (Parent Site Branding)
├── src/
│   ├── data/
│   │   ├── causes.json      # 23 Ursachen mit DE/EN Texten
│   │   ├── scenarios.json   # 16 Szenarien mit Mappings
│   │   └── strings.json     # UI-Übersetzungen
│   ├── causes.js            # Ursachen-Modul
│   ├── config.js            # Runtime-Config Loader
│   ├── evaluator.js         # Auswertungslogik
│   ├── i18n.js              # Internationalisierung
│   ├── main.js              # Einstiegspunkt
│   ├── scenarios.js         # Szenarien-Modul
│   ├── styles.css           # Styling
│   └── ui.js                # UI-Rendering
├── index.html               # HTML-Template
├── package.json
├── vite.config.js
├── Dockerfile               # Multi-stage Docker Build
├── docker-entrypoint.sh     # Container Entrypoint (Config Generation)
├── nginx.conf               # nginx Konfiguration
└── deploy-production.sh     # Deployment Script
```

## Szenarien erweitern

Neue Szenarien werden in `src/data/scenarios.json` hinzugefügt:

```json
{
  "id": "unique_id",
  "title": { "de": "Titel DE", "en": "Title EN" },
  "situation": { "de": "Beschreibung...", "en": "Description..." },
  "band": "40m",
  "time": "afternoon",
  "distance": "medium",
  "antenna": "dipole",
  "power": { "de": "100 Watt", "en": "100 Watts" },
  "symptoms": ["no_response", "weak_signals"],
  "causeMappings": {
    "skip_zone": "very_likely",
    "d_layer": "likely",
    "antenna_mismatch": "possible",
    "qrm": "unlikely"
  },
  "ahaHint": { "de": "Erklärung...", "en": "Explanation..." },
  "difficulty": "beginner"
}
```

## Deployment

### Mit Docker

```bash
docker build -t cqnothing .
docker run -d -p 3010:80 cqnothing
```

### Mit Parent Site Branding

Das Tool kann für verschiedene Parent Sites konfiguriert werden, ohne neu gebaut zu werden:

```bash
docker run -d -p 3010:80 \
  -e PARENT_SITE_URL="https://oeradio.at" \
  -e PARENT_SITE_LOGO="https://oeradio.at/logo.png" \
  -e PARENT_SITE_NAME="OERadio" \
  cqnothing
```

**Umgebungsvariablen:**
- `PARENT_SITE_URL` – Link-Ziel für Logo und Footer
- `PARENT_SITE_LOGO` – URL zum Logo-Bild (optional, wenn leer wird kein Logo angezeigt)
- `PARENT_SITE_NAME` – Anzeigename im Footer ("Teil der {Name} Tools")

Die Konfiguration kann auch direkt in `public/config.json` geändert werden.

### Auf Synology NAS

1. `.env.production` aus `.env.production.example` erstellen
2. `./deploy-production.sh` ausführen

## Technologien

- **Vite** – Build-Tool
- **Vanilla JS** – Kein Framework, pure ES Modules
- **CSS Custom Properties** – Design Tokens
- **nginx** – Production Server
- **Docker** – Containerisierung
- **Cloudflare Tunnel** – HTTPS/CDN

## Lizenz

MIT

## Autor

Michael Linder, OE8YML
https://oeradio.at
