import { assertDefined } from "../utils/nonNullAssertion.utils";

type Profile = {
    id?: string;
    first_name: string;
    last_name: string;
    dob?: string | null;
    gender?: boolean | null; // true = M, false = F
    created_at?: Date;
    updated_at?: Date;
};

type ProfileDPO = {
    id: string;
    first_name: string;
    last_name: string;
    dob: string | null;
    gender: boolean | null;
};

class ProfileMapper {
    static convertToDPO(profile: Profile): ProfileDPO {
        assertDefined(profile.id, "profile.id");
        return {
            id: profile.id,
            first_name: profile.first_name,
            last_name: profile.last_name,
            dob: profile.dob ?? null,
            gender: profile.gender ?? null,
        };
    }
}

export { Profile, ProfileDPO, ProfileMapper };
