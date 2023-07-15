# Test project 
quasar met electron-updater, autoupdates, 
build actions

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
  autoUpdater.checkForUpdatesAndNotify()
  createWindow()
})
```

### Configure GitHub Actions

#### From Quasar

Add the following scripts to `package.json`:

```json
"electron:build": "quasar build -m electron -P never",
"electron:release": "quasar build -m electron -P onTagOrDraft",
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

------------------ nog proberen --------------
#### From GitHub

1.  From your GitHub account settings, go to **Developer settings > Personal access tokens** and click **Generate new token**.
2.  Give the new token a name, but more importantly, check the `repo` box to enable repository access for the token.
    Then click **Generate token** and copy the value of the new token.
3.  From the project repository settings, go to **Secrets** and click **New repository secret**.
    Type `GH_TOKEN` into the name field, and paste the value of the personal access token into the value field, then click **Add secret**.

## Continuous Workflow

After the above steps are taken, GitHub Actions will automatically build the app for all platforms each time you push new commits to the repository (or a pull request targeting the `dev` branch is created).
If new commits are pushed to the `main` branch, GitHub Actions will also upload the artifacts to GitHub Releases where the app will be ready for publishing.

#### Recommended Steps

The following steps are taken from [the default `electron-builder` workflow](https://www.electron.build/configuration/publish#recommended-github-releases-workflow), but modified to accommodate Git branching development models such as [this one](https://nvie.com/posts/a-successful-git-branching-model/).

1.  [Draft a new release](https://help.github.com/articles/creating-releases/).
    Set the "Tag version" to some version after the current `version` in your application `package.json`, and prefix it with `v`.
    Make sure the tag targets the `main` branch.
    "Release title" can be anything you want.
2.  Push some commits to the `dev` branch.
    Each successful CI build confirms that the app can be compiled on all platforms.
3.  Create a release branch, add some commits that will prepare the app for release (e.g. increasing the `version` in `package.json`), then merge the release branch into `main`.
4.  Push the new commits to the `main` branch.
    Confirm that the artifacts from this CI build have been uploaded to the release draft.
4.  Add a description (preferably release notes) to the release, and publish the release.
5.  Merge the release branch back into `dev`, and delete the release branch.
