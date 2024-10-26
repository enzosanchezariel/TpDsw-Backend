import { Router } from 'express';
import { login, logout, sanitizeAuthInput } from './auth.controller.js';

const authRouter = Router();

// Ruta para el login de usuarios
authRouter.post('/login', sanitizeAuthInput, login);
authRouter.post('/logout', logout);

export default authRouter;