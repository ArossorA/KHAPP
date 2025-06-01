import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';

import { baseConfig } from '@/configs/configs';

import App from './App';
import './index.css';

// 🔒 ปิด error log ที่ไม่จำเป็นใน production เช่น 404
if (import.meta.env.MODE === 'production') {
  const originalConsoleError = console.error;
  console.error = (...args: unknown[]) => {
    const message = typeof args[0] === 'string' ? args[0] : args[0]?.toString?.();
    if (message?.includes('404') || message?.includes('Not Found')) return;
    originalConsoleError(...args);
  };
}

// 🧹 ล้าง Service Worker และ Cache (ใช้เฉพาะตอน dev/debug)
const clearSWCache = async (): Promise<void> => {
  if ('serviceWorker' in navigator) {
    try {
      const registrations = await navigator.serviceWorker.getRegistrations();
      await Promise.all(registrations.map((reg) => reg.unregister()));

      const keys = await caches.keys();
      await Promise.all(keys.map((key) => caches.delete(key)));

      console.info('🧹 Service worker and cache cleared.');
    } catch (err) {
      console.warn('❌ Failed to clear service worker/cache:', err);
    }
  }
};

// 👉 เรียกใช้เฉพาะตอน dev/debug เท่านั้น
clearSWCache();

const rootElement = document.getElementById('root');

if (!rootElement) {
  throw new Error('❌ Root element with id "root" not found.');
}

const root = createRoot(rootElement);

root.render(
  <StrictMode>
    <BrowserRouter basename={baseConfig.base}>
      <App />
    </BrowserRouter>
  </StrictMode>
);
