import express from "express"; // Importa o framework Express para criar o servidor HTTP
import http from "http"; // Importa o módulo HTTP nativo do Node.js para criar o servidor HTTP
import cors from "cors"; // Importa o middleware CORS para permitir solicitações de diferentes origens
import dotenv from "dotenv"; // Importa o módulo dotenv para carregar variáveis de ambiente a partir de um arquivo .env

import passport from "passport"; // Importa o módulo Passport para autenticação de usuários
import session from "express-session"; // Importa o middleware express-session para gerenciar sessões de usuário
import connectMongo from "connect-mongodb-session"; // Importa o módulo connect-mongodb-session para armazenar sessões no MongoDB

import { ApolloServer } from "@apollo/server"; // Importa a classe ApolloServer do Apollo Server para criar um servidor GraphQL
import { startStandaloneServer } from "@apollo/server/standalone"; // Importa a função startStandaloneServer do Apollo Server para iniciar um servidor GraphQL standalone
import { expressMiddleware } from "@apollo/server/express4"; // Importa o middleware express do Apollo Server para integração com o Express
import { ApolloServerPluginDrainHttpServer } from "@apollo/server/plugin/drainHttpServer"; // Importa o plugin ApolloServerPluginDrainHttpServer para gerenciar a finalização do servidor HTTP

import { buildContext } from "graphql-passport"; // Importa a função buildContext do graphql-passport para construir o contexto do Apollo Server com o Passport

import mergedResolvers from "./resolvers/index.js"; // Importa os resolvers combinados de diferentes módulos
import mergedTypeDefs from "./typeDefs/index.js"; // Importa os tipos definidos combinados de diferentes módulos

import { connectDB } from "./db/connectDB.js"; // Importa a função connectDB para conectar ao banco de dados MongoDB
import { configurePassport } from "./passport/passport.config.js"; // Importa a função configurePassport para configurar o Passport.js para autenticação

dotenv.config();
configurePassport(); // Configura o Passport.js para autenticação

const app = express(); // Inicializa o aplicativo Express

const httpServer = http.createServer(app); // Cria um servidor HTTP a partir do aplicativo Express

const MongoDBStore = connectMongo(session); // Cria uma instância do MongoDBStore para armazenar sessões no MongoDB

const store = new MongoDBStore({
  uri: process.env.MONGO_URI, // URI de conexão com o MongoDB
  collection: "sessions", // Coleção para armazenar sessões
});

store.on("error", (err) => console.log(err)); // Trata erros ocorridos no armazenamento de sessões

app.use(
  session({
    secret: process.env.SESSION_SECRET, // Chave secreta para assinar a sessão
    resave: false, // Não salva a sessão se não houver alterações
    saveUninitialized: false, // Não salva sessões não inicializadas
    cookie: {
      maxAge: 1000 * 60 * 60 * 24 * 7, // Tempo de vida do cookie de sessão (7 dias)
      httpOnly: true, // Define o cookie de sessão como acessível apenas pelo servidor
    },
    store: store, // Usa o MongoDBStore para armazenar as sessões
  })
);

app.use(passport.initialize()); // Inicializa o Passport.js para autenticação
app.use(passport.session()); // Usa o Passport.js para gerenciar sessões de usuário

const server = new ApolloServer({
  typeDefs: mergedTypeDefs, // Tipos definidos combinados de diferentes módulos
  resolvers: mergedResolvers, // Resolvers combinados de diferentes módulos
  plugins: [ApolloServerPluginDrainHttpServer({ httpServer })], // Plugin para gerenciar a finalização do servidor HTTP
});

await server.start(); // Inicia o servidor Apollo GraphQL

app.use(
  "/graphql", // Rota raiz
  cors({
    origin: "http://localhost:3000", // Origem permitida para solicitações
    credentials: true, // Permite o envio de credenciais (por exemplo, cookies)
  }),
  express.json(), // Middleware para análise de JSON
  expressMiddleware(server, {
    // Middleware para integração do Apollo Server com o Express
    context: async ({ req, res }) => buildContext({ req, res }), // Constrói o contexto do Apollo Server com o Passport
  })
);

// Inicia o servidor HTTP na porta 4000 após a inicialização do Apollo Server e conexão com o banco de dados
await new Promise((resolve) => httpServer.listen({ port: 4000 }, resolve));
await connectDB(); // Conecta ao banco de dados MongoDB

console.log(`🚀 Server ready at http://localhost:4000/graphql`); // Exibe mensagem indicando que o servidor está pronto
