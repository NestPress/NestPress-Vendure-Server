import { DeepPartial, VendureEntity } from "@vendure/core";
import { Column, Entity } from 'typeorm';

@Entity()
export class PhysicalAddress extends VendureEntity {
    constructor(init?: DeepPartial<PhysicalAddress>) {
        super(init);
    }

    @Column({ nullable: true })
    street?: string;

    @Column({ nullable: true })
    postalCode?: string;

    @Column({ nullable: true })
    city?: string;

    @Column({ nullable: true })
    region?: string;
}
