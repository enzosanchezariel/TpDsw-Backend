import { Request, Response, NextFunction } from 'express'
import { orm } from '../shared/db/orm.js' // Asegúrate de que la ruta sea correcta
import { User } from './user.entity.js'
import bcrypt from 'bcrypt'

const em = orm.em.fork(); // Utiliza un fork del EntityManager para manejar las solicitudes concurrentes

// Middleware para sanitizar la entrada de datos de User
function sanitizeUserInput(req: Request, res: Response, next: NextFunction) {
    if (!req.body) {
        return res.status(400).json({ message: 'Datos de entrada no proporcionados' });
    } else {
        req.body.sanitizedInput = {
            dni: req.body.dni,
            name: req.body.name,
            second_name: req.body.second_name,
            email: req.body.email,
            password: req.body.password,
            role: req.body.role
        };
        next();
    }
}

// Crear usuario
async function add(req: Request, res: Response) {
    try {
        req.body.sanitizedInput.password = await bcrypt.hash(req.body.sanitizedInput.password, 10);

        const existingUser = await em.findOne(User, { email: req.body.sanitizedInput.email });
        if (existingUser) {
            return res.status(400).json({ message: 'Usuario ya existe' });
        }

        const user = em.create(User, req.body.sanitizedInput);
        await em.persistAndFlush(user);
        res.status(201).json({ message: 'Usuario registrado con éxito', data: user });
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
}

// Obtener todos los usuarios
async function findAll(req: Request, res: Response) {
    try {
        const users = await em.find(User, {});
        res.status(200).json({ message: 'Usuarios encontrados', data: users });
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
}

// Obtener un usuario por DNI 
async function findOne(req: Request, res: Response) {
    try {
        const dni = req.params.dni;
        const user = await em.findOne(User, { dni });
        if (!user) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }
        res.status(200).json({ message: 'Usuario encontrado', data: user });
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
}

// Actualizar usuario
async function update(req: Request, res: Response) {
    try {
        const dni = req.params.dni;
        const userToUpdate = await em.findOneOrFail(User, { dni });

        if (req.body.sanitizedInput.password) {
            req.body.sanitizedInput.password = await bcrypt.hash(req.body.sanitizedInput.password, 10);
        }

        em.assign(userToUpdate, req.body.sanitizedInput);
        await em.flush();
        res.status(200).json({ message: 'Usuario actualizado con éxito', data: userToUpdate });
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
}

// Eliminar usuario
async function remove(req: Request, res: Response) {
    try {
        const dni = req.params.dni;
        const user = await em.findOneOrFail(User, { dni });
        await em.removeAndFlush(user);
        res.status(200).send('Usuario eliminado con éxito');
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
}

export { sanitizeUserInput, findAll, findOne, add, update, remove };