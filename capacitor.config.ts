import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'io.ionic.starter',
  appName: 'blog',
  webDir: 'www',
  plugins: {
    SplashScreen: {
      launchShowDuration: 0,
    }
  },
  cordova: {},
  

};

export default config;
