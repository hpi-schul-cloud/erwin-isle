import { PartialType } from '@nestjs/mapped-types';
import { CreateEducationalSchoolDto } from './create-educational-school.dto';

export class UpdateEducationalSchoolDto extends PartialType(CreateEducationalSchoolDto) {}
