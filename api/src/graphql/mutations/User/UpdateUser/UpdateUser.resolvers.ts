import { User } from "../../../../entity/User";
import { getRepository } from "typeorm";

interface UpdateUserInput {
    input: {
        id: number;
        firstName: string;
        lastName: string;
        age: number;
    }
}

export default {
    Mutation: {
        UpdateUser: async (_: {}, { input }: UpdateUserInput): Promise<User> => {

            const { id, ...values } = input;
            try {
                const userRepo = await getRepository(User);
                const userToUpdate = await userRepo.findOne(input.id);

                if (!userToUpdate) {
                    throw new Error(
                        'User you want to update does not exist'
                    );
                }
                Object.assign(userToUpdate, values)
                await userRepo.save(userToUpdate);

                return userToUpdate;

            } catch (error) {
                throw new Error(
                    `Error when updating User:\n ${error}`
                );
            }

        }
    }
}