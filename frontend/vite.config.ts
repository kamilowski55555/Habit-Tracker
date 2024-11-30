import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    host: '192.168.0.117',
    port: 5173, // Optional: Specify the port explicitly
  },
});

