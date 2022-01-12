import { Module } from '@nestjs/common';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { EducationalIdentityModule } from '@root/module/educational-identity';
import { InboundIdentity } from './entity';
import { InboundIdentityService } from './service/inbound-identity.service';

@Module({
    imports: [MikroOrmModule.forFeature({ entities: [InboundIdentity] }), EducationalIdentityModule],
    controllers: [],
    providers: [InboundIdentityService],
    exports: [InboundIdentityService],
})
export class InboundIdentityModule {}
