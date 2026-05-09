/*
import index from '../index.js';
index.post('/login', async (req, res) => {
    const { nombre, email, password } = req.body
    await check('nombre')
    .notEmpty().withMessage('El nombre no puede ser vacia')
    await check('email')
    .notEmpty().withMessage('El email no puede ser vacia')
    await check('password')
    .notEmpty().withMessage('La contraseña no puede ser vacia')
    .run(req)
})
// nose usar bcryptjs para encriptar la contraseña
// nose insertar a la base de datos
const result = varlidationResult(req)
if (!result.isEmpty()) {
    return res.status(400).json({ mensaje: result.mapped() })
}
res.send({ mensaje: 'Usuario registrado correctamente' })
*/
// FLujo de trabajo -->> index.js → authRoutes.js → authController.js → db.js
// sin express-validator
import bcrypt from 'bcryptjs'
import pool from '../db.js'
import jwt from 'jsonwebtoken'
/**
 * @description Registra un nuevo usuario 
 * step 1 - recibir los datos
 * step 2 - validar los datos
 * step 3 - encriptar/hashear la contraseña
 * step 4 - insertar el usuario en la base de datos
 * step 5 - responder al cliente
*/
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
/**
 * @description Autentica a un usuario existente
 */
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
        { expiresIn: '24h'}
    )
    res.status(200).json({ token })
}

export { register, login }

// Un dato interesante — ese token no está encriptado, está codificado en Base64. 
// Puedes ver su contenido en jwt.io, pega el token ahí y verás el payload con el id y email que guardaste.


// Seek ->
// ¿Qué significa el 10 en bcrypt.hash(password, 10)?
// ¿Por qué usamos ? en el SQL en lugar de escribir los valores directamente?
// ¿Qué diferencia hay entre res.status(200) y res.status(201)?

// Sought ->
// En bcrypt.hash(password, 10), el número 10 es el factor de trabajo (también llamado salt rounds o cost factor).
// Representa el número de iteraciones del algoritmo de derivación de clave como 2^10 = 1024 veces. 
// Es decir, el hash se calcula aplicando la función de forma recursiva 1024 veces.
// El 10 de bcrypt se llama salt rounds — mientras más alto, más seguro pero más lento. 10 es el estándar en la industria.

// usamos ? para blindar la aplicación contra inyección SQL y aprovechar la eficiencia de las consultas preparadas. 
// Nunca confíes en datos de usuario para construir SQL directamente.

// 200 OK -> Cualquier operación exitosa que no crea un recurso o que devuelve datos de uno existente.
// 201 Created -> Específicamente cuando se crea un recurso nuevo como resultado directo de la petición.

// Looking for ->
// 1. bcrypt.compare(plainTextPassword, hashedPassword)
// Compara una contraseña en texto plano (la que envía el usuario) con el hash almacenado en la base de datos.
// Devuelve true si coinciden, false en caso contrario.
// Es asíncrono (usa async/await o callback).

// 2. jwt.sign(payload, secretOrPrivateKey, [options, callback])
// Genera un token JWT firmado.
// payload: objeto con la información que quieres incluir (ej. { id: usuario.id, email: usuario.email }). No incluyas datos sensibles como contraseñas.
// secretOrPrivateKey: string secreta (o clave privada RSA) para firmar el token.
// options: objeto opcional con expiresIn (ej. '1h', '7d'), algorithm, etc.