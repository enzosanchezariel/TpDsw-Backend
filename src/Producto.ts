class Producto{
    codProd: number;
    stock: number;
    descProd: string;
    
    constructor(codProd: number, descProd: string, stock: number){
        this.codProd = codProd;
        this.stock = stock;
        this.descProd = descProd;
    }

    set setStock(newStock: number){
        this.stock = newStock;
    }
    
    get getStock(){
        return this.stock;
    }
    
    set setDescProd(newDescProd: string){
        this.descProd = newDescProd;
    }
    
    get getDescProd(){
        return this.descProd;
    }

    set setCodProd(newCodProd: number){
        this.codProd = newCodProd;
    }
    
    get getCodProd(){
        return this.codProd;
    }
}