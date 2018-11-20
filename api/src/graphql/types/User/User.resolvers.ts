import { User } from "../../../entity/User";
import { getRepository, getConnection } from "typeorm";
import { Digimon } from "../../../entity/Digimon";

export default {
    Query: {
        UserInfo: async (_: null, { id }: { id: number }): Promise<User> => {

            try {
                let UserRepo = await getRepository(User);
                return UserRepo.findOne(id);
            } catch (error) {
                throw new Error(
                    `Error during UserInfo Query:\n ${error}`
                );
            }
        }
    },

    User: {
        digimons: async (_: User): Promise<Digimon[]> => {
            const userRepo = await getRepository(User);
            const user = await userRepo.findOne(_.id, {
                relations: ['digimons']
            });

            const test = await getConnection()
                .createQueryBuilder()
                .relation(User, 'digimons')
                .of(_)
                .loadMany()

            console.log(user.digimons)
            console.log(test)

            return user.digimons;
        }
    }
}