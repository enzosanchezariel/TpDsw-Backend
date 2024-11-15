import { Request, Response, NextFunction } from 'express'
import { orm } from '../shared/db/orm.js'
import { Price } from '../price/price.entity.js'
import jwt from 'jsonwebtoken';
import { log } from 'console';
import { User } from '../user/user.entity.js';
import { Ticket } from './ticket.entity.js';
import { ProductAmount } from '../productamount/productamount.entity.js';
import { Delivery } from '../delivery/delivery.entity.js';
import { Collection, PopulatePath } from '@mikro-orm/core';
import { Product } from '../product/product.entity.js';
import { Discount } from '../discount/discount.entity.js';

const em = orm.em

function sanitizeTicketInput(req: Request, res: Response, next: NextFunction){
    if(!req.body){
        res.status(400).json({message: 'Invalid input'})
    } else {
        req.body.sanitizedInput = {
            product_amounts: req.body.product_amounts,
            //isDelivery: req.body.isDelivery,
            state: req.body.state,
        }
        next()
    }
}

async function findAll(req: Request, res: Response) {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'No AUTH token provided' });
    }

    const token = authHeader.split(' ')[1]; // Extraer el token después de "Bearer "
    let user: User | undefined;

    try {
        const data = jwt.verify(token, process.env.JWT_SECRET as string);
        user = await em.findOneOrFail(User, { token_id: (data as any).id });
    } catch (error) {
        return res.status(401).json({ message: 'Error while trying to authenticate' });
    }

    if (!user || (user.role !== 'admin' && user.role !== 'empleado')) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    try {
        const tickets = await em.find(Ticket, {}, { populate: ['product_amounts', 'delivery'] });
        res.status(200).json({ message: 'Found all tickets', data: tickets });
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
}

async function findAllByUser(req: Request, res: Response) {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'No AUTH token provided' });
    }

    const token = authHeader.split(' ')[1]; // Extraer el token después de "Bearer "
    let user: User | undefined;

    try {
        const data = jwt.verify(token, process.env.JWT_SECRET as string);
        user = await em.findOneOrFail(User, { token_id: (data as any).id });
    } catch (error) {
        return res.status(401).json({ message: 'Error while trying to authenticate' });
    }

    try {
        const token_id = req.params.token_id;

        const userRequested = await em.findOneOrFail(User, { token_id });

        if (!userRequested) {
            return res.status(404).json({ message: 'User not found' });
        }

        if (userRequested.token_id !== user.token_id && user.role !== 'admin' && user.role !== 'empleado') {
            return res.status(401).json({ message: 'Unauthorized' });
        }

        const tickets = await em.find(Ticket, { user: userRequested }, { populate: ['product_amounts', 'delivery'] });
        res.status(200).json({ message: 'Found all tickets', data: tickets });

    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
}

async function findOne(req: Request, res: Response) {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'No AUTH token provided' });
    }

    const token = authHeader.split(' ')[1]; // Extraer el token después de "Bearer "
    let user: User | undefined;

    try {
        const data = jwt.verify(token, process.env.JWT_SECRET as string);
        user = await em.findOneOrFail(User, { token_id: (data as any).id });
    } catch (error) {
        return res.status(401).json({ message: 'Error while trying to authenticate' });
    }

    if (!user) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    try {
        const number = Number.parseInt(req.params.number);

        const ticket = await em.findOneOrFail(
            Ticket,
            { number },
            { populate: ['product_amounts', 'delivery'] }
        );

        if (ticket.user.token_id !== user.token_id && user.role !== 'admin' && user.role !== 'empleado') {
            return res.status(401).json({ message: 'Unauthorized' });
        }

        res.status(200).json({ message: 'Found ticket', data: ticket });
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
}


async function add(req: Request, res: Response) {
    const token = req.body.access_token;
    let user: User | undefined;

    if (!token) {
        return res.status(401).json({ message: 'No AUTH token provided' });
    }

    try {
        const data = jwt.verify(token, process.env.JWT_SECRET as string);
        user = await em.findOneOrFail(User, { token_id: (data as any).id });
    } catch (error) {
        return res.status(401).json({ message: 'Error while trying to authenticate' });
    }

    if (!req.body.sanitizedInput.product_amounts || !user) {
        return res.status(400).json({ message: 'All fields are required' });
    }

    try {
        // Use a proper async loop to populate the newPAs array
        let newPAs: { product: number; amount: number; discount: number | undefined }[] = [];
        
        // Using Promise.all to ensure all async operations complete before continuing
        await Promise.all(req.body.sanitizedInput.product_amounts.map(async (aProductAmount: any) => {
            let newPa: { product: number, amount: number, discount: number | undefined } = { 
                product: -1, 
                amount: -1, 
                discount: undefined 
            };

            newPa.product = aProductAmount.product;
            newPa.amount = aProductAmount.amount;

            // Fetch the product with the discount info
            const foundProduct = await em.findOneOrFail(Product, { id: aProductAmount.product }, { populate: ['discount'] });
            if (foundProduct.discount && aProductAmount.amount >= foundProduct.discount.units) {
                newPa.discount = foundProduct.discount.id;
            }

            // Push the populated object to newPAs
            newPAs.push(newPa);
        }));

        // Now we can safely create the ticket as all async operations are done
        const ticket = em.create(Ticket, { ...req.body.sanitizedInput, product_amounts: newPAs, user });

        await em.persistAndFlush(ticket);
        res.status(201).json({ message: 'Ticket created', data: ticket });
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
}

// Los usuarios comunes solo pueden actualizar sus pedidos y solo si estan en preparacion
// Los empleados y los admins pueden actualizar cualquier pedido
async function update(req: Request, res: Response) {

    const token = req.body.access_token;
    let user: User | undefined;
    if (!token) {
        return res.status(401).json({ message: 'No AUTH token provided' });
    }
    try {
        const data = jwt.verify(token, process.env.JWT_SECRET as string);
        user = await em.findOneOrFail(User, { token_id: (data as any).id });
    } catch (error) {
        return res.status(401).json({ message: 'Error while trying to authenticate' });
    }

    try {
        const number = Number.parseInt(req.params.number);
        
        const ticketToUpdate = await em.findOneOrFail(Ticket, { number }, { populate: ['product_amounts', 'delivery'] });
        if (!ticketToUpdate) {
            return res.status(404).json({ message: 'Ticket not found' });
        }
        if (ticketToUpdate.user.token_id !== user.token_id && user.role !== 'admin' && user.role !== 'empleado') {
            return res.status(401).json({ message: 'Unauthorized' });
        }

        if (ticketToUpdate.state !== 'enPreparacion' && ticketToUpdate.user.token_id === user.token_id && user.role !== 'admin' && user.role !== 'empleado') {
            return res.status(400).json({ message: 'Ticket can only be updated if it is in "enPreparacion" state' });
        }

        if (ticketToUpdate.product_amounts.length > 0) {
            ticketToUpdate.product_amounts.getItems().forEach((pa) => em.remove(pa));
        }

        if (!req.body.sanitizedInput.product_amounts) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        ticketToUpdate.date = new Date();

        req.body.sanitizedInput.product_amounts.forEach((aProductAmount: ProductAmount) => {
            const productAmount = new ProductAmount();
            try {
                productAmount.amount = aProductAmount.amount;
                productAmount.product = aProductAmount.product;
                productAmount.ticket = ticketToUpdate;
                ticketToUpdate.product_amounts.add(productAmount);
            } catch (error: any) {
                return res.status(500).json({ message: "Error in product_amount syntax: " + error.message });
            }
        });

        /*
        if (ticketToUpdate.delivery && !req.body.sanitizedInput.isDelivery) {
            em.remove(ticketToUpdate.delivery);
            ticketToUpdate.delivery = undefined;
        }

        if (req.body.sanitizedInput.isDelivery) {
            const newDelivery = new Delivery();
            if (ticketToUpdate.delivery) {
                ticketToUpdate.delivery.tracking_number = newDelivery.tracking_number;
            } else {
                ticketToUpdate.delivery = newDelivery;
                ticketToUpdate.delivery.ticket = ticketToUpdate;
            }
        }
        */

        await em.flush();
        res.status(200).json({ message: 'Ticket updated', data: ticketToUpdate });
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
}

// Los usuarios comunes solo pueden eliminar sus pedidos y solo si estan en preparacion
// Los empleados y los admins pueden eliminar cualquier pedido
async function remove(req: Request, res: Response) {
    const authHeader = req.headers.authorization;
    let user: User | undefined;

    // Verificar que el encabezado esté presente y tenga el formato correcto
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'No AUTH token provided or invalid format' });
    }

    // Extraer el token eliminando el prefijo "Bearer "
    const token = authHeader.split(' ')[1];

    try {
        const data = jwt.verify(token, process.env.JWT_SECRET as string);
        user = await em.findOneOrFail(User, { token_id: (data as any).id });
    } catch (error) {
        return res.status(401).json({ message: 'Error while trying to authenticate' });
    }

    if (!user) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    try {
        const number = Number.parseInt(req.params.number);

        const ticket = await em.findOneOrFail(Ticket, { number }, { populate: ['product_amounts', 'delivery'] });

        if (!ticket) {
            return res.status(404).json({ message: 'Ticket not found' });
        }

        const ticketUser = em.getReference(User, ticket.user);

        if (ticketUser.token_id !== user.token_id && user.role !== 'admin' && user.role !== 'empleado') {
            return res.status(401).json({ message: 'Unauthorized' });
        }

        if (ticket.state !== 'enPreparacion' && ticketUser.token_id === user.token_id && user.role !== 'admin' && user.role !== 'empleado') {
            return res.status(400).json({ message: 'Ticket can only be removed if it is in "enPreparacion" state' });
        }

        ticket.state = "rechazado";

        await em.flush();

        res.status(200).json({ message: 'Ticket removed' });
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
}

async function changeTicketState(req: Request, res: Response) {
    const token = req.body.access_token;
    let user: User | undefined;
    if (!token) {
        return res.status(401).json({ message: 'No AUTH token provided' });
    }
    try {
        const data = jwt.verify(token, process.env.JWT_SECRET as string);
        user = await em.findOneOrFail(User, { token_id: (data as any).id });
    } catch (error) {
        return res.status(401).json({ message: 'Error while trying to authenticate' });
    }

    if (!user) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    try {
        if (user.role !== 'admin' && user.role !== 'empleado') {
            return res.status(401).json({ message: 'Unauthorized' });
        }

        const number = Number.parseInt(req.params.number);
        const ticket = await em.findOneOrFail(Ticket, { number });

        if (!ticket) {
            return res.status(404).json({ message: 'Ticket not found' });
        }

        console.log("b");

        if (req.body.sanitizedInput.state !== 'enPreparacion' && req.body.sanitizedInput.state !== 'rechazado' && req.body.sanitizedInput.state !== 'enEnvio' && req.body.sanitizedInput.state !== 'enviado') {
            return res.status(400).json({ message: 'Invalid state' });
        }

        console.log("c");
        
        if (req.body.sanitizedInput.state === 'rechazado') {
            ticket.state = 'rechazado';
        } else if (req.body.sanitizedInput.state === 'enEnvio') {
            if (ticket.state === 'enPreparacion') {
                
                const newDelivery = new Delivery();
                ticket.delivery = newDelivery;
                ticket.delivery.ticket = ticket;
                
                ticket.state = 'enEnvio';
            } else {
                return res.status(400).json({ message: 'Invalid state change' });
            }
        } else if (req.body.sanitizedInput.state === 'enviado') {
            if (ticket.state === 'enEnvio') {

                if (ticket.delivery) {
                    ticket.delivery.date = new Date();
                }

                ticket.state = 'enviado';
            } else {
                return res.status(400).json({ message: 'Invalid state change' });
            }
        }

        await em.flush();

        res.status(200).json({ message: 'Ticket state changed' });
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
    
}

export { sanitizeTicketInput, findAll, findOne, add, update, remove, findAllByUser, changeTicketState}