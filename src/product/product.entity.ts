import { Entity, Property, Cascade, ManyToOne, OneToMany, Collection, Rel} from '@mikro-orm/core'
import { BaseEntity } from '../shared/db/baseEntity.entity.js';
import { Category } from '../category/category.entity.js';
import { Price } from '../price/price.entity.js';
import { Discount } from '../discount/discount.entity.js';

@Entity()
export class Product extends BaseEntity{

    @Property({nullable: false})
    name!: string
    
    @Property({nullable: false})
    stock!: number

    @Property({nullable: false})
    img!: string
    
    @Property({nullable: false})
    desc!: string

    @Property({ default: 'active' })  // O 'inactive' / 'deleted'
    status!: string; 

    @OneToMany(() => Price, (price) => price.product, {cascade: [Cascade.ALL]})
    prices = new Collection<Price>(this)
    
    @ManyToOne(() => Category)
    category!: Rel<Category>;
    
    @ManyToOne(() => Discount, {nullable: true})
    discount?: Rel<Discount>;

}