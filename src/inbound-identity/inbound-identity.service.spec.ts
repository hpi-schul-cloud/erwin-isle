import { Test, TestingModule } from '@nestjs/testing';
import { InboundIdentityService } from './inbound-identity.service';
import config from '../mikro-orm.config';
import { EntityRepository, MikroORM } from '@mikro-orm/core';
import { getRepositoryToken, MikroOrmModule } from '@mikro-orm/nestjs';
import { InboundIdentity } from './entities/inbound-identity.entity';
import { EducationalIdentity, EducationalSchool } from './../educational-identity/entities';
import { EducationalIdentityService } from './../educational-identity/educational-identity.service';

describe('InboundIdentityService ORM', () => {
    let service: InboundIdentityService;
    let orm: MikroORM;

    beforeEach(async () => {
        config.tsNode = true;
        const module: TestingModule = await Test.createTestingModule({
            imports: [
                MikroOrmModule.forRoot(config),
                MikroOrmModule.forFeature({ entities: [InboundIdentity, EducationalIdentity, EducationalSchool] }),
            ],
            providers: [InboundIdentityService, EducationalIdentityService],
        }).compile();

        service = module.get<InboundIdentityService>(InboundIdentityService);
        orm = module.get<MikroORM>(MikroORM);
    });

    afterAll(async () => await orm.close(true));

    it('should be defined', () => {
        expect(service).toBeDefined();
    });
});

const testInbondIdentity1 = new InboundIdentity();
const testInbondIdentity2 = new InboundIdentity();

testInbondIdentity1.inboundId = '1000';
testInbondIdentity1.userName = 'testUser';
testInbondIdentity2.inboundId = '1001';
testInbondIdentity2.userName = 'testUser2';

const repoInboundArray = [testInbondIdentity1, testInbondIdentity2];

const testEducationalIdentity1 = new EducationalIdentity();
const testEducationalIdentity2 = new EducationalIdentity();

testEducationalIdentity1.id = 1;
testEducationalIdentity2.id = 2;

const repoEduArray = [testEducationalIdentity1, testEducationalIdentity2];

describe('InboundIdentityService db mock', () => {
    let service: InboundIdentityService;
    let repo: EntityRepository<InboundIdentity>;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                InboundIdentityService,
                EducationalIdentityService,
                {
                    provide: getRepositoryToken(InboundIdentity),
                    useValue: {
                        find: jest.fn().mockResolvedValue(repoInboundArray),
                        findOne: jest.fn().mockResolvedValue(testInbondIdentity1),
                        findOneOrFail: jest.fn().mockResolvedValue(testInbondIdentity1),
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

        service = module.get<InboundIdentityService>(InboundIdentityService);
        repo = module.get<EntityRepository<InboundIdentity>>(getRepositoryToken(InboundIdentity));
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    describe('create', () => {
        it('should create an inbound identity', async () => {
            const ret = await service.create({ inboundId: '1000', userName: 'testUser' });

            expect(ret.value).toMatchObject(testInbondIdentity1);
            expect(repo.persistAndFlush).toBeCalled();
        });
    });

    describe('findOne', () => {
        it('should get an inbound identity by id', async () => {
            const ret = await service.findOne(1);

            expect(ret.value).toEqual(testInbondIdentity1);
        });
    });

    describe('update', () => {
        it('should return the update inbound identity', async () => {
            const ret = await service.update(1, { inboundId: '1000' });

            expect(ret.value).toEqual(testInbondIdentity1);
        });
    });

    describe('remove', () => {
        it('should return the deleted inbound identity', async () => {
            const ret = await service.remove(1);

            expect(ret.value).toEqual(testInbondIdentity1);
            expect(repo.removeAndFlush).toBeCalled();
        });
    });
});
