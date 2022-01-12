import { UserDto } from './dto/user.dto';

export interface IUserProvisionSourceService {
    /**
     * Load all users from the provisioning source.
     *
     * @param [tenant] specifiy users origin
     * @returns an array of all users from the provisiong source (might be empty)
     */
    import(tenant?: string | undefined): Promise<UserDto[]>;
}
