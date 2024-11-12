import { Router } from 'express'
import { sanitizeDiscountInput, findAll, findOne, add, update, remove } from './discount.controller.js'

export const discountRouter = Router()

discountRouter.get('/', findAll)
discountRouter.get('/:id', findOne)
discountRouter.post('/', sanitizeDiscountInput, add)
discountRouter.put('/:id', sanitizeDiscountInput, update)
discountRouter.patch('/:id', sanitizeDiscountInput, update)
discountRouter.delete('/:id', remove)