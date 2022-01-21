import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { UserDto, UserSchoolAssignmentDto } from '@root/module/federal-api/controller/dto';
import { lastValueFrom } from 'rxjs';

@Injectable()
export class FederalApiProvisioningSource {
    public constructor(private httpService: HttpService) {}

    public async getUsers(): Promise<Array<UserDto>> {
        try {
            const res = await lastValueFrom(this.httpService.get<Array<UserDto>>(`/users`));
            return res.data;
        } catch {
            return [];
        }
    }

    public async getUser(id: string): Promise<UserDto | null> {
        try {
            const res = await lastValueFrom(this.httpService.get<UserDto>(`/users/${id}`));
            return res.data;
        } catch {
            return null;
        }
    }

    public async getUserSchools(id: string): Promise<Array<UserSchoolAssignmentDto>> {
        try {
            const res = await lastValueFrom(
                this.httpService.get<Array<UserSchoolAssignmentDto>>(`/users/${id}/schools`),
            );
            return res.data;
        } catch {
            return [];
        }
    }
}
