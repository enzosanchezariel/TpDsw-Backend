import { Request, Response, NextFunction } from 'express'
import { orm } from '../shared/db/orm.js'
import { Category } from './category.entity.js'

const em = orm.em

function sanitizeCategoryInput(req: Request, res: Response, next: NextFunction){
    if(req.body && req.body.name){
        req.body.sanitizedInput = {
            name: req.body.name,
        }
        next();
    }else{
        res.status(400).json({message: 'Invalid input'})
    }
}

async function findAll(req: Request, res: Response) {
    const em = orm.em.fork();
    try {
        const categories = await em.find(Category, {})
        res.status(200).json({ message: 'Found all categories', data: categories })
    } catch (error: any) {
        res.status(500).json({ message: error.message })
    }
}

async function findOne(req: Request, res: Response) {
    const em = orm.em.fork();
    try {
        const id = Number.parseInt(req.params.id)
        const category = await em.findOneOrFail(Category, { id })
        if (!category) {
            return res.status(404).json({ message: 'Category not found' });
        }
        res.status(200).json({ message: 'Found category', data: category })
    } catch (error: any) {
        res.status(500).json({ message: error.message })
    }
}


async function add(req: Request, res: Response) {
    const em = orm.em.fork();
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
    const em = orm.em.fork();
    try {
        const id = Number.parseInt(req.params.id)
        const categoryToUpdate = await em.findOneOrFail(Category, { id })
        if (!categoryToUpdate) {
            return res.status(404).json({ message: 'Category not found' });
        }
        req.body.sanitizedInput.id = id
        em.assign(categoryToUpdate, req.body.sanitizedInput)
        await em.flush()
        res.status(200).json({ message: 'Category updated', data: categoryToUpdate })
    } catch (error: any) {
        res.status(500).json({ message: error.message })
    }
}

async function remove(req: Request, res: Response) {
    const em = orm.em.fork();
    try {
        const id = Number.parseInt(req.params.id)
        const category = em.getReference(Category, id)
        if (!category) {
            return res.status(404).json({ message: 'Category not found' });
        }
        await em.removeAndFlush(category)
        res.status(200).json('Category removed')
    } catch (error: any) {
        res.status(500).json({ message: error.message })
    }
}


export { sanitizeCategoryInput, findAll, findOne, add, update, remove}