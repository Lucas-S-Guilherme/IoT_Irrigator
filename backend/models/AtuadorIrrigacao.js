class AtuadorIrrigacao {
    constructor(localizacao, tipoPlanta) {
      this.localizacao = localizacao;
      this.tipoPlanta = tipoPlanta;
      this.estado = false; // false = desligado, true = ligado
    }
  
    ativarIrrigacao() {
      this.estado = true;
      console.log(`Irrigação ativada em ${this.localizacao} para ${this.tipoPlanta}.`);
    }
  
    desativarIrrigacao() {
      this.estado = false;
      console.log(`Irrigação desativada em ${this.localizacao} para ${this.tipoPlanta}.`);
    }
  }
  
  module.exports = AtuadorIrrigacao;