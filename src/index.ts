import 'reflect-metadata';
import express from 'express';
import cors from 'cors'; // Agregado para simplificar el manejo de CORS
import { orm, syncSchema } from './shared/db/orm.js';
import { RequestContext } from '@mikro-orm/core';
import { productRouter } from './product/product.routes.js';
import { categoryRouter } from './category/category.routes.js';
import { discountRouter } from './discount/discount.routes.js';
import { login, signUp } from './auth/auth.controller.js';
import { userRouter } from './user/user.routes.js';

const app = express();

app.use(express.json());
app.use(cors()); // Simplificado CORS

app.use((req, res, next) => {
  RequestContext.create(orm.em, next);
});

// Rutas de la API
app.use('/api/products', productRouter);
app.use('/api/discounts', discountRouter);
app.use('/api/categories', categoryRouter);

// Rutas de autenticación
app.post('/api/login', login);
app.post('/api/signup', signUp);

// Ruta de usuario
app.use('/api/users', userRouter);

// Manejo de errores
app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err.stack);
  res.status(500).send({ message: 'Something went wrong!' });
});

// Manejador de recursos no encontrados
app.use((_, res) => {
  return res.status(404).send({ message: 'Resource not found' });
});

// Función para iniciar el servidor
async function startServer() {
  await syncSchema(); // Evitar en producción
  app.listen(3000, () => {
    console.log('Server running on http://localhost:3000/');
  });
}

// Iniciar el servidor
startServer().catch(err => {
  console.error('Error starting server:', err);
});
