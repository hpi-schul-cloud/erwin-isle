import { Injectable } from '@nestjs/common';
import { InboundIdentityService } from '@root/module/inbound-identity';
import { IdentityAlreadyExistException } from '@root/shared/core/exception';
import { ResponseUserProvisioningDto, UserDto } from '../controller/dto';
import { KeycloakProvisioningSourceUc } from '../uc/keycloak-provisioning-source.uc';
import { UserProvisionSourceUc } from '../uc/user-provisioning-source.uc';

@Injectable()
export class UserProvisioningService {
    private readonly provisioningServices: UserProvisionSourceUc[] = [];

    private readonly identityService: InboundIdentityService;

    private isRunning: boolean;

    private synchronized: boolean;

    private lastUpdate?: Date;

    public constructor(
        inboundIdentityService: InboundIdentityService,
        kcProvisioningService: KeycloakProvisioningSourceUc,
    ) {
        this.provisioningServices.push(kcProvisioningService);
        this.identityService = inboundIdentityService;
        this.isRunning = false;
        this.synchronized = false;
        this.lastUpdate = undefined;
    }

    public async import(): Promise<ResponseUserProvisioningDto> {
        if (!this.isRunning) {
            this.isRunning = true;
            try {
                await this.importFromProvisioningServices();
            } catch (err) {
                this.synchronized = false;
            } finally {
                this.lastUpdate = new Date();
                this.isRunning = false;
            }
        }
        return this.getStatus();
    }

    public getStatus(): ResponseUserProvisioningDto {
        return {
            isRunning: this.isRunning,
            lastUpdated: this.lastUpdate,
            lastActionSuccessful: this.synchronized,
        };
    }

    private async importFromProvisioningServices(): Promise<void> {
        const allUsers = this.provisioningServices.map((ps) => ps.import());
        // fetch all providers and keep successful syncs
        const userResponse = await Promise.allSettled(allUsers).then((results) => {
            return (results.filter((result) => result.status === 'fulfilled') as PromiseFulfilledResult<UserDto[]>[])
                .map((result) => result.value)
                .flat();
        });
        const usersToCreate = userResponse.map((user) => {
            return this.identityService.create({
                inboundId: user.id,
                userName: user.userName,
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
            });
        });
        const usersCreated = await Promise.all(usersToCreate);

        if (
            usersCreated.every(
                (userCreated) => userCreated.success || userCreated.error instanceof IdentityAlreadyExistException,
            )
        ) {
            this.synchronized = true;
        } else {
            this.synchronized = false;
        }

        for (const user of usersCreated) {
            if (!user.success) {
                // an error occurred
                // ignore, re-throw otherwise
                // TODO update user instead
            }
        }
    }
}
