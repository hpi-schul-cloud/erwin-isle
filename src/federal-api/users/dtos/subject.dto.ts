import { SchoolDto } from './school.dto';
import { SchoolSubjectDto } from './school-subject.dto';
import { SchoolYearDto } from './school-year.dto';

export class SubjectDto {
    id: string;
    displayName: string;
    school: SchoolDto;
    schoolYear: SchoolYearDto;
    schoolSubjects: Array<SchoolSubjectDto>;
    roleWithinClass: string;
    start: Date;
    end: Date;
}
