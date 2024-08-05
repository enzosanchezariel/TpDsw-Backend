import express from 'express';
import { Product } from './product/product.entity.js';
import { ProductRepository } from "./product/product.repository.js";
const app = express();
app.use(express.json());
const repository = new ProductRepository();
function sanitizeProductInput(req, res, next) {
    if (!req.body) { }
    else {
        req.body.sanitizedInput = {
            id: req.body.id,
            name: req.body.name,
            stock: req.body.stock
        };
        next();
    }
}
app.get('/api/products', (req, res) => {
    res.json({ data: repository.findAll() });
});
app.get('/api/products/:id', (req, res) => {
    const id = req.params.id;
    const product = repository.findOne({ id });
    if (!product) {
        return res.status(404).send({ message: 'Producto no encontrado' });
    }
    else {
        return res.json({ data: product });
    }
});
app.post('/api/products', sanitizeProductInput, (req, res) => {
    const input = req.body.sanitizedInput;
    const productInput = new Product(0, input.name, input.stock);
    const product = repository.add(productInput);
    return res.status(201).send({ message: 'Producto creado', data: product });
});
app.put('/api/products/:id', sanitizeProductInput, (req, res) => {
    req.body.sanitizedInput.id = parseInt(req.params.id);
    const product = repository.update(req.body.sanitizedInput);
    if (!product) {
        return res.status(404).send({ message: 'Producto no encontrado' });
    }
    else {
        return res.status(201).send({ message: 'Producto actualizado', data: product });
    }
});
app.patch('/api/products/:id', sanitizeProductInput, (req, res) => {
    req.body.sanitizedInput.id = parseInt(req.params.id);
    const product = repository.update(req.body.sanitizedInput);
    if (!product) {
        return res.status(404).send({ message: 'Producto no encontrado' });
    }
    else {
        return res.status(201).send({ message: 'Producto actualizado', data: product });
    }
});
app.delete('/api/products/:id', (req, res) => {
    const id = req.params.id;
    const product = repository.delete({ id });
    if (!product) {
        return res.status(404).send({ message: 'Producto no encontrado' });
    }
    else {
        return res.status(200).send({ message: 'Producto eliminado' });
    }
});
app.use((req, res) => {
    res.status(404).send({ message: 'Ruta no encontrada' });
});
app.listen(3000, () => {
    console.log('Server running on http://localhost:3000/');
});
//# sourceMappingURL=index.js.map