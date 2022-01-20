import { Controller, Post } from '@nestjs/common';
import { EducationalProvisioningService } from '../service/educational-provisioning.service';
import { ResponseEducationalProvisioningDto } from './dto';

@Controller('educational-provisioning')
export class EducationalProvisioningController {
    public constructor(private readonly educationalProvisioningService: EducationalProvisioningService) {}

    @Post('import')
    public async import(): Promise<ResponseEducationalProvisioningDto> {
        const ret = await this.educationalProvisioningService.import();
        return { success: ret };
    }
}
