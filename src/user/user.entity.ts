import { Entity, PrimaryKey, Property } from '@mikro-orm/core'
import { BaseEntity } from '../shared/db/baseEntity.entity.js';

@Entity()
export class User {

    @PrimaryKey()
    token_id?: string

    @Property()
    dni!: string

    @Property({nullable: false})
    name!: string

    @Property({nullable: false})
    last_name!: string

    @Property({ unique: true })
    email!: string;

    @Property({nullable: false})
    phone!: string;

    @Property({nullable: false})
    address!: string;               // Se asume que se trabaja solamente en Rosario, unicamente se pide la dirección

    @Property()
    password!: string;

    @Property({nullable: false})
    role!: string;  // Puede ser 'cliente', 'admin' o 'empleado'
}