import { Fragment, useEffect } from 'react';

// import DLayout from '@/layouts/dlayout';
// import RoutesPages from '@/routes/routes';
// import ProviderContext from '@/contexts/ProviderContext';
// import Loader from '@/components/layout/loader/loader';

import AppRoutes from './routes/RoutesPages';


// 🔒 Type-safe IndexedDBManager
const IndexedDBManager = {
  async clearStoredData(): Promise<void> {
    try {
      if (!('databases' in indexedDB)) return;

      const databases = await (indexedDB as any).databases?.();
      if (Array.isArray(databases)) {
        await Promise.all(
          databases.map((db: { name?: string }) => {
            if (db.name) return indexedDB.deleteDatabase(db.name);
          })
        );
      }
    } catch (error) {
      console.error('❌ Failed to clear IndexedDB:', error);
    }
  },

  async manageStorageSize(): Promise<void> {
    try {
      if (!navigator.storage?.estimate) return;

      const estimation = await navigator.storage.estimate();
      const usage = estimation.usage ?? 0;
      const quota = estimation.quota ?? 1;

      const usageRatio = usage / quota;
      if (usageRatio > 0.4) {
        await this.clearStoredData();
      }
    } catch (error) {
      console.error('❌ Storage management error:', error);
    }
  },
};

// 🧼 Hook สำหรับจัดการ IndexedDB
const useIndexedDBOptimization = (): void => {
  useEffect(() => {
    IndexedDBManager.clearStoredData();

    const cleanupInterval = setInterval(() => {
      IndexedDBManager.manageStorageSize();
    }, 1000 * 60 * 60 * 24); // ทุก 24 ชั่วโมง

    return () => clearInterval(cleanupInterval);
  }, []);
};

// ✅ คอมโพเนนต์หลัก
const App: React.FC = () => {
  useIndexedDBOptimization();

  return (
    <Fragment>
      {/* <ProviderContext> */}
      {/* <Loader> */}
      {/* <DLayout> */}
      <AppRoutes />
      {/* </DLayout> */}
      {/* </Loader> */}
      {/* </ProviderContext> */}
    </Fragment>
  );
};

export default App;
