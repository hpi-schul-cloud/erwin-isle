import { Collection, Entity, ManyToMany, PrimaryKey, Property } from '@mikro-orm/core';
import { EducationalIdentity } from './educational-identity.entity';

@Entity()
export class EducationalSchool {
    @PrimaryKey()
    id: number;

    @Property()
    schoolId: string;

    @Property()
    displayName: string;

    @ManyToMany(() => EducationalIdentity, 'schools', { owner: true })
    users: Collection<EducationalIdentity>;

    // TODO: these properties are needed to fulfill the Länder-API
    // years, classes, subjects
}
