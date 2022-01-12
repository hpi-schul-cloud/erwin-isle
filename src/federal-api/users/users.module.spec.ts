import { getRepositoryToken } from '@mikro-orm/nestjs';
import { Test } from '@nestjs/testing';
import { EducationalIdentity, EducationalSchool } from '../../educational-identity/entities';
import { InboundIdentity } from '../../inbound-identity/entities/inbound-identity.entity';
import { EducationalIdentityService } from '../../educational-identity';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { Collection } from '@mikro-orm/core';

const educationalIdentity: EducationalIdentity = {
    id: 1,
    studentId: 'MAX.MUSTERMANN@DOMAIN.TLD',
    firstName: 'Max',
    lastName: 'Mustermann',
    preferredName: 'Max',
    dateOfBirth: new Date(),
    inboundIdentities: new Collection(undefined, new Array<InboundIdentity>(), false),
    schools: new Collection(undefined, new Array<EducationalSchool>(), false),
};
const inboundIdentity: InboundIdentity = {
    id: 1,
    inboundId: 'MAX.MUSTERMANN@DOMAIN.TLD',
    email: 'MAX.MUSTERMANN@DOMAIN.TLD',
    userName: 'MAX.MUSTERMANN@DOMAIN.TLD',
    firstName: 'Max',
    lastName: 'Mustermann',
    eduIdentity: educationalIdentity,
};

describe('UsersModule', () => {
    let userId: string;
    let service: UsersService;
    let controller: UsersController;

    beforeEach(async () => {
        const module = await Test.createTestingModule({
            controllers: [UsersController],
            providers: [
                UsersService,
                EducationalIdentityService,
                {
                    provide: getRepositoryToken(EducationalIdentity),
                    useValue: {
                        findOneOrFail: jest.fn().mockResolvedValue(educationalIdentity),
                    },
                },
                {
                    provide: getRepositoryToken(EducationalSchool),
                    useValue: {},
                },
                {
                    provide: getRepositoryToken(InboundIdentity),
                    useValue: {
                        findOneOrFail: jest.fn().mockResolvedValue(inboundIdentity),
                    },
                },
            ],
        }).compile();

        userId = 'MAX.MUSTERMANN@DOMAIN.TLD';
        service = module.get<UsersService>(UsersService);
        controller = module.get<UsersController>(UsersController);
    });

    it('user id should be defined', () => {
        expect(userId).toBeDefined();
    });

    it('service should be defined', () => {
        expect(service).toBeDefined();
    });

    it('controller should be defined', () => {
        expect(controller).toBeDefined();
    });

    describe('UsersService', () => {
        describe('getUser', () => {
            it('should return user data', async () => {
                const result = await service.getUser(userId);

                expect(result).toBeDefined();
                expect(result.value.studentId).toEqual(userId);
            });
        });

        describe('getUserSchools', () => {
            it('should return user schools', async () => {
                const result = await service.getUserSchools(userId);

                expect(Array.isArray(result.value)).toBeTruthy();
                expect(result.value.length).toBeGreaterThanOrEqual(0);
            });
        });
    });

    describe('UsersController', () => {
        describe('getUser', () => {
            it('should return associated user data', async () => {
                const result = await controller.getUser(userId);

                expect(result).toBeDefined();
            });
        });

        describe('getUserSchools', () => {
            it('should return a list of user schools', async () => {
                const result = await controller.getUserSchools(userId);

                expect(Array.isArray(result)).toBeTruthy();
                expect(result.length).toBeGreaterThanOrEqual(0);
            });
        });
    });
});
