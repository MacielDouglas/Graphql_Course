const userTypeDef = `#graphql
    type User {
        _id: ID!
        username: String!
        name: String!
        password :String!
        profilePicture: String!
        gender: String!
        transactions: [Transaction!]
    }

    type Query {
        # users: [User!]
        authUser: User
        user(userId: ID!): User
    }

    type Mutation {
        signUp(input: SignUpInput!): User
        login(input: LoginInput!): User
        logout: LogoutResponse
    }

    input SignUpInput {
        username: String!
        name: String!
        password: String!
        gender: String!
    }

    input LoginInput {
        username: String!
        password: String!
    }

    type LogoutResponse {
        message: String!
    }
`;

export default userTypeDef;

/**
 * Este arquivo contém as definições de tipo (typeDefs) para as operações relacionadas aos usuários em uma API GraphQL.
 * Ele define a estrutura dos dados associados aos usuários, incluindo os campos do usuário, consultas e mutações disponíveis.
 *
 * Type User:
 * Define os campos disponíveis para um usuário, como ID, nome de usuário, nome, senha, imagem de perfil, gênero e transações associadas.
 *
 * Query:
 * Define as consultas disponíveis para recuperar informações dos usuários, incluindo autenticar um usuário e obter um usuário pelo ID.
 *
 * Mutation:
 * Define as mutações disponíveis para criar, autenticar e desautenticar usuários.
 *
 * Inputs:
 * Define os tipos de entrada (inputs) necessários para as operações de cadastro e login de usuários.
 *
 * LogoutResponse:
 * Define a estrutura da resposta ao fazer logout, incluindo uma mensagem de confirmação.
 */
