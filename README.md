# EchoPlugin

A simple Capacitor plugin for Ionic applications that demonstrates how to create an internal plugin for iOS with native Swift integration.

## Features

- Simple echo functionality to demonstrate native iOS integration
- TypeScript interface for type safety
- Swift native implementation
- Capacitor 6.x compatible

## Installation

```bash
npm install echo-plugin
npx cap sync
```

## Usage

```typescript
import { EchoPlugin } from 'echo-plugin';

// Echo a message
const result = await EchoPlugin.echo({ value: 'Hello, World!' });
console.log(result.value); // outputs: Hello, World!
```

## API

### echo(options: { value: string }) => Promise<{ value: string }>

Echoes back the provided text value.

**Parameters:**

- `options` (object): The options object
  - `value` (string): The text to echo back

**Returns:** Promise<{ value: string }>

## Development

### Building

```bash
npm run build
```

### Testing

```bash
npm run verify
```

## iOS Implementation

The plugin uses Swift to implement the native functionality. The main implementation is in:

- `ios/Plugin/EchoPlugin.swift` - Core Swift implementation
- `ios/Plugin/EchoPluginPlugin.swift` - Capacitor plugin wrapper

This demonstrates the basic structure needed for creating internal Ionic plugins with native iOS functionality.
