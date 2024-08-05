import { Repository } from "../shared/repository";
import { Product } from "./product.entity.js";

const products = [
    new Product(0,"Coca-Cola",850),
    new Product(1,"Mayonesa",1001),
    new Product(2,"Pepsi",123),
    new Product(3,"Guaymallen",234),
    new Product(4,"Turrón",2323),
    new Product(5,"Banana",344),
    new Product(6,"Tomate",4545),
    new Product(7,"Webo",656),
    new Product(8,"Zanahoria",6778)
];

// TODO: Cambiar el array por una Base de Datos

export class ProductRepository implements Repository<Product>{
    public findAll(): Product[] | undefined {
        return products
    }
    public findOne(item: {id: string}): Product | undefined {
        return products.find((product) => product.id === parseInt(item.id))
    }
    public add(item: Product): Product {
        products.push(item)
        return item
    }
    public update(item: Product): Product | undefined {
        const productIdx = products.findIndex((product) => product.id === item.id)
        if(productIdx !== -1){
            products[productIdx] = item
            return item
        }else{
            return undefined
        }
    }
    public delete(item: { id: string; }): Product | undefined {
        const productIdx = products.findIndex((product) => product.id === parseInt(item.id))
        if(productIdx !== -1){
            const product = products[productIdx]
            products.splice(productIdx,1)
            return product
        }else{
            return undefined
        }
    }
}