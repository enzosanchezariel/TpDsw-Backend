import { Request, Response, NextFunction } from 'express'
import { ProductRepository } from './product.repository.js'
import { Product } from './product.entity.js'

const repository = new ProductRepository()

function sanitizeProductInput(req: Request, res: Response, next: NextFunction){
    if(!req.body){}else{
        req.body.sanitizedInput = {
            id: req.body.id,
            name: req.body.name,
            stock: req.body.stock
        }
       next()
    }
}

function findAll(req: Request, res: Response) {
    res.json({data: repository.findAll()})
}

function findOne(req: Request, res: Response) {
    const id = req.params.id
    const product = repository.findOne({id})
    if(!product){
        return res.status(404).send({message: 'Producto no encontrado'})
    }else{
        return res.json({data: product})
    }
}


function add(req: Request, res: Response) {
    const input = req.body.sanitizedInput
    const productInput = new Product(0, input.name, input.stock)
    const product = repository.add(productInput)
    return res.status(201).send({message: 'Producto creado', data: product})
}

function update(req: Request, res: Response) {
    req.body.sanitizedInput.id = parseInt(req.params.id)
    
    const product = repository.update(req.body.sanitizedInput)

    if(!product){
        return res.status(404).send({message: 'Producto no encontrado'})
    }else{
        return res.status(201).send({message: 'Producto actualizado', data: product})
    }
}

function remove(req: Request, res: Response) {
    const id = req.params.id
    const product = repository.delete({id})
    if(!product){
        return res.status(404).send({message: 'Producto no encontrado'})
    }else{
        return res.status(200).send({message: 'Producto eliminado'})
    }
}


export { sanitizeProductInput, findAll, findOne, add, update, remove}