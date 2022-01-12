import { wrap } from '@mikro-orm/core';
import { EntityRepository } from '@mikro-orm/mariadb';
import { InjectRepository } from '@mikro-orm/nestjs';
import { Injectable } from '@nestjs/common';
import { unwrapIntoResult, Result } from '../utils';
import { CreateEducationalSchoolDto } from './dto/create-educational-school.dto';
import { UpdateEducationalSchoolDto } from './dto/update-educational-school.dto';
import { EducationalSchool } from './entities';

@Injectable()
export class EducationalSchoolService {
    public constructor(
        @InjectRepository(EducationalSchool)
        private readonly educationalSchoolRepository: EntityRepository<EducationalSchool>,
    ) {}

    public async create(dto: CreateEducationalSchoolDto): Promise<Result<EducationalSchool>> {
        const eS = new EducationalSchool();
        eS.schoolId = dto.schoolId;
        eS.displayName = dto.displayName;
        const res = await unwrapIntoResult(this.educationalSchoolRepository.persistAndFlush(eS));
        if (res.success) {
            return Result.fromValue(eS);
        } else {
            return Result.fromError(res.error);
        }
    }

    public async read(id: number): Promise<Result<EducationalSchool>> {
        return await unwrapIntoResult(this.educationalSchoolRepository.findOneOrFail(id));
    }

    public async update(
        id: number,
        updateEducationalSchoolDto: UpdateEducationalSchoolDto,
    ): Promise<Result<EducationalSchool>> {
        const eS = id ? await this.educationalSchoolRepository.findOneOrFail(id) : undefined;
        wrap(eS).assign(updateEducationalSchoolDto);
        const res = await unwrapIntoResult(this.educationalSchoolRepository.persistAndFlush(eS));
        if (res.success) {
            return Result.fromValue(eS);
        } else {
            return Result.fromError(res.error);
        }
    }

    public async delete(id: number): Promise<Result<EducationalSchool>> {
        const eS = id ? await this.educationalSchoolRepository.findOneOrFail(id) : undefined;
        const res = await unwrapIntoResult(this.educationalSchoolRepository.removeAndFlush(eS));
        if (res.success) {
            return Result.fromValue(eS);
        } else {
            return Result.fromError(res.error);
        }
    }

    public async findBySchoolId(schoolId: string): Promise<Result<EducationalSchool>> {
        return await unwrapIntoResult(this.educationalSchoolRepository.findOneOrFail({ schoolId: schoolId }));
    }

    public async findByDisplayName(displayName: string): Promise<Result<EducationalSchool>> {
        return await unwrapIntoResult(this.educationalSchoolRepository.findOneOrFail({ displayName: displayName }));
    }

    public async findAll(): Promise<Result<EducationalSchool[]>> {
        return await unwrapIntoResult(this.educationalSchoolRepository.findAll());
    }
}
