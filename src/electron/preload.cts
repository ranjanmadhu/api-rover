import electron from 'electron';

electron.contextBridge.exposeInMainWorld('electron', {
    subscribeMessages: (callback: (message: any) => void) => {
        const callBack = (event: any, arg: any) => {
            callback(arg);
        };
        electron.ipcRenderer.on('from-main', callBack);
        return () => electron.ipcRenderer.off('from-main', callBack);
    },
    getData: () => electron.ipcRenderer.invoke('get-data'),
    ipcRenderer: {
        invoke: electron.ipcRenderer.invoke,
        send: electron.ipcRenderer.send
    }
} satisfies Window['electron']);