import { getRepositoryToken } from '@mikro-orm/nestjs';
import { Test } from '@nestjs/testing';
import { Collection } from '@mikro-orm/core';
import { EducationalIdentityService } from '@root/module/educational-identity';
import { EducationalIdentity, EducationalSchool } from '@root/module/educational-identity/entity';
import { InboundIdentity } from '@root/module/inbound-identity/entity';
import { UsersService } from '../service/users.service';
import { UsersController } from './users.controller';
import { GetUserDto, GetUserSchoolsDto, SexDto } from './dto';

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
const getUserDto: GetUserDto = {
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
    let controller: UsersController;

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
        controller = testingModule.get<UsersController>(UsersController);
    });

    it('user id should be defined', () => {
        expect(userId).toBeDefined();
    });

    it('controller should be defined', () => {
        expect(controller).toBeDefined();
    });

    describe('UsersController', () => {
        describe('getUser', () => {
            it('should return associated user data', async () => {
                const result = await controller.getUser(userId);

                expect(result).toStrictEqual<GetUserDto>(getUserDto);
            });
        });

        describe('getUserSchools', () => {
            it('should return a list of user schools', async () => {
                const result = await controller.getUserSchools(userId);

                expect(result).toStrictEqual<Array<GetUserSchoolsDto>>([]);
            });
        });
    });
});
