import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import path from 'path';
// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),  // 将 @ 映射到 src 目录
    },
  },
  server: {
    proxy: {
      '/api': {//获取路径中包含了/api的请求
        target: 'http://localhost:8080',//后台服务所在的源
        changeOrigin: true,//修改源
        rewrite: (path) => path.replace(/^\/api/, '')///api替换为''
      }
    }
  }
})
