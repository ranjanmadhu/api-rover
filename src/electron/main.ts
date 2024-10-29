import { app, BrowserWindow, Tray, Menu, ipcMain } from 'electron';
import path from 'path';
import './reload.js';
import { ApiRover } from './api-rover.js';
import { BedRockService } from './bedrock.js';

let mainWindow: BrowserWindow;
let tray: Tray;

const specs = [
    {
      openapi: '3.0.0',
      info: {
        title: 'Documents API',
        description: 'API for managing documents',
        version: '1.0.0',
      },
      servers: [
        {
          url: 'http://localhost:3000',
          description: 'Local development server',
        },
      ],
      paths: {
        '/api/documents/status': {
          get: {
            summary: 'Get document status',
            description: 'Returns the status of documents',
            operationId: 'getDocumentStatus',
            responses: {
              '200': {
                description: 'Successful response',
                content: {
                  'application/json': {
                    schema: {
                      type: 'object',
                      properties: {
                        test: {
                          type: 'string',
                          example: '123',
                        },
                      },
                      required: ['test'],
                    },
                  },
                },
              },
              '400': {
                description: 'Bad request',
              },
              '500': {
                description: 'Internal server error',
              },
            },
            tags: ['Documents'],
          },
        },
      },
      tags: [
        {
          name: 'Documents',
          description: 'Operations related to documents',
        },
      ],
    },
    {
      openapi: '3.0.0',
      info: {
        title: 'Documents API 2nd',
        description: 'API for managing documents',
        version: '1.0.0',
      },
      servers: [
        {
          url: 'http://localhost:3000',
          description: 'Local development server',
        },
      ],
      paths: {
        '/api/documents/status': {
          get: {
            summary: 'Get document status',
            description: 'Returns the status of documents',
            operationId: 'getDocumentStatus',
            responses: {
              '200': {
                description: 'Successful response',
                content: {
                  'application/json': {
                    schema: {
                      type: 'object',
                      properties: {
                        test: {
                          type: 'string',
                          example: '123',
                        },
                      },
                      required: ['test'],
                    },
                  },
                },
              },
              '400': {
                description: 'Bad request',
              },
              '500': {
                description: 'Internal server error',
              },
            },
            tags: ['Documents'],
          },
        },
      },
      tags: [
        {
          name: 'Documents',
          description: 'Operations related to documents',
        },
      ],
    },
    {
      "openapi": "3.0.0",
      "info": {
        "title": "Task Management API",
        "description": "API for managing tasks",
        "version": "1.0.0"
      },
      "servers": [
        {
          "url": "https://4innovation-impl-api.cms.gov",
          "description": "Production server"
        }
      ],
      "paths": {
        "/task-management/v1/secure/notifications/dc/count": {
          "get": {
            "summary": "Get Notification Count",
            "description": "Returns the count of notifications",
            "operationId": "getNotificationCount",
            "parameters": [
              {
                "name": "Authorization",
                "in": "header",
                "required": true,
                "schema": {
                  "type": "string"
                }
              }
            ],
            "responses": {
              "200": {
                "description": "Successful response",
                "content": {
                  "application/json": {
                    "schema": {
                      "type": "integer",
                      "example": 1778
                    }
                  }
                }
              },
              "400": {
                "description": "Bad request"
              },
              "500": {
                "description": "Internal server error"
              }
            },
            "tags": ["Notifications"]
          }
        }
      },
      "components": {
        "securitySchemes": {
          "customTokenAuth": {
            "type": "apiKey",
            "name": "Authorization",
            "in": "header"
          }
        }
      },
      "security": [
        {
          "customTokenAuth": []
        }
      ]
    }
  ];

const createWindow = () => {
    mainWindow = new BrowserWindow({
        width: 1000,
        height: 1600,
        webPreferences: {
            preload: path.join(app.getAppPath(), '/dist-electron/preload.cjs'),
        }
    })

    mainWindow.loadFile(path.join(app.getAppPath(), '/dist-ui/index.html'));

    // Open the DevTools.
    // mainWindow.webContents.openDevTools();

    mainWindow.on('close', (event) => {
        event.preventDefault();
        mainWindow.hide();
        app.dock.hide();
    });

    // sample messages to update UI
    // for (let i = 0; i < 3; i++) {
    //     setTimeout(() => {
    //         mainWindow.webContents.send('from-main', {type: 'api-specs', data: specs[i]});
    //     }, i * 3000);
    // }

    ipcMain.handle('get-data', async () => {
        return 'data requested from UI';
    });

    ipcMain.handle('start-api-scan', async (event, data) => {
        console.log(data);
        const apiRover = new ApiRover(mainWindow, data);
        apiRover.openWindow();
    });      
   
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
