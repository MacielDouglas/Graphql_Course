import { mergeResolvers } from "@graphql-tools/merge";
import userResolver from "./user.resolver.js";
import transactionResolver from "./transaction.resolver.js";

/**
 * Resolvers são funções que definem como os dados são lidos ou modificados
 * em um esquema GraphQL. Este arquivo une os resolvers dos usuários (userResolver)
 * e das transações (transactionResolver) em um único conjunto de resolvers.
 * Isso permite gerenciar e exportar os resolvers de forma mais organizada e modular.
 */
const mergedResolvers = mergeResolvers([userResolver, transactionResolver]);

export default mergedResolvers;
