import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    host: '172.20.128.1',
    port: 5173, // Optional: Specify the port explicitly
  },
});

