
//Schema graphql
/*const typeDefs = gql`
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

*/