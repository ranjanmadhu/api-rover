interface Window {
    electron: {
        subscribeMessages: (callback: (message: any) => void) => void;
        getData: () => Promise<any>;
    }
}