import { SchoolDto } from './school.dto';

export class UserSchoolAssignmentDto {
    public school!: SchoolDto;

    public role!: string;

    public start!: Date;

    public end!: Date;
}
