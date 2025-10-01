import { contextBridge, ipcRenderer } from 'electron';

/** Represents the echo payload exchanged between the renderer and main processes. */
interface EchoResponse {
  original: string;
  echoed: string;
  processedAt: string;
}

/** Channel used to invoke echo requests from the renderer process. */
const IPC_CHANNEL_ECHO_INVOKE = 'echo:invoke';
/** Channel used by the main process to broadcast responses. */
const IPC_CHANNEL_ECHO_BROADCAST = 'echo:broadcast';

/**
 * Exposes a safe subset of the Electron IPC API to the renderer process.
 */
contextBridge.exposeInMainWorld('electronAPI', {
  /**
   * Invokes the main process echo handler and returns the response payload.
   */
  invokeEcho: async (payload: string): Promise<EchoResponse> => {
    const response = await ipcRenderer.invoke(IPC_CHANNEL_ECHO_INVOKE, payload);
    return response as EchoResponse;
  },
  /**
   * Registers a listener for echo broadcasts coming from the main process.
   */
  onEchoBroadcast: (callback: (payload: EchoResponse) => void) => {
    ipcRenderer.on(IPC_CHANNEL_ECHO_BROADCAST, (_event, data) => callback(data as EchoResponse));
  },
});
