import { Router } from 'express'
import { verificarToken } from '../middlewares/authMiddleware.js'
import { getTareas, crearTarea, editarTarea, eliminarTarea } from '../controllers/tareasController.js'

const router = Router()

router.get('/', verificarToken, getTareas)
router.post('/', verificarToken, crearTarea)
router.put('/:id', verificarToken, editarTarea)
router.delete('/:id', verificarToken, eliminarTarea)

export default router