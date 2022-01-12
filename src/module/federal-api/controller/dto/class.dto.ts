import { SchoolDto } from './school.dto';
import { SchoolYearDto } from './school-year.dto';

export class ClassDto {
    public id!: string;

    public displayName!: string;

    public summary!: string;

    public school!: SchoolDto;

    public schoolYear!: SchoolYearDto;

    public roleWithinClass!: string;

    public start!: Date;

    public end!: Date;
}
