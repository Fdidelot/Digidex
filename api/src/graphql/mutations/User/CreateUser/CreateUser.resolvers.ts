import { getRepository } from "typeorm";
import { User } from "../../../../entity/User";

interface CreateUserInput {
    input: {
        firstName: string;
        lastName: string;
        age: number;
    }
}

interface IUser {
    firstName: string;
}

export default {
    Mutation: {
        CreateUser: async (_: {}, { input }: CreateUserInput): Promise<IUser> => {

            const user = {
                firstName: input.firstName,
                lastName: input.lastName,
                age: input.age
            }

            const UserRepo = await getRepository(User);
            await UserRepo.save(user);

            return user;
        }
    }
}