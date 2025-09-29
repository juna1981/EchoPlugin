export interface EchoPluginPlugin {
  /**
   * Echo back the provided text
   */
  echo(options: { value: string }): Promise<{ value: string }>;
}