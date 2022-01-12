import { Test, TestingModule } from '@nestjs/testing';
import { UserProvisioningService } from '../service/user-provisioning.service';
import { UserProvisioningController } from './user-provisioning.controller';

describe('UserProvisioningController', () => {
    let controller: UserProvisioningController;

    beforeEach(async () => {
        const testingModule: TestingModule = await Test.createTestingModule({
            controllers: [UserProvisioningController],
            providers: [
                {
                    provide: UserProvisioningService,
                    useValue: {
                        synchronize: jest.fn(),
                        getStatus: jest.fn(),
                    },
                },
            ],
        }).compile();

        controller = testingModule.get<UserProvisioningController>(UserProvisioningController);
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
    });
});
