import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';
import { ServeStaticModule } from '@nestjs/serve-static';
import { EducationalIdentityModule } from './educational-identity/educational-identity.module';
import { InboundIdentityModule } from './inbound-identity/inbound-identity.module';
import { UserProvisioningModule } from './user-provisioning/user-provisioning.module';
import { FederalApiModule } from './federal-api';
import { join } from 'path';

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
            //renderPath: 'client'
        }),
    ],
    controllers: [],
    providers: [],
})
export class AppModule { }
