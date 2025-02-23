const mysql = require('mysql2');

// Configuração da conexão com o MySQL
const connection = mysql.createConnection({
  host: 'localhost',      // Endereço do banco de dados
  user: 'root',           // Usuário do banco de dados
  password: 'sua_senha',  // Senha do banco de dados
  database: 'iot_irrigation' // Nome do banco de dados
});

// Conectar ao banco de dados
connection.connect((err) => {
  if (err) {
    console.error('Erro ao conectar ao MySQL:', err);
  } else {
    console.log('Conectado ao MySQL!');
  }
});

module.exports = connection;