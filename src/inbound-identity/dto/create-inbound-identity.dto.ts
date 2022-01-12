export class CreateInboundIdentityDto {
    readonly inboundId: string;
    readonly userName: string;
    readonly email?: string;
    readonly firstName?: string;
    readonly lastName?: string;
}
