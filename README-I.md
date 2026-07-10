# NWT Linker

NWT Linker è un plugin community per Obsidian che trasforma i riferimenti biblici in link che aprono la Traduzione del Nuovo Mondo in JW Library o su jw.org.

Digita il nome di un libro biblico e il riferimento capitolo/versetto in una nota, e il plugin lo converte in un link che apre il passaggio corrispondente nella Traduzione del Nuovo Mondo.

## Funzionalità

- Crea automaticamente link ai riferimenti biblici mentre scrivi
- Genera link jw.org per la Traduzione del Nuovo Mondo
- Apre JW Library se disponibile, altrimenti utilizza jw.org
- Supporta alias configurabili per i nomi dei libri
- Carica gli alias dei nomi dei libri dai preset di WT Locale
- Aggiungi, modifica, elimina, importa ed esporta alias come JSON
- Tiene traccia se gli alias sono caricati da un preset o modificati manualmente
- Permette di configurare locale, pubblicazione e modello URL
- Usa una breve pausa dopo che smetti di scrivere, per non disturbare la modifica

## Utilizzo

Inserisci un riferimento biblico in questo modo:

```text
Tito1:14
```

Verrà convertito in un link come questo:

```md
[Tito 1:14](https://www.jw.org/finder?srcid=jwlshare&wtlocale=I&prefer=lang&bible=56001014&pub=nwtsty)
```

Funziona anche quando c'è uno spazio tra il nome del libro e il capitolo:

```text
Tito 1:14
```

## Alias dei nomi dei libri

Puoi definire alias per ogni libro biblico. Gli alias vengono caricati dai preset in base all'impostazione del tuo **WT Locale**.

Ad esempio, il preset italiano (`I`) include alias come:

- `Genesi`, `Gn` → Genesi
- `Salmi`, `Sal` → Salmi
- `Tito`, `Tit` → Tito
- `Giovanni`, `Gv` → Giovanni

In questo modo puoi convertire i riferimenti usando le abbreviazioni che preferisci.

Da **Book name aliases** nelle impostazioni, puoi:

- Aggiungere alias
- Modificare il numero del libro associato a un alias esistente
- Eliminare alias
- Importare o esportare alias come JSON
- **Load aliases for current WT Locale**: Sostituisce gli alias attuali con il preset che corrisponde all'impostazione del tuo WT Locale (ad esempio, `I — italiano`).

### Alias personalizzati e ricarica dei preset

Quando aggiungi, modifichi, elimini o importi alias, l'elenco passa allo stato **custom**. La schermata delle impostazioni mostra se l'elenco attuale è caricato da un preset o modificato manualmente.

Se sei in stato custom e scegli **Load aliases for current WT Locale**, appare una finestra di conferma per evitare di sovrascrivere accidentalmente i tuoi alias personalizzati. Se il preset per il locale attuale è già caricato, verrà ricaricato immediatamente.

### Richiedere un nuovo preset di locale

Se hai bisogno del supporto per un WT Locale non ancora incluso, apri una issue o una pull request su [GitHub](https://github.com/jwnetdotwork/nwt-linker).

## Impostazioni

Puoi regolare le seguenti opzioni nella schermata delle impostazioni:

- Abilitare o disabilitare la conversione
- Ritardo prima della conversione dopo aver smesso di scrivere
- Locale della pubblicazione da aprire
- Pubblicazione da aprire
- Modello URL

Se utilizzi un WT Locale diverso, modifica l'impostazione del locale in modo che corrisponda alla tua lingua.

## Installazione

### Installazione manuale

1. Apri la pagina [Releases su GitHub](https://github.com/jwnetdotwork/nwt-linker/releases) e scarica `main.js` e `manifest.json` dall'ultima release.
2. Posiziona questi due file nella seguente cartella del tuo vault:

```text
<Vault>/.obsidian/plugins/obsidian-nwt-linker/
```

3. Ricarica Obsidian e abilita NWT Linker da **Impostazioni → Plugin della community**.

## Note

- Preset WT Locale supportati:
  - Giapponese (`J`)
  - Inglese (`E`)
  - Spagnolo (`S`)
  - Cinese mandarino tradizionale (`CH`)
  - Cinese mandarino semplificato (`CHS`)
  - Portoghese brasiliano (`T`)
  - Francese (`F`)
  - Tedesco (`X`)
  - Coreano (`KO`)
  - Italiano (`I`)
  - Russo (`U`)
- Se non esiste un preset per il WT Locale configurato, il plugin utilizza il preset giapponese (`J`) alla prima configurazione.
- Questo è un plugin community per Obsidian.
- Funziona offline per impostazione predefinita.
- Rispetta le regole di utilizzo di jw.org e non esegue scraping.
- La conversione dei riferimenti avviene interamente all'interno delle tue note.
- Come trovare il tuo WT Locale
  - Crea un link di condivisione nella tua lingua e cerca il parametro `wtlocale=`. Le lettere maiuscole che seguono sono il tuo WT Locale.
  - Esempio: In `https://www.jw.org/finder?srcid=jwlshare&wtlocale=I&prefer=lang&bible=40024045&pub=nwtsty`, il WT Locale è `I`.
