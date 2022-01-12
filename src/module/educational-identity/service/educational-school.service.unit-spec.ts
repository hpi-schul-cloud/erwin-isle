import { Test, TestingModule } from '@nestjs/testing';
import { MikroORM } from '@mikro-orm/core';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import config from '@root/config/mikro-orm.config';
import { EducationalSchool } from '@root/module/educational-identity/entity';
import { EducationalSchoolService } from './educational-school.service';

describe('InboundSchoolService ORM', () => {
    let service: EducationalSchoolService;
    let orm: MikroORM;

    beforeEach(async () => {
        config.tsNode = true;
        config.debug = false;
        const testingModule: TestingModule = await Test.createTestingModule({
            imports: [MikroOrmModule.forRoot(config), MikroOrmModule.forFeature({ entities: [EducationalSchool] })],
            providers: [EducationalSchoolService],
        }).compile();

        service = testingModule.get<EducationalSchoolService>(EducationalSchoolService);
        orm = testingModule.get<MikroORM>(MikroORM);
    });

    afterAll(async () => orm.close(true));

    it('service should be defined', () => {
        expect(service).toBeDefined();
    });
});
