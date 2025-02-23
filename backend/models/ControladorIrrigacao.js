const Planta = require('./Planta');
const AtuadorIrrigacao = require('./AtuadorIrrigacao');

class ControladorIrrigacao {
  constructor(umidadeMinima, umidadeMaxima, atuador) {
    this.umidadeMinima = umidadeMinima;
    this.umidadeMaxima = umidadeMaxima;
    this.atuador = atuador;
  }

  verificarUmidade(nivelUmidade) {
    if (nivelUmidade < this.umidadeMinima) {
      this.atuador.ativarIrrigacao();
    } else if (nivelUmidade >= this.umidadeMaxima) {
      this.atuador.desativarIrrigacao();
    }
  }
}

module.exports = ControladorIrrigacao;