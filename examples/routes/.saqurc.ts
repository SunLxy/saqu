import { defineConfig } from 'saqu';
import autoCreateRoutes from '@saqu/auto-create-routes';
import autoCreateEnter from '@saqu/auto-create-enter';

export default defineConfig({
  entry: '!src/.cache/main.jsx',
  plugins: [new autoCreateEnter({}), new autoCreateRoutes({})],
  overridesRspack: (config) => {
    return config;
  },
});
