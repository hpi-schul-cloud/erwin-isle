export class CreateInboundIdentityDto {
    public readonly inboundId!: string;

    public readonly userName!: string;

    public readonly email?: string;

    public readonly firstName?: string;

    public readonly lastName?: string;
}
