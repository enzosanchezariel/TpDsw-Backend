import express from 'express'
// Ejecutar server express
import { Producto } from './Producto.js'

const app = express()

/*app.use('/', (req, res) => {
    res.json({message : '<h1> Hello!! </h1>'})
})*/

const productos = [
    new Producto(0,"Coca-Cola",850),
    new Producto(0,"Mayonesa",1001),
    new Producto(0,"Pepsi",123),
    new Producto(0,"Guaymallen",234),
    new Producto(0,"Turrón",2323),
    new Producto(0,"Banana",344),
    new Producto(0,"Tomate",4545),
    new Producto(0,"Webo",656),
    new Producto(0,"Zanahoria",6778)
];

app.get('/api/productos',(req,res) => {
    res.json(productos)
})

app.listen(3000, () => {
    console.log('Server running on http://localhost:3000/')
})

/* 26/7 -> Desarrollar y entregar el código un GET ALL desde el front-end al back-end ya
desarrollado antes (listar múltiples elementos de una colección).*/