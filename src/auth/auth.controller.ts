import { NextFunction, Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { orm } from '../shared/db/orm.js';
import { User } from '../user/user.entity.js';

const em = orm.em.fork();

function sanitizeAuthInput(req: Request, res: Response, next: NextFunction) {
  if (!req.body) {
      return res.status(400).json({ message: 'Datos de entrada no proporcionados' });
  } else {
      req.body.sanitizedInput = {
          email: req.body.email,
          password: req.body.password
      };
      next();
  }
}

async function login(req: Request, res: Response) {
  try {
    const email = req.body.sanitizedInput.email;
    const password = req.body.sanitizedInput.password;
    const user = await em.findOne(User, { email });

    if (!user) {
        return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    if (await bcrypt.compare(password, user.password)) {
      const token = jwt.sign(
        { id: user.token_id },
        process.env.JWT_SECRET as string,
        { expiresIn: '23h' }
      );

      return res.status(200).json({
        message: 'Inicio de sesión exitoso',
        data: { access_token: token, role: user.role, token_id: user.token_id }
      });
    } else {
      return res.status(401).json({ message: 'Correo electrónico y/o contraseña incorrectos.' });
    }
  } catch (error: any) {
    console.error('Error en login:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
}

export { sanitizeAuthInput, login };
