import { PrimaryKey, Property } from '@mikro-orm/core'

export abstract class BaseEntity {
    @PrimaryKey({autoincrement: true})
    id?: number

    /*
    @Property({ type: DateTimeType })
    createdAt? = new Date()

    @Property({
        type: DateTimeType,
        onUpdate: () => new Date(),
    })
    updatedAt? = new Date()
    */
}