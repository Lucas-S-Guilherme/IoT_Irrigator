const express = require('express');
const router = express.Router();
const SensorUmidade = require('../models/SensorUmidade');
const ControladorIrrigacao = require('../models/ControladorIrrigacao');
const BaseDados = require('../models/BaseDados');
const AtuadorIrrigacao = require('../models/AtuadorIrrigacao');
const { plantas } = require('../models/Planta');

const sensor = new SensorUmidade('Jardim');
let atuador = new AtuadorIrrigacao('Jardim', 'Rosa'); // Planta padrão
let controlador = new ControladorIrrigacao(
  plantas.Rosa.umidadeMinima,
  plantas.Rosa.umidadeMaxima,
  atuador
);
const baseDados = new BaseDados();

// Endpoint para selecionar o tipo de planta
router.post('/selecionar-planta', async (req, res) => {
  const { nomeUsuario, tipoPlanta } = req.body;

  if (!nomeUsuario || !tipoPlanta) {
    return res.status(400).json({ message: 'Nome do usuário e tipo de planta são obrigatórios.' });
  }

  if (!plantas[tipoPlanta]) {
    return res.status(400).json({ message: 'Tipo de planta inválido.' });
  }

  try {
    // Armazena o usuário e obtém o ID
    const usuarioId = await baseDados.armazenarUsuario(nomeUsuario, tipoPlanta);

    // Atualiza o atuador e o controlador
    atuador = new AtuadorIrrigacao('Jardim', tipoPlanta);
    controlador = new ControladorIrrigacao(
      plantas[tipoPlanta].umidadeMinima,
      plantas[tipoPlanta].umidadeMaxima,
      atuador
    );

    res.status(200).json({ message: `Planta selecionada: ${tipoPlanta}`, usuarioId });
  } catch (error) {
    console.error('Erro ao selecionar planta:', error);
    res.status(500).json({ message: 'Erro ao selecionar planta.' });
  }
});

// Endpoint para ler umidade e acionar irrigação
router.get('/monitorar', async (req, res) => {
  const { usuarioId } = req.query;

  if (!usuarioId) {
    return res.status(400).json({ message: 'ID do usuário é obrigatório.' });
  }

  const umidade = Math.floor(Math.random() * 1024); // Simulação de leitura
  controlador.verificarUmidade(umidade);
  baseDados.armazenarDados(umidade, atuador.estado, usuarioId);

  res.status(200).json({
    umidade,
    irrigacao: atuador.estado,
    tipoPlanta: atuador.tipoPlanta,
    mensagem: 'Sensor de umidade não conectado. Dados simulados.',
  });
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

// Endpoint para consultar dados
router.get('/dados', async (req, res) => {
  try {
    const dados = await baseDados.consultarDados();
    res.status(200).json(dados);
  } catch (error) {
    console.error('Erro ao consultar dados:', error);
    res.status(500).json({ message: 'Erro ao consultar dados.' });
  }
});

module.exports = router;