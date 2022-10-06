import { assertDefined } from "../utils/nonNullAssertion.utils";

type Token = {
    id?: string;
    account_id: string;
    value: string;
    expires_at: Date;
    created_at?: Date;
};

type TokenDPO = {
    token: string;
};

class TokenMapper {
    static convertToDPO(token: Token): TokenDPO {
        assertDefined(token.id, "token.id");
        return {
            token: `${token.id}.${token.value}`,
        };
    }
}

export { Token, TokenDPO, TokenMapper };
