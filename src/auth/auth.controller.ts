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

// Controlador para el login
async function login(req: Request, res: Response) {

  try {
    const email = req.body.sanitizedInput.email;
    const password = req.body.sanitizedInput.password;
    const user = await em.findOne(User, { email });
    if (!user) {
        return res.status(404).json({ message: 'User not found' });
    }
    //res.status(200).json({ message: 'Usuario encontrado', data: user });
    if (await bcrypt.compare(password, user.password)) {
      //
      const token = jwt.sign(
        { id: user.token_id },
        process.env.JWT_SECRET as string,
        {
          expiresIn: '1h'
        });
      res.cookie('access_token', token, {
        httpOnly: true,
        sameSite: 'strict',
        maxAge: 1000 * 60 * 60
      });
      return res.status(200).json({ message: 'Login successful' });
    } else {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
  } catch (error: any) {
      res.status(500).json({ message: error.message });
  }
}

async function logout(req: Request, res: Response) {
  await res.clearCookie('access_token');
  return res.status(200).json({ message: 'Logout successful' });
}

// Para utilizar la cookie en cualquier parte del backend

/*
  import jwt from 'jsonwebtoken';
  const token = req.cookies.access_token;
  if (!token) {
    return res.status(401).json({ message: 'Unauthorized' });
  }
  try {
    const data = jwt.verify(req.cookies.access_token, process.env.JWT_SECRET as string);
  } catch (error) {
    return res.status(401).json({ message: 'Unauthorized' });
  }
*/

export {sanitizeAuthInput, login, logout};