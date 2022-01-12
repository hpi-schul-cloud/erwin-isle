import { Test, TestingModule } from '@nestjs/testing';
import { MikroORM } from '@mikro-orm/core';
import { getRepositoryToken, MikroOrmModule } from '@mikro-orm/nestjs';
import { EducationalIdentity } from './entities/educational-identity.entity';
import { EducationalSchool } from './entities/educational-school.entity';
import { InboundIdentity } from '../inbound-identity/entities/inbound-identity.entity';
import { EducationalIdentityService } from './educational-identity.service';
import config from '../mikro-orm.config';

describe('InboundIdentityService ORM', () => {
    let service: EducationalIdentityService;
    let orm: MikroORM;

    beforeEach(async () => {
        config.tsNode = true;
        config.debug = false;
        const module: TestingModule = await Test.createTestingModule({
            imports: [
                MikroOrmModule.forRoot(config),
                MikroOrmModule.forFeature({ entities: [InboundIdentity, EducationalIdentity, EducationalSchool] }),
            ],
            providers: [EducationalIdentityService, EducationalIdentityService],
        }).compile();

        service = module.get<EducationalIdentityService>(EducationalIdentityService);
        orm = module.get<MikroORM>(MikroORM);
    });

    afterAll(async () => await orm.close(true));

    it('should be defined', () => {
        expect(service).toBeDefined();
    });
});

// describe('EducationalIdentityService db test', () => {
//     let service: EducationalIdentityService;
//     let orm: MikroORM;

//     const config: Options = {
//         type: 'sqlite',
//         dbName: ':memory:',
//         entities: ['dist/**/*.entity.js'],
//         entitiesTs: ['src/**/*.entity.ts'],
//         debug: false,
//         tsNode: true,
//     };

//     beforeEach(async () => {
//         const module: TestingModule = await Test.createTestingModule({
//             imports: [
//                 MikroOrmModule.forRoot(config),
//                 MikroOrmModule.forFeature({ entities: [InboundIdentity, EducationalIdentity] }),
//             ],
//             providers: [EducationalIdentityService],
//         }).compile();

//         service = module.get<EducationalIdentityService>(EducationalIdentityService);
//         orm = module.get<MikroORM>(MikroORM);
//         const generator = orm.getSchemaGenerator();
//         //await generator.dropSchema();
//         await generator.createSchema();
//     });

//     //afterAll(async () => await orm.close(true));

//     it('should be defined', () => {
//         expect(service).toBeDefined();
//     });

//     it('should allow to update a user', async () => {
//         const testName = 'name';
//         const retBefore = await service.create({ preferredName: testName });
//         expect(retBefore.educationalIdentity.preferredName).toBe(testName);

//         const testNameNew = 'newName';
//         const retAfter = await service.update(retBefore.educationalIdentity.id, { preferredName: testNameNew });
//         expect(retAfter.educationalIdentity.preferredName).toBe(testNameNew);
//         expect(retAfter.educationalIdentity.id).toBe(testEduId.id);
//     });
// });

const testEduId = new EducationalIdentity();
testEduId.id = 1;
testEduId.preferredName = 'name';

const testInboundId = new InboundIdentity();
testInboundId.id = 1;
testInboundId.inboundId = '1';
testInboundId.userName = 'testUser';
testInboundId.eduIdentity = testEduId;

describe('EducationalIdentityService db mock', () => {
    let service: EducationalIdentityService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                EducationalIdentityService,
                {
                    provide: getRepositoryToken(EducationalIdentity),
                    useValue: {
                        findAll: jest.fn().mockResolvedValue([testEduId]),
                        findOne: jest.fn().mockResolvedValue(testEduId),
                        findOneOrFail: jest.fn().mockResolvedValue(testEduId),
                        removeAndFlush: jest.fn(),
                        persistAndFlush: jest.fn(),
                    },
                },
                {
                    provide: getRepositoryToken(EducationalSchool),
                    useValue: {
                        findAll: jest.fn().mockResolvedValue([]),
                        findOne: jest.fn().mockResolvedValue(undefined),
                        findOneOrFail: jest.fn(),
                        removeAndFlush: jest.fn(),
                        persistAndFlush: jest.fn(),
                    },
                },
                {
                    provide: getRepositoryToken(InboundIdentity),
                    useValue: {
                        findAll: jest.fn().mockResolvedValue([testInboundId]),
                        findOne: jest.fn().mockResolvedValue(testInboundId),
                        findOneOrFail: jest.fn().mockResolvedValue(testInboundId),
                        removeAndFlush: jest.fn(),
                        persistAndFlush: jest.fn(),
                    },
                },
            ],
        }).compile();

        service = module.get<EducationalIdentityService>(EducationalIdentityService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    it('should allow to create a user', async () => {
        const ret = await service.create({ preferredName: testEduId.preferredName });

        expect(ret.value.preferredName).toBe(testEduId.preferredName);
    });

    it('should allow to remove a user', async () => {
        const ret = await service.remove(testEduId.id);

        expect(ret.value.id).toBe(testEduId.id);
    });

    it('should allow to find a user', async () => {
        const ret = await service.findOne(testEduId.id);

        expect(ret.value.id).toBe(testEduId.id);
    });

    it('should allow to find a user by inbound Id', async () => {
        const ret = await service.findOneByInboundId(testInboundId.inboundId);

        expect(ret.value.id).toBe(testEduId.id);
    });

    it('should allow to find all users ', async () => {
        const ret = await service.findAll();
        const exp = testEduId;

        expect(ret.value).toContainEqual(exp);
    });
});
