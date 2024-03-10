import { useQuery } from "@apollo/client";
import Card from "./Card";
import { GET_TRANSACTIONS } from "../graphql/queries/transaction.query.js";
import {
  GET_AUTHENTICATED_USER,
  GET_USER_AND_TRANSACTIONS,
} from "../graphql/queries/user.query.js";

// Componente para exibir uma lista de cards de transações
const Cards = () => {
  // Consulta para obter todas as transações
  const { data, loading } = useQuery(GET_TRANSACTIONS);

  // Consulta para obter o usuário autenticado
  const { data: authUser } = useQuery(GET_AUTHENTICATED_USER);

  // Consulta para obter as transações do usuário autenticado
  const { data: userAndTransactions } = useQuery(GET_USER_AND_TRANSACTIONS, {
    variables: {
      userId: authUser?.authUser?._id, // ID do usuário autenticado
    },
  });

  // Renderização do componente
  return (
    <div className="w-full px-10 min-h-[40vh]">
      {/* Título da seção */}
      <p className="text-5xl font-bold text-center my-10">History</p>
      {/* Grid para exibir os cards de transações */}
      <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 justify-start mb-20">
        {/* Mapeia e renderiza cada transação como um card */}
        {!loading &&
          data.transactions.map((transaction) => (
            <Card
              key={transaction._id}
              transaction={transaction}
              authUser={authUser.authUser}
            />
          ))}
      </div>
      {/* Mensagem caso não haja transações */}
      {!loading && data?.user?.transactions?.length === 0 && (
        <p className="text-2xl font-bold text-center w-full">
          Não tem histórico de transações.
        </p>
      )}
    </div>
  );
};

export default Cards; // Exporta o componente Cards
