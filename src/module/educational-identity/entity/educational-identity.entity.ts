/* eslint-disable import/no-cycle */
import { Collection, Entity, Enum, ManyToMany, OneToMany, PrimaryKey, Property } from '@mikro-orm/core';
import { SexDto } from '@root/module/federal-api/controller/dto';
import { InboundIdentity } from '../../inbound-identity/entity/inbound-identity.entity';
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
    public id!: number;

    @Property({ nullable: true })
    public originId?: string;

    @Property()
    public preferredName!: string;

    @Property({ nullable: true })
    public studentId?: string;

    @Property({ nullable: true })
    public firstName?: string;

    @Property({ nullable: true })
    public lastName?: string;

    @Property({ nullable: true })
    public dateOfBirth?: Date;

    @Enum({ items: () => SexDto, nullable: true })
    public sex?: SexDto;

    @OneToMany({
        entity: () => InboundIdentity,
        mappedBy: 'eduIdentity',
        orphanRemoval: true,
    })
    public inboundIdentities = new Collection<InboundIdentity>(this);

    @ManyToMany(() => EducationalSchool, (school) => school.users)
    public schools = new Collection<EducationalSchool>(this);
}
