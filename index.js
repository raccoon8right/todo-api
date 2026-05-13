import express from 'express'
import 'dotenv/config'
import authRoutes from './src/routes/authRoutes.js'
import tareasRoutes from './src/routes/tareasRoutes.js'
import cors from 'cors'

const app = express()
app.use(cors())
app.use(express.json())

app.use('/auth', authRoutes)
app.use('/tareas', tareasRoutes)

const port = process.env.PORT || 3000

process.on('SIGTERM', () => {
    console.log('SIGTERM recibido, cerrando servidor...')
    process.exit(0)
})

app.listen(port, '0.0.0.0', () => {
    console.log(`Servidor en http://localhost:${port}`)
})