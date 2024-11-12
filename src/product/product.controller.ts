import { Request, Response, NextFunction } from 'express'
import { Product } from './product.entity.js'
import { orm } from '../shared/db/orm.js'
import { Price } from '../price/price.entity.js'
import jwt from 'jsonwebtoken';
import { log } from 'console';
import { User } from '../user/user.entity.js';

const em = orm.em

function sanitizeProductInput(req: Request, res: Response, next: NextFunction){
    if(!req.body){}else{
        req.body.sanitizedInput = {
            desc: req.body.desc,
            name: req.body.name,
            stock: req.body.stock,
            img: req.body.img,
            prices: req.body.prices,
            discount: req.body.discount,
            category: req.body.category
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

    // Manejo de acceso
    const token = req.body.access_token;
    if (!token) {
        return res.status(401).json({ message: 'No AUTH token provided' });
    }
    try {
        const data = jwt.verify(token, process.env.JWT_SECRET as string);
        const user = await em.findOneOrFail(User, { token_id: (data as any).id });
        if (user.role == "cliente") {
            return res.status(401).json({ message: 'Unauthorized' });
        }
    } catch (error) {
        return res.status(401).json({ message: 'Error while trying to authenticate' });
    }

    try {
        const productData = req.body.sanitizedInput
        console.log('Datos recibidos:', productData)
        if (!req.body.sanitizedInput.prices) {
            return res.status(400).json({ message: 'Price is required' });
        }

        req.body.sanitizedInput.id = undefined
        const product = em.create(Product, req.body.sanitizedInput)
        const price = new Price()
        price.price = req.body.sanitizedInput.prices
        product.prices.add(price)
        await em.flush()
        res.status(201).json({ message: 'Product created', data: product })
    } catch (error: any) {
        res.status(500).json({ message: error.message })
    }
}

async function update(req: Request, res: Response) {
    try {
        const id = Number.parseInt(req.params.id);
        
        // Encuentra el producto a actualizar
        const productToUpdate = await em.findOneOrFail(Product, { id });
        if (!productToUpdate) {
            return res.status(404).json({ message: 'Product not found' });
        }

        // Extrae y valida el precio de la entrada
        const { prices, ...sanitizedInput } = req.body.sanitizedInput;
        if (!prices) {
            return res.status(400).json({ message: 'Price is required' });
        }

        // Crea una nueva instancia de Price y la asocia al producto
        const newPrice = new Price();
        newPrice.price = prices; // Asegúrate de que 'prices' contiene el valor numérico correcto
        newPrice.date = new Date();
        
        // Añade el nuevo precio al producto y guarda los cambios
        productToUpdate.prices.add(newPrice);
        em.assign(productToUpdate, sanitizedInput); // Asigna el resto de los campos actualizados del producto
        
        await em.flush(); // Guarda en la base de datos
        res.status(200).json({ message: 'Product updated', data: productToUpdate });
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
}

async function search(req: Request, res: Response) {
    const nameQuery = req.query.name as string;
    
    if (!nameQuery) {
        return res.status(400).json({ message: 'Debe proporcionar un nombre para la búsqueda' });
    }

    try {
        // Usar $like para realizar la búsqueda en la base de datos
        const products = await em.find(Product, {
            name: { $like: `%${nameQuery}%` }  // Búsqueda insensible a mayúsculas/minúsculas para cualquier coincidencia en "nameQuery"
        }, { populate: ['category', 'discount', 'prices'] });

        if (products.length === 0) {
            return res.status(404).json({ message: `No se encontraron productos para "${nameQuery}"` });
        }

        res.status(200).json({ message: 'Productos encontrados', data: products });
    } catch (error: any) {
        console.error('Error al buscar productos:', error);
        res.status(500).json({ message: 'Error al buscar productos' });
    }
}

async function remove(req: Request, res: Response) {
    try {
        const id = Number.parseInt(req.params.id);

        const prices = await em.find(Price, { product: id });
        await em.removeAndFlush(prices);

        const product = em.getReference(Product, id);
        await em.removeAndFlush(product);

        res.status(200).json({ message: 'Product and associated prices removed' });
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
}



export { sanitizeProductInput, findAll, findOne, add, update, remove, search}

function moment() {
    throw new Error('Function not implemented.');
}
