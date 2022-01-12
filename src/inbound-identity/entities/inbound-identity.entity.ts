import { Entity, ManyToOne, PrimaryKey, Property } from '@mikro-orm/core';
import { EducationalIdentity } from '../../educational-identity/entities/educational-identity.entity';

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
    id: number;

    @Property()
    inboundId: string;

    @Property()
    userName: string;

    @Property({ nullable: true })
    firstName?: string;

    @Property({ nullable: true })
    lastName?: string;

    @Property({ nullable: true })
    email?: string;

    @ManyToOne({ entity: () => EducationalIdentity })
    eduIdentity!: EducationalIdentity;
}
