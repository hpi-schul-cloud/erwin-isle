export class ResponseEducationalIdentityDto {
    public readonly id!: number;

    public readonly preferredName!: string;

    public readonly externalId?: string;

    public readonly studentId?: string;

    public readonly firstName?: string;

    public readonly lastName?: string;

    public readonly dateOfBirth?: Date;

    public readonly educationalDetails!: {
        schools: Array<string> | undefined;
    };
}
