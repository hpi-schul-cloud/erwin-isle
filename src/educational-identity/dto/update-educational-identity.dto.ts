import { PartialType } from '@nestjs/mapped-types';
import { CreateEducationalIdentityDto } from './create-educational-identity.dto';

export class UpdateEducationalIdentityDto extends PartialType(CreateEducationalIdentityDto) {}
