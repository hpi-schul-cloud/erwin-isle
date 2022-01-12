import { Module } from '@nestjs/common';
import { MikroOrmModule } from '@mikro-orm/nestjs';

import { InboundIdentityService } from './inbound-identity.service';
import { InboundIdentity } from './entities/inbound-identity.entity';
import { EducationalIdentityModule } from '../educational-identity/educational-identity.module';

@Module({
    imports: [MikroOrmModule.forFeature({ entities: [InboundIdentity] }), EducationalIdentityModule],
    controllers: [],
    providers: [InboundIdentityService],
    exports: [InboundIdentityService],
})
export class InboundIdentityModule {}
