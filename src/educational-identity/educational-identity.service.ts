import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@mikro-orm/nestjs';
import { EntityRepository } from '@mikro-orm/mariadb';
import { wrap } from '@mikro-orm/core';
import { CreateEducationalIdentityDto } from './dto/create-educational-identity.dto';
import { UpdateEducationalIdentityDto } from './dto/update-educational-identity.dto';
import { EducationalIdentity } from './entities/educational-identity.entity';
import { InboundIdentity } from '../inbound-identity/entities/inbound-identity.entity';
import { UserNotFoundException } from '../exceptions';
import { Result, unwrapIntoResult } from '../utils';
import { EducationalSchool } from './entities';

@Injectable()
export class EducationalIdentityService {
    constructor(
        @InjectRepository(EducationalIdentity)
        private readonly educationalIdentityRepository: EntityRepository<EducationalIdentity>,
        @InjectRepository(InboundIdentity)
        private readonly inboundIdentityRepository: EntityRepository<InboundIdentity>,
        @InjectRepository(EducationalSchool)
        private readonly educationalSchoolRepository: EntityRepository<EducationalSchool>,
    ) {}

    async create(dto: CreateEducationalIdentityDto): Promise<Result<EducationalIdentity>> {
        const eId = new EducationalIdentity();

        eId.firstName = dto.firstName;
        eId.lastName = dto.lastName;
        eId.preferredName = dto.preferredName;
        eId.dateOfBirth = dto.dateOfBirth;

        await this.educationalIdentityRepository.persistAndFlush(eId);

        return Result.fromValue(eId);
    }

    async update(
        id: number,
        updateEducationalIdentityDto: UpdateEducationalIdentityDto,
    ): Promise<Result<EducationalIdentity>> {
        const eId = await this.educationalIdentityRepository.findOneOrFail(id);

        wrap(eId).assign(updateEducationalIdentityDto);

        await this.educationalIdentityRepository.persistAndFlush(eId);

        return Result.fromValue(eId);
    }

    async addSchool(identityId: number, schoolId: number): Promise<Result<EducationalIdentity>> {
        const sId = await this.educationalSchoolRepository.findOneOrFail(schoolId, ['users']);
        const eId = await this.educationalIdentityRepository.getReference(identityId);
        //const sId = this.educationalSchoolRepository.getReference(schoolId);
        sId.users.add(eId);
        await this.educationalIdentityRepository.flush();

        return Result.fromValue(eId);
    }

    async removeSchool(identityId: number, schoolId: number): Promise<Result<EducationalIdentity>> {
        const sId = await this.educationalSchoolRepository.findOneOrFail(schoolId, ['users']);
        const eId = await this.educationalIdentityRepository.getReference(identityId);
        //const sId = this.educationalSchoolRepository.getReference(schoolId);
        sId.users.remove(eId);
        await this.educationalIdentityRepository.flush();

        return Result.fromValue(eId);
    }

    async remove(id: number): Promise<Result<EducationalIdentity>> {
        const eId = id ? await this.educationalIdentityRepository.findOneOrFail(id) : undefined;

        await this.educationalIdentityRepository.removeAndFlush(eId);

        return Result.fromValue(eId);
    }

    async findOne(id: number, details?: boolean): Promise<Result<EducationalIdentity>> {
        return await unwrapIntoResult(
            this.educationalIdentityRepository.findOneOrFail(
                { id: id },
                {
                    populate: details ? ['schools'] : [],
                    failHandler: () => {
                        return new UserNotFoundException();
                    },
                },
            ),
        );
    }

    async findOneByInboundId(id: string): Promise<Result<EducationalIdentity>> {
        const result = await unwrapIntoResult(
            this.inboundIdentityRepository.findOneOrFail(
                { inboundId: id },
                {
                    populate: ['eduIdentity'],
                    failHandler: () => {
                        return new UserNotFoundException();
                    },
                },
            ),
        );

        if (result.success) {
            return Result.fromValue(result.value.eduIdentity);
        } else {
            return Result.fromError(result.error);
        }
    }

    //TODO pagination
    async findAll(page?: number, details?: boolean): Promise<Result<Array<EducationalIdentity>>> {
        const pageSize = 100;
        const offset = page ? page * pageSize : 0;
        const eId = await this.educationalIdentityRepository.findAll({
            offset: offset,
            limit: pageSize,
            populate: details,
        });

        return Result.fromValue(eId);
    }

    async findAllSchools(id: number): Promise<Result<Array<EducationalSchool>>> {
        const result = await unwrapIntoResult(
            this.educationalIdentityRepository.findOneOrFail(
                { id: id },
                {
                    populate: ['schools'],
                    failHandler: () => {
                        return new UserNotFoundException();
                    },
                },
            ),
        );

        if (result.success) {
            const schools = new Array<EducationalSchool>();

            for (const school of result.value.schools) {
                schools.push(school);
            }

            return Result.fromValue(schools);
        } else {
            return Result.fromError(result.error);
        }
    }
}
