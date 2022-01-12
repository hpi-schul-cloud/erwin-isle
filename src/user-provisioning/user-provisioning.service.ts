import { Injectable } from '@nestjs/common';
import { IdentityAlreadyExistError } from './../inbound-identity/exception/identityAlreadyExists.exception';
import { CreateInboundIdentityDto } from './../inbound-identity/dto/create-inbound-identity.dto';
import { InboundIdentityService } from './../inbound-identity/inbound-identity.service';
import { ResponseUserProvisioningDto } from './dto/response-provisioning-status.dto';
import { KeycloakProvisioningSourceService } from './keycloak-provisioning-source/keycloak-provisioning-source.service';
import { IUserProvisionSourceService } from './user-provisioning-source.interface';
import { UserDto } from './dto/user.dto';

@Injectable()
export class UserProvisioningService {
    private provisioningServices: IUserProvisionSourceService[] = [];
    private identityService: InboundIdentityService;

    private isRunning: boolean;
    private synchronized: boolean;
    private lastUpdate = new Date();

    constructor(
        private readonly inboundIdentityService: InboundIdentityService,
        private readonly kcProvisioningService: KeycloakProvisioningSourceService,
    ) {
        this.provisioningServices.push(kcProvisioningService);
        this.identityService = inboundIdentityService;
        this.isRunning = false;
        this.synchronized = false;
        this.lastUpdate = undefined;
    }

    async import(): Promise<ResponseUserProvisioningDto> {
        if (!this.isRunning) {
            this.isRunning = true;
            try {
                await this.importFromProvisioningServices();
                this.synchronized = true;
            } catch (err) {
                this.synchronized = false;
            } finally {
                this.lastUpdate = new Date();
                this.isRunning = false;
            }
        }
        return this.getStatus();
    }

    getStatus(): ResponseUserProvisioningDto {
        return { isRunning: this.isRunning, lastUpdated: this.lastUpdate, lastActionSuccesful: this.synchronized };
    }

    private async importFromProvisioningServices(): Promise<void> {
        const allUsers = this.provisioningServices.map((ps) => ps.import());

        // fetch all providers and keep succesful syncs
        const userResponse = await Promise.allSettled(allUsers).then((results) => {
            return (results.filter((result) => result.status === 'fulfilled') as PromiseFulfilledResult<UserDto[]>[])
                .map((result) => result.value)
                .flat();
        });

        for (const user of userResponse) {
            const dto: CreateInboundIdentityDto = {
                inboundId: user.id,
                userName: user.userName,
                email: user.email,
                firstName: user.firstName,
                lastName: user.lastName,
            };
            try {
                await this.identityService.create(dto);
            } catch (error) {
                if (error instanceof IdentityAlreadyExistError) {
                    // ignore, re-throw otherwise
                    // TODO update user instead
                } else {
                    throw error;
                }
            }
        }

        return;
    }
}
