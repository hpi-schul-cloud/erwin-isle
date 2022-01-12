import { Test, TestingModule } from '@nestjs/testing';
import { EducationalIdentityController, EducationalIdentityService } from '@root/module/educational-identity';

describe('EducationalIdentityController', () => {
    let controller: EducationalIdentityController;

    beforeEach(async () => {
        const testingModule: TestingModule = await Test.createTestingModule({
            controllers: [EducationalIdentityController],
            providers: [
                {
                    provide: EducationalIdentityService,
                    useValue: {
                        create: jest.fn(),
                        findOne: jest.fn(),
                        update: jest.fn(),
                        remove: jest.fn(),
                    },
                },
            ],
        }).compile();

        controller = testingModule.get<EducationalIdentityController>(EducationalIdentityController);
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
    });
});
