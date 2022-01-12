import { Injectable } from '@nestjs/common';
import { Result } from '../../utils';
import { EducationalIdentityService } from '../../educational-identity';
import { GetUserDto, GetUserSchoolsDto, SchoolDto, SexDto } from './dtos';

@Injectable()
export class UsersService {
    public constructor(private readonly service: EducationalIdentityService) {}

    // TODO: add optional properties for GetUserDto
    public async getUser(id: string): Promise<Result<GetUserDto>> {
        const userResult = await this.service.findOneByInboundId(id);

        if (userResult.success) {
            const schoolsResult = await this.service.findAllSchools(userResult.value.id);
            const schools = new Array<SchoolDto>();

            for (const school of schoolsResult.value) {
                schools.push({
                    id: school.schoolId,
                    displayName: school.displayName,
                });
            }

            return Result.fromValue({
                id: id,
                studentId: userResult.value.studentId,
                firstName: userResult.value.firstName,
                lastName: userResult.value.lastName,
                preferredName: userResult.value.lastName,
                sex: SexDto.NONE,
                dateOfBirth: userResult.value.dateOfBirth,
                schools: schools,
            });
        } else {
            return Result.fromError(userResult.error);
        }
    }

    // TODO: role, start and end date are hardcoded values
    public async getUserSchools(id: string): Promise<Result<Array<GetUserSchoolsDto>>> {
        const userResult = await this.service.findOneByInboundId(id);
        if (userResult.success) {
            const result = await this.service.findAllSchools(userResult.value.id);

            if (result !== undefined && result.success) {
                const schools = new Array<GetUserSchoolsDto>();

                for (const school of result.value) {
                    schools.push({
                        school: {
                            id: school.schoolId,
                            displayName: school.displayName,
                        },
                        role: 'student',
                        start: new Date(),
                        end: new Date(),
                    });
                }

                return Result.fromValue(schools);
            } else {
                return Result.fromError(result.error);
            }
        } else {
            return Result.fromError(userResult.error);
        }
    }
}
