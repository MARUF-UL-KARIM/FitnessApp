import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.fitnessapp.app',
  appName: 'FitnessApp',
  webDir: 'dist',
  server: {
    androidScheme: 'https',
  },
  plugins: {
    SplashScreen: {
      launchAutoHide: true,
      launchShowDuration: 3000,
      backgroundColor: '#0A0A0A',
      showSpinner: true,
      spinnerColor: '#CCFF00',
    },
    App: {
      allowOrientationLock: true,
    },
  },
};

export default config;
