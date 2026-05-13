import pool from '../db.js'

const getTareas = async (req, res) => {
    try {
        const user_id = req.usuario.id
        const [tareas] = await pool.query(
            'SELECT * FROM tareas WHERE usuario_id = ?',
            [user_id]
        )
        res.json(tareas)
    } catch (error) {
        res.status(500).json({ mensaje: 'Error interno del servidor' })
    }
}

const crearTarea = async (req, res) => {
    try {
        const user_id = req.usuario.id
        const { titulo, descripcion } = req.body
        if (!titulo) {
            return res.status(400).json({ mensaje: 'El campo "titulo" es obligatorio' })
        }
        await pool.query(
            'INSERT INTO tareas (usuario_id, titulo, descripcion) VALUES (?, ?, ?)',
            [user_id, titulo, descripcion]
        )
        res.status(201).json({ mensaje: 'Tarea creada correctamente' })
    } catch (error) {
        res.status(500).json({ mensaje: 'Error interno del servidor' })
    }
}

const editarTarea = async (req, res) => {
    try {
        const user_id = req.usuario.id
        const { id } = req.params
        await pool.query(
            'UPDATE tareas SET titulo = ?, descripcion = ?, completada = ? WHERE id = ? AND usuario_id = ?',
            [req.body.titulo, req.body.descripcion, req.body.completada, id, user_id]
        )
        res.json({ mensaje: 'Tarea actualizada correctamente' })
    } catch (error) {
        res.status(500).json({ mensaje: 'Error interno del servidor' })
    }
}

const eliminarTarea = async (req, res) => {
    try {
        const user_id = req.usuario.id
        const { id } = req.params
        await pool.query(
            'DELETE FROM tareas WHERE id = ? AND usuario_id = ?',
            [id, user_id]
        )
        res.json({ mensaje: 'Tarea eliminada correctamente' })
    } catch (error) {
        res.status(500).json({ mensaje: 'Error interno del servidor' })
    }
}

export { getTareas, crearTarea, editarTarea, eliminarTarea }