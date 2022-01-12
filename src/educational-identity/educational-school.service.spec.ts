import { Test, TestingModule } from '@nestjs/testing';
import { MikroORM } from '@mikro-orm/core';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { EducationalSchool } from './entities/educational-school.entity';
import { EducationalSchoolService } from './educational-school.service';
import config from '../mikro-orm.config';

describe('InboundSchoolService ORM', () => {
    let service: EducationalSchoolService;
    let orm: MikroORM;

    beforeEach(async () => {
        config.tsNode = true;
        config.debug = false;
        const module: TestingModule = await Test.createTestingModule({
            imports: [MikroOrmModule.forRoot(config), MikroOrmModule.forFeature({ entities: [EducationalSchool] })],
            providers: [EducationalSchoolService],
        }).compile();

        service = module.get<EducationalSchoolService>(EducationalSchoolService);
        orm = module.get<MikroORM>(MikroORM);
    });

    afterAll(async () => await orm.close(true));

    it('should be defined', () => {
        expect(service).toBeDefined();
    });
});
