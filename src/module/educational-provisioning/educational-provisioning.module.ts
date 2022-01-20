import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { EducationalProvisioningService } from './service/educational-provisioning.service';
import { EducationalIdentityModule } from '../educational-identity';
import { FederalApiProvisioningSource } from './uc/federal-api-provisioning-source.uc';
import config from '@root/config/educational-provisioning.config.json';
import { EducationalProvisioningController } from './controller/educational-provisioning.controller';

@Module({
    imports: [
        HttpModule.register({ baseURL: config.baseUrl, timeout: 5000, responseType: 'json' }),
        EducationalIdentityModule,
    ],
    controllers: [EducationalProvisioningController],
    providers: [EducationalProvisioningService, FederalApiProvisioningSource],
})
export class EducationalProvisioningModule {}
