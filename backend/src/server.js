import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import morgan from 'morgan'
import healthRoutes from './routes/health.js'
import postRoutes from './routes/posts.js'
import eventRoutes from './routes/events.js'
import resourceRoutes from './routes/resources.js'
import galleryRoutes from './routes/gallery.js'
import formRoutes from './routes/forms.js'
import miscRoutes from './routes/misc.js'
import dashboardRoutes from './routes/dashboard.js'
import searchRoutes from './routes/search.js'
import analyticsRoutes from './routes/analytics.js'
import userRoutes from './routes/users.js'
import settingsRoutes from './routes/settings.js'
import uploadRoutes from './routes/uploads.js'
import { notFound, errorHandler } from './middleware/error.js'

const app = express()
const port = Number(process.env.PORT || 5001)
const origins = (process.env.FRONTEND_URL || 'http://localhost:3000').split(',').map(s => s.trim())

app.set('trust proxy', 1)
app.use(helmet())
app.use(cors({ origin: origins, credentials: true }))
app.use(express.json({ limit: '500kb' }))
app.use(express.urlencoded({ extended: true, limit: '500kb' }))
app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'))

app.use('/api/health', healthRoutes)
app.use('/api/posts', postRoutes)
app.use('/api/events', eventRoutes)
app.use('/api/resources', resourceRoutes)
app.use('/api/gallery', galleryRoutes)
app.use('/api/forms', formRoutes)
app.use('/api', miscRoutes)
app.use('/api/dashboard', dashboardRoutes)
app.use('/api/search', searchRoutes)
app.use('/api/analytics', analyticsRoutes)
app.use('/api/users', userRoutes)
app.use('/api/settings', settingsRoutes)
app.use('/api/uploads', uploadRoutes)

app.use(notFound)
app.use(errorHandler)

const server = app.listen(port, () => {
  console.log(`PCM backend running on http://localhost:${port}`)
})

function shutdown(signal) {
  console.log(`${signal} received. Closing HTTP server...`)
  server.close((error) => {
    if (error) {
      console.error('Error during shutdown:', error)
      process.exit(1)
    }
    process.exit(0)
  })
  setTimeout(() => process.exit(1), 10000).unref()
}

process.on('SIGTERM', () => shutdown('SIGTERM'))
process.on('SIGINT', () => shutdown('SIGINT'))
