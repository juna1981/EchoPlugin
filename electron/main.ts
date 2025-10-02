import { app, BrowserWindow, ipcMain } from 'electron';
import { join } from 'path';
import { CapacitorElectronApp, setupElectronPlugins } from '@capacitor-community/electron';

// Variable que mantendrá la referencia a la ventana principal de la aplicación
let mainWindow: BrowserWindow | null = null;

// Instancia que configura la aplicación de Capacitor para Electron
const capacitorApp = new CapacitorElectronApp({
  mainWindow: {
    windowOptions: {
      width: 1024,
      height: 768,
      minWidth: 768,
      minHeight: 600,
      webPreferences: {
        preload: join(__dirname, 'preload.js')
      }
    }
  },
  splashScreen: {
    useSplashScreen: false
  }
});

// Función que crea la ventana principal y carga el contenido de Ionic
const createWindow = async (): Promise<void> => {
  await capacitorApp.load();
  mainWindow = capacitorApp.getMainWindow();

  if (!mainWindow) {
    throw new Error('No se pudo crear la ventana principal de Electron');
  }

  if (process.env.NODE_ENV === 'development') {
    mainWindow.webContents.openDevTools({ mode: 'detach' });
  }
};

// Registro de manejadores IPC para comunicarse con el proceso de renderizado
const registrarCanalesIpc = (): void => {
  // Canal que recibe un mensaje simple y responde con la versión de la app
  ipcMain.on('obtener-version', () => {
    if (!mainWindow) {
      return;
    }

    const version = app.getVersion();
    mainWindow.webContents.send('version-info', `Versión de la aplicación: ${version}`);
  });

  // Canal que usa invocaciones asíncronas para devolver la ruta de descargas del sistema
  ipcMain.handle('obtener-ruta-descargas', async () => {
    return app.getPath('downloads');
  });
};

// Evento que se dispara cuando Electron ha finalizado la inicialización
app.whenReady().then(async () => {
  setupElectronPlugins();
  registrarCanalesIpc();
  await createWindow();

  app.on('activate', async () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      await createWindow();
    }
  });
});

// Evento que gestiona el cierre de todas las ventanas en plataformas distintas a macOS
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
