import express from 'express';
// Ejecutar server express
const app = express();
app.use('/', (req, res) => {
    res.send("Hello!");
});
app.listen(3000, () => {
    console.log("Server runnning");
});
// Definir una entity para el crud
class Producto {
    constructor(codProd, descProd, stock) {
        this.codProd = codProd;
        this.stock = stock;
        this.descProd = descProd;
    }
    set setStock(newStock) {
        this.stock = newStock;
    }
    get getStock() {
        return this.stock;
    }
    set setDescProd(newDescProd) {
        this.descProd = newDescProd;
    }
    get getDescProd() {
        return this.descProd;
    }
    set setCodProd(newCodProd) {
        this.codProd = newCodProd;
    }
    get getCodProd() {
        return this.codProd;
    }
}
const p1 = new Producto(0, "Coca-Cola", 850);
p1.setStock = 300;
//# sourceMappingURL=index.js.map