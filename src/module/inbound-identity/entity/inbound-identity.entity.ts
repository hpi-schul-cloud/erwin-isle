/* eslint-disable import/no-cycle */
import { Entity, ManyToOne, PrimaryKey, Property } from '@mikro-orm/core';
import { EducationalIdentity } from '../../educational-identity/entity/educational-identity.entity';

/**
 * Replica of externally managed identity information.
 *
 * Any inbound identity holds a unique identifier {@link inboundId}, personal meta data,
 * and refers to an educational identity {@link eduIdentity}.
 *
 */
@Entity()
export class InboundIdentity {
    @PrimaryKey()
    public id!: number;

    @Property()
    public inboundId!: string;

    @Property()
    public userName!: string;

    @Property({ nullable: true })
    public firstName?: string;

    @Property({ nullable: true })
    public lastName?: string;

    @Property({ nullable: true })
    public email?: string;

    @ManyToOne({ entity: () => EducationalIdentity })
    public eduIdentity?: EducationalIdentity;
}
