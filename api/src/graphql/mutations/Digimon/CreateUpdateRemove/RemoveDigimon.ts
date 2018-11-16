import { getRepository } from "typeorm";
import { Digimon } from "../../../../entity/Digimon";

interface RemoveDigimonInput {
    input: {
        id: number;
    }
}

export default {
    Mutation: {
        RemoveDigimon: async (_: {}, { input }: RemoveDigimonInput): Promise<Digimon> => {

            const digirepo = await getRepository(Digimon);
            const digiToRemove = await digirepo.findOne(input.id);
            await digirepo.remove(digiToRemove);

            return digiToRemove;
        }
    }
}