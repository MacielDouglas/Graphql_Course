import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

import Cards from "../components/Cards";
import TransactionForm from "../components/TransictionForm";

import { MdLogout } from "react-icons/md";
import toast from "react-hot-toast";
import { useMutation, useQuery } from "@apollo/client";
import { LOGOUT } from "./../graphql/mutations/user.mutation";
import { GET_TRANSACTION_STATISTICS } from "../graphql/mutations/transaction.mutation";
import { useEffect, useState } from "react";
import { GET_AUTHENTICATED_USER } from "./../graphql/queries/user.query";

// Registra os elementos do Chart.js necessários para o gráfico de rosca
ChartJS.register(ArcElement, Tooltip, Legend);

// Componente para a página inicial
const HomePage = () => {
  // Consulta para obter as estatísticas das transações
  const { data } = useQuery(GET_TRANSACTION_STATISTICS);

  // Consulta para obter os dados do usuário autenticado
  const { data: authUserData } = useQuery(GET_AUTHENTICATED_USER);

  // Mutação para fazer logout do usuário
  const [logout, { loading, client }] = useMutation(LOGOUT, {
    refetchQueries: ["GetAuthenticatedUser"], // Refetch dos dados do usuário autenticado após o logout
  });

  // Estado para armazenar os dados do gráfico de rosca
  const [chartData, setChartData] = useState({
    labels: [],
    datasets: [
      {
        label: "$",
        data: [],
        backgroundColor: [],
        borderColor: [],
        borderWidth: 1,
        borderRadius: 30,
        spacing: 10,
        cutout: 130,
      },
    ],
  });

  // Atualiza o estado do gráfico de rosca com os dados obtidos da consulta
  useEffect(() => {
    if (data?.categoryStatistics) {
      const categories = data.categoryStatistics.map((stat) => stat.category);
      const totalAmounts = data.categoryStatistics.map(
        (stat) => stat.totalAmount
      );

      const backgroundColors = [];
      const borderColors = [];

      // Define as cores com base na categoria das transações
      categories.forEach((category) => {
        if (category === "saving") {
          backgroundColors.push("rgba(75, 192, 192)");
          borderColors.push("rgba(75, 192, 192)");
        } else if (category === "expense") {
          backgroundColors.push("rgba(255, 99, 132)");
          borderColors.push("rgba(255, 99, 132)");
        } else if (category === "investment") {
          backgroundColors.push("rgba(54, 162, 235)");
          borderColors.push("rgba(54, 162, 235)");
        }
      });

      // Atualiza o estado do gráfico de rosca
      setChartData((prev) => ({
        labels: categories,
        datasets: [
          {
            ...prev.datasets[0],
            data: totalAmounts,
            backgroundColor: backgroundColors,
            borderColor: borderColors,
          },
        ],
      }));
    }
  }, [data]);

  // Função para lidar com o logout do usuário
  const handleLogout = async () => {
    try {
      await logout(); // Executa a mutação de logout
      client.resetStore(); // Reseta o cache do cliente Apollo
    } catch (error) {
      console.error("Erro para fazer logout: ", error);
      toast.error(error.message); // Exibe uma mensagem de erro caso ocorra algum problema durante o logout
    }
  };

  // Renderização do componente
  return (
    <>
      <div className="flex flex-col gap-6 items-center max-w-7xl mx-auto z-20 relative justify-center">
        {/* Cabeçalho com título e botão de logout */}
        <div className="flex items-center">
          <p className="md:text-4xl text-2xl lg:text-4xl font-bold text-center relative z-50 mb-4 mr-4 bg-gradient-to-r from-pink-600 via-indigo-500 to-pink-400 inline-block text-transparent bg-clip-text">
            Spend wisely, track wisely
          </p>
          {/* Exibe a foto de perfil do usuário autenticado */}
          <img
            src={authUserData?.authUser.profilePicture}
            className="w-11 h-11 rounded-full border cursor-pointer"
            alt="Avatar"
          />
          {/* Botão de logout */}
          {!loading && (
            <MdLogout
              className="mx-2 w-5 h-5 cursor-pointer"
              onClick={handleLogout}
            />
          )}
          {/* Spinner de carregamento durante o logout */}
          {loading && (
            <div className="w-6 h-6 border-t-2 border-b-2 mx-2 rounded-full animate-spin"></div>
          )}
        </div>
        {/* Seção para exibir o gráfico de rosca e o formulário de transação */}
        <div className="flex flex-wrap w-full justify-center items-center gap-6">
          {/* Exibe o gráfico de rosca se houver dados disponíveis */}
          {data?.categoryStatistics.length > 0 && (
            <div className="h-[330px] w-[330px] md:h-[360px] md:w-[360px]  ">
              <Doughnut data={chartData} />
            </div>
          )}

          {/* Componente do formulário de transação */}
          <TransactionForm />
        </div>
        {/* Componente para exibir a lista de transações */}
        <Cards />
      </div>
    </>
  );
};

export default HomePage; // Exporta o componente HomePage
