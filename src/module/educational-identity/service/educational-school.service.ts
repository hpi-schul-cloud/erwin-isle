import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@mikro-orm/nestjs';
import { wrap } from '@mikro-orm/core';
import { EntityRepository } from '@mikro-orm/mariadb';
import { unwrapIntoResult, Result } from '@root/shared/util';
import { EducationalSchool } from '../entity';
import { CreateEducationalSchoolDto, UpdateEducationalSchoolDto } from '../controller/dto';

@Injectable()
export class EducationalSchoolService {
    public constructor(
        @InjectRepository(EducationalSchool)
        private readonly educationalSchoolRepository: EntityRepository<EducationalSchool>,
    ) {}

    public async create(dto: CreateEducationalSchoolDto): Promise<Result<EducationalSchool>> {
        const eS = new EducationalSchool();
        eS.originId = dto.originId;
        eS.schoolNumber = dto.schoolNumber;
        eS.displayName = dto.displayName;
        const res = await unwrapIntoResult(this.educationalSchoolRepository.persistAndFlush(eS));
        if (res.success) {
            return { success: true, value: eS };
        }
        return res;
    }

    public async read(id: number): Promise<Result<EducationalSchool>> {
        return unwrapIntoResult(this.educationalSchoolRepository.findOneOrFail(id));
    }

    public async update(
        id: number,
        updateEducationalSchoolDto: UpdateEducationalSchoolDto,
    ): Promise<Result<EducationalSchool>> {
        const eS = await this.educationalSchoolRepository.findOneOrFail(id);
        wrap(eS).assign(updateEducationalSchoolDto);
        const res = await unwrapIntoResult(this.educationalSchoolRepository.persistAndFlush(eS));
        if (res.success) {
            return { success: true, value: eS };
        }
        return res;
    }

    public async delete(id: number): Promise<Result<EducationalSchool>> {
        const eS = await this.educationalSchoolRepository.findOneOrFail(id);
        const res = await unwrapIntoResult(this.educationalSchoolRepository.removeAndFlush(eS));

        if (res.success) {
            return { success: true, value: eS };
        }
        return res;
    }

    public async findByOriginId(originId: string): Promise<Result<EducationalSchool>> {
        return unwrapIntoResult(
            this.educationalSchoolRepository.findOneOrFail({
                originId: originId,
            }),
        );
    }

    public async findByDisplayName(displayName: string): Promise<Result<EducationalSchool>> {
        return unwrapIntoResult(
            this.educationalSchoolRepository.findOneOrFail({
                displayName,
            }),
        );
    }

    public async findAll(): Promise<Result<Array<EducationalSchool>>> {
        return unwrapIntoResult(this.educationalSchoolRepository.findAll());
    }
}
