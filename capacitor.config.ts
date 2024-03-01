import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.faciliteamz.supervision-cap',
  appName: 'Faciliteamz - Supervisión',
  webDir: 'www',
  server: {
    androidScheme: 'https'
  },
  android: {
    useLegacyBridge: true
  }
};

export default config;
