import { app, BrowserWindow, Tray, Menu, ipcMain } from 'electron';
import path from 'path';
import './reload.js';
import { ApiRover } from './api-rover.js';

let mainWindow: BrowserWindow;
let tray: Tray;

const createWindow = () => {
    mainWindow = new BrowserWindow({
        width: 1800,
        height: 1000,
        webPreferences: {
            preload: path.join(app.getAppPath(), '/dist-electron/preload.cjs'),
        }
    })

    mainWindow.loadFile(path.join(app.getAppPath(), '/dist-ui/index.html'));

    // Open the DevTools.
    mainWindow.webContents.openDevTools();

    mainWindow.on('close', (event) => {
        event.preventDefault();
        mainWindow.hide();
        app.dock.hide();
    });

    // sample messages to update UI
    for (let i = 0; i < 10; i++) {
        setTimeout(() => {
            mainWindow.webContents.send('from-main', `data sent from electron main ${i}`);
        }, i * 2000);
    }

    ipcMain.handle('get-data', async () => {
        return 'data requested from UI';
    });

    const apiRover = new ApiRover(mainWindow);
    // apiRover.openWindow('https://4innovation-dev.cms.gov/');
}

const createTray = async () => {
    // Remove existing tray icon if it exists
    if (tray) {
        tray.destroy();
    }

    tray = new Tray(path.join(app.getAppPath(), '/src/electron/tray/angular.png'));

    const contextMenu = Menu.buildFromTemplate([
        {
            label: 'Open App',
            click: () => {
                mainWindow.show();
            }
        },
        {
            type: 'separator' // This adds a divider
        },
        {
            label: 'Quit',
            click: () => {
                app.quit();
            }
        }
    ]);
    tray.setToolTip('Electron App');
    tray.setContextMenu(contextMenu);

    tray.on('click', () => {
        tray.popUpContextMenu(contextMenu);
    });
}

app.whenReady().then(() => {
    try {
        createWindow();
        createTray();
    } catch (error) {
        console.error('Error during initialization:', error);
    }

    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) createWindow()
    });
})

app.on('window-all-closed', () => {
    if (process.platform === 'darwin') {
        app.dock.hide();
    }
});

app.on('before-quit', () => {
    if (mainWindow) {
        mainWindow.removeAllListeners('close');
        mainWindow.close();
    }
});
