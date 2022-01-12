import { Controller, Get, Body, Patch, Param, HttpException, HttpStatus, Query, Put, Delete } from '@nestjs/common';
import { Result } from '@root/shared/util';
import { EducationalIdentity } from '../entity';
import { EducationalIdentityService } from '../service/educational-identity.service';
import { UpdateEducationalIdentityDto, ResponseEducationalIdentityDto } from './dto';

@Controller('educational-identity')
export class EducationalIdentityController {
    public constructor(private readonly educationalIdentityService: EducationalIdentityService) {}

    @Get(':id')
    public async findOne(
        @Param('id') id: string,
        @Query('details') details?: string,
    ): Promise<ResponseEducationalIdentityDto> {
        const result = await this.educationalIdentityService.findOne(+id, details === 'true');

        if (result.success) {
            return this.extractResponse(result.value);
        }
        throw new HttpException(id, HttpStatus.NOT_FOUND);
    }

    @Get()
    public async findAll(
        @Param('page') page?: number,
        @Query('details') details?: string,
    ): Promise<Array<ResponseEducationalIdentityDto>> {
        const result = await this.educationalIdentityService.findAll(page, details === 'true');

        if (result.success) {
            return result.value.flatMap((x) => this.extractResponse(x));
        }
        throw new HttpException('Internal Server Error', HttpStatus.INTERNAL_SERVER_ERROR);
    }

    @Patch(':id')
    public async update(
        @Param('id') id: string,
        @Body() updateEducationalIdentityDto: UpdateEducationalIdentityDto,
    ): Promise<ResponseEducationalIdentityDto> {
        const result = await this.educationalIdentityService.update(+id, updateEducationalIdentityDto);

        if (result.success) {
            return this.extractResponse(result.value);
        }
        throw new HttpException(id, HttpStatus.NOT_FOUND);
    }

    @Put(':id/school')
    public async addSchool(@Param('id') id: number, @Body() schoolId: number): Promise<Result<EducationalIdentity>> {
        return this.educationalIdentityService.addSchool(id, schoolId);
    }

    @Delete(':id/school')
    public async removeSchool(@Param('id') id: number, @Body() schoolId: number): Promise<Result<EducationalIdentity>> {
        return this.educationalIdentityService.removeSchool(id, schoolId);
    }

    private extractResponse(eId: EducationalIdentity): ResponseEducationalIdentityDto {
        // TODO append external ids

        const schoolArray =
            eId.schools && eId.schools.isInitialized()
                ? eId.schools.getItems().flatMap((s) => s.displayName)
                : undefined;

        return {
            id: eId.id,
            externalId: undefined,
            firstName: eId.firstName,
            lastName: eId.lastName,
            preferredName: eId.preferredName,
            dateOfBirth: eId.dateOfBirth,
            studentId: eId.studentId,
            educationalDetails: { schools: schoolArray },
        };
    }
}
