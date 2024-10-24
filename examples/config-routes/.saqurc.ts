import { defineConfig } from 'saqu';
import createRoutes from '@saqu/auto-config-to-routes';
export default defineConfig({
  plugins: [new createRoutes({ loadType: 'lazy' })],
});
