/* eslint-disable no-nested-ternary */
import { Inject, Injectable } from '@nestjs/common';
import KcAdminClient from '@keycloak/keycloak-admin-client';
import UserRepresentation from '@keycloak/keycloak-admin-client/lib/defs/userRepresentation';
import { GrantTypes } from '@keycloak/keycloak-admin-client/lib/utils/auth';
import { UserDto } from '@root/module/user-provisioning/controller/dto';
import { UserProvisionSourceUc } from './user-provisioning-source.uc';

interface KcSettings {
    realmName: string;
    baseUrl: string;
    credentials: KcCredentials;
    sourceRealm: string;
}

interface KcCredentials {
    grantType: GrantTypes;
    username: string;
    password: string;
    clientId: string;
}

@Injectable()
export class KeycloakProvisioningSourceUc implements UserProvisionSourceUc {
    private kcAdminClient: KcAdminClient;

    private kcCredentials: KcCredentials;

    public constructor(@Inject('KeyCloakSettings') private readonly kcSettings: KcSettings) {
        this.kcAdminClient = new KcAdminClient({
            baseUrl: kcSettings.baseUrl,
            realmName: kcSettings.realmName,
        });
        this.kcCredentials = kcSettings.credentials;
    }

    public async import(tenant?: string): Promise<UserDto[]> {
        await this.kcAdminClient.auth(this.kcCredentials);
        const foundUsers = tenant
            ? await this.kcAdminClient.users.find({ realm: tenant })
            : this.kcSettings.sourceRealm
            ? await this.kcAdminClient.users.find({
                  realm: this.kcSettings.sourceRealm,
              })
            : await this.kcAdminClient.users.find();

        return foundUsers.map((user: UserRepresentation) => this.extractUserDto(user));
    }

    private extractUserDto(user: UserRepresentation): UserDto {
        return {
            id: user.id as string,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            userName: user.username as string,
        };
    }
}
