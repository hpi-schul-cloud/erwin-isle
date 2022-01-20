import { Test, TestingModule } from '@nestjs/testing';
import { EducationalProvisioningService } from '../service/educational-provisioning.service';
import { EducationalProvisioningController } from './educational-provisioning.controller';

describe('EducationalProvisioningController', () => {
    let controller: EducationalProvisioningController;

    beforeEach(async () => {
        const testingModule: TestingModule = await Test.createTestingModule({
            controllers: [EducationalProvisioningController],
            providers: [
                {
                    provide: EducationalProvisioningService,
                    useValue: {
                        import: jest.fn(),
                    },
                },
            ],
        }).compile();

        controller = testingModule.get<EducationalProvisioningController>(EducationalProvisioningController);
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
    });
});
