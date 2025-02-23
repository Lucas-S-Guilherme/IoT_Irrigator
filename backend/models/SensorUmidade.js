class SensorUmidade {
    constructor(localizacao) {
      this.localizacao = localizacao;
      this.nivelUmidade = 0;
    }
  
    lerUmidade() {
      // Simula a leitura de umidade (valor entre 0 e 1023)
      this.nivelUmidade = Math.floor(Math.random() * 1024);
      return this.nivelUmidade;
    }
  }
  
  module.exports = SensorUmidade;