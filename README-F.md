# NWT Linker

NWT Linker est une extension communautaire pour Obsidian qui transforme les références bibliques en liens ouvrant la Traduction du Monde Nouveau dans JW Library ou sur jw.org.

Tapez un nom de livre biblique et une référence chapitre/verset dans une note, et l'extension la convertit en un lien qui ouvre le passage correspondant dans la Traduction du Monde Nouveau.

## Fonctionnalités

- Crée automatiquement des liens vers les références bibliques pendant la saisie
- Génère des liens jw.org pour la Traduction du Monde Nouveau
- Ouvre JW Library s'il est disponible, sinon utilise jw.org
- Prend en charge les alias configurables pour les noms de livres
- Charge les alias de noms de livres à partir des préréglages de WT Locale
- Ajoutez, modifiez, supprimez, importez et exportez des alias au format JSON
- Indique si les alias proviennent d'un préréglage ou ont été modifiés manuellement
- Permet de configurer le locale, la publication et le modèle d'URL
- Utilise un court délai après l'arrêt de la saisie pour ne pas gêner l'édition

## Utilisation

Saisissez une référence biblique comme ceci :

```text
Tite1:14
```

Elle sera convertie en un lien tel que :

```md
[Tite 1:14](https://www.jw.org/finder?srcid=jwlshare&wtlocale=F&prefer=lang&bible=56001014&pub=nwtsty)
```

Cela fonctionne également lorsqu'il y a un espace entre le nom du livre et le chapitre :

```text
Tite 1:14
```

## Alias de noms de livres

Vous pouvez définir des alias pour chaque livre biblique. Les alias sont chargés à partir de préréglages basés sur votre paramètre **WT Locale**.

Par exemple, le préréglage français (`F`) inclut des alias tels que :

- `Genèse`, `Gn` → Genèse
- `Psaumes`, `Ps` → Psaumes
- `Tite`, `Tite` → Tite
- `Jean`, `Jn` → Jean

Cela vous permet de convertir des références en utilisant l'abréviation que vous préférez.

Dans **Book name aliases** dans les paramètres, vous pouvez :

- Ajouter des alias
- Modifier le numéro de livre associé à un alias existant
- Supprimer des alias
- Importer ou exporter des alias au format JSON
- **Load aliases for current WT Locale** : Remplace les alias actuels par le préréglage correspondant à votre paramètre WT Locale (par exemple, `F — français`).

### Alias personnalisés et rechargement des préréglages

Lorsque vous ajoutez, modifiez, supprimez ou importez des alias, la liste passe à l'état **custom**. L'écran des paramètres indique si la liste actuelle est chargée à partir d'un préréglage ou modifiée manuellement.

Si vous êtes en état custom et que vous choisissez **Load aliases for current WT Locale**, une boîte de dialogue de confirmation apparaît pour éviter d'écraser vos alias personnalisés par accident. Si le préréglage du locale actuel est déjà chargé, il sera rechargé immédiatement.

### Demander un nouveau préréglage de locale

Si vous avez besoin de la prise en charge d'un WT Locale qui n'est pas encore inclus, veuillez ouvrir une issue ou une pull request sur [GitHub](https://github.com/jwnetdotwork/nwt-linker).

## Paramètres

Vous pouvez ajuster les options suivantes dans l'écran des paramètres :

- Activer ou désactiver la conversion
- Délai avant conversion après l'arrêt de la saisie
- Locale de la publication à ouvrir
- Publication à ouvrir
- Modèle d'URL

Si vous utilisez un autre WT Locale, modifiez le paramètre de locale pour qu'il corresponde à votre langue.

## Installation

### Installation manuelle

1. Ouvrez la page [Releases sur GitHub](https://github.com/jwnetdotwork/nwt-linker/releases) et téléchargez `main.js` et `manifest.json` de la dernière version.
2. Placez ces deux fichiers dans le dossier suivant de votre vault :

```text
<Vault>/.obsidian/plugins/obsidian-nwt-linker/
```

3. Rechargez Obsidian et activez NWT Linker dans **Paramètres → Plugins communautaires**.

## Notes

- Préréglages WT Locale pris en charge :
  - Japonais (`J`)
  - Anglais (`E`)
  - Espagnol (`S`)
  - Chinois mandarin traditionnel (`CH`)
  - Chinois mandarin simplifié (`CHS`)
  - Portugais du Brésil (`T`)
  - Français (`F`)
  - Allemand (`X`)
  - Coréen (`KO`)
  - Italien (`I`)
  - Russe (`U`)
- Si aucun préréglage n'existe pour le WT Locale configuré, l'extension utilise le préréglage japonais (`J`) lors de la première configuration.
- Il s'agit d'une extension communautaire pour Obsidian.
- Elle fonctionne hors ligne par défaut.
- Elle respecte les règles d'utilisation de jw.org et n'extrait pas de contenu.
- La conversion des références se fait entièrement dans vos notes.
- Comment trouver votre WT Locale
  - Créez un lien de partage dans votre langue et recherchez le paramètre `wtlocale=`. Les lettres majuscules qui suivent sont votre WT Locale.
  - Exemple : Dans `https://www.jw.org/finder?srcid=jwlshare&wtlocale=F&prefer=lang&bible=40024045&pub=nwtsty`, le WT Locale est `F`.
