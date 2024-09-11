import { Request, Response, NextFunction } from 'express'
import { orm } from '../shared/db/orm.js'
import { Category } from './category.entity.js'

const em = orm.em

function sanitizeCategoryInput(req: Request, res: Response, next: NextFunction){
    if(!req.body){}else{
        req.body.sanitizedInput = {
            name: req.body.name,
        }
       next()
    }
}

async function findAll(req: Request, res: Response) {
    try {
        const categories = await em.find(Category, {})
        res.status(200).json({ message: 'Found all categories', data: categories })
    } catch (error: any) {
        res.status(500).json({ message: error.message })
    }
}

async function findOne(req: Request, res: Response) {
    try {
        const id = Number.parseInt(req.params.id)
        const category = await em.findOneOrFail(Category, { id })
        res.status(200).json({ message: 'Found category', data: category })
    } catch (error: any) {
        res.status(500).json({ message: error.message })
    }
}


async function add(req: Request, res: Response) {
    try {
        req.body.sanitizedInput.id = undefined
        const category = em.create(Category, req.body.sanitizedInput)
        await em.flush()
        res.status(201).json({ message: 'Category created', data: category })
    } catch (error: any) {
        res.status(500).json({ message: error.message })
    }
}

async function update(req: Request, res: Response) {
    try {
        const id = Number.parseInt(req.params.id)
        const categoryToUpdate = await em.findOneOrFail(Category, { id })
        req.body.sanitizedInput.id = id
        em.assign(categoryToUpdate, req.body.sanitizedInput)
        await em.flush()
        res.status(200).json({ message: 'Category updated', data: categoryToUpdate })
    } catch (error: any) {
        res.status(500).json({ message: error.message })
    }
}

async function remove(req: Request, res: Response) {
    try {
        const id = Number.parseInt(req.params.id)
        const category = em.getReference(Category, id)
        await em.removeAndFlush(category)
        res.status(200).send('Category removed')
    } catch (error: any) {
        res.status(500).json({ message: error.message })
    }
}


export { sanitizeCategoryInput, findAll, findOne, add, update, remove}