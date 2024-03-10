import { FaLocationDot } from "react-icons/fa6";
import { BsCardText } from "react-icons/bs";
import { MdOutlinePayments } from "react-icons/md";
import { FaSackDollar } from "react-icons/fa6";
import { FaTrash } from "react-icons/fa";
import { HiPencilAlt } from "react-icons/hi";
import { Link } from "react-router-dom";
import { formatDate } from "../utils/formatDate";
import { useMutation } from "@apollo/client";
import { DELETE_TRANSACTION } from "../graphql/mutations/transaction.mutation";
import toast from "react-hot-toast";

// Mapeamento das cores das categorias
const categoryColorMap = {
  saving: "from-green-700 to-green-400",
  expense: "from-pink-800 to-pink-600",
  investment: "from-blue-700 to-blue-400",
};

// Componente de Card para exibir detalhes da transação
const Card = ({ transaction, authUser }) => {
  // Extração dos dados da transação
  let { category, amount, location, date, paymentType, description } =
    transaction;

  // Classe de estilo do card com base na categoria da transação
  const cardClass = categoryColorMap[category];

  // Uso da mutação para deletar uma transação
  const [deleteTransaction, { loading }] = useMutation(DELETE_TRANSACTION, {
    refetchQueries: ["GetTransactions"], // Atualiza a lista de transações após exclusão
  });

  // Formatação da descrição, categoria e tipo de pagamento para começar com letra maiúscula
  description = description[0]?.toUpperCase() + description.slice(1);
  category = category[0]?.toUpperCase() + category.slice(1);
  paymentType = paymentType[0]?.toUpperCase() + paymentType.slice(1);

  // Formatação da data
  const formatedDate = formatDate(date);

  // Função para lidar com a exclusão da transação
  const handleDelete = async () => {
    try {
      await deleteTransaction({
        variables: { transactionId: transaction._id }, // ID da transação a ser deletada
      });
      toast.success("Transação deletada com sucesso!!!"); // Exibe mensagem de sucesso
    } catch (error) {
      console.error("Erro ao deletar transação: ", error); // Registra erro no console
      toast.error(error.message); // Exibe mensagem de erro
    }
  };

  // Renderização do componente
  return (
    <div className={`rounded-md p-4 bg-gradient-to-br ${cardClass}`}>
      <div className="flex flex-col gap-3">
        <div className="flex flex-row items-center justify-between">
          <h2 className="text-lg font-bold text-white">{category}</h2>
          <div className="flex items-center gap-2">
            {/* Ícone para deletar a transação */}
            {!loading && (
              <FaTrash className={"cursor-pointer"} onClick={handleDelete} />
            )}
            {/* Ícone de carregamento durante a exclusão da transação */}
            {loading && (
              <div className="w-6 h-6 border-t-2 border-b-2 rounded-full animate-spin"></div>
            )}
            {/* Link para editar a transação */}
            <Link to={`/transaction/${transaction._id}`}>
              <HiPencilAlt className="cursor-pointer" size={20} />
            </Link>
          </div>
        </div>
        {/* Descrição da transação */}
        <p className="text-white flex items-center gap-1">
          <BsCardText />
          Description: {description}
        </p>
        {/* Tipo de pagamento */}
        <p className="text-white flex items-center gap-1">
          <MdOutlinePayments />
          Payment Type: {paymentType}
        </p>
        {/* Valor da transação */}
        <p className="text-white flex items-center gap-1">
          <FaSackDollar />
          Amount: ${amount}
        </p>
        {/* Local da transação */}
        <p className="text-white flex items-center gap-1">
          <FaLocationDot />
          Location: {location || "N/A"}
        </p>
        {/* Data da transação */}
        <div className="flex justify-between items-center">
          <p className="text-xs text-black font-bold">{formatedDate}</p>
          {/* Foto do usuário associado à transação */}
          <img
            src={authUser?.profilePicture}
            className="h-8 w-8 border rounded-full"
            alt=""
          />
        </div>
      </div>
    </div>
  );
};

export default Card; // Exporta o componente Card
