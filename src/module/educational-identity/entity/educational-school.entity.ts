/* eslint-disable import/no-cycle */
import { Collection, Entity, ManyToMany, PrimaryKey, Property } from '@mikro-orm/core';
import { EducationalIdentity } from './educational-identity.entity';

@Entity()
export class EducationalSchool {
    @PrimaryKey()
    public id!: number;

    @Property({ nullable: true })
    public originId?: string;

    @Property({ nullable: true })
    public schoolNumber?: string;

    @Property()
    public displayName!: string;

    @ManyToMany(() => EducationalIdentity, 'schools', { owner: true })
    public users = new Collection<EducationalIdentity>(this);
}
