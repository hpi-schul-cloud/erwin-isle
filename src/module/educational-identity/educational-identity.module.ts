import { Module } from '@nestjs/common';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { InboundIdentity } from '@root/module/inbound-identity/entity';
import { EducationalIdentity, EducationalSchool } from './entity';
import { EducationalIdentityController } from './controller/educational-identity.controller';
import { EducationalSchoolController } from './controller/educational-school.controller';
import { EducationalIdentityService } from './service/educational-identity.service';
import { EducationalSchoolService } from './service/educational-school.service';

@Module({
    imports: [
        MikroOrmModule.forFeature({
            entities: [EducationalIdentity, EducationalSchool, InboundIdentity],
        }),
    ],
    controllers: [EducationalIdentityController, EducationalSchoolController],
    providers: [EducationalIdentityService, EducationalSchoolService],
    exports: [EducationalIdentityService, EducationalSchoolService],
})
export class EducationalIdentityModule {}
