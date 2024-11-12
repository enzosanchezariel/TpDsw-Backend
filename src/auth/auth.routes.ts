import { Router } from 'express';
import { login, sanitizeAuthInput } from './auth.controller.js';

const authRouter = Router();

// Ruta para el login de usuarios
authRouter.post('/auth/login', sanitizeAuthInput, login);

export default authRouter;