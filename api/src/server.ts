import * as express from 'express';
import { gql, ApolloServer } from "apollo-server-express";
import { createConnection, getConnection, getRepository } from "typeorm";
import { User } from "./entity/User";
import { Digimon } from "./entity/Digimon";
import "reflect-metadata";
import bodyParser = require('body-parser');

//Schema graphql
const typeDefs = gql`
    type Query {
        DigimonInfo(id: Int!): Digimon!
        UserInfo(id: Int!): Digimon!
        GetDigimons(id: Int!): [Digimon!]!
    }

    type Mutation {
        CreateDigimon(input: CreateDigimonInput!): Digimon!
        UpdateDigimon(input: UpdateDigimonInput!): Digimon!
        RemoveDigimon(input: RemoveDigimonInput!): Digimon!

        CreateUser(input: CreateUserInput!): User!
        UpdateUser(input: UpdateUserInput!): User!
        RemoveUser(input: RemoveUserInput!): User!

        CatchDigimon(input: CatchDigimonInput): Digimon!
    }

    type User {
        id: Int!
        firstName: String!
        lastName: String!
        age: Int!
        digmons: [Digimon!]!
    }

    enum DigiType {
        VIRUS
        ANTIVIRUS
        DONNEES
    }

    type Digimon {
        id: Int!
        name: String!
        type: String!
        owner: User
    }

    input CreateDigimonInput {
        name: String!
        type: String!
    }

    input RemoveDigimonInput {
        id: Int!
    }

    input UpdateDigimonInput {
        id: Int!
        name: String
        type: DigiType
        ownerid: Int
    }

    input CatchDigimonInput {
        userId: Int!
        digimonId: Int!
    }

    input CreateUserInput {
        id: Int!
        firstName: String!
        lastName: String!
        age: Int!
    }

    input RemoveUserInput {
        id: Int!
    }

    input UpdateUserInput {
        id: Int!
        firstName: String!
        lastName: String!
        age: Int!
    }

`;

//Digimon Inputs
interface CreateDigimonInput {
    input: {
        name: string;
        type: string;
    }
}

interface RemoveDigimonInput {
    input: {
        id: number;
    }
}

interface UpdateDigimonInput {
    input: {
        id: number;
        name: string;
        type: string;
        owner: User;
    }
}

//User Inputs
interface CreateUserInput {
    input: {
        id: number;
        firstName: string;
        lastName: string;
        age: number;
    }
}

interface RemoveUserInput {
    input: {
        id: number;
    }
}

interface UpdateUserInput {
    input: {
        id: number;
        firstName: string;
        lastName: string;
        age: number;
    }
}

interface CatchDigimonInput {
    input: {
        userId: number;
        digimonId: number;
    }

}

//Interfaces for functions
interface IDigmon {
    name: string;
    type: string;
}

interface IUser {
    id: number;
    firstName: string;
}

const resolvers = {
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
        UserInfo: async (id: number): Promise<User> => {

            try {
                let UserRepo = await getRepository(User);
                return UserRepo.findOne(id);
            } catch (error) {
                throw new Error(
                    `Error during UserInfo Query:\n ${error}`
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

    Mutation: {
        CreateDigimon: async (_: {}, { input }: CreateDigimonInput): Promise<IDigmon> => {

            console.log("creation")
            const digimon = new Digimon();
            digimon.name = input.name;
            digimon.type = input.type;

            let digirepo = await getRepository(Digimon);
            await digirepo.save(digimon);
            console.log(digimon);

            return digimon;
        },

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
                    `Error when updating Digimon:\n ${error}`
                );
            }

        },

        RemoveDigimon: async (_: {}, { input }: RemoveDigimonInput): Promise<Digimon> => {

            let digirepo = await getRepository(Digimon);
            let digiToRemove = await digirepo.findOne(input.id);
            await digirepo.remove(digiToRemove);

            return digiToRemove;
        },

        CreateUser: async (_: {}, { input }: CreateUserInput): Promise<IUser> => {

            const user = {
                id: input.id,
                firstName: input.firstName,
            }

            let UserRepo = await getRepository(User);
            await UserRepo.save(user);

            return user;
        },

        UpdateUser: async (_: {}, { input }: UpdateUserInput): Promise<User> => {

            try {
                let UserRepo = await getRepository(User);
                let UserToUpdate = await UserRepo.findOne(input.id);
                // Update things
                return UserToUpdate;
            } catch (error) {
                throw new Error(
                    `Error when updating User:\n ${error}`
                );
            }

        },

        RemoveUser: async (_: {}, { input }: RemoveUserInput): Promise<User> => {

            let UserRepo = await getRepository(User);
            let UserToRemove = await UserRepo.findOne(input.id);
            await UserRepo.remove(UserToRemove);

            return UserToRemove;
        },

        CatchDigimon: async (_: {}, { input }: CatchDigimonInput): Promise<Digimon> => {

            let DigiRepo = await getRepository(Digimon);
            let UserRepo = await getRepository(User);
            let DigiToCatch = await DigiRepo.findOne(input.digimonId);
            DigiToCatch.owner = await UserRepo.findOne(input.userId);

            return DigiToCatch;
        }

    }
}

export class App {

    public server: ApolloServer;
    public app;

    constructor() {
        this.server = new ApolloServer({
            typeDefs,
            resolvers
        });
        this.app = express();
        this.app.use(bodyParser.json());
        this.server.applyMiddleware({ app: this.app });
        this.connectToDb();
    }

    async connectToDb(): Promise<void> {

        try {
            await createConnection({
                type: 'postgres',
                host: 'localhost',
                password: 'Castorama22',
                username: 'postgres',
                database: 'Digidex',
                synchronize: true,
                entities: [
                    Digimon,
                    User,
                ],
                migrations: ['./migration/**\.*?.s'],

            });
        } catch (err) {
            throw new Error(
                `An error occured during connection to the database:\n ${err}`
            );
        }
        const connection = await getConnection();
        console.log('Connected to Db');
    }
}