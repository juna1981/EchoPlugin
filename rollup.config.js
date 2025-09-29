import resolve from '@rollup/plugin-node-resolve';

const pkg = require('./package.json');

export default {
  input: 'dist/esm/index.js',
  output: [
    {
      file: pkg.main,
      format: 'cjs',
      sourcemap: true,
      inlineDynamicImports: true,
    },
    {
      file: pkg.unpkg,
      format: 'iife',
      name: 'EchoPlugin',
      globals: {
        '@capacitor/core': 'capacitorExports',
      },
      sourcemap: true,
      inlineDynamicImports: true,
    },
  ],
  external: ['@capacitor/core'],
  plugins: [
    resolve(),
  ],
};