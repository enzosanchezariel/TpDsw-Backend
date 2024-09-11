import { Collection, Entity, OneToMany, Property, Rel } from "@mikro-orm/core"
import { Product } from "../product/product.entity.js"
import { BaseEntity } from "../shared/db/baseEntity.entity.js"

@Entity()
export class Discount extends BaseEntity{
    
    @Property({nullable: false})
    percentage!: number

    @Property({nullable: false})
    units!: number

    @OneToMany(() => Product, (product) => product.discount, {nullable: true})
    products? = new Collection<Product>(this)
}