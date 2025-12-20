import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import vueDevTools from 'vite-plugin-vue-devtools'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    vueJsx(),
    vueDevTools(),
    {
      name: 'local-api-mock',
      configureServer(server) {
        server.middlewares.use(async (req, res, next) => {
          if (req.url?.startsWith('/api/proxy-image')) {
            const urlParams = new URL(req.url, `http://${req.headers.host}`)
            const targetUrl = urlParams.searchParams.get('url')
            
            if (!targetUrl) {
              res.statusCode = 400
              res.end(JSON.stringify({ error: 'URL is required' }))
              return
            }

            try {
              const response = await fetch(targetUrl)
              if (!response.ok) {
                res.statusCode = response.status
                res.end(JSON.stringify({ error: 'Failed to fetch image' }))
                return
              }

              const contentType = response.headers.get('content-type')
              const arrayBuffer = await response.arrayBuffer()
              const buffer = Buffer.from(arrayBuffer)

              if (contentType) res.setHeader('Content-Type', contentType)
              res.setHeader('Access-Control-Allow-Origin', '*')
              res.setHeader('Cache-Control', 'public, max-age=86400')
              res.end(buffer)
            } catch (error) {
              console.error('Local proxy error:', error)
              res.statusCode = 500
              res.end(JSON.stringify({ error: 'Internal server error' }))
            }
            return
          }

          // Basic mock for /api/view and /api/stats to avoid errors locally
          if (req.url?.startsWith('/api/view') || req.url?.startsWith('/api/stats')) {
            res.setHeader('Content-Type', 'application/json')
            if (req.url.startsWith('/api/view') && req.method === 'GET') {
              // Return some dummy data so the leaderboard isn't empty locally
              res.end(JSON.stringify({ 
                success: true, 
                topAthletes: [
                  { athleteId: '14300261', views: 150, updatedAt: new Date().toISOString() },
                  { athleteId: '14474566', views: 120, updatedAt: new Date().toISOString() },
                  { athleteId: '14567432', views: 95, updatedAt: new Date().toISOString() }
                ] 
              }))
            } else if (req.url.startsWith('/api/stats')) {
              res.end(JSON.stringify({ success: true, uniqueAthletes: 42, totalViews: 1337 }))
            } else {
              res.end(JSON.stringify({ success: true }))
            }
            return
          }

          next()
        })
      }
    }
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    },
  },
})
