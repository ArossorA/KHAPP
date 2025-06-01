import { Routes, Route, Navigate } from 'react-router-dom';
import { Suspense, lazy } from 'react';
import { RoutesApp, GlobalError, GlobalLoading } from './autoRoutes';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { checkRoutePermission } from '@/utils/checkRoutePermission';
import { useAuthStore } from '@/stores/useAuthStore';

export default function AppRoutes() {
  const { userData } = useAuthStore();
  const validRoutes = RoutesApp.filter((route) => checkRoutePermission(route.path, userData));

  return (
    <Routes>
      {/* Redirect default route */}
      {['/', '*', '404', '500'].map((redirectPath) => (
        <Route key={redirectPath} path={redirectPath} element={<Navigate to="/home" replace />} />
      ))}

      {/* Valid Routes */}
      {validRoutes.map((route, index) => {
        const LazyPage = route.element;
        const LayoutLoader = route.layout ? lazy(route.layout) : null;

        const PageWithLayout = LayoutLoader ? (
          <LayoutLoader>
            <LazyPage />
          </LayoutLoader>
        ) : (
          <LazyPage />
        );

        return (
          <Route
            key={index}
            path={route.path}
            element={
              <Suspense fallback={<GlobalLoading />}>
                <ErrorBoundary fallback={<GlobalError />}>
                  {PageWithLayout}
                </ErrorBoundary>
              </Suspense>
            }
          />
        );
      })}
    </Routes>
  );
}
