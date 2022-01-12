import { Inject, Injectable } from '@nestjs/common';
import { IUserProvisionSourceService } from '../user-provisioning-source.interface';
import KcAdminClient from '@keycloak/keycloak-admin-client';
import UserRepresentation from '@keycloak/keycloak-admin-client/lib/defs/userRepresentation';
import { UserDto } from '../dto/user.dto';

interface KcSettings {
    realmName: string;
    baseUrl: string;
    credentials: KcCredentials;
    sourceRealm: string;
}

interface KcCredentials {
    grantType: any;
    username: string;
    password: string;
    clientId: string;
}

@Injectable()
export class KeycloakProvisioningSourceService implements IUserProvisionSourceService {
    private kcAdminClient: KcAdminClient;
    private kcCredentials: KcCredentials;

    constructor(@Inject('KeyCloakSettings') private readonly kcSettings: KcSettings) {
        this.kcAdminClient = new KcAdminClient({ baseUrl: kcSettings.baseUrl, realmName: kcSettings.realmName });
        this.kcCredentials = kcSettings.credentials;
    }

    async import(tenant?: string | undefined): Promise<UserDto[]> {
        await this.kcAdminClient.auth(this.kcCredentials);
        console.log(this.kcSettings);
        const foundUsers = tenant
            ? await this.kcAdminClient.users.find({ realm: tenant })
            : this.kcSettings.sourceRealm
            ? await this.kcAdminClient.users.find({ realm: this.kcSettings.sourceRealm })
            : await this.kcAdminClient.users.find();

        console.log(foundUsers);
        return foundUsers.map(this.extractUserDto);
    }

    private extractUserDto(user: UserRepresentation): UserDto {
        return {
            id: user.id,
            userName: user.username,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
        };
    }
}
