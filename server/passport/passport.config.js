import passport from "passport"; // Importa o módulo passport para autenticação
import bcrypt from "bcryptjs";
import User from "../models/user.model.js";
import { GraphQLLocalStrategy } from "graphql-passport"; // Importa a estratégia de autenticação GraphQLLocalStrategy

// Função para configurar o Passport.js para autenticação GraphQL
export const configurePassport = async () => {
  // Serializa o usuário para armazenar na sessão
  passport.serializeUser((user, done) => {
    console.log("Serializzing user");
    done(null, user.id); // Armazena apenas o ID do usuário na sessão
  });

  // Desserializa o usuário a partir do ID armazenado na sessão
  passport.deserializeUser(async (id, done) => {
    console.log("Deserializing user");
    try {
      const user = await User.findById(id); // Procura o usuário pelo ID no banco de dados
      done(null, user); // Retorna o usuário encontrado
    } catch (error) {
      done(err); // Se houver um erro, retorna o erro
    }
  });

  // Define uma estratégia de autenticação local usando GraphQLLocalStrategy
  passport.use(
    new GraphQLLocalStrategy(async (username, password, done) => {
      try {
        const user = await User.findOne({ username }); // Procura o usuário pelo nome de usuário
        if (!user) {
          throw new Error("Usuário ou senha inválida!");
        }
        const validPassword = await bcrypt.compare(password, user.password);

        if (!validPassword) {
          throw new Error("Usuário ou senha inválida."); // Se a senha não for válida, retorna um erro
        }
        return done(null, user); // Se o usuário for autenticado com sucesso, retorna o usuário
      } catch (error) {
        return done(err); // Se houver um erro durante o processo de autenticação, retorna o erro
      }
    })
  );
};
