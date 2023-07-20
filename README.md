# Test project 
quasar met electron-updater, autoupdates, 
build actions
autoupates downloadblijkt alleen verschil in versies te downloaden :)

## Vooraf
### Node.js
installeer laatste versie LTS van [node.js](https://nodejs.org/en) (default waarden)
- 18.16.1 LTS op dit moment

## Maak een nieuw Quasar Project
[quick start](https://quasar.dev/start/quick-start)

### install Quasar CLI (global)
in vs-code terminal
```bash
npm install -g @quasar/cli
```

### Creer project
in vscode terminal, in rootmap waar submap `quasar-electron-action-update` in komt te staan.
```bash
npm init quasar
```
- What would you like to build? --> App with Quasar CLI, let's go! 
- Project folder: --> quasar-electron-action-update
- Pick Quasar version: --> Quasar v2 (Vue 3 | latest and greatest)
- Pick script type: --> Javascript
- Pick Quasar App CLI variant: --> Quasar App CLI with Vite
- Package name: --> quasar-electron-action-update
- Project product name: (must start with letter if building mobile apps) --> Test project Quasar, Electron, actions
- Project description: --> Quasar, electron, action build met autoupdate test
- Author: --> J76F
- Pick your CSS preprocessor: --> Sass with SCSS syntax
- Check the features needed for your project: --> 
  (*)   ESLint - recommended
  ( )   State Management (Pinia)
  ( )   State Management (Vuex) [DEPRECATED by Vue Team]
  ( )   Axios
  ( )   Vue-i18n
- Pick an ESLint preset: --> Standard
- Install project dependencies? (recommended) --> Yes, use npm

### Start project
```bash
cd quasar-electron-action-update
quasar dev # http://localhost:9000/
```

### maak een nieuwe reprositonies aan
- in github aanmaken --> https://github.com/J76F/quasar-electron-action-update

### Comment to Github
```bash
git init
git add -A
git commit -m "Init Quasar test project"
git branch -M main
git remote add origin https://github.com/J76F/quasar-electron-action-update.git
git push -u origin main
```
Of maak kopieeer de documenten in een geclonede branch (wanneer je in de bestaande de documenten vervangt worden ook de .git map vervangen)

## Aanpassen Project
### Edit Quasar Configuration
Open `quasar.conf.js` and maak de volgende veranderingen tot de `electron` opties object:

-   Vervang `'packager'` met `'builder'` als de waarde vn de `builder` eigenschap (--> `electron-builder` to build the app).
-   In the configuration object for the `builder` property, add the following lines:

```js
win: {
  target: [
    {
      target: 'nsis',
      arch: ['x64']
    }
  ]
},
publish: {
  provider: 'github'
}
```
Open `package.json` en voeg toe 
```json
  "repository": "github:J76F/quasar-electron-action-update",
```

Now create a test build for the app.
This will also enable Electron mode for the project, adding Electron-specific dependencies and source code.

```bash
quasar build -m electron
```

### Add Automatic Updates

Install `electron-updater` as an app dependency.

```bash
npm install electron-updater --save
```

Open `src-electron/electron-main.js` and make the following changes:

```js
// Add the following line near the top of the file
import { autoUpdater } from 'electron-updater'

// Replace this line ...
app.whenReady().then(createWindow)
// ... with this code
app.whenReady().then(() => {
  createWindow()
  autoUpdater.checkForUpdatesAndNotify()
})
```

Eventueel add log tijdelijk voor debug naast de autoupdater:
log bestand wordt geplaatst onder `%USERPROFILE%\AppData\Roaming\{app name}\logs\main.log`
```bash
npm install electron-updater --save
npm install electron-log --save
```
Open `src-electron/electron-main.js` and make the following changes:

```js
// Add the following line near the top of the file
import { autoUpdater } from 'electron-updater'

// Replace this line ...
app.whenReady().then(createWindow)
// ... with this code
app.whenReady().then(() => {
  createWindow()
  autoUpdater.logger = require('electron-log')
  autoUpdater.logger.transports.file.level = 'info' // debug
  autoUpdater.checkForUpdatesAndNotify()
})
```

### Configure GitHub Actions

#### From Quasar

Add the following scripts to `package.json`:

```json
"electron:build": "quasar build -m electron -P never",
"electron:release": "quasar build -m electron -P always",
```

Create a new file in `.github/workflows/main.yml` with the following code:

```yml
name: build

on:
  push:
    branches:
      - main
      - dev
  pull_request:
    branches:
      - dev

jobs:
  build:
    runs-on: ${{ matrix.os }}
    permissions:
      contents: write
    strategy:
      matrix:
        os:
          - windows-latest
      max-parallel: 1
      fail-fast: false
    steps:
      - name: Clone repository
        uses: actions/checkout@v3
      - name: Setup Node
        uses: actions/setup-node@v3
        with:
          node-version: 18.x # use the latest LTS version of Node
      - name: Install dependencies
        run: npm ci
      - name: Build app
        if: github.ref != 'refs/heads/main'
        run: npm run electron:build
      - name: Build & deploy app
        if: github.ref == 'refs/heads/main'
        env:
          GH_TOKEN: ${{ secrets.GITHUB_TOKEN }}
        run: npm run electron:release
```

--------------------
https://docs.github.com/en/actions/publishing-packages/publishing-nodejs-packages
#### Authenticating to the destination repository
To perform authenticated operations against the GitHub Packages registry in your workflow, you can use the `GITHUB_TOKEN`. The `GITHUB_TOKEN` secret is set to an access token for the repository each time a job in a workflow begins. You should set the permissions for this access token in the workflow file to grant read access for the contents scope and write access for the packages scope. For more information, see ["Automatic token authentication."](https://docs.github.com/en/actions/security-guides/automatic-token-authentication)

Voor releases --> alleen `permissions: contents: write` is nodig

----------------

## Continuous Workflow Github Actions

Na bovenstaande stappen, GitHub Actions automatisch build de app; 
- bij elke push van nieuwe commits naar de `main` & `dev` branch
- bij elke pull request naar de  `dev` branch.
- bij elke push van nieuwe commits naar de `main` branch, GitHub Actions upload de artifacts/bestanden ook naar GitHub Releases, als een draft.
(opmerking Quasar Publisch gebeurt niet wanneer het versienummer niet is opgehoogt tov een bestaande release:
voorbeeld uit log: `GitHub release not created  reason=existing type not compatible with publishing type tag=v1.0.1 version=1.0.1 existingType=release publishingType=draft`)

## plaat in toolbar de versie van de app ter info
open ./src/layouts/MainLayout.vue
vervang: 
```vue
        <q-toolbar-title>
          Quasar Test App
        </q-toolbar-title>

        <div>Quasar v{{ $q.version }}</div>

        ....
        <script>

        ...
          setup () {
          const leftDrawerOpen = ref(false)

          return {
            essentialLinks: linksList,
            leftDrawerOpen,
            toggleLeftDrawer () {
              leftDrawerOpen.value = !leftDrawerOpen.value
            }
          }
        }
```
door:
```vue
        <q-toolbar-title>
          Quasar Test App
        </q-toolbar-title>
        <div>App v{{ version }}</div>
        <q-space />
        <div>Quasar v{{ $q.version }}</div>

        ....
        <script>
        import PACKAGE from '../../package.json'

        ...
          setup () {
          const leftDrawerOpen = ref(false)

          return {
            essentialLinks: linksList,
            leftDrawerOpen,
            toggleLeftDrawer () {
              leftDrawerOpen.value = !leftDrawerOpen.value
            },
            version: PACKAGE.version
          }
        }
```

------
## bovenstaand doet de update op de achtergrond en geeft de notificatie via een windows popup in het notivicatie centrum.
Om de onderdelen naar de app te krijgen bewerk onderstaande:

toevoegen aan .\src-electron\electron-main.js
```js
/* New Update Available */
autoUpdater.on('error', (error) => {
  console.log(error)
  mainWindow.webContents.send('autoUpdateMessage', 'Updates controle app fout, probeer het later opnieuw')
})

autoUpdater.on('checking-for-update', () => {
  mainWindow.webContents.send('autoUpdateMessage', 'Controle op app updates...')
})

autoUpdater.on('update-not-available', (info) => {
  mainWindow.webContents.send('autoUpdateMessage', 'Geen updates beschikbaar')
})

autoUpdater.on('update-available', (info) => {
  mainWindow.webContents.send('autoUpdateMessage', `Update versie ${info.version} beschikbaar`)
  mainWindow.webContents.send('autoUpdateDownload', 1, 'downloading')
})

autoUpdater.on('download-progress', (progressObj) => {
  const message = (`Download speed: ${(progressObj.bytesPerSecond / 1028576).toFixed(2)} Mb/sec (${(progressObj.transferred / 1028576).toFixed(2)}/${(progressObj.total / 1028576).toFixed(2)} Mb)`)
  mainWindow.webContents.send('autoUpdateDownload', progressObj.percent, message)
})

autoUpdater.on('update-downloaded', (info) => {
  const message = `Versie ${info.version} gedownload, wordt na afsluiten geinstalleerd.`
  mainWindow.webContents.send('autoUpdateMessage', message)
  mainWindow.webContents.send('autoUpdateDownload', 100, message)
})
```
toevoegen aan .\src-electron\electron-preload.js
```js
import { contextBridge, ipcRenderer } from 'electron'

// Expose methods defined in electron-main.js
contextBridge.exposeInMainWorld('electron', {
  onAutoUpdateMessage: (message) => ipcRenderer.on('autoUpdateMessage', message),
  onAutoUpdateDownload: (percent, message) => ipcRenderer.on('autoUpdateDownload', percent, message)
})
```
toevoegen aan .\src\layouts\MainLayout.vue
```
/* in template */
        <div>{{ autoUpdateMessage }}</div>
        <q-circular-progress
          v-if="autoUpdateDownloadPercent"
          :indeterminate="indeterminateProgress"
          :show-value="!indeterminateProgress"
          font-size="12px"
          :value="autoUpdateDownloadPercent"
          size="50px"
          :thickness="0.22"
          color="teal"
          track-color="grey-3"
          class="q-ma-md"
        >
          {{ autoUpdateDownloadPercent }}%
          <q-tooltip>
            {{ autoUpdateDownloadMessage }}
          </q-tooltip>
        </q-circular-progress>
        <q-space />
/* onder script */
  data () {
    return {
      autoUpdateMessage: '',
      autoUpdateDownloadMessage: '',
      autoUpdateDownloadPercent: 0
    }
  },
  computed: {
    indeterminateProgress () {
      return this.autoUpdateDownloadMessage === 'downloading'
    }
  },
/* onder script */
  created () {
    if (this.$q.platform.is.electron) {
      window.electron.onAutoUpdateMessage((event, message) => {
        this.autoUpdateMessage = message
      })
      window.electron.onAutoUpdateDownload((event, percent, message) => {
        this.autoUpdateDownloadMessage = message
        this.autoUpdateDownloadPercent = Math.round(percent)
      })
    }
  }
```
## om installatie niet uit te voeren bij afsluiten:
voeg toe

toevoegen aan .\src-electron\electron-main.js
```js
autoUpdater.autoInstallOnAppQuit = false  // default = true
```

## Standaard wordt het in de achtergrond geinstallerd.
om op de voorgrond te installeren voeg onderstaande toe; na installatie wordt dan app weeropgestart (onduidelijk hoe dit te voorkomen.)

toevoegen aan .\src-electron\electron-main.js
```js
let autoUpdaterDownloaded = false
...
  mainWindow.on('closed', () => {
    mainWindow = null
    if (autoUpdaterDownloaded) autoUpdater.quitAndInstall(false, false) //<-- toevoegen
  })
...
autoUpdater.on('update-downloaded', (info) => {
  autoUpdaterDownloaded = true // <-- toevoegen
  const message = `Versie ${info.version} gedownload, wordt na afsluiten geinstalleerd.`
  mainWindow.webContents.send('autoUpdateMessage', message)
  mainWindow.webContents.send('autoUpdateDownload', 100, message)
})
```

zet de start checken eventeel op moment dat mainwindows geladen is zodat de eerste meldingen ook naar render deel gestuurd kunnen worden:
```js
// vervang
  autoUpdater.checkForUpdatesAndNotify()
//door
  mainWindow.on('ready-to-show', () => {
    autoUpdater.checkForUpdatesAndNotify()
  })
```
