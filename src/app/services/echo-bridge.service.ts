import { Injectable, NgZone } from '@angular/core';
import { Capacitor } from '@capacitor/core';
import { BehaviorSubject, Observable } from 'rxjs';

/**
 * Represents the response returned from the native echo logic.
 */
export interface EchoResponse {
  /** The original value that was passed to the echo call. */
  original: string;
  /** The transformed echo value returned by the native layer. */
  echoed: string;
  /** Timestamp when the message was processed. */
  processedAt: string;
}

/**
 * Extends the global window interface to describe values injected by the Electron preload script.
 */
declare global {
  interface Window {
    /**
     * Safe Electron bridge exposed from the preload script.
     */
    electronAPI?: {
      /** Sends a message to the main process and resolves with the echo payload. */
      invokeEcho: (payload: string) => Promise<EchoResponse>;
      /** Registers a callback that is triggered when the main process broadcasts an echo event. */
      onEchoBroadcast: (callback: (payload: EchoResponse) => void) => void;
    };
  }
}

/**
 * Provides a unified API that works on web, mobile, and the Electron wrapper.
 * The service automatically chooses between Capacitor plugins and Electron IPC.
 */
@Injectable({ providedIn: 'root' })
export class EchoBridgeService {
  /** Holds the last response emitted by any echo call for convenient observation inside Angular. */
  private readonly lastResponseSubject = new BehaviorSubject<EchoResponse | null>(null);

  constructor(private readonly zone: NgZone) {
    // Ensure Electron listeners are registered only when running inside the Electron shell.
    if (this.isRunningInsideElectron() && window.electronAPI) {
      window.electronAPI.onEchoBroadcast((payload) => {
        // NgZone is leveraged so that updates propagate through Angular's change detection.
        this.zone.run(() => this.lastResponseSubject.next(payload));
      });
    }
  }

  /**
   * Exposes a stream of all echo responses received from any platform.
   */
  public watchResponses(): Observable<EchoResponse | null> {
    return this.lastResponseSubject.asObservable();
  }

  /**
   * Dispatches an echo request and resolves with the native response.
   * On Electron, the IPC bridge is used. On mobile/web the Capacitor Echo plugin is used instead.
   */
  public async echo(message: string): Promise<EchoResponse> {
    if (!message) {
      throw new Error('The message parameter is required when calling echo().');
    }

    if (this.isRunningInsideElectron() && window.electronAPI?.invokeEcho) {
      // Delegate to the Electron main process using the bridge defined in the preload script.
      const electronResponse = await window.electronAPI.invokeEcho(message);
      this.lastResponseSubject.next(electronResponse);
      return electronResponse;
    }

    // Dynamically import the plugin to avoid bundling it for platforms where it is unavailable.
    const { Echo } = await import('../plugins/echo.plugin');
    const pluginResult = await Echo.echo({ value: message });
    const response: EchoResponse = {
      original: message,
      echoed: pluginResult.value,
      processedAt: new Date().toISOString(),
    };
    this.lastResponseSubject.next(response);
    return response;
  }

  /**
   * Helper that detects whether the current runtime is the Capacitor Electron platform.
   */
  private isRunningInsideElectron(): boolean {
    return Capacitor.getPlatform() === 'electron';
  }
}
