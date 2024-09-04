import { Request, Response, NextFunction } from 'express'
import { Product } from './product.entity.js'
import { orm } from '../shared/db/orm.js'

const em = orm.em

// No chequea tipo de dato
function sanitizeProductInput(req: Request, res: Response, next: NextFunction){
    if(!req.body){}else{
        req.body.sanitizedInput = {
            id: req.body.id,
            name: req.body.name,
            stock: req.body.stock,
            img: req.body.img
        }
       next()
    }
}

async function findAll(req: Request, res: Response) {
    try {
        const products = await em.find(Product, {})
        res.status(200).json({ message: 'Found all products', data: products })
    } catch (error: any) {
        res.status(500).json({ message: error.message })
    }
}

async function findOne(req: Request, res: Response) {
    try {
        const id = Number.parseInt(req.params.id)
        const product = await em.findOneOrFail(Product, { id })
        res.status(200).json({ message: 'Found product', data: product })
    } catch (error: any) {
        res.status(500).json({ message: error.message })
    }
}


async function add(req: Request, res: Response) {
    try {
        req.body.sanitizedInput.id = undefined
        const product = em.create(Product, req.body.sanitizedInput)
        await em.flush()
        res.status(201).json({ message: 'Product created', data: product })
    } catch (error: any) {
        res.status(500).json({ message: error.message })
    }
}

async function update(req: Request, res: Response) {
    try {
        const id = Number.parseInt(req.params.id)
        const productToUpdate = await em.findOneOrFail(Product, { id })
        req.body.sanitizedInput.id = id
        em.assign(productToUpdate, req.body.sanitizedInput)
        await em.flush()
        res.status(200).json({ message: 'Product updated', data: productToUpdate })
    } catch (error: any) {
        res.status(500).json({ message: error.message })
    }
}

async function remove(req: Request, res: Response) {
    try {
        const id = Number.parseInt(req.params.id)
        const product = em.getReference(Product, id)
        await em.removeAndFlush(product)
        res.status(200).send('Product removed')
    } catch (error: any) {
        res.status(500).json({ message: error.message })
    }
}


export { sanitizeProductInput, findAll, findOne, add, update, remove}