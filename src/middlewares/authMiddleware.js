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

// seek -> next() es algo nuevo — investiga para qué sirve en Express y luego intenta el código.

// next() -> next() es una función que se usa en middlewares para pasar el control al siguiente middleware en la cadena de ejecución.
// next() es el mecanismo para continuar la cadena de middlewares.
// Con JWT lo usas después de verificar exitosamente el token para permitir el acceso a la ruta protegida.
// Si falla la verificación, respondes con error y omites next().