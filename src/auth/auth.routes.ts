import { Router } from 'express';
import { login, signUp } from './auth.controller';

const router = Router();

// Ruta para el registro de usuarios
router.post('/signup', signUp);

// Ruta para el login de usuarios
router.post('/login', login);

export default router;
