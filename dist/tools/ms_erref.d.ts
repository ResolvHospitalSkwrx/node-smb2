interface ErrorInfo {
    code: string;
    message: string;
}
interface FacilityInfo extends ErrorInfo {
    value: number;
}
interface SeverityInfo extends ErrorInfo {
    value: number;
}
export interface StatusError extends ErrorInfo {
    value: number;
    valueHex: string;
    facility: FacilityInfo;
    severity: SeverityInfo;
}
export declare function getStatus(errorCode: number): StatusError;
export declare function getErrorMessage(err: StatusError): string;
export {};
//# sourceMappingURL=ms_erref.d.ts.map