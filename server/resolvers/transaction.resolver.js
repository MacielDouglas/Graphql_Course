import User from "../models/user.model.js";
import Transaction from "./../models/transiction.model.js";

const transactionResolver = {
  Query: {
    transactions: async (_, __, context) => {
      try {
        if (!context.getUser()) throw new Error("Não autorizado."); // Verifica se o usuário está autenticado
        const userId = await context.getUser()._id; // Obtém o ID do usuário autenticado

        const transactions = await Transaction.find({ userId }); // Busca as transações do usuário
        return transactions;
      } catch (error) {
        console.error("Erro ao obter transações: ", error); // Registra o erro
        throw new Error("Erro ao obter transações."); // Lança um erro
      }
    },
    transaction: async (_, { transactionId }) => {
      try {
        const transaction = await Transaction.findById(transactionId); // Busca uma transação pelo ID
        return transaction;
      } catch (error) {
        console.error("Erro ao obter transação: ", error);
        throw new Error("Erro ao obter transação");
      }
    },
    categoryStatistics: async (_, __, context) => {
      try {
        if (!context.getUser()) throw new Error("Não autorizado."); // Verifica se o usuário está autenticado
        const userId = context.getUser()._id; // Obtém o ID do usuário autenticado
        const transactions = await Transaction.find({ userId }); // Busca as transações do usuário

        // Inicializa um mapa para armazenar a soma dos valores por categoria
        const categoryMap = {};

        // Calcula a soma dos valores para cada categoria
        transactions.forEach((transaction) => {
          if (!categoryMap[transaction.category]) {
            categoryMap[transaction.category] = 0;
          }
          categoryMap[transaction.category] += transaction.amount;
        });

        // Converte o mapa em uma lista de objetos contendo a categoria e o total de valores
        return Object.entries(categoryMap).map(([category, totalAmount]) => ({
          category,
          totalAmount,
        }));
      } catch (error) {
        console.error("Erro ao obter estatísticas de categoria: ", error); // Registra o erro
        throw new Error("Erro ao obter estatísticas de categoria."); // Lança um erro
      }
    },
  },
  Mutation: {
    createTransaction: async (_, { input }, context) => {
      try {
        const newTransaction = new Transaction({
          // Cria uma nova transação
          ...input,
          userId: context.getUser()._id, // Define o ID do usuário na transação
        });
        await newTransaction.save(); // Salva a nova transação no banco de dados
        return newTransaction;
      } catch (error) {
        console.error("Erro ao criar transação: ", error);
        throw new Error("Erro ao criar transação.");
      }
    },
    updateTransaction: async (_, { input }) => {
      try {
        const updatedTransaction = await Transaction.findByIdAndUpdate(
          // Atualiza uma transação pelo ID
          input.transactionId,
          input,
          { new: true } // Retorna a transação atualizada
        );

        return updatedTransaction; // Retorna a transação atualizada
      } catch (error) {
        console.error("Erro ao alterar transação: ", error);
        throw new Error("Erro ao alterar transação.");
      }
    },
    deleteTransaction: async (_, { transactionId }) => {
      try {
        const deletedTransaction = await Transaction.findByIdAndDelete(
          // Exclui uma transação pelo ID
          transactionId
        );
        return deletedTransaction; // Retorna a transação excluída
      } catch (error) {
        console.error("Erro ao deletar transação: ", error);
        throw new Error("Erro ao deletar transação.");
      }
    },
  },
  Transaction: {
    user: async (parent) => {
      const userId = parent.userId;
      try {
        const user = await User.findById(userId);
        return user;
      } catch (error) {
        console.error("Erro ao getting user: ", error);
        throw new Error("Error getting user.");
      }
    },
  },
};

export default transactionResolver; // Exporta os resolvers de transação
