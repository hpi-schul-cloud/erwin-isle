export class CreateEducationalIdentityDto {
    public readonly studentId?: number;

    public readonly firstName?: string;

    public readonly lastName?: string;

    public readonly preferredName!: string;

    public readonly dateOfBirth?: Date;
}
