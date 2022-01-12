import { Body, Controller, Delete, Get, HttpException, HttpStatus, Param, Post } from '@nestjs/common';
import { EducationalSchoolService } from './educational-school.service';
import { CreateEducationalSchoolDto } from './dto/create-educational-school.dto';
import { ResponseEducationalSchoolDto } from './dto/response-educational-school.dto';
import { EducationalSchool } from './entities';

@Controller('educational-school')
export class EducationalSchoolController {
    constructor(private readonly educationalSchoolService: EducationalSchoolService) {}

    @Get(':id')
    async findOne(@Param('id') id: string) {
        const result = await this.educationalSchoolService.read(+id);
        if (result.success) {
            return this.extractResponse(result.value);
        } else {
            throw new HttpException(id, HttpStatus.NOT_FOUND);
        }
    }

    //TODO pagination
    @Get()
    async findAll() {
        const result = await this.educationalSchoolService.findAll();
        if (result.success) {
            return result.value.flatMap((x) => this.extractResponse(x));
        } else {
            throw new HttpException('', HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @Post()
    async create(@Body() dto: CreateEducationalSchoolDto) {
        const result = await this.educationalSchoolService.create(dto);
        if (result.success) {
            return this.extractResponse(result.value);
        } else {
            throw new HttpException('', HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @Delete(':id')
    async delete(@Param('id') id: number) {
        const result = await this.educationalSchoolService.delete(+id);
        if (result.success) {
            return this.extractResponse(result.value);
        } else {
            throw new HttpException(id.toString(), HttpStatus.NOT_FOUND);
        }
    }

    private extractResponse(eS: EducationalSchool): ResponseEducationalSchoolDto {
        return {
            id: eS.id,
            schoolId: eS.schoolId,
            displayName: eS.displayName,
        };
    }
}
