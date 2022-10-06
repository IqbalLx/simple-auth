import { parsePhoneNumber } from "awesome-phonenumber";

interface IPhoneNumberUtils {
    isValidNumber(phoneNumber: string, countryCode?: string): boolean;
    getNumber(phoneNumber: string, countryCode?: string): string;
}

class PhoneNumberFormatter implements IPhoneNumberUtils {
    isValidNumber(phoneNumber: string, countryCode?: string): boolean {
        const isValidNumber: boolean = parsePhoneNumber(
            phoneNumber,
            countryCode ?? "ID"
        ).isValid();
        return isValidNumber;
    }

    getNumber(phoneNumber: string, countryCode?: string): string {
        const nationalPhoneNumber: string = parsePhoneNumber(
            phoneNumber,
            countryCode ?? "ID"
        ).getNumber();
        return nationalPhoneNumber;
    }
}

const phoneNumberFormatter = new PhoneNumberFormatter();

export type { IPhoneNumberUtils };
export { phoneNumberFormatter };
