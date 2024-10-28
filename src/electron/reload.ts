import { app, BrowserWindow } from 'electron';
import chokidar from 'chokidar';
import path from 'path';

// Watch for changes in the dist-ui folder
const watcher = chokidar.watch(path.join(app.getAppPath(), '/dist-ui'), {
    ignored: /(^|[\/\\])\../, // ignore dotfiles
    persistent: true,
});

watcher.on('change', () => {
    const windows = BrowserWindow.getAllWindows();
    windows.forEach((window) => {
        window.reload();
    });
});

