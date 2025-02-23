class BaseDados {
    constructor() {
      this.registroUmidade = [];
      this.registroAtuacao = [];
    }
  
    armazenarDados(umidade, acionamento) {
      const timestamp = new Date().toISOString();
      this.registroUmidade.push({ umidade, timestamp });
      if (acionamento) {
        this.registroAtuacao.push({ acionamento, timestamp });
      }
    }
  
    consultarDados() {
      return {
        umidade: this.registroUmidade,
        acionamento: this.registroAtuacao,
      };
    }
  }
  
  module.exports = BaseDados;