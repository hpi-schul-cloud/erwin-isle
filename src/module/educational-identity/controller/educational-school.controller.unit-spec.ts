import { Test, TestingModule } from '@nestjs/testing';
import { EducationalSchoolService } from '@root/module/educational-identity';
import { EducationalSchoolController } from './educational-school.controller';

describe('EducationalSchoolController', () => {
    let controller: EducationalSchoolController;

    beforeEach(async () => {
        const testingModule: TestingModule = await Test.createTestingModule({
            controllers: [EducationalSchoolController],
            providers: [
                {
                    provide: EducationalSchoolService,
                    useValue: {
                        create: jest.fn(),
                        findOne: jest.fn(),
                        update: jest.fn(),
                        remove: jest.fn(),
                    },
                },
            ],
        }).compile();

        controller = testingModule.get<EducationalSchoolController>(EducationalSchoolController);
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
    });
});
