import express from 'express'
import 'dotenv/config'
import pool from './src/db.js'
import authRoutes from './src/routes/authRoutes.js'
import tareasRoutes from './src/routes/tareasRoutes.js'
import cors from 'cors'

console.log('Variables de entorno:', {
    DB_HOST: process.env.DB_HOST,
    DB_USER: process.env.DB_USER,
    DB_NAME: process.env.DB_NAME,
    DB_PORT: process.env.DB_PORT,
    PORT: process.env.PORT
})

const app = express()
app.use(cors())
app.use(express.json())

app.use('/auth', authRoutes)
app.use('/tareas', tareasRoutes)

const port = process.env.PORT || 3000

pool.getConnection()
    .then(conn => {
        console.log('Conexión a la base de datos exitosa')
        conn.release()
    })
    .catch(err => {
        console.error('Error conectando a la base de datos:', err.message)
    })

process.on('uncaughtException', (error) => {
    console.error('Error no capturado:', error)
})

process.on('unhandledRejection', (error) => {
    console.error('Promesa rechazada:', error)
})

app.listen(port, '0.0.0.0', () => {
    console.log(`Servidor en http://localhost:${port}`)
})

process.on('SIGTERM', () => {
    console.log('SIGTERM recibido, cerrando servidor...')
    process.exit(0)
})