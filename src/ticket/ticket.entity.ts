import { Cascade, Collection, DateTimeType, Entity, ManyToOne, OneToMany, OneToOne, PrimaryKey, Property, Rel } from '@mikro-orm/core'
import { ProductAmount } from '../productamount/productamount.entity.js';
import { User } from '../user/user.entity.js';
import { Delivery } from '../delivery/delivery.entity.js';

@Entity()
export class Ticket {

    @PrimaryKey({autoincrement: true})
    number?: number

    @Property({type: DateTimeType})
    date: Date = new Date()

    // enPreparacion, rechazado, enEnvio, enviado.
    @Property({nullable: true})
    state?: string = 'enPreparacion'

    @ManyToOne(() => User, {nullable: true, deleteRule: 'set null'})
    user!: Rel<User>

    @OneToMany(() => ProductAmount, (product_amounts) => product_amounts.ticket, {cascade: [Cascade.ALL]})
    product_amounts = new Collection<ProductAmount>(this)

    @OneToOne(() => Delivery, {nullable: true, cascade: [Cascade.ALL]})
    delivery?: Rel<Delivery>
    
}