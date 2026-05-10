import jwt from 'jsonwebtoken'

const verificarToken = (req, res, next) => {
    const authHeader = req.headers.authorization
    if (!authHeader) {
        return res.status(401).json({ error: 'Token no proporcionado' })
    }
    const token = authHeader.split(' ')[1] // Extraer el token después de "Bearer"
    try {
        const verificar = jwt.verify(token, process.env.JWT_SECRET)
        req.usuario = verificar // Guardar los datos del usuario en req.usuario
        next()
    } catch (error) {
        return res.status(401).json({ error: 'Token inválido o expirado' })
    }
}

export { verificarToken }