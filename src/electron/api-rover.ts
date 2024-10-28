import { BrowserWindow, session } from "electron";

export class ApiRover {
    constructor(private readonly mainWindow: BrowserWindow) { }

    openWindow = (url: string) => {
        const captureWindowSession = session.fromPartition(Math.random().toString(36).substring(7))
        const captureWindow = new BrowserWindow({
            width: 1500,
            height: 1700,
            show: false,
            parent: this.mainWindow,
            webPreferences: {
                session: captureWindowSession
            }
        });

        const apiEndPoint = 'https://4innovation-dev-api.cms.gov';
        captureWindow.loadURL(url).then(() => {
            try {
                captureWindow.webContents.debugger.attach('1.3');
            } catch (err) {
                console.log('Debugger attach failed: ', err);
                return;
            }

            captureWindow.webContents.debugger.on('detach', (event, reason) => {
                console.log('Debugger detached due to: ', reason);
            });

            captureWindow.webContents.debugger.on('message', (event, method, params) => {
                if (method === 'Network.responseReceived') {
                    try {
                        const url = params.response.url;
                        if (url.includes(apiEndPoint)) { // Add your filter condition here
                            console.log(url);
                            captureWindow.webContents.debugger.sendCommand('Network.getResponseBody', { requestId: params.requestId }).then(function(response) {
                                console.log(response);
                            }).catch(err => {
                                console.log('Failed to get response body: ', err);
                            });
                        }
                    } catch (err) {
                        console.log('Error processing response: ', err);
                    }
                }
            });

            try {
                captureWindow.webContents.debugger.sendCommand('Network.enable');
            } catch (err) {
                console.log('Failed to enable network debugging: ', err);
            }
        });

        captureWindow.show();
    }
}