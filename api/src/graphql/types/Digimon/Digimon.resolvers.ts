import { Digimon } from "../../../entity/Digimon";
import { getRepository } from "typeorm";
import { User } from "../../../entity/User";

export default {
    Query: {
        DigimonInfo: async (id: number): Promise<Digimon> => {

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
    }
}