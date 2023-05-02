import { defineConfig } from 'saqu';
import autoCreateRoutes from '@saqu/auto-create-routes';
export default defineConfig({
  plugins: [new autoCreateRoutes()],
});
