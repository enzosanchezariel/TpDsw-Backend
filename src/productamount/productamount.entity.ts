import { Cascade, Collection, DateTimeType, Entity, ManyToOne, OneToMany, OneToOne, PrimaryKey, Property, Rel } from '@mikro-orm/core'
import { BaseEntity } from '../shared/db/baseEntity.entity.js';
import { Ticket } from '../ticket/ticket.entity.js';
import { Product } from '../product/product.entity.js';
import { Discount } from '../discount/discount.entity.js';

@Entity()
export class ProductAmount {

    @Property({ nullable: false })
    amount!: number;

    @ManyToOne(() => Product, { primary: true, cascade: [Cascade.ALL], nullable: false })
    product!: Rel<Product>

    @ManyToOne(() => Ticket, { primary: true })
    ticket!: Rel<Ticket>

    @ManyToOne(() => Discount, { nullable: true })
    discount?: Rel<Discount>

}