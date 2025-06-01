import { createElement, lazy, type ComponentType } from 'react';
import type { RouteMeta } from '@/types/types';

const pageModules = import.meta.glob('@/pages/**/page.tsx');
const metaModules = import.meta.glob('@/pages/**/metadata.ts', { eager: true }) as Record<string, { default: RouteMeta }>;
const layoutModules = import.meta.glob('@/pages/**/layout.tsx');
const loadingModule = import.meta.glob('@/pages/loading.tsx', { eager: true });
const errorModule = import.meta.glob('@/pages/error.tsx', { eager: true });

function convertNextStylePath(path: string): string {
  return path
    .replace(/^.*\/pages/, '')
    .replace(/\/page\.tsx$/, '')
    .replace(/\[(.+?)\]/g, ':$1')
    .replace(/\/index$/, '')
    .replace(/\\/g, '/');
}

// function extractMetaPath(path: string): string {
//   return path
//     .replace(/^.*\/pages/, '')
//     .replace(/\/metadata\.ts$/, '')
//     .replace(/\/index$/, '')
//     .replace(/\\/g, '/');
// }

// function findNearestLayout(path: string): (() => Promise<{ default: ComponentType<any> }>) | null {
//   const segments = path.split('/').filter(Boolean);
//   while (segments.length > 0) {
//     const checkPath = `/src/pages/${segments.join('/')}/layout.tsx`;
//     if (checkPath in layoutModules) return layoutModules[checkPath] as any;
//     segments.pop();
//   }
//   if ('/src/pages/layout.tsx' in layoutModules) return layoutModules['/src/pages/layout.tsx'] as any;
//   return null;
// }


function findNearestLayout(path: string): (() => Promise<{ default: ComponentType<any> }>) | undefined {
  const segments = path.split('/').filter(Boolean);
  while (segments.length > 0) {
    const checkPath = `/src/pages/${segments.join('/')}/layout.tsx`;
    if (checkPath in layoutModules) return layoutModules[checkPath] as () => Promise<{ default: ComponentType<any> }>;
    segments.pop();
  }
  const rootLayoutPath = '/src/pages/layout.tsx';
  return rootLayoutPath in layoutModules && '/src/pages/page.tsx' in pageModules
    ? (layoutModules[rootLayoutPath] as () => Promise<{ default: ComponentType<any> }>)
    : undefined;
}


export interface RouteItem {
  path: string;
  element: React.LazyExoticComponent<ComponentType<any>>;
  meta?: RouteMeta;
  layout?: () => Promise<{ default: ComponentType<any> }>;
}

// ✅ ใช้ filter ตรวจ loader ก่อน lazy()
export const RoutesApp: RouteItem[] = Object.entries(pageModules)
  .filter(([path, loader]) => {
    const isValid = typeof loader === 'function';
    if (!isValid) {
      console.warn('❌ Invalid loader:', path, loader);
    }
    return isValid;
  })
  .map(([path, loader]) => {
    const routePath = convertNextStylePath(path);
    const metaKey = `/src/pages${routePath}/metadata.ts`; // key ที่ใช้กับ eager meta
    const meta = metaModules[metaKey]?.default;
    const layout = findNearestLayout(routePath);

    return {
      path: routePath,
      element: lazy(loader as () => Promise<{ default: ComponentType<any> }>),
      meta,
      layout,
    };
  });

export const GlobalLoading =
  (loadingModule['/src/pages/loading.tsx'] as { default: ComponentType } | undefined)?.default ??
  (() => createElement('div', null, 'Loading...'));

export const GlobalError =
  (errorModule['/src/pages/error.tsx'] as { default: ComponentType } | undefined)?.default ??
  (() => createElement('div', null, 'Something went wrong'));
