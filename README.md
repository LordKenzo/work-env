## Avvio del Progetto

Creo il progetto con:

```
npm init -y
```

in questo modo mi creo il mio `package.json`. Il file mi serve principalmente per inserire `script` di avvio e `dipendenze`. Le dipendenze sono librerie che mi servono o solo in sviluppo (dette `devDependencies`) o anche in produzione (`dependencies`).

## Configurazione di ESLint Automatica

Dal [sito](https://eslint.org/docs/user-guide/getting-started) prendo i passi per installare ESLint e avere una prima configurazione:

```
npm install eslint --save-dev
npx eslint --init
```

Uso npx per avviare un comando presente in node_modules senza dover configurare uno script in packet.json. Questo comando mi porrà delle domande per installare ulteriori dipendenze. Ad esempio potrei avere bisogno di installare:

```
@typescript-eslint/eslint-plugin@latest eslint-config-airbnb-base@latest eslint@^5.16.0 || ^6.1.0 eslint-plugin-import@^2.18.2
@typescript-eslint/parser@latest
```

oppure:

```
@typescript-eslint/eslint-plugin@latest
@typescript-eslint/parser@latest
```

Il file creato può essere in 3 formati: YAML, JSON o JS. Scegli quello che preferisci.

## Configurazione di ESLint manuale

La configurazione manuale è preferibile perchè possiamo partire da una configurazione minima e piano piano inserire nuove informazioni.
Partiamo dal volere usare **TypeScript** e **Prettier**. Il vantaggio di avere Prettier configurato con ESLint, oltre ad evitare conflitti perchè entrambi tenteranno di apportare fix al codice, è che i fix verranno effettuati direttamente da ESLint tramite il `--fix` dello script che configurerò. Per quanto concerne Typescript le dipendenze che servono per far coesistere ESLint e TypeScript sono:

```
@typescript-eslint/parser
@typescript-eslint/eslint-plugin
```

Il primo è il parser che permette di effettuare Linter all'interno del codice TypeScript. Il secondo è un plugin che contiene regole per controllare codice TypeScript.

A queste si aggiungono le dipendenze TypeScript che ci permetteranno di transpilare codice JavaScript in codice TypeScript:

```
ts-loader
typescript
```

Creo il file di configurazione `tsconfig.json` per TypeScript:

```json
{
  "compilerOptions": {
    "outDir": "./dist/",
    "sourceMap": true,
    "noImplicitAny": true,
    "module": "commonjs",
    "target": "es5",
    "allowSyntheticDefaultImports": true,
    "lib": ["es2018", "dom"]
  }
}
```

Tutte queste saranno dipendenze di tipo `devDependencies` quindi installate con il flag `--save-dev` o con lo shortcut `-D`.

Ora passiamo alle dipendenze per Prettier:

```
prettier
eslint-config-prettier
eslint-plugin-prettier
```

Il primo è la core library di Prettier, la seconda dipendenza disabilita regole che possono entrare in conflitto con ESLint ed il terzo è un plugin che fa si che le regole di Prettier vengano eseguite come regole di ESLint.

Quindi installo il tutto con:

```
npm i -D @typescript-eslint/parser @typescript-eslint/eslint-plugin ts-loader typescript prettier eslint-config-prettier eslint-plugin-prettier
```

Se usassi **React**, la dipendenza ulteriore da aggiungere per farlo funzionare con TypeScript sarà: `eslint-plugin-react`.

Il file di base si chiama `.eslintrc.js` (in questo modo, a differenza di JSON, posso inserire commenti):

```js
// .eslintrc.js
module.exports = {
  parser: '@typescript-eslint/parser',
  extends: [
    'plugin:@typescript-eslint/recommended',
    // 'plugin:react/recommended',
    'prettier/@typescript-eslint',
    'plugin:prettier/recommended',
  ],
  parserOptions: {
    ecmaVersion: 2018,
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true,
    },
  },
  rules: {},
  settings: {
    /*react: {
      version: "detect"
    }*/
  },
};
```

Nella sezione `rules` ci vado a mettere le regole per ESLint e Prettier:

```
// 'no-console': 'off',
'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'off',
'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
'@typescript-eslint/explicit-function-return-type': 'off',
'@typescript-eslint/no-use-before-define': 'off',
quotes: [2, 'single', { avoidEscape: true, allowTemplateLiterals: true }],
```

Per usare Prettier ho bisogno di un suo file di configurazione `.prettierrc.js`:

```js
module.exports = {
  semi: true,
  trailingComma: 'all',
  bracketSpacing: true,
  singleQuote: true,
  printWidth: 80,
  tabWidth: 2,
};
```

Supponiamo di vole impallare il tutto. Diciamo che tramite ESLint configuro affinchè il mio codice usi le single quote e l'ho fatto con questa regola:

```
quotes: [2, 'single', { avoidEscape: true, allowTemplateLiterals: true }],
```

ora nelle regole inseriamo anche il warning per l'uso di single quote:

```
'prettier/prettier': [
    'warn',
        {
            singleQuote: false,
        },
    ],
```

A questo punto la string 'Asd' sarà invalida per 'prettier/prettier' che corretta in "Asd" non sarà valida per 'ESLint'.

Posso avere degli sovrascritture delle regole per determinate cartelle, mi basta inserire nel file `.eslintrc.js`:

```
overrides: [
    {
      files: ['test/*.spec.js', 'dist/**/*'], // Or *.test.js
      rules: {
        'no-var': 'off',
      },
    },
  ],
```

Ora nel file `settings.json` del progetto (quello creato in `.vscode`) inserisco:

```js
"editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
},
"eslint.validate": [
    "javascript",
    "javascriptreact",
    "typescript",
    "typescriptreact"
],
"editor.formatOnSave": true,
"[javascript]": {
    "editor.formatOnSave": false
},
"[javascriptreact]": {
    "editor.formatOnSave": false
},
"[typescript]": {
    "editor.formatOnSave": false
},
"[typescriptreact]": {
    "editor.formatOnSave": false
}
```

Mentre nel package.json lo script di lint può essere:

```js
"scripts": {
    "lint": "tsc --noEmit && eslint '*/**/*.{js,ts,tsx}' --quiet --fix"
  }
```

che avvio con `npm run lint` e magicamente mi sistema tutto ;)

Supponiamo di volere impostare una convenzione interna per cui i campi privati e protetti debbano seguire una nomenclatura specifica, posso aggiungere questo in `.eslintrc.js`:

```
"@typescript-eslint/member-naming": ["error", {
      "private": "^_",
      "protected": "^__"
    }]
```

In questo modo i campi privati devono iniziare con '\_' mentre i campi protetti con '\_\_'.

## Il file editorconfig

Questo file è utile per impostare dei settaggi comuni tra editor diversi soprattutto per far si di avere consistenza tra un team di sviluppatori. Creo il file `.editorconfig`:

```
[*]
end_of_line = lf
indent_size = 2
indent_style = space
trim_trailing_whitespace = true
```

## Il file eslitignore

Se ho necessita di specificare delle folder da ignorare creo il file `.eslintignore`.

## Il file gitignore

C'è poco da dire a che serve, copia e incolla nel file `.gitignore`:

```
# See http://help.github.com/ignore-files/ for more about ignoring files.

# compiled output
/dist
/tmp
/out-tsc

# dependencies
/node_modules
node_modules

# IDEs and editors
/.idea
.project
.classpath
.c9/
*.launch
.settings/
*.sublime-workspace

# IDE - VSCode
.vscode/*
!.vscode/settings.json
!.vscode/tasks.json
!.vscode/launch.json
!.vscode/extensions.json

# misc
/.sass-cache
/connect.lock
/coverage
/libpeerconnection.log
npm-debug.log
yarn-error.log
testem.log
/typings

# System Files
.DS_Store
Thumbs.db
```

## Avviare più comandi da script

Installare il package: `npm i -D concurrently` e avere uno script del tipo:

```json
"start": "tsc && concurrently \"npm run tsc:w\" \"npm run lite\"",
```
