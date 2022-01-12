import { wrap } from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';
import { EntityRepository } from '@mikro-orm/mariadb';
import { Injectable } from '@nestjs/common';
import { EducationalIdentityService } from '@root/module/educational-identity';
import { IdentityAlreadyExistException } from '@root/shared/core/exception';
import { Result } from '@root/shared/util';
import { InboundIdentity } from '../entity';
import { CreateInboundIdentityDto, UpdateInboundIdentityDto } from '../controller/dto';

@Injectable()
export class InboundIdentityService {
    public constructor(
        @InjectRepository(InboundIdentity)
        private readonly inboundIdentityRepository: EntityRepository<InboundIdentity>,
        private readonly educationalIdentityService: EducationalIdentityService,
    ) {}

    // TODO: refactoring
    public async create(createInboundIdentityDto: CreateInboundIdentityDto): Promise<Result<InboundIdentity>> {
        // check if inboundId already exists
        const exInboundId = await this.inboundIdentityRepository.count({
            inboundId: createInboundIdentityDto.inboundId,
        });
        if (exInboundId > 0) {
            return { success: false, error: new IdentityAlreadyExistException('Inbound Id exists') };
        }

        // check if e-mail already exists
        // TODO merge inbound identities with matching e-mail?
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

        if (result.success) {
            inboundIdentity.eduIdentity = result.value;

            await this.inboundIdentityRepository.persistAndFlush(inboundIdentity);

            return { success: true, value: inboundIdentity };
        }

        return { success: false, error: new Error() };
    }

    public async findOne(id: number): Promise<Result<InboundIdentity>> {
        const inboundIdentity = await this.inboundIdentityRepository.findOneOrFail(id);

        return { success: true, value: inboundIdentity };
    }

    public async update(
        id: number,
        updateInboundIdentityDto: UpdateInboundIdentityDto,
    ): Promise<Result<InboundIdentity>> {
        const inboundIdentity = await this.inboundIdentityRepository.findOneOrFail(id);

        wrap(inboundIdentity).assign(updateInboundIdentityDto);

        return { success: true, value: inboundIdentity };
    }

    public async remove(id: number): Promise<Result<InboundIdentity>> {
        const inboundIdentity = await this.inboundIdentityRepository.findOneOrFail(id);

        await this.inboundIdentityRepository.removeAndFlush(inboundIdentity);

        return { success: true, value: inboundIdentity };
    }
}
