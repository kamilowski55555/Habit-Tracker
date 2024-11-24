import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    host: true, // This allows binding to all available network interfaces
    port: 5173, // Optional: Specify the port explicitly
  },
});

