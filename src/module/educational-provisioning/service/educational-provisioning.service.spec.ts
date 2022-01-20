import { MikroORM, Options } from '@mikro-orm/core';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Test, TestingModule } from '@nestjs/testing';
import { EducationalIdentity, EducationalSchool } from '@root/module/educational-identity/entity';
import { UserDto, SexDto } from '@root/module/federal-api/controller/dto';
import { InboundIdentityService } from '@root/module/inbound-identity';
import { InboundIdentity } from '@root/module/inbound-identity/entity';
import { EducationalIdentityService, EducationalSchoolService } from '../../educational-identity';
import { FederalApiProvisioningSource } from '../uc/federal-api-provisioning-source.uc';
import { EducationalProvisioningService } from './educational-provisioning.service';

const mockSchoolA = {
    id: '1',
    displayName: 'School A',
};

const mockSchoolB = {
    id: '2',
    displayName: 'School B',
};

const mockUserSchoolA = {
    school: mockSchoolA,
    role: 'student',
    start: new Date('2012-08-01'),
    end: new Date('2022-07-31'),
};
const mockUserSchoolB = {
    school: mockSchoolB,
    role: 'student',
    start: new Date('2011-03-01'),
    end: new Date('2017-07-31'),
};

const mockUsers: UserDto[] = [
    {
        id: '4dfb0d08-5a25-4092-8b5f-bf1e1cadfd70',
        studentId: '513-06-9822',
        firstName: 'Ricardo',
        lastName: 'Parton',
        preferredName: 'rparton',
        sex: SexDto.MALE,
        dateOfBirth: new Date('2005-02-13'),
        schools: [mockUserSchoolA],
    },
    {
        id: 'c40f541a-0e83-45d7-81a0-0f68142ce66d',
        studentId: '106-51-7835',
        firstName: 'Ida',
        lastName: 'Rawlinson',
        preferredName: 'irawlinson',
        sex: SexDto.NONE,
        dateOfBirth: new Date('2002-12-09'),
        schools: [mockUserSchoolB],
    },
];

const mockDbConfig: Options = {
    type: 'sqlite',
    dbName: ':memory:',
    entities: ['dist/**/*.entity.js'],
    entitiesTs: ['src/**/*.entity.ts'],
    debug: false,
    tsNode: true,
};

describe('EducationalProvisioningService', () => {
    let service: EducationalProvisioningService;
    let serviceEduIdent: EducationalIdentityService;
    //let serviceEduSchool: EducationalSchoolService;

    let orm: MikroORM;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            imports: [
                MikroOrmModule.forRoot(mockDbConfig),
                MikroOrmModule.forFeature({ entities: [InboundIdentity, EducationalIdentity, EducationalSchool] }),
            ],
            providers: [
                EducationalProvisioningService,
                InboundIdentityService,
                EducationalIdentityService,
                EducationalSchoolService,
                {
                    provide: FederalApiProvisioningSource,
                    useValue: {
                        getUsers: jest.fn().mockResolvedValue(mockUsers),
                    },
                },
            ],
        }).compile();

        service = module.get<EducationalProvisioningService>(EducationalProvisioningService);
        serviceEduIdent = module.get<EducationalIdentityService>(EducationalIdentityService);
        //serviceEduSchool = module.get<EducationalSchoolService>(EducationalSchoolService);
        orm = module.get<MikroORM>(MikroORM);

        const generator = orm.getSchemaGenerator();

        await generator.dropSchema();
        await generator.createSchema();
        await generator.updateSchema();
    });

    afterAll(async () => {
        //await orm.close(true);
        //return done;
    });

    it('should be defined', async () => {
        expect(service).toBeDefined();
    });

    it('should import users from Länder-API', async () => {
        // GIVEN no entries at start
        let exEduIds = await serviceEduIdent.findAll();
        expect(exEduIds.success).toBe(true);
        if (exEduIds.success) {
            expect(exEduIds.value).toHaveLength(0);
        }
        // WHEN
        await service.import();

        // THEN
        exEduIds = await serviceEduIdent.findAll();
        expect(exEduIds.success).toBe(true);
        if (exEduIds.success) {
            expect(exEduIds.value).toHaveLength(2);
            expect(exEduIds.value).toContainEqual(
                expect.objectContaining({ studentId: '513-06-9822', firstName: 'Ricardo', lastName: 'Parton' }),
            );
            expect(exEduIds.value).toContainEqual(
                expect.objectContaining({ studentId: '106-51-7835', firstName: 'Ida', lastName: 'Rawlinson' }),
            );
        }
    });
});
