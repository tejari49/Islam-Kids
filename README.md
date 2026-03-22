# IslamKids

IslamKids ist eine kleine React-/Vite-App für Kinder mit Duas, Hadithen und Geschichten.

## Entwicklung starten

```bash
npm install
npm run dev
```

## Produktions-Build lokal prüfen

```bash
npm run build
npm run preview
```

## Wichtig: Nicht per Doppelklick öffnen

Öffne `index.html` oder `dist/index.html` **nicht** direkt über `file://` (z. B. per Doppelklick im Dateimanager).

Der Browser blockiert bei Vite-Apps in diesem Fall die JavaScript-Module, wodurch die Seite leer bleiben kann.

Nutze stattdessen immer einen Webserver, zum Beispiel:

```bash
npm run dev
```

oder für den Build-Ordner:

```bash
npx serve dist
```
