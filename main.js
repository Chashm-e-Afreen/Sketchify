// Modules to control application life and create native browser window
const {app, BrowserWindow} = require('electron')

const path = require('path')


function createWindow () {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: true
    }
  })

  // and load the index.html of the app.
  mainWindow.loadFile('index.html')

  // Open the DevTools.
  // mainWindow.webContents.openDevTools()

}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.

app.allowRendererProcessReuse = false;
app.whenReady().then(() => {
  createWindow()
  
  app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
} )

// QUIT WHEN ALL WINDOWS ARE CLOSED, EXCEPT ON MACOS. THERE, IT'S COMMON
// FOR APPLICATIONS AND THEIR MENU BAR TO STAY ACTIVE UNTIL THE USER QUITS
// EXPLICITLY WITH CMD + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
})


// IN THIS FILE YOU CAN INCLUDE THE REST OF YOUR APP'S SPECIFIC MAIN PROCESS
// CODE. YOU CAN ALSO PUT THEM IN SEPARATE FILES AND REQUIRE THEM HERE.
//
