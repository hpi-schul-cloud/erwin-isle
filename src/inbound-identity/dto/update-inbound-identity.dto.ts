import { PartialType } from '@nestjs/mapped-types';
import { CreateInboundIdentityDto } from './create-inbound-identity.dto';

export class UpdateInboundIdentityDto extends PartialType(CreateInboundIdentityDto) {}
