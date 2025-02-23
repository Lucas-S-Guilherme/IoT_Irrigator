const express = require('express');
const router = express.Router();
const SensorUmidade = require('../models/SensorUmidade');
const ControladorIrrigacao = require('../models/ControladorIrrigacao');
const BaseDados = require('../models/BaseDados');
const AtuadorIrrigacao = require('../models/AtuadorIrrigacao');
const { plantas } = require('../models/Planta'); // Importa a lista de plantas

const sensor = new SensorUmidade('Jardim');
let atuador = new AtuadorIrrigacao('Jardim', 'Rosa'); // Planta padrão
let controlador = new ControladorIrrigacao(
  plantas.Rosa.umidadeMinima,
  plantas.Rosa.umidadeMaxima,
  atuador
);
const baseDados = new BaseDados();

// Endpoint para selecionar o tipo de planta
router.post('/selecionar-planta', (req, res) => {
    const { tipoPlanta } = req.body;
  
    console.log('Tipo de planta recebido:', tipoPlanta); // Debug
  
    if (plantas[tipoPlanta]) {
      atuador = new AtuadorIrrigacao('Jardim', tipoPlanta);
      controlador = new ControladorIrrigacao(
        plantas[tipoPlanta].umidadeMinima,
        plantas[tipoPlanta].umidadeMaxima,
        atuador
      );
  
      console.log('Planta selecionada com sucesso:', tipoPlanta); // Debug
      res.status(200).json({ message: `Planta selecionada: ${tipoPlanta}` });
    } else {
      console.log('Tipo de planta inválido:', tipoPlanta); // Debug
      res.status(400).json({ message: 'Tipo de planta inválido.' });
    }
  });

// Endpoint para ler umidade e acionar irrigação
// router.get('/monitorar', (req, res) => {
//   const umidade = sensor.lerUmidade();
//   controlador.verificarUmidade(umidade);
//   baseDados.armazenarDados(umidade, atuador.estado);

//   res.status(200).json({
//     umidade,
//     irrigacao: atuador.estado,
//     tipoPlanta: atuador.tipoPlanta,
//   });
// });

// Endpoint para ler umidade e acionar irrigação
router.get('/monitorar', (req, res) => {
    // Simulação de leitura da umidade (sem Arduino)
    const umidade = Math.floor(Math.random() * 1024); // Valor aleatório entre 0 e 1023
    console.log('Umidade simulada:', umidade); // Debug
  
    // Verifica se a umidade está abaixo ou acima dos limites
    controlador.verificarUmidade(umidade);
    baseDados.armazenarDados(umidade, atuador.estado);
  
    // Retorna os dados em formato JSON
    res.status(200).json({
      umidade,
      irrigacao: atuador.estado,
      tipoPlanta: atuador.tipoPlanta,
      mensagem: 'Sensor de umidade não conectado. Dados simulados.',
    });
  });

// Endpoint para consultar dados
router.get('/dados', (req, res) => {
  const dados = baseDados.consultarDados();
  res.status(200).json(dados);
});

module.exports = router;