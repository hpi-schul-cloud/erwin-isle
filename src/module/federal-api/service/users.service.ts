import { Injectable } from '@nestjs/common';
import { Result } from '@root/shared/util';
import { EducationalIdentityService } from '@root/module/educational-identity';
import { UserDto, UserSchoolAssignmentDto, SexDto } from '../controller/dto';

@Injectable()
export class UsersService {
    public constructor(private readonly service: EducationalIdentityService) {}

    // TODO: add optional properties for GetUserDto
    public async getUser(id: string): Promise<Result<UserDto>> {
        const userResult = await this.service.findOneByInboundId(id);

        if (userResult.success) {
            const schoolsResult = await this.service.findAllSchools(userResult.value.id);

            // TODO: refactoring
            return schoolsResult.success
                ? {
                      success: true,
                      value: {
                          id,
                          studentId: userResult.value.studentId as string,
                          firstName: userResult.value.firstName as string,
                          lastName: userResult.value.lastName as string,
                          preferredName: userResult.value.preferredName,
                          sex: userResult.value.sex as SexDto,
                          dateOfBirth: userResult.value.dateOfBirth as Date,
                          schools: schoolsResult.value.map((school) => {
                              return {
                                  school: {
                                      id: school.displayName,
                                      displayName: school.displayName,
                                  },
                                  role: 'student',
                                  start: new Date(),
                                  end: new Date(),
                              };
                          }),
                      },
                  }
                : schoolsResult;
        }

        return userResult;
    }

    // TODO: role, start and end date are hardcoded values
    public async getUserSchools(id: string): Promise<Result<Array<UserSchoolAssignmentDto>>> {
        const userResult = await this.service.findOneByInboundId(id);

        if (userResult.success) {
            const schoolsResult = await this.service.findAllSchools(userResult.value.id);

            // TODO: refactor this code!!!
            return schoolsResult.success
                ? {
                      success: true,
                      value: schoolsResult.value.map((school) => {
                          return {
                              school: {
                                  id: school.id.toString(),
                                  displayName: school.displayName,
                              },
                              role: 'student',
                              start: new Date(),
                              end: new Date(),
                          };
                      }),
                  }
                : schoolsResult;
        }

        return userResult;
    }
}
