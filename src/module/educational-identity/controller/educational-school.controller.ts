import { Body, Controller, Delete, Get, HttpException, HttpStatus, Param, Post } from '@nestjs/common';
import { EducationalSchool } from '../entity';
import { EducationalSchoolService } from '../service/educational-school.service';
import { CreateEducationalSchoolDto, ResponseEducationalSchoolDto } from './dto';

@Controller('educational-school')
export class EducationalSchoolController {
    public constructor(private readonly educationalSchoolService: EducationalSchoolService) {}

    @Get(':id')
    public async findOne(@Param('id') id: string): Promise<ResponseEducationalSchoolDto> {
        const result = await this.educationalSchoolService.read(+id);
        if (result.success) {
            return this.extractResponse(result.value);
        }

        throw new HttpException(id, HttpStatus.NOT_FOUND);
    }

    // TODO pagination
    @Get()
    public async findAll(): Promise<Array<ResponseEducationalSchoolDto>> {
        const result = await this.educationalSchoolService.findAll();
        if (result.success) {
            return result.value.flatMap((x) => this.extractResponse(x));
        }

        throw new HttpException('', HttpStatus.INTERNAL_SERVER_ERROR);
    }

    @Post()
    public async create(@Body() dto: CreateEducationalSchoolDto): Promise<ResponseEducationalSchoolDto> {
        const result = await this.educationalSchoolService.create(dto);
        if (result.success) {
            return this.extractResponse(result.value);
        }

        throw new HttpException('', HttpStatus.INTERNAL_SERVER_ERROR);
    }

    @Delete(':id')
    public async delete(@Param('id') id: number): Promise<ResponseEducationalSchoolDto> {
        const result = await this.educationalSchoolService.delete(+id);
        if (result.success) {
            return this.extractResponse(result.value);
        }

        throw new HttpException(id.toString(), HttpStatus.NOT_FOUND);
    }

    private extractResponse(eS: EducationalSchool): ResponseEducationalSchoolDto {
        return {
            id: eS.id,
            schoolNumber: eS.schoolNumber,
            displayName: eS.displayName,
        };
    }
}
