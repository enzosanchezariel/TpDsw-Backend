import { Request, Response, NextFunction } from 'express'
import { orm } from '../shared/db/orm.js'
import { Category } from './category.entity.js'
import { Product } from '../product/product.entity.js'
import { Price } from '../price/price.entity.js'

const em = orm.em

function sanitizeCategoryInput(req: Request, res: Response, next: NextFunction){
    if(req.body && req.body.name){
        req.body.sanitizedInput = {
            name: req.body.name,
            status: 'active'
        }
        next();
    }else{
        res.status(400).json({message: 'Invalid input'})
    }
}

async function findAll(req: Request, res: Response) {
    const em = orm.em.fork();
    try {
        const categories = await em.find(Category, { status: 'active' });

        if (categories.length === 0) {
            return res.status(404).json({ message: 'No active categories found' });
        }

        res.status(200).json({ message: 'Found active categories', data: categories });
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
}

async function findOne(req: Request, res: Response) {
    const em = orm.em.fork();
    try {
        const id = Number.parseInt(req.params.id);
        const category = await em.findOneOrFail(Category, { id, status: 'active' });
        if (!category) {
            return res.status(404).json({ message: 'Active category not found' });
        }
        res.status(200).json({ message: 'Found active category', data: category });
    } catch (error: any) {
        res.status(500).json({ message: error.message });
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

async function getProductsByCategory(req: Request, res: Response) {
  const em = orm.em.fork();
  try {
    // Asegúrate de que el parámetro `id` sea un número válido
    const categoryId = Number.parseInt(req.params.id);

    if (isNaN(categoryId)) {
      return res.status(400).json({ message: 'ID de categoría inválido' });
    }

    const products = await em.find(Product, { category: categoryId });
    res.status(200).json({ message: 'Productos encontrados', data: products });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}

async function remove(req: Request, res: Response) {
    const em = orm.em.fork();
    try {
        const id = Number.parseInt(req.params.id);

        // Buscar productos de la categoría
        const products = await em.find(Product, { category: id });

        if (products.length > 0) {
            // Eliminar precios asociados a los productos
            const productIds = products.map(product => product.id).filter(id => id !== undefined);
            await em.nativeDelete(Price, { product: productIds }); // Eliminar precios asociados

            // Eliminar los productos
            await em.nativeDelete(Product, { category: id }); // Eliminar productos
        }

        // Eliminar la categoría
        const category = await em.findOne(Category, id);
        if (!category) {
            return res.status(404).json({ message: 'Category not found' });
        }

        // Eliminar la categoría
        await em.nativeDelete(Category, { id: id });

        res.status(200).json('Category, products, and associated prices removed');
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
}

async function deactivateCategory(req: Request, res: Response) {
    const em = orm.em.fork();
    try {
        const categoryId = Number.parseInt(req.params.id);
        const category = await em.findOne(Category, categoryId);
        if (!category) {
            return res.status(404).json({ message: 'Category not found' });
        }
        category.status = 'inactive'; 
        await em.flush();
        const products = await em.find(Product, { category: categoryId });

        if (products.length > 0) {
            products.forEach(product => {
                product.status = 'inactive';
            });
            await em.flush();
        }

        res.status(200).json({ message: 'Category and associated products deactivated' });
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
}





export { sanitizeCategoryInput, findAll, findOne, add, update, remove, deactivateCategory}