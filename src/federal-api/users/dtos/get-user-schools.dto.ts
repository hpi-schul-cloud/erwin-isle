import { SchoolDto } from './school.dto';

export class GetUserSchoolsDto {
    school: SchoolDto;
    role: string;
    start: Date;
    end: Date;
}
