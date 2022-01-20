import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { UserDto, UserSchoolAssignmentDto } from '@root/module/federal-api/controller/dto';
import { AxiosResponse } from 'axios';
import { lastValueFrom } from 'rxjs';

@Injectable()
export class FederalApiProvisioningSource {
    constructor(private httpService: HttpService) {}

    public async getUsers(): Promise<Array<UserDto>> {
        try {
            const res = (await lastValueFrom(this.httpService.get(`/users`))) as AxiosResponse<UserDto[]>;
            return res.data;
        } catch {
            return [];
        }
    }

    public async getUser(id: string): Promise<UserDto | null> {
        try {
            const res = (await lastValueFrom(this.httpService.get(`/users/${id}`))) as AxiosResponse<UserDto>;
            return res.data;
        } catch {
            return null;
        }
    }

    public async getUserSchools(id: string): Promise<Array<UserSchoolAssignmentDto>> {
        try {
            const res = (await lastValueFrom(this.httpService.get(`/users/${id}/schools`))) as AxiosResponse<
                UserSchoolAssignmentDto[]
            >;
            return res.data;
        } catch {
            return [];
        }
    }
}
