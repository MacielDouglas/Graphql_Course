import { gql } from "@apollo/client";

// Consulta para obter todas as transações
export const GET_TRANSACTIONS = gql`
  query GetTransactions {
    transactions {
      _id
      description
      paymentType
      category
      amount
      location
      date
    }
  }
`;

// Consulta para obter uma transação específica por ID
export const GET_TRANSACTION = gql`
  query GetTransaction($id: ID!) {
    transaction(transactionId: $id) {
      _id
      description
      paymentType
      category
      amount
      location
      date
      user {
        name
        username
        profilePicture
      }
    }
  }
`;

// Consulta para obter estatísticas das transações por categoria
export const GET_TRANSACTION_STATISTICS = gql`
  query GetTransactionStatistics {
    categoryStatistics {
      category
      totalAmount
    }
  }
`;
