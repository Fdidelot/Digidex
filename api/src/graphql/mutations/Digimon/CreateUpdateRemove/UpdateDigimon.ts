import { Digimon } from "../../../../entity/Digimon";
import { getRepository } from "typeorm";
import { User } from "../../../../entity/User";

interface UpdateDigimonInput {
    input: {
        id: number;
        name: string;
        type: string;
        owner: User;
    }
}

export default {
    Mutation: {
        UpdateDigimon: async (_: {}, { input }: UpdateDigimonInput): Promise<Digimon> => {

            const { id, ...values } = input;
            try {
                const digirepo = await getRepository(Digimon);
                const digiToUpdate = await digirepo.findOne(id);

                if (!digiToUpdate) {
                    throw new Error(
                        'Digimon you want to update does not exist.'
                    );
                }
                Object.assign(digiToUpdate, values)
                await digirepo.save(digiToUpdate);

                return digiToUpdate;
            } catch (error) {
                throw new Error(
                    `Error when removing Digimon:\n ${error}`
                );
            }

        }
    }
}