import { fileLoader, mergeTypes, mergeResolvers } from "merge-graphql-schemas";
import * as path from "path";
import * as express from 'express';
import { gql, ApolloServer } from "apollo-server-express";
import { createConnection, getConnection, getRepository } from "typeorm";
import { User } from "./entity/User";
import { Digimon } from "./entity/Digimon";
import "reflect-metadata";
import bodyParser = require('body-parser');



const typesArray = fileLoader(path.join(__dirname, "./**/*.graphql"));
const resolversArray = fileLoader(path.join(__dirname, "./**/*.resolvers.*"));

export const typeDefs = mergeTypes(typesArray);
export const resolvers = mergeResolvers(resolversArray);


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


const server = new App();

server.app.listen(3001, async () => {
    console.log('Bonjour le port 3001');
})