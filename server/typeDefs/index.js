import { mergeTypeDefs } from "@graphql-tools/merge";

// Definições de tipo (typeDefs) para GraphQL
import userTypeDef from "./user.typeDef.js";
import transactionTypeDef from "./transaction.typeDef.js";

/**
 * As definições de tipo (typeDefs) são esquemas que definem a estrutura
 * dos dados disponíveis em uma API GraphQL. Este arquivo une as definições
 * de tipo dos usuários (userTypeDef) e das transações (transactionTypeDef)
 * em um único conjunto de definições de tipo.
 * Isso permite gerenciar e exportar as definições de tipo de forma mais organizada e modular.
 */
const mergedTypeDefs = mergeTypeDefs([userTypeDef, transactionTypeDef]);

export default mergedTypeDefs;
