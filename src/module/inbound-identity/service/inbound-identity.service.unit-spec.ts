import { Test, TestingModule } from '@nestjs/testing';
import { EntityRepository, MikroORM } from '@mikro-orm/core';
import { getRepositoryToken, MikroOrmModule } from '@mikro-orm/nestjs';
import config from '@root/config/mikro-orm.config';
import { EducationalIdentity, EducationalSchool } from '@root/module/educational-identity/entity';
import { InboundIdentity } from '@root/module/inbound-identity/entity';
import { EducationalIdentityService } from '@root/module/educational-identity';
import { Result } from '@root/shared/util';
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

const testInboundIdentity1 = new InboundIdentity();
const testInboundIdentity2 = new InboundIdentity();

testInboundIdentity1.inboundId = '1000';
testInboundIdentity1.userName = 'testUser';
testInboundIdentity2.inboundId = '1001';
testInboundIdentity2.userName = 'testUser2';

const repoInboundArray = [testInboundIdentity1, testInboundIdentity2];

const testEducationalIdentity1 = new EducationalIdentity();
const testEducationalIdentity2 = new EducationalIdentity();

testEducationalIdentity1.id = 1;
testEducationalIdentity2.id = 2;

const repoEduArray = [testEducationalIdentity1, testEducationalIdentity2];

describe('InboundIdentityService db mock', () => {
    let service: InboundIdentityService;
    let repo: EntityRepository<InboundIdentity>;

    beforeEach(async () => {
        const testingModule: TestingModule = await Test.createTestingModule({
            providers: [
                InboundIdentityService,
                EducationalIdentityService,
                {
                    provide: getRepositoryToken(InboundIdentity),
                    useValue: {
                        find: jest.fn().mockResolvedValue(repoInboundArray),
                        findOne: jest.fn().mockResolvedValue(testInboundIdentity1),
                        findOneOrFail: jest.fn().mockResolvedValue(testInboundIdentity1),
                        count: jest.fn().mockResolvedValue(0),
                        removeAndFlush: jest.fn(),
                        persistAndFlush: jest.fn(),
                    },
                },
                {
                    provide: getRepositoryToken(EducationalIdentity),
                    useValue: {
                        find: jest.fn().mockResolvedValue(repoEduArray),
                        findOne: jest.fn().mockResolvedValue(testEducationalIdentity1),
                        findOneOrFail: jest.fn().mockResolvedValue(testEducationalIdentity1),
                        removeAndFlush: jest.fn(),
                        persistAndFlush: jest.fn(),
                    },
                },
                {
                    provide: getRepositoryToken(EducationalSchool),
                    useValue: {
                        find: jest.fn(),
                        findOne: jest.fn(),
                        findOneOrFail: jest.fn(),
                        removeAndFlush: jest.fn(),
                        persistAndFlush: jest.fn(),
                    },
                },
            ],
        }).compile();

        service = testingModule.get<InboundIdentityService>(InboundIdentityService);
        repo = testingModule.get<EntityRepository<InboundIdentity>>(getRepositoryToken(InboundIdentity));
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    describe('create', () => {
        it('should create an inbound identity', async () => {
            const ret = await service.create({
                inboundId: '1000',
                userName: 'testUser',
            });
            const spy = jest.spyOn(repo, 'persistAndFlush');

            expect(ret).toMatchObject<Result<InboundIdentity>>({
                success: true,
                value: testInboundIdentity1,
            });
            expect(spy).toHaveBeenCalled();
        });
    });

    describe('findOne', () => {
        it('should get an inbound identity by id', async () => {
            const ret = await service.findOne(1);

            expect(ret).toStrictEqual<Result<InboundIdentity>>({
                success: true,
                value: testInboundIdentity1,
            });
        });
    });

    describe('update', () => {
        it('should return the update inbound identity', async () => {
            const ret = await service.update(1, { inboundId: '1000' });

            expect(ret).toStrictEqual<Result<InboundIdentity>>({
                success: true,
                value: testInboundIdentity1,
            });
        });
    });

    describe('remove', () => {
        it('should return the deleted inbound identity', async () => {
            const ret = await service.remove(1);
            const spy = jest.spyOn(repo, 'removeAndFlush');

            expect(ret).toStrictEqual<Result<InboundIdentity>>({
                success: true,
                value: testInboundIdentity1,
            });
            expect(spy).toHaveBeenCalled();
        });
    });
});
