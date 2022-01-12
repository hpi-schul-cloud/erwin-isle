import { Controller, Post, Get } from '@nestjs/common';
import { UserProvisioningService } from '../service/user-provisioning.service';
import { ResponseUserProvisioningDto } from './dto';

@Controller('user-provisioning')
export class UserProvisioningController {
    public constructor(private readonly userProvisioningService: UserProvisioningService) {}

    @Post('import')
    public async import(): Promise<ResponseUserProvisioningDto> {
        return this.userProvisioningService.import();
    }

    @Get()
    public get(): ResponseUserProvisioningDto {
        return this.userProvisioningService.getStatus();
    }
}
