import { Router } from 'express';
import { sanitizeUserInput, findAll, findOne, add, update, remove } from './user.controller.js';

export const userRouter = Router();

// Rutas de usuario
userRouter.get('/', findAll);                // Obtener todos los usuarios
userRouter.get('/:dni', findOne);            // Obtener un usuario por DNI
userRouter.post('/', sanitizeUserInput, add); // Crear un nuevo usuario
userRouter.put('/:dni', sanitizeUserInput, update); // Actualizar un usuario por DNI (PUT)
userRouter.patch('/:dni', sanitizeUserInput, update); // Actualizar un usuario parcialmente (PATCH)
userRouter.delete('/:dni', remove);          // Eliminar un usuario por DNI