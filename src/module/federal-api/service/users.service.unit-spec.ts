import { getRepositoryToken } from '@mikro-orm/nestjs';
import { Test } from '@nestjs/testing';
import { Collection } from '@mikro-orm/core';
import { EducationalIdentityService } from '@root/module/educational-identity';
import { EducationalIdentity, EducationalSchool } from '@root/module/educational-identity/entity';
import { InboundIdentity } from '@root/module/inbound-identity/entity';
import { Result } from '@root/shared/util';
import { UsersController } from '../controller/users.controller';
import { UserDto, UserSchoolAssignmentDto, SexDto } from '../controller/dto';
import { UsersService } from './users.service';

const cachedDate: Date = new Date();
const educationalIdentity: EducationalIdentity = {
    id: 1,
    studentId: 'MAX.MUSTERMANN@DOMAIN.TLD',
    firstName: 'Max',
    lastName: 'Mustermann',
    preferredName: 'Max',
    dateOfBirth: cachedDate,
    sex: SexDto.MALE,
    inboundIdentities: new Collection<InboundIdentity>(undefined),
    schools: new Collection<EducationalSchool>(undefined),
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
const getUserDto: UserDto = {
    id: 'MAX.MUSTERMANN@DOMAIN.TLD',
    studentId: 'MAX.MUSTERMANN@DOMAIN.TLD',
    firstName: 'Max',
    lastName: 'Mustermann',
    preferredName: 'Max',
    dateOfBirth: cachedDate,
    sex: SexDto.MALE,
    schools: [],
};

describe('UsersModule', () => {
    let userId: string;
    let service: UsersService;

    beforeEach(async () => {
        const testingModule = await Test.createTestingModule({
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
        service = testingModule.get<UsersService>(UsersService);
    });

    it('user id should be defined', () => {
        expect(userId).toBeDefined();
    });

    it('service should be defined', () => {
        expect(service).toBeDefined();
    });

    describe('UsersService', () => {
        describe('getUser', () => {
            it('should return user data', async () => {
                const result = await service.getUser(userId);

                expect(result).toStrictEqual<Result<UserDto>>({
                    success: true,
                    value: getUserDto,
                });
            });
        });

        describe('getUserSchools', () => {
            it('should return user schools', async () => {
                const result = await service.getUserSchools(userId);

                expect(result).toStrictEqual<Result<Array<UserSchoolAssignmentDto>>>({
                    success: true,
                    value: [],
                });
            });
        });
    });
});
