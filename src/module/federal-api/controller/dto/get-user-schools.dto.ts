import { SchoolDto } from './school.dto';

export class GetUserSchoolsDto {
    public school!: SchoolDto;

    public role!: string;

    public start!: Date;

    public end!: Date;
}
