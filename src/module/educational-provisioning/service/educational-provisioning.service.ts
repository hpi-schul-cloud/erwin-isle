import { Injectable } from '@nestjs/common';
import { CreateEducationalIdentityDto } from '@root/module/educational-identity/controller/dto';
import { UserDto } from '@root/module/federal-api/controller/dto';
import { EducationalIdentityService, EducationalSchoolService } from '../../educational-identity';
import { FederalApiProvisioningSource } from '../uc/federal-api-provisioning-source.uc';

@Injectable()
export class EducationalProvisioningService {
    constructor(
        private readonly federalApiService: FederalApiProvisioningSource,
        private readonly educationalIdentityService: EducationalIdentityService,
        private readonly educationalSchoolService: EducationalSchoolService,
    ) {}

    async import(): Promise<boolean> {
        // find users
        const userResponse = await this.federalApiService.getUsers();

        // extract, isolate, create, and collect schools first
        const allSchools = userResponse
            .flatMap((u) => u.schools)
            .flatMap((sa) => sa.school)
            .filter((v, i, a) => a.indexOf(v) === i);

        const schoolMap = new Map<string, number>();
        // await Promise.all(
        // allSchools.map(async (school) => {
        for (const school of allSchools) {
            const existingSchool = await this.educationalSchoolService.findByOriginId(school.id);
            if (existingSchool.success) {
                schoolMap.set(school.id, existingSchool.value.id);
            } else {
                const createdSchool = await this.educationalSchoolService.create({
                    displayName: school.displayName,
                    originId: school.id,
                });
                if (createdSchool.success) {
                    schoolMap.set(school.id, createdSchool.value.id);
                }
            }
        }

        // create users and add schools
        // await Promise.all(
        //     userResponse.map(async (user) => {
        for (const user of userResponse) {
            const existingEduId = await this.educationalIdentityService.findOneByOriginId(user.id);
            if (existingEduId.success) {
                // skip no migration
                // this.educationalIdentityService.update(existingEduId.value.id, this.extractEduUserDto(user));
            } else {
                const ret = await this.educationalIdentityService.create(this.extractEduDto(user));
                if (ret.success) {
                    const createdEduIdentity = ret.value;
                    for (const userSchool of user.schools) {
                        const matchingSchool = schoolMap.get(userSchool.school.id);
                        if (matchingSchool) {
                            await this.educationalIdentityService.addSchool(createdEduIdentity.id, matchingSchool);
                        } else {
                            return false;
                        }
                    }
                } else {
                    return false;
                }
            }
        }
        return true;
    }

    private extractEduDto(user: UserDto): CreateEducationalIdentityDto {
        return {
            originId: user.id,
            studentId: user.studentId,
            firstName: user.firstName,
            lastName: user.lastName,
            preferredName: user.preferredName,
            dateOfBirth: user.dateOfBirth,
        };
    }
}
