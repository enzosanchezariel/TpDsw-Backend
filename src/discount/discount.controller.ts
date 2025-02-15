import { Request, Response, NextFunction } from 'express'
import { orm } from '../shared/db/orm.js'
import { Discount } from './discount.entity.js'
import { Product } from '../product/product.entity.js'

const em = orm.em

// TODO: Chequear que el porcentaje sea un número entre 0 y 100

function sanitizeDiscountInput(req: Request, res: Response, next: NextFunction){
    if(!req.body){
        return res.status(400).json({message: 'No input provided'})
    }else{
        const {percentage, units} = req.body
        if (typeof percentage !== 'number' || percentage < 0 || percentage > 100){
            return res.status(400).json({message: 'Percentage must be a number between 0 and 100'})
        }
        req.body.sanitizedInput = {
            percentage: req.body.percentage,
            units: req.body.units,
            status: req.body.status
        }
        next()
    }
}

async function findAll(req: Request, res: Response) {
    try {
        const discounts = await em.find(Discount, {status: 'active' })
        res.status(200).json({ message: 'Found all discounts', data: discounts })
    } catch (error: any) {
        res.status(500).json({ message: error.message })
    }
}

async function findOne(req: Request, res: Response) {
    try {
        const id = Number.parseInt(req.params.id)
        const discount = await em.findOneOrFail(Discount, { id, status: 'active' })
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
        const id = Number.parseInt(req.params.id);
        const discountToUpdate = await em.findOneOrFail(Discount, { id });

        // Verificar que req.body.sanitizedInput tiene los datos esperados
        if (!req.body.sanitizedInput || Object.keys(req.body.sanitizedInput).length === 0) {
            return res.status(400).json({ message: 'No data provided for update.' });
        }

        // Asignar solo los campos válidos, asegurándose de que 'status' no sea undefined
        const sanitizedInput = req.body.sanitizedInput;

        // Evitar la asignación del id
        delete sanitizedInput.id;

        // Asegurarse de que el 'status' no sea undefined
        if (sanitizedInput.status === undefined) {
            sanitizedInput.status = discountToUpdate.status;  // Mantener el valor actual de 'status'
        }

        // Asignar los valores al objeto de descuento
        em.assign(discountToUpdate, sanitizedInput);

        // Guardar los cambios en la base de datos
        await em.flush();

        // Enviar respuesta de éxito
        res.status(200).json({ message: 'Discount updated', data: discountToUpdate });
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
}



async function remove(req: Request, res: Response) {
    try {
        const id = Number.parseInt(req.params.id)
        const discount = em.getReference(Discount, id)
        await em.removeAndFlush(discount)
        res.status(200).json('Discount removed')
    } catch (error: any) {
        res.status(500).json({ message: error.message })
    }
}

async function desactivate(req: Request, res: Response) {
try {
        const id = Number.parseInt(req.params.id);

        // Encuentra el descuento a dar de baja
        const discountToDeactivate = await em.findOneOrFail(Discount, { id });

        // Encuentra los productos relacionados al descuento
        const relatedProducts: Product[] = await em.find(Product, { discount: discountToDeactivate });

        if (relatedProducts.length > 0) {
            console.log(`El descuento ${id} está asociado a ${relatedProducts.length} producto(s). Eliminando relaciones...`);

            // Elimina la relación con el descuento en cada producto
            for (const product of relatedProducts) {
                product.discount = undefined; // Desvincula el descuento
                em.persist(product);    // Marca los cambios para persistencia
            }

            // Guarda los cambios en la base de datos
            await em.flush();

            console.log(`Relaciones con los productos eliminadas correctamente.`);
        } else {
            console.log(`El descuento ${id} no tiene productos relacionados.`);
        }

        // Cambia el estado del descuento a 'inactive' para baja lógica
        discountToDeactivate.status = 'inactive';

        // Guarda el cambio de estado del descuento
        await em.flush();

        res.status(200).json({ message: 'Discount deactivated successfully' });
    } catch (error: any) {
        console.error('Error durante la desactivación del descuento:', error);
        res.status(500).json({ message: error.message });
    }
}


export { sanitizeDiscountInput, findAll, findOne, add, update, remove, desactivate}