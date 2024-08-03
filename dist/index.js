import express from 'express';
import { Producto } from './Producto.js';
const app = express();
app.use(express.json());
const productos = [
    new Producto(0, "Coca-Cola", 850),
    new Producto(1, "Mayonesa", 1001),
    new Producto(2, "Pepsi", 123),
    new Producto(3, "Guaymallen", 234),
    new Producto(4, "Turrón", 2323),
    new Producto(5, "Banana", 344),
    new Producto(6, "Tomate", 4545),
    new Producto(7, "Webo", 656),
    new Producto(8, "Zanahoria", 6778)
];
// TODO: Pasar todos los chequeos de datos de los métodos http a una única funcion/middleware de sanitizeInput
/*function sanitizarInputProducto(req: Request, res: Response, next: NextFunction){
    if(!req.body){}else{
        req.body.sanitizedInput = {
            codProd: req.body.codProd,
            descProd: req.body.descProd,
            stock: req.body.stock
        }
       next()
    }
}*/
// TODO: Todos los métodos http estan hechos con el array de prueba
app.get('/api/productos', (req, res) => {
    console.log("GET a /api/productos realizado");
    res.json(productos);
});
app.get('/api/productos/:id', (req, res) => {
    const producto = productos.find((producto) => producto.codProd === parseInt(req.params.id));
    if (!producto) {
        res.status(404).send({ message: 'Producto no encontrado' });
    }
    else {
        console.log("GET a /api/productos/" + req.params.id + " realizado");
    }
    res.json(producto);
});
app.post('/api/productos', (req, res) => {
    const { stock, descProd } = req.body;
    if (!stock || !descProd) {
        res.status(400).send({ message: 'Faltan datos' });
    }
    else {
        console.log("POST a /api/productos realizado:", req.body);
        const producto = new Producto(productos.length, descProd, stock);
        productos.push(producto);
        res.status(201).send({ message: 'Producto creado', data: producto });
    }
});
app.put('/api/productos/:id', (req, res) => {
    const indexProducto = productos.findIndex((producto) => producto.codProd === parseInt(req.params.id));
    const { stock, descProd } = req.body;
    if (indexProducto === -1 || !stock || !descProd) {
        res.status(404).send({ message: 'Producto no encontrado o faltan datos' });
    }
    else {
        console.log("PUT a /api/productos/" + req.params.id + " realizado:", req.body);
        productos[indexProducto] = new Producto(indexProducto, descProd, stock);
        res.status(201).send({ message: 'Producto actualizado', data: productos[indexProducto] });
    }
});
app.listen(3000, () => {
    console.log('Server running on http://localhost:3000/');
});
//# sourceMappingURL=index.js.map