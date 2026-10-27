# Calisthenics Pro – App-Dateien

Hier liegen alle Dateien, die auf GitHub hochgeladen werden müssen.

## Ordnerstruktur (vollständig)

```
calisthenics-app/
├── index.html          ← MUSST DU SELBST HINEINKOPIEREN (deine App-Datei)
├── manifest.json       ✅ fertig
├── sw.js               ✅ fertig
├── head-snippet.html   ← Nur Referenz, NICHT hochladen
└── icons/
    ├── icon-192.png    ← MUSST DU SELBST ERSTELLEN (siehe unten)
    └── icon-512.png    ← MUSST DU SELBST ERSTELLEN (siehe unten)
```

## Was du noch tun musst (in dieser Reihenfolge)

### Schritt 1: index.html hier hereinkopieren
- Deine Calisthenics Tracker HTML-Datei (calisthenics_tracker_app.html)
- Umbenennen zu: index.html
- In diesen Ordner legen

### Schritt 2: PWA-Block in index.html einfügen
- head-snippet.html öffnen
- Den Inhalt kopieren
- In deine index.html einfügen: direkt nach dem <meta name="viewport"> Tag

### Schritt 3: Icons erstellen
1. Gehe auf: https://realfavicongenerator.net
2. Lade ein beliebiges Bild hoch (oder nimm ein einfaches grünes Bild)
3. Scrolle runter zu "Favicon Generator Options" und lade alle Größen herunter
4. Benenne die Dateien um: icon-192.png und icon-512.png
5. Lege sie in den icons/ Ordner

### Schritt 4: Auf GitHub hochladen
Alle Dateien außer head-snippet.html hochladen:
- index.html
- manifest.json
- sw.js
- icons/icon-192.png
- icons/icon-512.png

## Was wurde am Code gegenüber Geminis Version geändert?

### Fehler 1 behoben: CDN-URLs aus Service Worker entfernt (KRITISCH)
Gemini hatte Tailwind, Google Fonts und FontAwesome in ASSETS_TO_CACHE.
Das bricht die Service Worker Installation komplett, weil addAll() abbricht
wenn auch nur ein einziger Request scheitert – und externe CDN-URLs
scheitern oft beim Erstinstall (CORS, Offline).
Fix: Nur lokale Dateien (./, ./index.html, ./manifest.json) vorgeladen.
CDN-Ressourcen werden automatisch beim ersten Laden dynamisch gecacht.

### Fehler 2 behoben: start_url und Pfade relativ gemacht
Geminis Version hatte start_url: "/index.html" (absolut).
Auf GitHub Pages liegt die App nicht im Root, sondern unter einem Unterpfad
(z. B. /calisthenics-tracker/). Absoluter Pfad / wäre dann falsch.
Fix: "./index.html" und "./" überall – funktioniert auf jedem Hosting.
