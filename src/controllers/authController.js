import bcrypt from 'bcryptjs'
import pool from '../db.js'
import jwt from 'jsonwebtoken'

const register = async (req, res) => {
    try {
        const { nombre, email, password } = req.body
        if (!nombre || !email || !password) {
            return res.status(400).json({ mensaje: 'Todos los campos son obligatorios' })
        }
        const emailValido = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
        if (!emailValido) {
            return res.status(400).json({ mensaje: 'El email no tiene un formato válido' })
        }
        const [existing] = await pool.query(
            'SELECT id FROM usuarios WHERE email = ?',
            [email]
        )
        if (existing.length > 0) {
            return res.status(400).json({ mensaje: 'El email ya está registrado' })
        }
        const passwordHash = await bcrypt.hash(password, 10)
        await pool.query(
            'INSERT INTO usuarios (nombre, email, password) VALUES (?, ?, ?)',
            [nombre, email, passwordHash]
        )
        res.status(201).json({ mensaje: 'Usuario registrado correctamente' })
    } catch (error) {
        res.status(500).json({ mensaje: 'Error interno del servidor' })
    }
}

const login = async (req, res) => {
    try {
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
    } catch (error) {
        res.status(500).json({ mensaje: 'Error interno del servidor' })
    }
}

export { register, login }