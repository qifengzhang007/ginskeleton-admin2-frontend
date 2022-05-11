import path from 'path'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import Icons from 'unplugin-icons/vite'
import IconsResolver from 'unplugin-icons/resolver'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'
import Inspect from 'vite-plugin-inspect'

const baseUrl = {
  development: './',
  release: './'
}

const pathSrc = path.resolve(__dirname, 'src')
export default ({ mode }) =>  defineConfig({
  base: baseUrl[mode],
  resolve: {
    alias: {
      '@': pathSrc,
      '_c': path.resolve(__dirname, 'src/components'),
    }
  },
  plugins: [
    vue(),
    AutoImport({
      resolvers: [
          ElementPlusResolver(),
        // 自动导入图标组件
        IconsResolver({
          prefix: 'Icon',
        }),
      ],
      dts: path.resolve(pathSrc, 'auto-imports.d.ts'),
    }),
    Components({
      resolvers: [
        // 自动注册图标组件
        IconsResolver({
          enabledCollections: ['ep'],
        }),
          ElementPlusResolver(),

      ],
      dts: path.resolve(pathSrc, 'components.d.ts'),
    }),
    Icons({
      autoInstall: true,
    }),
    Inspect(),
  ],
  // server: {
  //   proxy: {
  //     '/api': {
  //       target: 'http://127.0.0.1:20201',
  //       changeOrigin: true,
  //       //rewrite: path => path.replace(/^\//, '')
  //       rewrite: path=> path.replace(/^\/api/, '')
  //     }
  //   }
  // }
})
