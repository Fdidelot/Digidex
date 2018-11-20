import { User } from "../../../../entity/User";
import { getRepository } from "typeorm";

interface RemoveUserInput {
    input: {
        id: number;
    }
}

export default {
    Mutation: {
        RemoveUser: async (_: {}, { input }: RemoveUserInput): Promise<User> => {

            let UserRepo = await getRepository(User);
            let UserToRemove = await UserRepo.findOne(input.id);
            await UserRepo.remove(UserToRemove);

            return UserToRemove;
        }
    }
}