/* eslint-disable import/no-cycle */
import { Collection, Entity, ManyToMany, PrimaryKey, Property } from '@mikro-orm/core';
import { EducationalIdentity } from './educational-identity.entity';

@Entity()
export class EducationalSchool {
    @PrimaryKey()
    public id!: number;

    @Property()
    public schoolId!: string;

    @Property()
    public displayName!: string;

    @ManyToMany(() => EducationalIdentity, 'schools', { owner: true })
    public users?: Collection<EducationalIdentity>;
}
