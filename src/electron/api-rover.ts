import { BrowserWindow, session } from "electron";
import { BedRockService } from "./bedrock.js";

export class ApiRover {
    private data: { ui: string; api: string; };
    private requestResponse: any = {};

    constructor(private readonly mainWindow: BrowserWindow, data: { ui: string, api: string }) {
        this.data = data;
    }

    openWindow = () => {
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

        const bedRoxService = new BedRockService(this.mainWindow, this.data);

        captureWindow.loadURL(this.data.ui).then(() => {
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
                // console.log('------------------------------------');
                // console.log(method);
                // console.log(params);
                // console.log('------------------------------------');
                if (method === 'Network.responseReceived') {
                    try {
                        const url = params.response.url;
                        if (url.includes(this.data.api)) {
                            console.log(url);
                            captureWindow.webContents.debugger.sendCommand('Network.getResponseBody', { requestId: params.requestId }).then(async (response) => {
                                // this.requestResponsePairs.push({ request: params, response: response });
                                // this.mainWindow.webContents.send('from-main', { request: params, response: response });

                                if (!this.requestResponse[params.requestId]) {
                                    this.requestResponse[params.requestId] = {};
                                }
                                this.requestResponse[params.requestId]['response'] = JSON.parse(response.body);
                                bedRoxService.queueRequest(this.requestResponse[params.requestId]['request'], this.requestResponse[params.requestId]['response']);                                
                            }).catch(err => {
                                console.log('Failed to get response body: ', err);
                            });
                        }
                    } catch (err) {
                        console.log('Error processing response: ', err);
                    }
                }
                else if (method === 'Network.requestWillBeSent') {
                    const url = params.request.url;
                    if (url.includes(this.data.api)) {
                        if (!this.requestResponse[params.requestId]) {
                            this.requestResponse[params.requestId] = {};
                        }

                        this.requestResponse[params.requestId]['request'] = params.request;
                    }
                }
                else {
                    // console.log(method);
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