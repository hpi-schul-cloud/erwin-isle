export class ResponseUserProvisioningDto {
    readonly isRunning: boolean;
    readonly lastActionSuccesful: boolean;
    readonly lastUpdated = new Date();
}
