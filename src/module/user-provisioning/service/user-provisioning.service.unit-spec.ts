import { Test, TestingModule } from '@nestjs/testing';
import { InboundIdentity } from '@root/module/inbound-identity/entity';
import { InboundIdentityService } from '@root/module/inbound-identity';
import { IdentityAlreadyExistException } from '@root/shared/core/exception';
import { UserDto } from '../controller/dto/user.dto';
import { UserProvisioningService } from './user-provisioning.service';
import { KeycloakProvisioningSourceUc } from '../uc/keycloak-provisioning-source.uc';
import { UserProvisionSourceUc } from '../uc/user-provisioning-source.uc';

const user1: UserDto = {
    email: 'adr1@mail.xyz',
    firstName: 'Alice',
    lastName: 'T',
    id: '1',
    userName: 'userAlice',
};
const user2: UserDto = {
    email: 'adr2@mail.xyz',
    firstName: 'Bob',
    lastName: 'T',
    id: '2',
    userName: 'userBob',
};

const mockedUsers = [user1, user2];

describe('UserProvisioningService', () => {
    let service: UserProvisioningService;
    let inboundService: InboundIdentityService;
    let provisioningService: UserProvisionSourceUc;

    beforeEach(async () => {
        const testingModule: TestingModule = await Test.createTestingModule({
            providers: [
                UserProvisioningService,
                {
                    provide: InboundIdentityService,
                    useValue: {
                        create: jest.fn(),
                    },
                },
                {
                    provide: KeycloakProvisioningSourceUc,
                    useValue: {
                        import: jest.fn().mockResolvedValue(mockedUsers),
                    },
                },
            ],
        }).compile();

        service = testingModule.get<UserProvisioningService>(UserProvisioningService);
        inboundService = testingModule.get<InboundIdentityService>(InboundIdentityService);
        provisioningService = testingModule.get<KeycloakProvisioningSourceUc>(KeycloakProvisioningSourceUc);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    it('should import users from a provider', async () => {
        const inboundMock = jest.spyOn(inboundService, 'create').mockResolvedValue({
            success: true,
            value: { id: 1, inboundId: 'inboundId', userName: 'userName' },
        });

        const res = await service.import();
        expect(res.isRunning).toBe(false);
        expect(res.lastActionSuccessful).toBe(true);

        expect(inboundMock).toHaveBeenCalledTimes(2);
    });

    it('should ignore duplicate users from a provider', async () => {
        const inboundMock = jest
            .spyOn(inboundService, 'create')
            .mockResolvedValue({ success: false, error: new IdentityAlreadyExistException('Catched') });

        const res = await service.import();

        expect(res.isRunning).toBe(false);
        expect(res.lastActionSuccessful).toBe(true);
        expect(inboundMock).toHaveBeenCalledTimes(2);
    });

    it('should fail gracefully on provider exceptions', async () => {
        const createSpy = jest
            .spyOn(inboundService, 'create')
            .mockResolvedValue({ success: false, error: new Error('Unhandled') });

        const res = await service.import();

        expect(res.isRunning).toBe(false);
        expect(res.lastActionSuccessful).toBe(false);
        expect(createSpy).toHaveBeenCalledTimes(mockedUsers.length);
    });

    it('should not allow concurrent calls', async () => {
        jest.useFakeTimers();

        const sleep = (time: number): Promise<void> => {
            // eslint-disable-next-line no-promise-executor-return
            return new Promise((resolve) => setTimeout(resolve, time));
        };

        jest.spyOn(inboundService, 'create').mockResolvedValue({ success: true, value: new InboundIdentity() });

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
        expect(res1.lastActionSuccessful).toBe(true);

        jest.useRealTimers();
    });
});
