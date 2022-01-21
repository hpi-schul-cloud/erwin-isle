import { UserDto } from '../controller/dto/user.dto';

export interface UserProvisionSourceUc {
    /**
     * Load all users from the provisioning source.
     *
     * @param [tenant] specify users origin
     * @returns an array of all users from the provisioning source (might be empty)
     */
    import(tenant?: string | undefined): Promise<UserDto[]>;

    /**
     * Load a specific user from the provisioning source.
     *
     * @param userId specific user ID
     * @param [tenant] specifiy users origin
     * @returns the user from the provisiong source (might be null)
     */
    importOne(userId: string, tenant?: string | undefined): Promise<UserDto | null>;
}
