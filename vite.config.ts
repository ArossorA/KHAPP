import { defineConfig } from "vite";
import tailwindcss from '@tailwindcss/vite';
import react from "@vitejs/plugin-react";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import { visualizer } from "rollup-plugin-visualizer";
import process from "node:process";
import compression from 'vite-plugin-compression';

import { baseConfig } from './src/configs/configs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

export default defineConfig(({ mode }) => {

  const isProd = mode === "production";
  const envBasePath = baseConfig?.base;
  const outDir = process.env.OUT_DIR || "./dist";

  if (isProd) {
    console.log(`Vite Build: BASE_PATH = ${envBasePath}, OUT_DIR = ${outDir}`);
  } else {
    console.log(`Vite Run: BASE_PATH = ${envBasePath},`)
  }

  return {
    plugins: [
      react(),
      tailwindcss(),
      ...(isProd ? [
        compression({
          algorithm: 'brotliCompress',
          threshold: 10240, // 10KB
          deleteOriginFile: false,
          ext: '.br'
        }),
        compression({
          algorithm: 'gzip',
          threshold: 10240,
          deleteOriginFile: false,
          ext: '.gz'
        })
      ] : []),
      visualizer({
        open: false,
        filename: 'stats.html',
        gzipSize: true,
        brotliSize: true,
        template: 'treemap',
      }),

    ],
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
    define: {
      // "process.env": process.env,
      "process.env.NODE_ENV": JSON.stringify(mode),
      "process.env.BASE_PATH": JSON.stringify(envBasePath),
      "process.env.API_URL": JSON.stringify(
        isProd ? envBasePath + process.env.API_URL_PROD : process.env.API_URL
      ),
      "process.env.API_TOKEN": JSON.stringify(process.env.API_TOKEN),
      // "process.env.THAI_ID_URL": JSON.stringify(process.env.THAI_ID_URL),
      "process.env.THAI_ID_URL": JSON.stringify(
        isProd ? envBasePath + process.env.THAI_ID_URL_PRD : process.env.THAI_ID_URL
      ),
      "process.env.THAI_ID_KEY_HEADER": JSON.stringify(process.env.THAI_ID_KEY_HEADER),
      "process.env.THAI_ID_KEY_TOKEN": JSON.stringify(process.env.THAI_ID_KEY_TOKEN),
      "process.env.THAI_ID_GENERATOR": JSON.stringify(process.env.THAI_ID_GENERATOR),
      // ป้องกัน global undefined error
      "global": 'globalThis',
    },

    base: `${baseConfig.base}/`,
    server: {
      ...baseConfig.server,
      allowedHosts: ['*'],
      hmr: {
        overlay: false
      },
    },

    optimizeDeps: {
      include: [
        // Core dependencies
        'react',
        'react-dom',
        'react-dom/client',
      ],
      exclude: [
        // ไม่ pre-bundle สำหรับ dev dependencies
        '@vitejs/plugin-react',
        // '@ant-design/icons',
        'lucide-react'
      ]
    },

    build: {

      target: 'es2020',
      outDir,

      reportCompressedSize: false,
      modulePreload: {
        polyfill: false, // default true
      },
      assetsDir: "assets", // โฟลเดอร์สําหรับไฟล์ assets
      minify: "terser", // ใช้ terser สําหรับ minify
      sourcemap: isProd ? false : true,
      cssCodeSplit: true,
      commonjsOptions: {
        ignoreTryCatch: false,
      },
      chunkSizeWarningLimit: 1000,
      rollupOptions: {
        treeshake: {
          moduleSideEffects: false
        },
        output: {
          entryFileNames: isProd ? 'assets/[name]-[hash].js' : 'assets/[name].js',
          chunkFileNames: isProd ? 'assets/[name]-[hash].js' : 'assets/[name].js',
          assetFileNames: isProd ? 'assets/[name]-[hash].[ext]' : 'assets/[name].[ext]',
          manualChunks: {
            // Vendor chunks
            'vendor-react': ['react', 'react-dom'],
            'vendor-utils': ['dayjs', 'lodash-es'],
            'vendor-motion': ['framer-motion'],
          },
          experimentalMinChunkSize: 20000,
        },
      },
      terserOptions: {
        compress: {
          drop_console: isProd,
          drop_debugger: isProd,
          pure_funcs: isProd ? ['console.log', 'console.info'] : [],
          passes: 2,
          unsafe_arrows: true,
          unsafe_methods: true,
        },
        mangle: {
          safari10: true,
        },
        format: {
          comments: false,
        },
      },

    },
    // preview: {
    //   host: true, // ให้เครื่องอื่นในวง LAN เข้าถึงได้
    //   https: true, // preview ผ่าน https
    //   port: 5000, // รันที่พอร์ต 5000
    //   open: true, // เปิด browser ให้อัตโนมัติ
    // },
    esbuild: {
      ignoreAnnotations: true,
      legalComments: 'none',
      minifyIdentifiers: isProd,
      minifySyntax: isProd,
      minifyWhitespace: isProd,
      treeShaking: true,
    },

    // Experimental features
    experimental: {
      renderBuiltUrl(filename, { hostType }) {
        if (hostType === 'js') {
          return { js: `/${filename}` }
        } else {
          return { relative: true }
        }
      }
    }
  }
})