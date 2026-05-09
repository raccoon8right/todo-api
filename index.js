/*
import mysql from 'mysql2/promise'
import pool from './src/db.js'
const app = express()
app.use(express.json())
app.get('/', (req, res) => { })
app.post('/', (req, res) => { })
app.put('/', (req, res) => { })
app.patch('/', (req, res) => { })
app.delete('/', (req, res) => { })
const port = 1234
app.listen(port, () => {
    console.log(`Servidor en http://localhost:${port}`)
})
*/
import express from 'express'
import 'dotenv/config'

import authRoutes from './src/routes/authRoutes.js'
import tareasRoutes from './src/routes/tareasRoutes.js'

const app = express()
app.use(express.json())

// Rutas
app.use('/auth', authRoutes)
app.use('/tareas', tareasRoutes)

const port = process.env.PORT || 3000
app.listen(port, () => {
    console.log(`Servidor en http://localhost:${port}`)
})