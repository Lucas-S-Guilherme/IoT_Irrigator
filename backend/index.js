const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const apiRouter = require('./routes/api'); // Importa as rotas da API
const db = require('../database/db');

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Aplica o prefixo /api às rotas
app.use('/api', apiRouter);

// Endpoint para receber os dados do ESP8266
app.post('/sensor-data', (req, res) => {
  const { umidade } = req.body;
  const timestamp = new Date().toISOString();
  
  const data = { umidade, timestamp };
  db.saveSensorData(data);
  
  console.log('Dados recebidos:', data);
  res.status(200).send({ message: 'Dados recebidos com sucesso!' });
});

// Endpoint para exibir os dados
app.get('/sensor-data', (req, res) => {
  const data = db.getSensorData();
  res.status(200).json(data);
});

// Iniciar o servidor
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});