import { Test, TestingModule } from '@nestjs/testing';
import { EducationalIdentityController } from './educational-identity.controller';
import { EducationalIdentityService } from './educational-identity.service';

describe('EducationalIdentityController', () => {
    let controller: EducationalIdentityController;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
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

        controller = module.get<EducationalIdentityController>(EducationalIdentityController);
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
    });
});
