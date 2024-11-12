import { Entity, Property, ManyToMany, Cascade, ManyToOne, Rel, OneToMany, Collection } from '@mikro-orm/core'
import { BaseEntity } from '../shared/db/baseEntity.entity.js';
import { Product } from '../product/product.entity.js';

@Entity()
export class Category extends BaseEntity{

    @Property({nullable: false})
    name!: string
    
    @OneToMany(() => Product, (product) => product.category, {cascade: [Cascade.ALL]})
    products = new Collection<Product>(this)
}