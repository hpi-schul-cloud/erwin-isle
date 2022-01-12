import { Module } from '@nestjs/common';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { EducationalIdentityService } from './educational-identity.service';
import { EducationalIdentityController } from './educational-identity.controller';
import { EducationalIdentity, EducationalSchool } from './entities';
import { InboundIdentity } from './../inbound-identity/entities/inbound-identity.entity';
import { EducationalSchoolService } from './educational-school.service';
import { EducationalSchoolController } from './educational-school.controller';

@Module({
    imports: [MikroOrmModule.forFeature({ entities: [EducationalIdentity, EducationalSchool, InboundIdentity] })],
    controllers: [EducationalIdentityController, EducationalSchoolController],
    providers: [EducationalIdentityService, EducationalSchoolService],
    exports: [EducationalIdentityService, EducationalSchoolService],
})
export class EducationalIdentityModule {}
