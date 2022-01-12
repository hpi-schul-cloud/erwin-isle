import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@mikro-orm/nestjs';
import { wrap } from '@mikro-orm/core';
import { EntityRepository } from '@mikro-orm/mariadb';
import { UserNotFoundException } from '@root/shared/core/exception';
import { Result } from '@root/shared/util';
import { InboundIdentity } from '@root/module/inbound-identity/entity';
import { EducationalIdentity, EducationalSchool } from '../entity';
import { CreateEducationalIdentityDto, UpdateEducationalIdentityDto } from '../controller/dto';

@Injectable()
export class EducationalIdentityService {
    public constructor(
        @InjectRepository(EducationalIdentity)
        private readonly educationalIdentityRepository: EntityRepository<EducationalIdentity>,
        @InjectRepository(InboundIdentity)
        private readonly inboundIdentityRepository: EntityRepository<InboundIdentity>,
        @InjectRepository(EducationalSchool)
        private readonly educationalSchoolRepository: EntityRepository<EducationalSchool>,
    ) {}

    public async create(dto: CreateEducationalIdentityDto): Promise<Result<EducationalIdentity>> {
        const eId = new EducationalIdentity();

        eId.firstName = dto.firstName;
        eId.lastName = dto.lastName;
        eId.preferredName = dto.preferredName;
        eId.dateOfBirth = dto.dateOfBirth;

        await this.educationalIdentityRepository.persistAndFlush(eId);

        return { success: true, value: eId };
    }

    public async update(
        id: number,
        updateEducationalIdentityDto: UpdateEducationalIdentityDto,
    ): Promise<Result<EducationalIdentity>> {
        const eId = await this.educationalIdentityRepository.findOneOrFail(id);

        wrap(eId).assign(updateEducationalIdentityDto);

        await this.educationalIdentityRepository.persistAndFlush(eId);

        return { success: true, value: eId };
    }

    public async addSchool(identityId: number, schoolId: number): Promise<Result<EducationalIdentity>> {
        try {
            const sId = await this.educationalSchoolRepository.findOneOrFail(schoolId, ['users']);
            const eId = this.educationalIdentityRepository.getReference(identityId);
            // const sId = this.educationalSchoolRepository.getReference(schoolId);

            sId.users?.add(eId);

            await this.educationalIdentityRepository.flush();

            return { success: true, value: eId };
        } catch (error) {
            return { success: false, error: error as Error };
        }
    }

    public async removeSchool(identityId: number, schoolId: number): Promise<Result<EducationalIdentity>> {
        try {
            const sId = await this.educationalSchoolRepository.findOneOrFail(schoolId, ['users']);
            const eId = this.educationalIdentityRepository.getReference(identityId);
            // const sId = this.educationalSchoolRepository.getReference(schoolId);

            sId.users?.remove(eId);

            await this.educationalIdentityRepository.flush();

            return { success: true, value: eId };
        } catch (error) {
            return { success: false, error: error as Error };
        }
    }

    public async remove(id: number): Promise<Result<EducationalIdentity>> {
        try {
            const eId = await this.educationalIdentityRepository.findOneOrFail(id);

            await this.educationalIdentityRepository.removeAndFlush(eId);

            return { success: true, value: eId };
        } catch (error) {
            return { success: false, error: error as Error };
        }
    }

    public async findOne(id: number, details?: boolean): Promise<Result<EducationalIdentity>> {
        try {
            const result = await this.educationalIdentityRepository.findOneOrFail(
                { id },
                {
                    populate: details ? ['schools'] : [],
                    failHandler: () => {
                        return new UserNotFoundException();
                    },
                },
            );

            return { success: true, value: result };
        } catch (error) {
            return { success: false, error: error as Error };
        }
    }

    public async findOneByInboundId(id: string): Promise<Result<EducationalIdentity>> {
        try {
            const result = await this.inboundIdentityRepository.findOneOrFail(
                { inboundId: id },
                {
                    populate: ['eduIdentity'],
                    failHandler: () => {
                        return new UserNotFoundException();
                    },
                },
            );

            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            return { success: true, value: result.eduIdentity! };
        } catch (error) {
            return { success: false, error: error as Error };
        }
    }

    // TODO pagination
    public async findAll(page?: number, details?: boolean): Promise<Result<Array<EducationalIdentity>>> {
        const pageSize = 100;
        const offset = page ? page * pageSize : 0;
        const eId = await this.educationalIdentityRepository.findAll({
            offset,
            limit: pageSize,
            populate: details ? ['schools'] : [],
        });

        return { success: true, value: eId };
    }

    public async findAllSchools(id: number): Promise<Result<Array<EducationalSchool>>> {
        try {
            const result = await this.educationalIdentityRepository.findOneOrFail(
                { id },
                {
                    populate: ['schools'],
                    failHandler: () => {
                        return new UserNotFoundException();
                    },
                },
            );

            // TODO: refactoring
            if (result.schools !== undefined) {
                const schools = new Array<EducationalSchool>();

                for (const school of result.schools) {
                    schools.push(school);
                }

                return { success: true, value: schools };
            }

            throw new Error();
        } catch (error) {
            return { success: false, error: error as Error };
        }
    }
}
