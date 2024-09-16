import { Request, Response } from 'express';
import { User } from './user.model.js';
import { MikroORM } from '@mikro-orm/core';

// Controlador para el registro de usuario
export const signUp = async (req: Request, res: Response) => {
  const orm = req.app.get('orm') as MikroORM;
  const { username, password, role } = req.body;

  const user = orm.em.create(User, { username, password, role });
  await orm.em.persistAndFlush(user);

  return res.status(201).json({ message: 'User created', user });
};

// Controlador para el login
export const login = async (req: Request, res: Response) => {
  const orm = req.app.get('orm') as MikroORM;
  const { username, password } = req.body;

  const user = await orm.em.findOne(User, { username, password });

  if (!user) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }

  if (user.role === 'empleado') {
    // Lógica para empleados
  } else if (user.role === 'cliente') {
    // Lógica para clientes
  }

  return res.status(200).json({ message: 'Login successful', user });
};
