const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(bodyParser.json());

let sensorData = [];

// Endpoint para receber os dados do ESP8266
app.post('/sensor-data', (req, res) => {
  const { umidade } = req.body;
  const timestamp = new Date().toISOString();
  
  const data = { umidade, timestamp };
  sensorData.push(data);
  
  console.log('Dados recebidos:', data);
  res.status(200).send({ message: 'Dados recebidos com sucesso!' });
});

// Endpoint para exibir os dados
app.get('/sensor-data', (req, res) => {
  res.status(200).json(sensorData);
});

// Iniciar o servidor
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
