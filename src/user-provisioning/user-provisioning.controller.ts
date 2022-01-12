import { Controller, Post, Get } from '@nestjs/common';
import { ResponseUserProvisioningDto } from './dto/response-provisioning-status.dto';
import { UserProvisioningService } from './user-provisioning.service';

@Controller('user-provisioning')
export class UserProvisioningController {
    constructor(private readonly userProvisioningService: UserProvisioningService) {}

    @Post('import')
    async import(): Promise<ResponseUserProvisioningDto> {
        return this.userProvisioningService.import();
    }

    @Get()
    async get(): Promise<ResponseUserProvisioningDto> {
        return this.userProvisioningService.getStatus();
    }
}
