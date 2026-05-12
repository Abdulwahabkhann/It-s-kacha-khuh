import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'pk.shandaar.app',
  appName: 'Shandaar',
  webDir: 'out',
  server: {
    androidScheme: 'https'
  }
};

export default config;
