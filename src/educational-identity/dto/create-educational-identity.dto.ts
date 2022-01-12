export class CreateEducationalIdentityDto {
    readonly studentId?: number;
    readonly firstName?: string;
    readonly lastName?: string;
    readonly preferredName: string;
    readonly dateOfBirth? = new Date();
}
