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
} satisfies Window['electron']);