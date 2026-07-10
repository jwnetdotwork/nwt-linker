# NWT Linker

NWT Linker es un plugin comunitario para Obsidian que convierte referencias bíblicas en enlaces que abren la Traducción del Nuevo Mundo en JW Library o en jw.org.

Escribe el nombre de un libro bíblico y la referencia de capítulo/versículo en una nota, y el plugin la convierte en un enlace que abre el pasaje correspondiente en la Traducción del Nuevo Mundo.

## Características

- Enlaza referencias bíblicas automáticamente mientras escribes
- Genera enlaces de jw.org para la Traducción del Nuevo Mundo
- Abre JW Library cuando está disponible; de lo contrario, usa jw.org
- Admite alias configurables para los nombres de los libros
- Carga alias de nombres de libros desde los ajustes predefinidos de WT Locale
- Agrega, edita, elimina, importa y exporta alias como JSON
- Indica si los alias provienen de un ajuste predefinido o fueron editados manualmente
- Permite configurar el locale, la publicación y la plantilla de URL
- Usa un breve retraso después de que dejas de escribir, para no interrumpir la edición

## Uso

Introduce una referencia bíblica así:

```text
Tito1:14
```

Se convertirá en un enlace como este:

```md
[Tito 1:14](https://www.jw.org/finder?srcid=jwlshare&wtlocale=S&prefer=lang&bible=56001014&pub=nwtsty)
```

También funciona si hay un espacio entre el nombre del libro y el capítulo:

```text
Tito 1:14
```

## Alias de nombres de libros

Puedes definir alias para cada libro bíblico. Los alias se cargan desde ajustes predefinidos basados en tu configuración de **WT Locale**.

Por ejemplo, el ajuste predefinido en español (`S`) incluye alias como:

- `Génesis`, `Gén` → Génesis
- `Salmos`, `Sal` → Salmos
- `Tito`, `Tit` → Tito
- `Juan`, `Jn` → Juan

Esto te permite convertir referencias usando la abreviatura que prefieras.

Desde **Book name aliases** en la configuración, puedes:

- Agregar alias
- Cambiar el número de libro asociado a un alias existente
- Eliminar alias
- Importar o exportar alias como JSON
- **Load aliases for current WT Locale**: Reemplaza los alias actuales por los del ajuste predefinido que coincida con tu configuración de WT Locale (por ejemplo, `S — español`).

### Alias personalizados y recarga de ajustes predefinidos

Cuando agregas, editas, eliminas o importas alias, la lista pasa al estado **custom**. La pantalla de configuración muestra si la lista actual proviene de un ajuste predefinido o fue editada manualmente.

Si estás en estado custom y eliges **Load aliases for current WT Locale**, aparecerá un diálogo de confirmación para evitar que sobrescribas tus alias personalizados accidentalmente. Si el ajuste predefinido del locale actual ya está cargado, se recargará inmediatamente.

### Solicitar un nuevo ajuste predefinido de locale

Si necesitas soporte para un WT Locale que aún no está incluido, abre un issue o pull request en [GitHub](https://github.com/jwnetdotwork/nwt-linker).

## Configuración

Puedes ajustar las siguientes opciones en la pantalla de configuración:

- Habilitar o deshabilitar la conversión
- Retraso antes de la conversión después de dejar de escribir
- Locale de la publicación a abrir
- Publicación a abrir
- Plantilla de URL

Si usas otro WT Locale, cambia la configuración de locale para que coincida con tu idioma.

## Instalación

### Instalación manual

1. Abre la página de [Releases en GitHub](https://github.com/jwnetdotwork/nwt-linker/releases) y descarga `main.js` y `manifest.json` de la última versión.
2. Coloca esos dos archivos en la siguiente carpeta de tu vault:

```text
<Vault>/.obsidian/plugins/nwt-linker/
```

3. Recarga Obsidian y habilita NWT Linker desde **Configuración → Complementos de la comunidad**.

## Notas

- Ajustes predefinidos de WT Locale compatibles:
  - Japonés (`J`)
  - Inglés (`E`)
  - Español (`S`)
  - Chino mandarín tradicional (`CH`)
  - Chino mandarín simplificado (`CHS`)
  - Portugués de Brasil (`T`)
  - Francés (`F`)
  - Alemán (`X`)
  - Coreano (`KO`)
  - Italiano (`I`)
  - Ruso (`U`)
- Si no existe un ajuste predefinido para el WT Locale configurado, el plugin usa el ajuste predefinido en japonés (`J`) en la configuración inicial.
- Este es un plugin comunitario de Obsidian.
- Funciona sin conexión de forma predeterminada.
- Sigue las reglas de uso de jw.org y no extrae contenido.
- La conversión de referencias ocurre completamente dentro de tus notas.
- Cómo encontrar tu WT Locale
  - Crea un enlace para compartir en tu idioma y busca el parámetro `wtlocale=`. Las letras mayúsculas que siguen son tu WT Locale.
  - Ejemplo: En `https://www.jw.org/finder?srcid=jwlshare&wtlocale=S&prefer=lang&bible=40024045&pub=nwtsty`, el WT Locale es `S`.
