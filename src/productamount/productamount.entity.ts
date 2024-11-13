import { Collection, DateTimeType, Entity, ManyToOne, OneToMany, OneToOne, PrimaryKey, Property, Rel } from '@mikro-orm/core'
import { BaseEntity } from '../shared/db/baseEntity.entity.js';
import { Ticket } from '../ticket/ticket.entity.js';
import { Product } from '../product/product.entity.js';

@Entity()
export class ProductAmount {

    @Property({ nullable: false })
    amount!: number;

    @ManyToOne(() => Product, { primary: true })
    product!: Rel<Product>

    @ManyToOne(() => Ticket, { primary: true })
    ticket!: Rel<Ticket>

}