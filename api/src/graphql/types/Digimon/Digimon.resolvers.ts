import { Digimon } from "../../../entity/Digimon";
import { getRepository, getConnection } from "typeorm";
import { User } from "../../../entity/User";

export default {
    Query: {
        DigimonInfo: async (_: null, id: number): Promise<Digimon> => {

            try {
                let digirepo = await getRepository(Digimon);
                return digirepo.findOne(id);
            } catch (error) {
                throw new Error(
                    `Error during DigimonInfo Query:\n ${error}`
                );
            }
        },
        GetDigimons: async (id: number): Promise<Digimon[]> => {

            let userRep = await getRepository(User);
            let user = await userRep.findOne({ where: { id: id }, relations: ["digimons"] });

            if (!user.digimons) {
                return [];
            }
            return user.digimons;
        }
    },

    Digimon: {
        owner: async (_: Digimon): Promise<User> => {
            return await getConnection()
                .createQueryBuilder()
                .relation(Digimon, 'owner')
                .of(_)
                .loadOne()
        }
    }
}