import { Controller, Get, Body, Patch, Param, HttpException, HttpStatus, Query, Put, Delete } from '@nestjs/common';
import { EducationalIdentityService } from './educational-identity.service';
import { UpdateEducationalIdentityDto } from './dto/update-educational-identity.dto';
import { EducationalIdentity } from './entities/educational-identity.entity';
import { ResponseEducationalIdentityDto } from './dto/response-educational-identity.dto';

@Controller('educational-identity')
export class EducationalIdentityController {
    constructor(private readonly educationalIdentityService: EducationalIdentityService) {}

    @Get(':id')
    async findOne(@Param('id') id: string, @Query('details') details?: string) {
        try {
            const result = await this.educationalIdentityService.findOne(+id, details === 'true');
            return this.extractResponse(result.value);
        } catch {
            throw new HttpException(id, HttpStatus.NOT_FOUND);
        }
    }

    @Get()
    async findAll(@Param('page') page?: number, @Query('details') details?: string) {
        const result = await this.educationalIdentityService.findAll(page, details === 'true');
        return result.value.flatMap((x) => this.extractResponse(x));
    }

    @Patch(':id')
    async update(@Param('id') id: string, @Body() updateEducationalIdentityDto: UpdateEducationalIdentityDto) {
        try {
            const result = await this.educationalIdentityService.update(+id, updateEducationalIdentityDto);

            return this.extractResponse(result.value);
        } catch {
            throw new HttpException(id, HttpStatus.NOT_FOUND);
        }
    }

    @Put(':id/school')
    async addSchool(@Param('id') id: number, @Body() schoolId: number) {
        return await this.educationalIdentityService.addSchool(id, schoolId);
    }

    @Delete(':id/school')
    async removeSchool(@Param('id') id: number, @Body() schoolId: number) {
        return await this.educationalIdentityService.removeSchool(id, schoolId);
    }

    private extractResponse(eId: EducationalIdentity): ResponseEducationalIdentityDto {
        //TODO append external ids

        const schoolArray = eId.schools.isInitialized()
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
