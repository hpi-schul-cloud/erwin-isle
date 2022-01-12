import { Test, TestingModule } from '@nestjs/testing';
import { UserProvisioningController } from './user-provisioning.controller';
import { UserProvisioningService } from './user-provisioning.service';

describe('UserProvisioningController', () => {
    let controller: UserProvisioningController;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
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

        controller = module.get<UserProvisioningController>(UserProvisioningController);
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
    });
});
