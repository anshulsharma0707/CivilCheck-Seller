import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Vite ko batate hain ki yeh React project hai
export default defineConfig({
  plugins: [react()],
})