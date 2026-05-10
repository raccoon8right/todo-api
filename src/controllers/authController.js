import bcrypt from 'bcryptjs'
import pool from '../db.js'
import jwt from 'jsonwebtoken'

const register = async (req, res) => {
    try {
        const { nombre, email, password } = req.body // step 1
        if (!nombre || !email || !password) {
            return res.status(400).json({ mensaje: 'Todos los campos son obligatorios' }) // step 2
        }
        const passwordHash = await bcrypt.hash(password, 10) // step 3
        await pool.query(
            'INSERT INTO usuarios (nombre, email, password) VALUES (?, ?, ?)',
            [nombre, email, passwordHash] // step 4
        )
        res.status(201).json({ mensaje: 'Usuario registrado correctamente' }) // step 5
    } catch (error) {
        res.status(500).json({ mensaje: 'Error al interno del servidor' })
    }
}

const login = async (req, res) => {
    const { email, password } = req.body
    if (!email || !password) {
        return res.status(400).json({ mensaje: 'Todos los campos son obligatorios' })
    }
    const [users] = await pool.query(
        'SELECT * FROM usuarios WHERE email = ?',
        [email]
    )
    if (users.length === 0) {
        return res.status(401).json({ mensaje: 'Credenciales incorrectas' })
    }
    const usuario = users[0]
    const passwordValido = await bcrypt.compare(password, usuario.password)
    if (!passwordValido) {
        return res.status(401).json({ mensaje: 'Credenciales incorrectas' })
    }
    const token = jwt.sign(
        { id: usuario.id, email: usuario.email },
        process.env.JWT_SECRET,
        { expiresIn: '24h' }
    )
    res.status(200).json({ token })
}

export { register, login }