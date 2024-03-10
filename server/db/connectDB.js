import mongoose from "mongoose";

// Função assíncrona para conectar ao banco de dados MongoDB
export const connectDB = async () => {
  try {
    // Conecta ao banco de dados usando a URI fornecida no ambiente
    const conn = await mongoose.connect(process.env.MONGO_URI);
    // Exibe uma mensagem de sucesso se a conexão for estabelecida com sucesso
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    // Exibe uma mensagem de erro se ocorrer um erro durante a conexão
    console.error(`Error: ${error.message}`);
    // Encerra o processo do Node.js com código de saída 1
    process.exit(1);
  }
};
