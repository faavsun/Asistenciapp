import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'io.ionic.starter',
  appName: 'componentes_ionic_s1',
  webDir: 'www',
  plugins: {
    Geolocation: {
      // Aquí puedes establecer opciones, como 'enableHighAccuracy'
      enableHighAccuracy: true,
    },
  },
};

export default config;