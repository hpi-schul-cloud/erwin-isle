import { Test, TestingModule } from '@nestjs/testing';
import { MikroORM } from '@mikro-orm/core';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import config from '@root/config/mikro-orm.config';
import { EducationalIdentity, EducationalSchool } from '@root/module/educational-identity/entity';
import { InboundIdentity } from '@root/module/inbound-identity/entity';
import { EducationalIdentityService } from '@root/module/educational-identity';
import { InboundIdentityService } from './inbound-identity.service';

describe('InboundIdentityService ORM', () => {
    let service: InboundIdentityService;
    let orm: MikroORM;

    beforeEach(async () => {
        config.tsNode = true;
        const testingModule: TestingModule = await Test.createTestingModule({
            imports: [
                MikroOrmModule.forRoot(config),
                MikroOrmModule.forFeature({
                    entities: [InboundIdentity, EducationalIdentity, EducationalSchool],
                }),
            ],
            providers: [InboundIdentityService, EducationalIdentityService],
        }).compile();

        service = testingModule.get<InboundIdentityService>(InboundIdentityService);
        orm = testingModule.get<MikroORM>(MikroORM);
    });

    afterAll(async () => orm.close(true));

    it('should be defined', () => {
        expect(service).toBeDefined();
    });
});
