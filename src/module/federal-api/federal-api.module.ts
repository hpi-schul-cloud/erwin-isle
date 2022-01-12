import { Module } from '@nestjs/common';
import { EducationalIdentityModule } from '@root/module/educational-identity';
import { UsersController } from './controller/users.controller';
import { UsersService } from './service/users.service';

@Module({
    imports: [EducationalIdentityModule],
    controllers: [UsersController],
    providers: [UsersService],
})
export class FederalApiModule {}
