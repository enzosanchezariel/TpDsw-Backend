import { Router } from 'express'
import { sanitizeDiscountInput, findAll, findOne, add, update, remove, desactivate } from './discount.controller.js'

export const discountRouter = Router()

discountRouter.get('/', findAll)
discountRouter.get('/:id', findOne)
discountRouter.post('/', sanitizeDiscountInput, add)
discountRouter.put('/:id', sanitizeDiscountInput, update)
discountRouter.patch('/:id', desactivate)
discountRouter.delete('/:id', remove)