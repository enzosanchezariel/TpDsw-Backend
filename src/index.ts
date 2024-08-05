import express from 'express'
import { productRouter } from './product/product.routes.js';

const app = express()

app.use(express.json())

app.use('/api/products', productRouter)

app.use((req, res)=>{
    res.status(404).send({message: 'Ruta no encontrada'})
})

app.listen(3000, () => {
    console.log('Server running on http://localhost:3000/')
})