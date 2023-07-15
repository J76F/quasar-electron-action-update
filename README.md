# Test project 
quasar met electron-updater, autoupdates, 
build actions

# Vooraf
## Node.js
installeer laatste versie LTS van node.js https://nodejs.org/en (default waarden)
- 18.16.1 LTS op dit moment

# Maak een nieuw Quasar Project
https://quasar.dev/start/quick-start

## install Quasar CLI (global)
in vs-code terminal
`npm install -g @quasar/cli`

## Creer project
in vscode terminal, in rootmap waar submap `quasar-electron-action-update` in komt te staan.
`npm init quasar`
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

## Start project
`cd quasar-electron-action-update`
`quasar dev` --> http://localhost:9000/

## maak een nieuwe reprositonies aan
- in github aanmaken --> https://github.com/J76F/quasar-electron-action-update

## Comment to Github
git init
git add -A
git commit -m "Init Quasar test project"
git branch -M main
git remote add origin https://github.com/J76F/quasar-electron-action-update.git
git push -u origin main

Of maak kopieeer de documenten in een geclonede branch (wanneer je in de bestaande de documenten vervangt worden ook de .git map vervangen)

