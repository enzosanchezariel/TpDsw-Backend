import 'reflect-metadata'
import express from 'express'
import { orm, syncSchema } from './shared/db/orm.js'
import { RequestContext } from '@mikro-orm/core'
import { productRouter } from './product/product.routes.js';

const app = express()

app.use(express.json())

app.use((req, res, next) => {
  RequestContext.create(orm.em, next)
})

app.use('/api/products', productRouter)

app.use((_, res) => {
  return res.status(404).send({ message: 'Resource not found' })
})

// Evitar en producción
await syncSchema()

app.listen(3000, () => {
  console.log('Server runnning on http://localhost:3000/')
})