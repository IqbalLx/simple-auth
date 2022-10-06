import { assertDefined } from "../utils/nonNullAssertion.utils";

type Account = {
    id?: string;
    email: string;
    mobile: string;
    mobile_raw: string;
    password: string;
    created_at?: Date;
    updated_at?: Date;
};

type AccountDPO = {
    id: string;
    email: string;
    mobile: string;
    mobile_raw: string;
};

class AccountMapper {
    static convertToDPO(account: Account): AccountDPO {
        assertDefined(account.id, "account.id");
        return {
            id: account.id,
            email: account.email,
            mobile: account.mobile,
            mobile_raw: account.mobile_raw,
        };
    }
}

export { Account, AccountDPO, AccountMapper };
