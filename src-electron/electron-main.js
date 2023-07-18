import { app, BrowserWindow, nativeTheme } from 'electron'
import { autoUpdater } from 'electron-updater'
import path from 'path'
import os from 'os'

// needed in case process is undefined under Linux
const platform = process.platform || os.platform()

try {
  if (platform === 'win32' && nativeTheme.shouldUseDarkColors === true) {
    require('fs').unlinkSync(path.join(app.getPath('userData'), 'DevTools Extensions'))
  }
} catch (_) { }

let mainWindow

function createWindow () {
  /**
   * Initial window options
   */
  mainWindow = new BrowserWindow({
    icon: path.resolve(__dirname, 'icons/icon.png'), // tray icon
    width: 1000,
    height: 600,
    useContentSize: true,
    webPreferences: {
      contextIsolation: true,
      // More info: https://v2.quasar.dev/quasar-cli-vite/developing-electron-apps/electron-preload-script
      preload: path.resolve(__dirname, process.env.QUASAR_ELECTRON_PRELOAD)
    }
  })

  mainWindow.loadURL(process.env.APP_URL)

  if (process.env.DEBUGGING) {
    // if on DEV or Production with debug enabled
    mainWindow.webContents.openDevTools()
  } else {
    // we're on production; no access to devtools pls
    mainWindow.webContents.on('devtools-opened', () => {
      mainWindow.webContents.closeDevTools()
    })
  }

  mainWindow.on('closed', () => {
    mainWindow = null
  })
}

app.whenReady().then(() => {
  createWindow()

  autoUpdater.logger = require('electron-log')
  autoUpdater.logger.transports.file.level = 'debug' // debug, info
  autoUpdater.isSilent = true
  autoUpdater.checkForUpdatesAndNotify()
})

app.on('window-all-closed', () => {
  if (platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow()
  }
})

/* Send message to main window */
function sendAutoUpdateMessage (message) {
  mainWindow.webContents.send('autoUpdateMessage', message)
}

/* New Update Available */
autoUpdater.on('error', (error) => {
  console.log(error)
  sendAutoUpdateMessage('Updates controle app fout, probeer het later opnieuw')
})

autoUpdater.on('checking-for-update', () => {
  sendAutoUpdateMessage('Controle op app updates...')
})

autoUpdater.on('update-not-available', (info) => {
  sendAutoUpdateMessage('Geen updates beschikbaar')
})

autoUpdater.on('update-available', (info) => {
  sendAutoUpdateMessage(`Update versie ${info.version} beschikbaar`)
  mainWindow.webContents.send('autoUpdateDownload', 1, 'downloading')
})

autoUpdater.on('download-progress', (progressObj) => {
  const message = (`Download speed: ${(progressObj.bytesPerSecond / 1028576).toFixed(2)} Mb/sec (${(progressObj.transferred / 1028576).toFixed(2)}/${(progressObj.total / 1028576).toFixed(2)} Mb)`)
  mainWindow.webContents.send('autoUpdateDownload', progressObj.percent, message)
})

autoUpdater.on('update-downloaded', (info) => {
  const message = `Versie ${info.version} gedownload, wordt na afsluiten geinstalleerd.`
  sendAutoUpdateMessage(message)
  mainWindow.webContents.send('autoUpdateDownload', 100, message)
})
