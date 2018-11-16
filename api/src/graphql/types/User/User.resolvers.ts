import { User } from "../../../entity/User";
import { getRepository } from "typeorm";

export default {
    Query: {
        UserInfo: async (id: number): Promise<User> => {

            try {
                let UserRepo = await getRepository(User);
                return UserRepo.findOne(id);
            } catch (error) {
                throw new Error(
                    `Error during UserInfo Query:\n ${error}`
                );
            }
        }
    }
}