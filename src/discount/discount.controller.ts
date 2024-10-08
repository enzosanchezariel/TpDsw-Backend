import { Request, Response, NextFunction } from 'express'
import { orm } from '../shared/db/orm.js'
import { Discount } from './discount.entity.js'

const em = orm.em

// TODO: Chequear que el porcentaje sea un número entre 0 y 100

function sanitizeDiscountInput(req: Request, res: Response, next: NextFunction){
    if(!req.body){}else{
        req.body.sanitizedInput = {
            percentage: req.body.percentage,
            units: req.body.units
        }
        next()
    }
}

async function findAll(req: Request, res: Response) {
    try {
        const discounts = await em.find(Discount, {})
        res.status(200).json({ message: 'Found all discounts', data: discounts })
    } catch (error: any) {
        res.status(500).json({ message: error.message })
    }
}

async function findOne(req: Request, res: Response) {
    try {
        const id = Number.parseInt(req.params.id)
        const discount = await em.findOneOrFail(Discount, { id })
        res.status(200).json({ message: 'Found discount', data: discount })
    } catch (error: any) {
        res.status(500).json({ message: error.message })
    }
}


async function add(req: Request, res: Response) {
    try {
        req.body.sanitizedInput.id = undefined
        const discount = em.create(Discount, req.body.sanitizedInput)
        await em.flush()
        res.status(201).json({ message: 'Discount created', data: discount })
    } catch (error: any) {
        res.status(500).json({ message: error.message })
    }
}

async function update(req: Request, res: Response) {
    try {
        const id = Number.parseInt(req.params.id)
        const discountToUpdate = await em.findOneOrFail(Discount, { id })
        req.body.sanitizedInput.id = id
        em.assign(discountToUpdate, req.body.sanitizedInput)
        await em.flush()
        res.status(200).json({ message: 'Discount updated', data: discountToUpdate })
    } catch (error: any) {
        res.status(500).json({ message: error.message })
    }
}

async function remove(req: Request, res: Response) {
    try {
        const id = Number.parseInt(req.params.id)
        const discount = em.getReference(Discount, id)
        await em.removeAndFlush(discount)
        res.status(200).send('Discount removed')
    } catch (error: any) {
        res.status(500).json({ message: error.message })
    }
}


export { sanitizeDiscountInput, findAll, findOne, add, update, remove}