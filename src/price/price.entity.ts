import { Entity, Property, ManyToOne, DateTimeType, PrimaryKey, Rel } from '@mikro-orm/core'
import { Product } from '../product/product.entity.js';

@Entity()
export class Price {

    @PrimaryKey({type: DateTimeType})
    date: Date = new Date();
    
    @Property({ nullable: false })
    price!: number;

    @ManyToOne(() => Product)
    product!: Rel<Product>;

}