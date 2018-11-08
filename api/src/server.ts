import * as express from 'express';
import { gql, ApolloServer } from "apollo-server-express";
import { createConnection, getConnection, getRepository } from "typeorm";
import { User } from "./entity/User";
import { Digimon } from "./entity/Digimon";
import "reflect-metadata";
import { Namespace } from 'protobufjs';

const typeDefs = gql`
    type Query {
        DigimonInfo(id: Int!): Digimon!
    }

    type Mutation {
        AddDigimon(name: String!, type: String!): Digimon!
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

interface IDigmon {
    name: string;
    type: string;
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
            }
        },

    Mutation: {
        AddDigimon: async (name: string, type: string): Promise<IDigmon> => {
            const digimon = {
                name,
                type
            }

            let digirepo = await getRepository(Digimon);
            await digirepo.save(digimon);

            return digimon;
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