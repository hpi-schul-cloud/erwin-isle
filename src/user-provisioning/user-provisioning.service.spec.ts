import { Test, TestingModule } from '@nestjs/testing';
import { UserProvisioningService } from './user-provisioning.service';
import { UserDto } from './dto/user.dto';
import { InboundIdentityService } from './../inbound-identity/inbound-identity.service';
import { KeycloakProvisioningSourceService } from './keycloak-provisioning-source/keycloak-provisioning-source.service';
import { IdentityAlreadyExistError } from './../inbound-identity/exception/identityAlreadyExists.exception';
import { IUserProvisionSourceService } from './user-provisioning-source.interface';

const user1: UserDto = { email: 'adr1@mail.xyz', firstName: 'Alice', lastName: 'T', id: '1', userName: 'userAlice' };
const user2: UserDto = { email: 'adr2@mail.xyz', firstName: 'Bob', lastName: 'T', id: '2', userName: 'userBob' };

const mockedUsers = [user1, user2];

describe('UserProvisioningService', () => {
    let service: UserProvisioningService;
    let inboundService: InboundIdentityService;
    let provisioningService: IUserProvisionSourceService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                UserProvisioningService,
                {
                    provide: InboundIdentityService,
                    useValue: {
                        create: jest.fn(),
                    },
                },
                {
                    provide: KeycloakProvisioningSourceService,
                    useValue: {
                        import: jest.fn().mockResolvedValue(mockedUsers),
                    },
                },
            ],
        }).compile();

        service = module.get<UserProvisioningService>(UserProvisioningService);
        inboundService = module.get<InboundIdentityService>(InboundIdentityService);
        provisioningService = module.get<KeycloakProvisioningSourceService>(KeycloakProvisioningSourceService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    it('should import users from a provider', async () => {
        const inboundMock = jest.spyOn(inboundService, 'create').mockResolvedValue(undefined);

        const res = await service.import();
        expect(res.isRunning).toBe(false);
        expect(res.lastActionSuccesful).toBe(true);

        expect(inboundMock).toHaveBeenCalledTimes(2);
    });

    it('should ignore duplicate users from a provider', async () => {
        const inboundMock = jest
            .spyOn(inboundService, 'create')
            .mockRejectedValue(new IdentityAlreadyExistError('Catched'));

        const res = await service.import();

        expect(res.isRunning).toBe(false);
        expect(res.lastActionSuccesful).toBe(true);
        expect(inboundMock).toHaveBeenCalledTimes(2);
    });

    it('should fail gracefully on provider exceptions', async () => {
        const inboundMock = jest.spyOn(inboundService, 'create').mockRejectedValue(new Error('Unhandled'));

        const res = await service.import();

        expect(res.isRunning).toBe(false);
        expect(res.lastActionSuccesful).toBe(false);
        expect(inboundMock).toHaveBeenCalledTimes(1);
    });

    it('should not allow concurrent calls', async () => {
        jest.useFakeTimers();

        const sleep = (time: number) => {
            return new Promise((resolve) => setTimeout(resolve, time));
        };

        jest.spyOn(provisioningService, 'import').mockImplementation(async () => {
            await sleep(1);
            return Promise.resolve(mockedUsers);
        });

        expect(service.getStatus().isRunning).toBe(false);

        // first call
        const res1P = service.import();
        expect(service.getStatus().isRunning).toBe(true);

        // second call
        const res2 = await service.import();
        expect(res2.isRunning).toBe(true);
        expect(service.getStatus().isRunning).toBe(true);

        jest.advanceTimersByTime(1);
        const res1 = await res1P;
        expect(service.getStatus().isRunning).toBe(false);

        expect(res1.isRunning).toBe(false);
        expect(res1.lastActionSuccesful).toBe(true);

        jest.useRealTimers();
    });
});
