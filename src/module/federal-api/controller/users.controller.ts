import { Controller, Get, HttpException, HttpStatus, Param } from '@nestjs/common';
import { ApiProduces, ApiResponse, ApiTags } from '@nestjs/swagger';
import { UserNotFoundException } from '@root/shared/core/exception';
import { GetUserDto, GetUserSchoolsDto } from './dto';
import { UsersService } from '../service/users.service';

@Controller('/api/users')
@ApiTags('users')
@ApiProduces('application/json')
export class UsersController {
    public constructor(private readonly service: UsersService) {}

    @Get(':id')
    @ApiResponse({
        status: 200,
        description: 'Returns associated user data.',
        type: GetUserDto,
    })
    @ApiResponse({ status: 404, description: 'User not found.' })
    public async getUser(@Param('id') id: string): Promise<GetUserDto> {
        const result = await this.service.getUser(id);

        if (result.success) {
            return result.value;
        }
        if (result.error instanceof UserNotFoundException) {
            throw new HttpException(result.error.message, HttpStatus.NOT_FOUND);
        }

        throw new HttpException(result.error, HttpStatus.INTERNAL_SERVER_ERROR);
    }

    @Get(':id/schools')
    @ApiResponse({
        status: 200,
        description: 'Returns associated user schools.',
        type: [GetUserSchoolsDto],
    })
    @ApiResponse({ status: 404, description: 'User not found.' })
    public async getUserSchools(@Param('id') id: string): Promise<Array<GetUserSchoolsDto>> {
        const result = await this.service.getUserSchools(id);

        if (result.success) {
            return result.value;
        }
        if (result.error instanceof UserNotFoundException) {
            throw new HttpException(result.error.message, HttpStatus.NOT_FOUND);
        }

        throw new HttpException(result.error, HttpStatus.INTERNAL_SERVER_ERROR);
    }
}
