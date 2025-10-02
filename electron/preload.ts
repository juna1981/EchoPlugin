import { contextBridge, ipcRenderer, IpcRendererEvent } from 'electron';

// Interfaz que describe las funciones expuestas del lado del renderizado
interface ElectronIpcBridge {
  send: (canal: string, datos?: unknown) => void;
  invoke: <T>(canal: string, datos?: unknown) => Promise<T>;
  on: (canal: string, listener: (event: IpcRendererEvent, ...args: unknown[]) => void) => void;
  removeListener: (canal: string, listener: (event: IpcRendererEvent, ...args: unknown[]) => void) => void;
}

// Exposición controlada del ipcRenderer al proceso de renderizado utilizando contextBridge
const electronApi: { ipcRenderer: ElectronIpcBridge } = {
  ipcRenderer: {
    // Método para enviar mensajes unidireccionales al proceso principal
    send: (canal: string, datos?: unknown) => ipcRenderer.send(canal, datos),
    // Método para invocar canales que retornan una respuesta asincrónica
    invoke: <T>(canal: string, datos?: unknown) => ipcRenderer.invoke(canal, datos) as Promise<T>,
    // Método para escuchar eventos provenientes del proceso principal
    on: (canal: string, listener: (event: IpcRendererEvent, ...args: unknown[]) => void) =>
      ipcRenderer.on(canal, listener),
    // Método para retirar listeners previamente registrados
    removeListener: (canal: string, listener: (event: IpcRendererEvent, ...args: unknown[]) => void) =>
      ipcRenderer.removeListener(canal, listener)
  }
};

contextBridge.exposeInMainWorld('ElectronCapacitor', electronApi);
