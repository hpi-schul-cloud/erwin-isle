import { Module } from '@nestjs/common';
import { InboundIdentityModule } from './../inbound-identity/inbound-identity.module';
import { KeycloakProvisioningSourceService } from './keycloak-provisioning-source/keycloak-provisioning-source.service';
import { UserProvisioningController } from './user-provisioning.controller';
import { UserProvisioningService } from './user-provisioning.service';

//TODO Provide tenants to ProvisioningSources by ext. config
import config from './../user-provisioning.config.json';

@Module({
    imports: [InboundIdentityModule],
    controllers: [UserProvisioningController],
    providers: [
        UserProvisioningService,
        KeycloakProvisioningSourceService,
        {
            provide: 'KeyCloakSettings',
            useValue: {
                realmName: config.realmName,
                baseUrl: config.baseUrl,
                credentials: {
                    grantType: config.grantType,
                    username: config.username,
                    password: config.password,
                    clientId: config.clientId,
                },
                sourceRealm: config.defaultTenant,
            },
        },
    ],
})
export class UserProvisioningModule {}
