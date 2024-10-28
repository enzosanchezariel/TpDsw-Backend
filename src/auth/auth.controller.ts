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
    if (await bcrypt.compare(password, user.password)) {
      const token = jwt.sign(
        { id: user.token_id },
        process.env.JWT_SECRET as string,
        {
          expiresIn: '1h'
        });
      return res.status(200).json({
        message: 'Login successful',
        data: {
          access_token: token,
          role: user.role
        }
      });
    } else {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
  } catch (error: any) {
      res.status(500).json({ message: error.message });
  }
}

export {sanitizeAuthInput, login};