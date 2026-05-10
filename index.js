import express from 'express'
import 'dotenv/config'
import authRoutes from './src/routes/authRoutes.js'
import tareasRoutes from './src/routes/tareasRoutes.js'

const app = express()
app.use(express.json())

app.use('/auth', authRoutes)
app.use('/tareas', tareasRoutes)

const port = process.env.PORT || 3000
app.listen(port, () => {
    console.log(`Servidor en http://localhost:${port}`)
})