import { Request, Response, NextFunction } from 'express'
import { Product } from './product.entity.js'
import { orm } from '../shared/db/orm.js'
import { Price } from '../price/price.entity.js'

const em = orm.em

function sanitizeProductInput(req: Request, res: Response, next: NextFunction){
    if(!req.body){}else{
        req.body.sanitizedInput = {
            desc: req.body.desc,
            name: req.body.name,
            stock: req.body.stock,
            img: req.body.img,

            price: req.body.price,
                // Creado y actualizado junto al producto
                // Es opcional en update porque la clave foranea la tiene el precio

                // Tener en cuenta que en la clase de producto, el atributo se llama prices
                // Price es solo para la request, para crear una instancia de Price con price = req.body.sanitizedInput.price
            discount: req.body.discount,
                // Creado anteriormente
                // Desde este controlador solo se cambia el id de la relacion
                // Desde el controlador de descuentos se actualiza el descuento
                // Es opcional en update porque admite null
            category: req.body.category
                // Debe haber por lo menos una categoria registrada antes de crear un producto
                // Es necesaria en update porque tiene clave foranea
        }
       next()
    }
}

async function findAll(req: Request, res: Response) {
    try {
        const products = await em.find(Product, {}, {populate: ['category', 'discount', 'prices']})
        res.status(200).json({ message: 'Found all products', data: products })
    } catch (error: any) {
        res.status(500).json({ message: error.message })
    }
}

async function findOne(req: Request, res: Response) {
    try {
        const id = Number.parseInt(req.params.id)
        const product = await em.findOneOrFail(Product, { id }, {populate: ['category', 'discount', 'prices']})
        res.status(200).json({ message: 'Found product', data: product })
    } catch (error: any) {
        res.status(500).json({ message: error.message })
    }
}


async function add(req: Request, res: Response) {
    try {
        req.body.sanitizedInput.id = undefined
        const product = em.create(Product, req.body.sanitizedInput)
        const price = new Price()
        price.price = req.body.sanitizedInput.price
        //const price = em.create(Price, req.body.sanitizedInput.prices)
        product.prices.add(price)
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
        if (req.body.sanitizedInput.price) {
            const price = new Price()
            price.price = req.body.sanitizedInput.price
            productToUpdate.prices.add(price)
        }
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