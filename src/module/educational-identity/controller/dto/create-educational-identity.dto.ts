export class CreateEducationalIdentityDto {
    public readonly originId?: string;

    public readonly studentId?: string;

    public readonly firstName?: string;

    public readonly lastName?: string;

    public readonly preferredName!: string;

    public readonly dateOfBirth?: Date;
}
