import { Test, TestingModule } from '@nestjs/testing';
import { EducationalSchoolController } from './educational-school.controller';
import { EducationalSchoolService } from './educational-school.service';

describe('EducationalSchoolController', () => {
    let controller: EducationalSchoolController;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
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

        controller = module.get<EducationalSchoolController>(EducationalSchoolController);
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
    });
});
