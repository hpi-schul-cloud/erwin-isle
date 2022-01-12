import { SchoolDto } from './school.dto';
import { SchoolSubjectDto } from './school-subject.dto';
import { SchoolYearDto } from './school-year.dto';

export class SubjectDto {
    public id!: string;

    public displayName!: string;

    public school!: SchoolDto;

    public schoolYear!: SchoolYearDto;

    public schoolSubjects!: Array<SchoolSubjectDto>;

    public roleWithinClass!: string;

    public start!: Date;

    public end!: Date;
}
