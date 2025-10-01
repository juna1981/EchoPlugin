import { app, BrowserWindow, ipcMain } from 'electron';
import path from 'path';
import { format } from 'url';

/** Channel name used for invoking echo requests from the renderer process. */
const IPC_CHANNEL_ECHO_INVOKE = 'echo:invoke';
/** Channel name used when broadcasting processed echo responses back to the renderer. */
const IPC_CHANNEL_ECHO_BROADCAST = 'echo:broadcast';

/** Holds a reference to the main application window. */
let mainWindow: BrowserWindow | null = null;

/**
 * Creates the Electron BrowserWindow and loads the Ionic/Angular application.
 */
async function createWindow(): Promise<void> {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      // The preload script wires the IPC bridge using context isolation.
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
    },
  });

  if (process.env.NODE_ENV === 'development') {
    await mainWindow.loadURL('http://localhost:8100');
    mainWindow.webContents.openDevTools();
  } else {
    await mainWindow.loadURL(
      format({
        pathname: path.join(__dirname, '../app/index.html'),
        protocol: 'file:',
        slashes: true,
      })
    );
  }

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

/**
 * Registers the IPC handler that mimics the native Capacitor Echo plugin while running on desktop.
 */
function registerIpcHandlers(): void {
  ipcMain.handle(IPC_CHANNEL_ECHO_INVOKE, async (_event, message: string) => {
    const response = {
      original: message,
      echoed: `${message} (from Electron)` ,
      processedAt: new Date().toISOString(),
    };

    // Broadcast the same response to all renderer windows to keep streams in sync.
    BrowserWindow.getAllWindows().forEach((window) => {
      window.webContents.send(IPC_CHANNEL_ECHO_BROADCAST, response);
    });

    return response;
  });
}

/**
 * Ensures the application lifecycle matches the default Electron behavior.
 */
function registerLifecycleHooks(): void {
  app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
      app.quit();
    }
  });

  app.on('activate', async () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      await createWindow();
    }
  });
}

app.whenReady().then(async () => {
  registerIpcHandlers();
  registerLifecycleHooks();
  await createWindow();
});
