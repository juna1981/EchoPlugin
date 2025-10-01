import { registerPlugin } from '@capacitor/core';

/**
 * Defines the Capacitor contract for the native Echo plugin.
 */
export interface EchoPlugin {
  /**
   * Invokes the native echo implementation and returns the echoed string value.
   */
  echo(options: { value: string }): Promise<{ value: string }>;
}

/**
 * Registers the plugin so it can be imported lazily throughout the Angular application.
 */
export const Echo = registerPlugin<EchoPlugin>('Echo');
