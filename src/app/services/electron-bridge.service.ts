import { Injectable, NgZone } from '@angular/core';
import { Capacitor } from '@capacitor/core';
import { Observable } from 'rxjs';

// Declaración global para ampliar el objeto Window con la API de Electron expuesta por Capacitor
export interface ElectronIpcRenderer {
  send(channel: string, payload?: unknown): void;
  invoke<T>(channel: string, payload?: unknown): Promise<T>;
  on(channel: string, listener: (event: unknown, ...args: unknown[]) => void): void;
  removeListener(channel: string, listener: (event: unknown, ...args: unknown[]) => void): void;
}

declare global {
  interface Window {
    ElectronCapacitor?: {
      ipcRenderer?: ElectronIpcRenderer;
    };
  }
}

interface ElectronPlugin {
  ipcRenderer?: ElectronIpcRenderer;
}

// Interfaz que describe un mensaje básico enviado mediante IPC
export interface ElectronMessage<T = unknown> {
  canal: string;
  datos?: T;
}

@Injectable({
  providedIn: 'root'
})
export class ElectronBridgeService {
  // Constructor que inyecta NgZone para sincronizar los eventos de Electron con Angular
  constructor(private readonly ngZone: NgZone) {}

  // Método privado que devuelve la referencia al ipcRenderer expuesto por Capacitor cuando se ejecuta en Electron
  private obtenerIpcRenderer(): ElectronIpcRenderer | undefined {
    const esElectron = Capacitor.getPlatform() === 'electron' || Capacitor.isPluginAvailable('Electron');
    if (!esElectron) {
      return undefined;
    }

    const electronPlugin = (Capacitor.Plugins as Record<string, unknown>)?.Electron as ElectronPlugin | undefined;

    if (electronPlugin?.ipcRenderer) {
      return electronPlugin.ipcRenderer;
    }

    return window?.ElectronCapacitor?.ipcRenderer;
  }

  // Método público para saber si la aplicación se está ejecutando dentro de Electron
  public estaEnElectron(): boolean {
    return Capacitor.getPlatform() === 'electron' || Boolean(this.obtenerIpcRenderer());
  }

  // Método que envía un mensaje unidireccional al proceso principal mediante IPC
  public enviarMensaje<T>(mensaje: ElectronMessage<T>): void {
    const ipcRenderer = this.obtenerIpcRenderer();
    if (!ipcRenderer) {
      console.warn('IPC no disponible: la aplicación no se está ejecutando en Electron.');
      return;
    }

    ipcRenderer.send(mensaje.canal, mensaje.datos);
  }

  // Método que invoca un canal IPC esperando una respuesta del proceso principal
  public async invocar<TRespuesta = unknown, TEntrada = unknown>(
    mensaje: ElectronMessage<TEntrada>
  ): Promise<TRespuesta | undefined> {
    const ipcRenderer = this.obtenerIpcRenderer();
    if (!ipcRenderer || typeof ipcRenderer.invoke !== 'function') {
      console.warn('Invoke IPC no disponible: la aplicación no se está ejecutando en Electron.');
      return undefined;
    }

    return ipcRenderer.invoke<TRespuesta>(mensaje.canal, mensaje.datos);
  }

  // Método que devuelve un observable para escuchar un canal específico desde el proceso principal
  public escucharCanal<T = unknown>(canal: string): Observable<T> {
    return new Observable<T>((suscriptor) => {
      const ipcRenderer = this.obtenerIpcRenderer();
      if (!ipcRenderer) {
        suscriptor.error('IPC no disponible: la aplicación no se está ejecutando en Electron.');
        return;
      }

      // Función manejadora que reinyecta el flujo dentro del NgZone de Angular
      const handler = (_event: unknown, payload: T) => {
        this.ngZone.run(() => suscriptor.next(payload));
      };

      ipcRenderer.on(canal, handler);

      // Función de limpieza que se ejecuta cuando el observable se completa o se cancela
      return () => {
        ipcRenderer.removeListener(canal, handler);
      };
    });
  }
}
