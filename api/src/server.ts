import * as express from 'express';
import { gql, ApolloServer } from "apollo-server-express";
import { createConnection, getConnection, getRepository } from "typeorm";
import { User } from "./entity/User";
import { Digimon } from "./entity/Digimon";
import "reflect-metadata";

const typeDefs = gql`
    type Query {
        DigimonInfo(id: Int!): Digimon!
        UserInfo(id: Int!): Digimon!
        GetDigimon(id: Int!): [Digimon!]!
    }

    type Mutation {
        CreateDigimon(): Digimon!
        UpdateDigimon(): Digimon!
        RemoveDigimon(): Digimon!

        CreateUser(): User!
        UpdateUser(): User!
        RemoveUser(): User!

        CatchDigimon(): Digimon!
    }

    type User {
        id: Int!
        firstName: String!
        lastName: String!
        age: Int!
        digmons: [Digimon!]!
    }

    type Digimon {
        id: Int!
        name: String!
        type: String!
        owner: User
    }
`;

/*input CreateDigimonInput {
    name: string;
    type: string;
}*/

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
                    throw new Error (
                        `Error during DigimonInfo Query:\n ${error}`
                    );
                }
        },
        UserInfo: async (id: number): Promise<User> => {
            
            try { 
                let UserRepo = await getRepository(User);
                return UserRepo.findOne(id);
                } catch (error) {
                    throw new Error (
                        `Error during UserInfo Query:\n ${error}`
                    );
                }
        },
        GetDigimon: async (id: number): Promise<Digimon[]> => {

            let UserRep = await getRepository(User);
            let user = await UserRep.findOne(id);
            
            return user.digimons;
        }
    },

    Mutation: {
//        CreateDigimon: async (_: {}, CreateDigimonInput): Promise<IDigmon> => {
//      
        CreateDigimon: async (_: {}, args: {name: string, type: string}): Promise<IDigmon> => {
            
            const digimon = {
                name: args.name,
                type: args.type
            }

            let digirepo = await getRepository(Digimon);
            await digirepo.save(digimon);

            return digimon;
        },

        UpdateDigimon: async (_: {}, args: {id: number}): Promise<Digimon> => {
            
            try {
                let digirepo = await getRepository(Digimon);
                let digiToUpdate = await digirepo.findOne(args.id);
                // Update things
                return digiToUpdate;
            } catch (error) {
                throw new Error (
                    `Error when updating Digimon:\n ${error}`
                );
            }

        },

        RemoveDigimon: async (_: {}, args: {id: number}): Promise<Digimon> => {

            let digirepo = await getRepository(Digimon);
            let digiToRemove = await digirepo.findOne(args.id);
            await digirepo.remove(digiToRemove);

            return digiToRemove;
        },

        CreateUser: async (_: {}, args: {id: number, firstName: string}): Promise<IUser> => {
            
            const user = {
                id: args.id,
                firstName: args.firstName,
            }

            let UserRepo = await getRepository(User);
            await UserRepo.save(user);

            return user;
        },

        UpdateUser: async (_: {}, args: {id: number}): Promise<User> => {
            
            try {
                let UserRepo = await getRepository(User);
                let UserToUpdate = await UserRepo.findOne(args.id);
                // Update things
                return UserToUpdate;
            } catch (error) {
                throw new Error (
                    `Error when updating User:\n ${error}`
                );
            }

        },

        RemoveUser: async (_: {}, args: {id: number}): Promise<User> => {

            let UserRepo = await getRepository(User);
            let UserToRemove = await UserRepo.findOne(args.id);
            await UserRepo.remove(UserToRemove);

            return UserToRemove;
        },

        CatchDigimon: async(_: {}, args: {userId: number, digimonId: number}): Promise<Digimon> => {

            let DigiRepo = await getRepository(Digimon);
            let UserRepo = await getRepository(User);
            let DigiToCatch = await DigiRepo.findOne(args.digimonId);
            DigiToCatch.owner = await UserRepo.findOne(args.userId);

            return DigiToCatch;
        }

    }
}

export class App {

    public server: ApolloServer;
    public app: any;

    constructor(){
        this.server = new ApolloServer({
            typeDefs,
            resolvers
        });
        this.app = express();
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