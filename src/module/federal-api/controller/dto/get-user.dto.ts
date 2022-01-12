import { ClassDto } from './class.dto';
import { GuardianDto } from './guardian.dto';
import { SchoolDto } from './school.dto';
import { SexDto } from './sex.dto';
import { SubjectDto } from './subject.dto';

export class GetUserDto {
    public id!: string;

    public studentId!: string;

    public firstName!: string;

    public lastName!: string;

    public preferredName!: string;

    public dateOfBirth!: Date;

    public sex!: SexDto;

    public schools!: Array<SchoolDto>;

    public classes?: Array<ClassDto>;

    public subjects?: Array<SubjectDto>;

    public guardians?: Array<GuardianDto>;
}
