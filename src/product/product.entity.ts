import {
    Entity, Property, ManyToMany, Cascade, ManyToOne, Rel } from '@mikro-orm/core'
import { BaseEntity } from '../shared/db/baseEntity.entity.js';

@Entity()
export class Product extends BaseEntity{

    @Property({nullable: false})
    name!: string
    
    @Property({nullable: false})
    stock!: number

    @Property({nullable: false})
    img?: string
    
}