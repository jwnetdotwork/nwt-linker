# NWT Linker

NWT Linker é um plugin comunitário do Obsidian que transforma referências bíblicas em links que abrem a Tradução do Novo Mundo no JW Library ou em jw.org.

Digite o nome de um livro bíblico e a referência de capítulo/versículo em uma nota, e o plugin converte em um link que abre a passagem correspondente na Tradução do Novo Mundo.

## Recursos

- Cria links de referências bíblicas automaticamente enquanto você digita
- Gera links do jw.org para a Tradução do Novo Mundo
- Abre o JW Library quando disponível; caso contrário, usa o jw.org
- Suporta aliases configuráveis para nomes de livros
- Carrega aliases de nomes de livros a partir de predefinições de WT Locale
- Adicione, edite, exclua, importe e exporte aliases como JSON
- Indica se os aliases foram carregados de uma predefinição ou editados manualmente
- Permite configurar o locale, a publicação e o modelo de URL
- Usa um breve atraso após você parar de digitar, para não atrapalhar a edição

## Uso

Insira uma referência bíblica assim:

```text
Tito1:14
```

Ela será convertida em um link como este:

```md
[Tito 1:14](https://www.jw.org/finder?srcid=jwlshare&wtlocale=T&prefer=lang&bible=56001014&pub=nwtsty)
```

Também funciona quando há um espaço entre o nome do livro e o capítulo:

```text
Tito 1:14
```

## Aliases de nomes de livros

Você pode definir aliases para cada livro bíblico. Os aliases são carregados a partir de predefinições baseadas na sua configuração de **WT Locale**.

Por exemplo, a predefinição em português do Brasil (`T`) inclui aliases como:

- `Gênesis`, `Gên` → Gênesis
- `Salmos`, `Sal` → Salmos
- `Tito`, `Tit` → Tito
- `João`, `Jo` → João

Isso permite converter referências usando a abreviação que você já prefere.

Em **Book name aliases** nas configurações, você pode:

- Adicionar aliases
- Alterar o número do livro associado a um alias existente
- Excluir aliases
- Importar ou exportar aliases como JSON
- **Load aliases for current WT Locale**: Substitui os aliases atuais pela predefinição que corresponde à sua configuração de WT Locale (por exemplo, `T — português`).

### Aliases personalizados e recarregamento de predefinições

Quando você adiciona, edita, exclui ou importa aliases, a lista entra no estado **custom**. A tela de configurações mostra se a lista atual foi carregada de uma predefinição ou editada manualmente.

Se você estiver no estado custom e escolher **Load aliases for current WT Locale**, uma caixa de diálogo de confirmação será exibida para que você não sobrescreva seus aliases personalizados acidentalmente. Se a predefinição do locale atual já estiver carregada, ela será recarregada imediatamente.

### Solicitar uma nova predefinição de locale

Se você precisar de suporte para um WT Locale que ainda não está incluído, abra uma issue ou pull request no [GitHub](https://github.com/jwnetdotwork/nwt-linker).

## Configurações

Você pode ajustar as seguintes opções na tela de configurações:

- Ativar ou desativar a conversão
- Atraso antes da conversão após parar de digitar
- Locale da publicação a ser aberta
- Publicação a ser aberta
- Modelo de URL

Se você usar outro WT Locale, altere a configuração de locale para corresponder ao seu idioma.

## Instalação

### Instalação manual

1. Abra a página de [Releases no GitHub](https://github.com/jwnetdotwork/nwt-linker/releases) e baixe `main.js` e `manifest.json` da versão mais recente.
2. Coloque esses dois arquivos na seguinte pasta do seu vault:

```text
<Vault>/.obsidian/plugins/nwt-linker/
```

3. Recarregue o Obsidian e ative o NWT Linker em **Configurações → Plugins da comunidade**.

## Observações

- Predefinições de WT Locale compatíveis:
  - Japonês (`J`)
  - Inglês (`E`)
  - Espanhol (`S`)
  - Chinês mandarim tradicional (`CH`)
  - Chinês mandarim simplificado (`CHS`)
  - Português do Brasil (`T`)
  - Francês (`F`)
  - Alemão (`X`)
  - Coreano (`KO`)
  - Italiano (`I`)
  - Russo (`U`)
- Se não houver uma predefinição para o WT Locale configurado, o plugin usará a predefinição em japonês (`J`) na primeira configuração.
- Este é um plugin comunitário do Obsidian.
- Funciona offline por padrão.
- Segue as regras de uso do jw.org e não faz scraping de conteúdo.
- A conversão de referências acontece inteiramente dentro das suas notas.
- Como encontrar seu WT Locale
  - Crie um link para compartilhar no seu idioma e procure pelo parâmetro `wtlocale=`. As letras maiúsculas após ele são o seu WT Locale.
  - Exemplo: Em `https://www.jw.org/finder?srcid=jwlshare&wtlocale=T&prefer=lang&bible=40024045&pub=nwtsty`, o WT Locale é `T`.
