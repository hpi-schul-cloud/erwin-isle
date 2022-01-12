import { Module } from '@nestjs/common';
import { InboundIdentityModule } from '@root/module/inbound-identity';
// TODO Provide tenants to ProvisioningSources by ext. config
import config from '@root/config/user-provisioning.config.json';
import { UserProvisioningController } from './controller/user-provisioning.controller';
import { UserProvisioningService } from './service/user-provisioning.service';
import { KeycloakProvisioningSourceUc } from './uc/keycloak-provisioning-source.uc';

@Module({
    imports: [InboundIdentityModule],
    controllers: [UserProvisioningController],
    providers: [
        UserProvisioningService,
        KeycloakProvisioningSourceUc,
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
