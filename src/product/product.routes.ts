import { Router } from 'express'
import { sanitizeProductInput, findAll, findOne, add, update, search, deactivate } from './product.controller.js'

export const productRouter = Router()

productRouter.get('/', findAll)
productRouter.get('/search', search)
productRouter.get('/:id', findOne)
productRouter.post('/', sanitizeProductInput, add)
productRouter.put('/:id', sanitizeProductInput, update)
productRouter.patch('/:id', deactivate)
productRouter.delete('/:id', deactivate)