import path from 'path'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
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
      ],
      dts: path.resolve(pathSrc, 'auto-imports.d.ts'),
    }),
    Components({
      resolvers: [
          ElementPlusResolver(),
      ],
      dts: path.resolve(pathSrc, 'components.d.ts'),
    }),
    Inspect(),
  ],
})
