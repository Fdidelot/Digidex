import { Digimon } from "../../../../entity/Digimon";
import { User } from "../../../../entity/User";
import { getRepository } from "typeorm";

interface CatchDigimonInput {
    input: {
        userId: number;
        digimonId: number;
    }

}

export default {
    Mutation: {
        CatchDigimon: async (_: {}, { input }: CatchDigimonInput): Promise<Digimon> => {

            let DigiRepo = await getRepository(Digimon);
            let UserRepo = await getRepository(User);
            let DigiToCatch = await DigiRepo.findOne(input.digimonId);
            DigiToCatch.owner = await UserRepo.findOne(input.userId);
            await DigiRepo.save(DigiToCatch);

            return DigiToCatch;
        }
    }
}