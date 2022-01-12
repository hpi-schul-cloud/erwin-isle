import { GuardianUserDto } from './guardian-user.dto';

export class GuardianDto {
    id: string;
    role: string;
    user: GuardianUserDto;
}
