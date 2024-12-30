import { Router } from 'express'
import { sanitizeProductInput, findAll, findOne, add, update, remove, search, deactivate, increaseStock } from './product.controller.js'

export const productRouter = Router()

productRouter.get('/', findAll)
productRouter.get('/search', search)
productRouter.get('/:id', findOne)
productRouter.post('/', sanitizeProductInput, add)
productRouter.post('/:id/increase-stock', increaseStock)
productRouter.put('/:id', sanitizeProductInput, update)
productRouter.patch('/:id', deactivate)
productRouter.delete('/:id', remove)