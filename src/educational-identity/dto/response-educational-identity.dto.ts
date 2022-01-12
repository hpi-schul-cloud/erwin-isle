export class ResponseEducationalIdentityDto {
    readonly id: number;
    readonly preferredName: string;
    readonly externalId?: string;
    readonly studentId?: string;
    readonly firstName?: string;
    readonly lastName?: string;
    readonly dateOfBirth? = new Date();
    readonly educationalDetails?: {
        schools?: string[];
    };
}
