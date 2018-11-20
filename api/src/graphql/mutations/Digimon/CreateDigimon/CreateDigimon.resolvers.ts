import { Digimon } from "../../../../entity/Digimon";
import { getRepository } from "typeorm";

interface CreateDigimonInput {
    input: {
        name: string;
        type: string;
    }
}

interface IDigmon {
    name: string;
    type: string;
}

export default {
    Mutation: {
        CreateDigimon: async (_: {}, { input }: CreateDigimonInput): Promise<IDigmon> => {

            console.log("Creation d'un digimon")
            let digimon = new Digimon();
            digimon.name = input.name;
            digimon.type = input.type;

            const digirepo = await getRepository(Digimon);
            await digirepo.save(digimon);
            console.log(digimon);

            return digimon;
        }
    }
}