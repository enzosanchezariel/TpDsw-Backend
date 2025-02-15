import { Router } from 'express'
import { sanitizeProductInput, findAll, findOne, add, update, search, desactivate, increaseStock } from './product.controller.js'


export const productRouter = Router()

productRouter.get('/', findAll)
productRouter.get('/search', search)
productRouter.get('/:id', findOne)
productRouter.post('/', sanitizeProductInput, add)
productRouter.post('/:id/increase-stock', increaseStock)
productRouter.put('/:id', sanitizeProductInput, update)
productRouter.patch('/:id', desactivate)
productRouter.delete('/:id', desactivate)