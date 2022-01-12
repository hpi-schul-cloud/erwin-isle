import { GuardianUserDto } from './guardian-user.dto';

export class GuardianDto {
    public id!: string;

    public role!: string;

    public user!: GuardianUserDto;
}
