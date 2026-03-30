// Middleware centralizado para tratamento de erros
const errorMiddleware = (err, req, res, next) => {
  // Define o status code: se o erro tiver um status próprio, usa ele. 
  // Caso contrário, usa 500 (Erro Interno do Servidor).
  const statusCode = err.statusCode || 500;

  // Log do erro no console para o desenvolvedor ver o que aconteceu
  console.error(`[Erro]: ${err.message}`);

  // Resposta padronizada para o cliente (JSON)
  res.status(statusCode).json({
    status: 'error',
    message: err.message || 'Ocorreu um erro interno no servidor.'
  });
};

module.exports = errorMiddleware;