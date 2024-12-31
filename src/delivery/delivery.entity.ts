import { DateTimeType, Entity, OneToOne, Property, Rel } from '@mikro-orm/core'
import { Ticket } from '../ticket/ticket.entity.js';

@Entity()
export class Delivery {

    @Property({ nullable: false })
    tracking_number?: string = crypto.randomUUID();
    
    @Property({ type: DateTimeType, nullable: true })
    date: Date | null = null;

    @OneToOne(() => Ticket, { primary: true })
    ticket!: Rel<Ticket>
    
}