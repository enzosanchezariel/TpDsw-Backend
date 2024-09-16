import 'reflect-metadata';
import express from 'express';
import { orm, syncSchema } from './shared/db/orm.js';
import { RequestContext } from '@mikro-orm/core';
import {productRouter} from './product/product.routes.js';
import {categoryRouter} from './category/category.routes.js';
import {discountRouter} from './discount/discount.routes.js';
import { login, signUp } from './auth/auth.controller.js';
import { userRouter } from './user/user.routes.js';

const app = express();

app.use(express.json());

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET, PUT, POST, DELETE");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.use((req, res, next) => {
  RequestContext.create(orm.em, next);
});

app.use('/api/products', productRouter);
app.use('/api/discounts', discountRouter);
app.use('/api/categories', categoryRouter);

// Rutas de autenticación
app.post('/api/login', login);
app.post('/api/signup', signUp);

// Ruta de usuario
app.use('/api/users', userRouter); // Usa el nuevo router

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

startServer().catch(err => {
  console.error('Error starting server:', err);
});