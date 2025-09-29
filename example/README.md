# EchoPlugin Usage Example

This directory contains example code showing how to integrate the EchoPlugin into an Ionic/Angular application.

## Integration Steps

1. **Install the plugin** in your Ionic project:
   ```bash
   npm install echo-plugin
   npx cap sync ios
   ```

2. **Import the plugin** in your component:
   ```typescript
   import { EchoPlugin } from 'echo-plugin';
   ```

3. **Use the plugin** in your methods:
   ```typescript
   async doEcho() {
     const result = await EchoPlugin.echo({ value: 'Hello World!' });
     console.log(result.value); // outputs: Hello World!
   }
   ```

## Files Included

- `home.page.ts` - Example Angular component using the EchoPlugin
- `home.page.html` - Example template with UI for testing the plugin

## Native iOS Integration

When running on iOS, the plugin will:
1. Call the native Swift implementation
2. The Swift code receives the message
3. Processes it and returns the same value
4. The result is returned to the JavaScript layer

This demonstrates the complete flow from JavaScript → Native iOS → JavaScript for Capacitor plugins.