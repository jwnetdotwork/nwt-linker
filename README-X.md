# NWT Linker

NWT Linker ist ein Community-Plugin für Obsidian, das Bibelstellen in Links umwandelt, die die Neue-Welt-Übersetzung in JW Library oder auf jw.org öffnen.

Gib den Namen eines Bibelbuchs und eine Kapitel-/Versangabe in einer Notiz ein, und das Plugin wandelt sie in einen Link um, der die entsprechende Stelle in der Neue-Welt-Übersetzung öffnet.

## Funktionen

- Verlinkt Bibelstellen automatisch während der Eingabe
- Erzeugt jw.org-Links für die Neue-Welt-Übersetzung
- Öffnet JW Library, wenn verfügbar, andernfalls wird auf jw.org zurückgegriffen
- Unterstützt konfigurierbare Aliasse für Bibelbuchnamen
- Lädt Bibelbuch-Aliasse aus WT-Locale-Voreinstellungen
- Aliasse als JSON hinzufügen, bearbeiten, löschen, importieren und exportieren
- Zeigt an, ob Aliasse aus einer Voreinstellung geladen oder eigenständig bearbeitet wurden
- Ermöglicht die Konfiguration von Locale, Publikation und URL-Vorlage
- Wartet kurz nach Ende der Eingabe, um die Bearbeitung nicht zu stören

## Verwendung

Gib eine Bibelstelle wie folgt ein:

```text
Titus1:14
```

Sie wird in einen Link wie diesen umgewandelt:

```md
[Titus 1:14](https://www.jw.org/finder?srcid=jwlshare&wtlocale=X&prefer=lang&bible=56001014&pub=nwtsty)
```

Es funktioniert auch, wenn zwischen Buchname und Kapitel ein Leerzeichen steht:

```text
Titus 1:14
```

## Aliasse für Bibelbuchnamen

Du kannst für jedes Bibelbuch Aliasse definieren. Aliasse werden aus Voreinstellungen geladen, die auf deiner **WT Locale**-Einstellung basieren.

Die Voreinstellung für Deutsch (`X`) enthält beispielsweise Aliasse wie:

- `Genesis`, `Gen` → Genesis
- `Psalmen`, `Ps` → Psalmen
- `Titus`, `Tit` → Titus
- `Johannes`, `Joh` → Johannes

Damit kannst du Stellenangaben mit den Abkürzungen umwandeln, die du gewohnt bist.

Unter **Book name aliases** in den Einstellungen kannst du:

- Aliasse hinzufügen
- Die zugeordnete Buchnummer eines bestehenden Alias ändern
- Aliasse löschen
- Aliasse als JSON importieren oder exportieren
- **Load aliases for current WT Locale**: Ersetzt die aktuellen Aliasse durch die Voreinstellung, die zu deiner WT-Locale-Einstellung passt (z. B. `X — Deutsch`).

### Benutzerdefinierte Aliasse und Neuladen von Voreinstellungen

Wenn du Aliasse hinzufügst, bearbeitest, löschst oder importierst, wechselt die Alias-Liste in den Zustand **custom**. Im Einstellungsbildschirm wird angezeigt, ob die aktuelle Liste aus einer Voreinstellung geladen oder eigenständig bearbeitet wurde.

Befindest du dich im Zustand custom und wählst **Load aliases for current WT Locale**, erscheint ein Bestätigungsdialog, damit du deine benutzerdefinierten Aliasse nicht versehentlich überschreibst. Ist die Voreinstellung für das aktuelle Locale bereits geladen, wird sie sofort neu geladen.

### Anfrage einer neuen Locale-Voreinstellung

Wenn du Unterstützung für ein WT Locale benötigst, das noch nicht enthalten ist, eröffne bitte ein Issue oder einen Pull Request auf [GitHub](https://github.com/jwnetdotwork/nwt-linker).

## Einstellungen

Im Einstellungsbildschirm kannst du folgende Optionen anpassen:

- Konvertierung aktivieren oder deaktivieren
- Verzögerung vor der Konvertierung nach Ende der Eingabe
- Locale der zu öffnenden Publikation
- Zu öffnende Publikation
- URL-Vorlage

Wenn du ein anderes WT Locale verwendest, ändere die Locale-Einstellung entsprechend deiner Sprache.

## Installation

### Manuelle Installation

1. Öffne die [Releases-Seite auf GitHub](https://github.com/jwnetdotwork/nwt-linker/releases) und lade `main.js` und `manifest.json` aus dem neuesten Release herunter.
2. Lege diese beiden Dateien in den folgenden Ordner deines Vaults:

```text
<Vault>/.obsidian/plugins/obsidian-nwt-linker/
```

3. Lade Obsidian neu und aktiviere NWT Linker unter **Einstellungen → Community-Plugins**.

## Hinweise

- Unterstützte WT-Locale-Voreinstellungen:
  - Japanisch (`J`)
  - Englisch (`E`)
  - Spanisch (`S`)
  - Chinesisch Mandarin Traditionell (`CH`)
  - Chinesisch Mandarin Vereinfacht (`CHS`)
  - Portugiesisch Brasilien (`T`)
  - Französisch (`F`)
  - Deutsch (`X`)
  - Koreanisch (`KO`)
  - Italienisch (`I`)
  - Russisch (`U`)
- Wenn es für das konfigurierte WT Locale keine Voreinstellung gibt, fällt das Plugin bei der ersten Einrichtung auf die japanische Voreinstellung (`J`) zurück.
- Dies ist ein Community-Plugin für Obsidian.
- Es funktioniert standardmäßig offline.
- Es befolgt die Nutzungsregeln von jw.org und scrapt keine Inhalte.
- Die Umwandlung der Stellenangaben erfolgt vollständig innerhalb deiner Notizen.
- So findest du dein WT Locale
  - Erstelle einen Teilen-Link in deiner Sprache und suche nach dem Parameter `wtlocale=`. Die folgenden Großbuchstaben sind dein WT Locale.
  - Beispiel: In `https://www.jw.org/finder?srcid=jwlshare&wtlocale=X&prefer=lang&bible=40024045&pub=nwtsty` ist das WT Locale `X`.
