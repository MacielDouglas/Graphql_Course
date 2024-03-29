import { users } from "../dummyData/data.js";
import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import Transaction from "./../models/transiction.model.js";

const userResolver = {
  Query: {
    authUser: async (_, __, context) => {
      try {
        const user = await context.getUser(); // Obtém o usuário autenticado
        return user; // Retorna o usuário autenticado
      } catch (error) {
        console.error("Erro ao autenticar: ", error); // Registra o erro
        throw new Error("Erro interno no servidor."); // Lança um erro
      }
    },
    user: async (_, { userId }) => {
      try {
        const user = await User.findById(userId); // Busca um usuário pelo ID
        return user; // Retorna o usuário encontrado
      } catch (error) {
        console.log("Error in user: ", err);
        throw new Error(error.message || "Error getting user");
      }
    },
  },
  Mutation: {
    signUp: async (_, { input }, context) => {
      try {
        const { username, name, password, gender } = input; // Obtém os dados do formulário de registro

        if (!username || !name || !password || !gender) {
          throw new Error("Todos os campos são necessários."); // Verifica se todos os campos estão preenchidos
        }
        const existingUser = await User.findOne({ username }); // Verifica se o usuário já existe no banco de dados
        if (existingUser) {
          throw new Error("Usuário já cadastrado.");
        }
        const salt = await bcrypt.genSalt(10); // Gera um salt para a senha
        const hashedPassword = await bcrypt.hash(password, salt); // Criptografa a senha

        // Define a URL do avatar com base no gênero do usuário
        const boyProfilePic = `https://avatar.iran.liara.run/public/boy?username=${username}`;
        const girlProfilePic = `https://avatar.iran.liara.run/public/girl?username=${username}`;

        const newUser = new User({
          // Cria um novo usuário
          username,
          name,
          password: hashedPassword,
          gender,
          profilePicture: gender === "male" ? boyProfilePic : girlProfilePic, // Define a imagem de perfil com base no gênero
        });

        await newUser.save(); // Salva o novo usuário no banco de dados
        await context.login(newUser); // Faz login do novo usuário
        return newUser;
      } catch (error) {
        console.error("Erro ao cadastrar: ", error);
        throw new Error(error.message || "Erro interno no servidor.");
      }
    },
    login: async (_, { input }, context) => {
      try {
        const { username, password } = input; // Obtém o nome de usuário e a senha do formulário de login
        if (!username || !password)
          throw new Error("Todos os campos são necessários.");

        const { user } = await context.authenticate("graphql-local", {
          // Autentica o usuário
          username,
          password,
        });

        await context.login(user); // Faz login do usuário autenticado
        return user; // Retorna o usuário autenticado
      } catch (error) {
        console.error("Erro ao fazer login: ", error);
        throw new Error(error.message || "Erro interno no Servidor..");
      }
    },

    logout: async (_, __, context) => {
      try {
        await context.logout(); // Faz logout do usuário
        context.req.session.destroy((err) => {
          // Destrói a sessão do usuário
          if (err) throw err; // Lança um erro se houver algum problema
        });
        context.res.clearCookie("connect.sid"); // Limpa o cookie de sessão

        return { message: "Desconectado com sucesso" }; // Retorna uma mensagem de sucesso
      } catch (error) {
        console.error("Erro ao fazer sair: ", error);
        throw new Error(error.message || "Erro interno no Servidor..");
      }
    },
  },

  User: {
    transactions: async (parent) => {
      try {
        const transactions = await Transaction.find({ userId: parent._id });
        return transactions;
      } catch (error) {
        console.log("Erro no user.transactions resolver: ", error);
        throw new Error(error.message || "Erro interno do servidor.");
      }
    },
  },
};

export default userResolver; // Exporta os resolvers de usuário
