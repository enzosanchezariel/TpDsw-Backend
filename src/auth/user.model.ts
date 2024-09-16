import { Entity, Property, Unique } from '@mikro-orm/core';
import { BaseEntity } from '../shared/db/baseEntity.entity.js';

@Entity()
export class User extends BaseEntity {

  @Property({ nullable: false })
  @Unique()
  username!: string;

  @Property({ nullable: false })
  password!: string;

  @Property({ nullable: false })
  role!: string;  // Puede ser 'cliente' o 'empleado'
}
