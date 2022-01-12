import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { EducationalIdentityModule } from './module/educational-identity/educational-identity.module';
import { InboundIdentityModule } from './module/inbound-identity/inbound-identity.module';
import { UserProvisioningModule } from './module/user-provisioning/user-provisioning.module';
import { FederalApiModule } from './module/federal-api';

@Module({
    imports: [
        MikroOrmModule.forRoot(),
        EducationalIdentityModule,
        InboundIdentityModule,
        UserProvisioningModule,
        FederalApiModule,
        ServeStaticModule.forRoot({
            rootPath: join(__dirname, '..', 'client'),
            exclude: ['/educational-identity*', '/educational-school*'],
            // renderPath: 'client'
        }),
    ],
    controllers: [],
    providers: [],
})
export class MainModule {}
