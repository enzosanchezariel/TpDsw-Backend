import { Entity, Property } from '@mikro-orm/core'
import { BaseEntity } from '../shared/db/baseEntity.entity.js';

@Entity()
export class User extends BaseEntity{
    @Property()
    dni!: string

    @Property({nullable: false})
    name!: string

    @Property({nullable: false})
    second_name!: string

    @Property({ unique: true })
    email!: string;

    @Property()
    password!: string;

    @Property({nullable: false})
    role!: string;  // Puede ser 'cliente' o 'empleado'
}