import { Module } from '@nestjs/common';
import { EducationalIdentityModule } from '../../educational-identity';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

@Module({
    imports: [EducationalIdentityModule],
    controllers: [UsersController],
    providers: [UsersService],
})
export class UsersModule {}
