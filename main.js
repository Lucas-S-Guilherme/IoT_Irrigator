const express = require('express');
const path = require('path');
const cors = require('cors');

const app = express();

// Servindo arquivos estáticos (como o seu HTML e JS)
app.use(express.static(path.join(__dirname, 'public')));
app.use(cors());
// Rota para servir a página principal
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Configuração para o servidor rodar na porta 8080
app.listen(8080, () => {
  console.log('Servidor rodando na porta 8080');
});