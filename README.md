# Test project 
quasar met electron-updater, autoupdates, 
build actions

# Vooraf
## Node.js
installeer laatste versie LTS van node.js https://nodejs.org/en (default waarden)
- 18.16.1 LTS op dit moment

## maak een nieuwe reprositonies aan
- in github aanmaken
- clone in vs-code --> selecteer map, daarnoder wordt map aangemaakt met geclonede repro.
- open in nieuw window

# Maak een nieuw Quasar Project
https://quasar.dev/start/quick-start

## install Quasar CLI (global)
in vs-code terminal
`npm install -g @quasar/cli`

## Creer project
in vscode terminal, in project
`npm init quasar`
- Need to install the following packages: create-quasar@1.3.0, Ok to proceed? (y) --> y
- What would you like to build? --> App with Quasar CLI, let's go! 
- Project folder: --> . // we zitten reeds in projectmap
- Current directory is not empty. Remove existing files and continue? --> y
- Pick Quasar version: --> Quasar v2 (Vue 3 | latest and greatest)
- Pick script type: --> Javascript
- Pick Quasar App CLI variant: --> Quasar App CLI with Vite
- Package name: --> quasar-electron-action-update
- Project product name: (must start with letter if building mobile apps) --> quasar-electron-action-update
- Project description: --> Quasar, electron, action build met autoupdate test
- Author: --> J76F
- Pick your CSS preprocessor: --> Sass with SCSS syntax
- Check the features needed for your project: --> 
  (*)   ESLint - recommended
  ( )   State Management (Pinia)
  ( )   State Management (Vuex) [DEPRECATED by Vue Team]
  (*)   Axios
  ( )   Vue-i18n
- Pick an ESLint preset: --> Prettier - https://github.com/prettier/prettier
- Install project dependencies? (recommended) --> Yes, use npm

## Start project
`quasar dev` --> http://localhost:9000/

## Comment to Github
--> create quasar
