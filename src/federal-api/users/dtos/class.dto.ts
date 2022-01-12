import { SchoolDto } from './school.dto';
import { SchoolYearDto } from './school-year.dto';

export class ClassDto {
    id: string;
    displayName: string;
    summary: string;
    school: SchoolDto;
    schoolYear: SchoolYearDto;
    roleWithinClass: string;
    start: Date;
    end: Date;
}
