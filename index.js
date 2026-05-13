import express from 'express'
console.log('Variables de entorno:', {
    DB_HOST: process.env.DB_HOST,
    DB_USER: process.env.DB_USER,
    DB_NAME: process.env.DB_NAME,
    DB_PORT: process.env.DB_PORT,
    PORT: process.env.PORT
})
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

process.on('uncaughtException', (error) => {
    console.error('Error no capturado:', error)
})

process.on('unhandledRejection', (error) => {
    console.error('Promesa rechazada:', error)
})

app.listen(port, '0.0.0.0', () => {
    console.log(`Servidor en http://localhost:${port}`)
})