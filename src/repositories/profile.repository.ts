import { Profile } from "../entities/profile.entity";

interface IProfileRepository {
    getProfile(profileId: string): Promise<Profile>;
    updateProfile(
        profileId: string,
        newProfile: Partial<Profile>
    ): Promise<Profile>;
}

export type { IProfileRepository };
