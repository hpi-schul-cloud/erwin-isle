import { Collection, Entity, ManyToMany, OneToMany, PrimaryKey, Property } from '@mikro-orm/core';
import { InboundIdentity } from '../../inbound-identity/entities/inbound-identity.entity';
import { EducationalSchool } from './educational-school.entity';

/**
 * Internally managed educational identity information.
 *
 * An educational identity holds personal meta data, educational specific details (e.g. assigned school(s) and is linked to
 * one or more {@link inboundIdentities}.
 *
 */
@Entity()
export class EducationalIdentity {
    @PrimaryKey()
    id: number;

    @Property()
    preferredName: string;

    @Property({ nullable: true })
    studentId?: string;

    @Property({ nullable: true })
    firstName?: string;

    @Property({ nullable: true })
    lastName?: string;

    @Property({ nullable: true })
    dateOfBirth? = new Date();

    @OneToMany({ entity: () => InboundIdentity, mappedBy: 'eduIdentity', orphanRemoval: true })
    inboundIdentities = new Collection<InboundIdentity>(this);

    @ManyToMany(() => EducationalSchool, (school) => school.users)
    schools: Collection<EducationalSchool>;
}
