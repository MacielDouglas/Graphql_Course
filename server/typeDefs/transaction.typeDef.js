const transactionTypeDef = `#graphql
    
    # Tipo que representa uma transação.
    type Transaction {
        _id: ID! # ID único da transação
        userId: ID! # ID do usuário associado à transação
        description: String! # Descrição da transação
        paymentType: String! # Tipo de pagamento da transação
        category: String! # Categoria da transação
        amount: Float! # Valor da transação
        location: String! # Local da transação
        date: String! # Data da transação
    }

    # Consultas disponíveis para transações.
    type Query {
        transactions: [Transaction!]! # Consulta para obter todas as transações
        transaction(transactionId:ID!): Transaction # Consulta para obter uma transação pelo ID
        # TODO =: ADD categoryStatics query
    }


    # Mutações disponíveis para transações.
    type Mutation {
        createTransaction(input: CreateTransactionInput!): Transaction! # Mutação para criar uma nova transação
        updateTransaction(input: UpdateTransactionInput!): Transaction! # Mutação para atualizar uma transação existente
        deleteTransaction(transactionId:ID!): Transaction! # Mutação para excluir uma transação
    }


    # Entrada para criar uma nova transação.
    input CreateTransactionInput {
        description: String! # Descrição da transação
        paymentType: String! # Tipo de pagamento da transação
        category: String! # Categoria da transação
        amount: Float! # Valor da transação
        location: String! # Local da transação
        date: String! # Data da transação
    }


    # Entrada para atualizar uma transação existente.
    input UpdateTransactionInput {
        transactionId: ID! # ID da transação a ser atualizada
        description: String # Nova descrição da transação
        paymentType: String # Novo tipo de pagamento da transação
        category: String # Nova categoria da transação
        amount: Float # Novo valor da transação
        location: String # Novo local da transação
        date: String # Nova data da transação
    }
`;

export default transactionTypeDef; // Exporta as definições de tipo de transação
