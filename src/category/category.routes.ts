import { Router } from 'express';
import { sanitizeCategoryInput, findAll, findOne, add, update, desactivateCategory  } from './category.controller.js';

export const categoryRouter = Router();

categoryRouter.get('/', findAll); // Ruta para obtener todas las categorías
categoryRouter.get('/:id', findOne);
categoryRouter.post('/', sanitizeCategoryInput, add); // Ruta para agregar una nueva categoría
categoryRouter.put('/:id', sanitizeCategoryInput, update); // Ruta para actualizar una categoría
categoryRouter.delete('/:id', desactivateCategory); // Ruta para desactivar (baja lógica) una categoría
