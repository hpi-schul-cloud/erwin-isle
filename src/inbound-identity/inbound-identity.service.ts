import { wrap } from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';
import { EntityRepository } from '@mikro-orm/mariadb';
import { Injectable } from '@nestjs/common';
import { Result } from '../utils';
import { CreateInboundIdentityDto } from './dto/create-inbound-identity.dto';
import { UpdateInboundIdentityDto } from './dto/update-inbound-identity.dto';
import { InboundIdentity } from './entities/inbound-identity.entity';
import { EducationalIdentityService } from './../educational-identity/educational-identity.service';
import { IdentityAlreadyExistError } from './exception/identityAlreadyExists.exception';

@Injectable()
export class InboundIdentityService {
    constructor(
        @InjectRepository(InboundIdentity)
        private readonly inboundIdentityRepository: EntityRepository<InboundIdentity>,
        private readonly educationalIdentityService: EducationalIdentityService,
    ) {}

    async create(createInboundIdentityDto: CreateInboundIdentityDto): Promise<Result<InboundIdentity>> {
        // check if inboundId already exists
        const exInboundId = await this.inboundIdentityRepository.count({
            inboundId: createInboundIdentityDto.inboundId,
        });
        if (exInboundId > 0) {
            throw new IdentityAlreadyExistError('Inbound Id exists');
        }

        // check if e-mail already exists
        //TODO merge inbound identities with matching e-mail?
        // const ex = await this.inboundIdentityRepository.count({ email: createInboundIdentityDto.email });
        // if (ex > 0) {
        //     throw new IdentityAlreadyExistError('E-Mail exists');
        // }

        const inboundIdentity = new InboundIdentity();

        inboundIdentity.inboundId = createInboundIdentityDto.inboundId;
        inboundIdentity.userName = createInboundIdentityDto.userName;
        inboundIdentity.email = createInboundIdentityDto.email;
        inboundIdentity.firstName = createInboundIdentityDto.firstName;
        inboundIdentity.lastName = createInboundIdentityDto.lastName;

        const result = await this.educationalIdentityService.create({
            preferredName: inboundIdentity.userName,
            firstName: inboundIdentity.firstName,
            lastName: inboundIdentity.lastName,
        });

        inboundIdentity.eduIdentity = result.value;

        await this.inboundIdentityRepository.persistAndFlush(inboundIdentity);

        return Result.fromValue(inboundIdentity);
    }

    async findOne(id: number): Promise<Result<InboundIdentity>> {
        const inboundIdentity = id ? await this.inboundIdentityRepository.findOneOrFail(id) : undefined;

        return Result.fromValue(inboundIdentity);
    }

    async update(id: number, updateInboundIdentityDto: UpdateInboundIdentityDto): Promise<Result<InboundIdentity>> {
        const inboundIdentity = id ? await this.inboundIdentityRepository.findOne(id) : undefined;

        wrap(inboundIdentity).assign(updateInboundIdentityDto);

        return Result.fromValue(inboundIdentity);
    }

    async remove(id: number): Promise<Result<InboundIdentity>> {
        const inboundIdentity = id ? await this.inboundIdentityRepository.findOneOrFail(id) : undefined;

        await this.inboundIdentityRepository.removeAndFlush(inboundIdentity);

        return Result.fromValue(inboundIdentity);
    }
}
