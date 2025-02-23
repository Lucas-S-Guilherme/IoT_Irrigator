class Planta {
    constructor(tipo, umidadeMinima, umidadeMaxima) {
      this.tipo = tipo;
      this.umidadeMinima = umidadeMinima;
      this.umidadeMaxima = umidadeMaxima;
    }
  
    getUmidadeIdeal() {
      return {
        minima: this.umidadeMinima,
        maxima: this.umidadeMaxima,
      };
    }
  }
  
  // Lista de plantas pré-definidas
  const plantas = {
    Rosa: new Planta('Rosa', 20, 40),
    Suculenta: new Planta('Suculenta', 10, 30),
    Samambaia: new Planta('Samambaia', 50, 70),
    Orquídea: new Planta('Orquídea', 30, 60),
    Lavanda: new Planta('Lavanda', 15, 35),
    Cacto: new Planta('Cacto', 5, 20),
    Tomate: new Planta('Tomate', 40, 60),
    Manjericão: new Planta('Manjericão', 35, 55),
    Hortênsia: new Planta('Hortênsia', 45, 65),
    Girassol: new Planta('Girassol', 25, 45),
    Lírio: new Planta('Lírio', 30, 50),
    Jasmim: new Planta('Jasmim', 20, 40),
    Bromélia: new Planta('Bromélia', 40, 60),
    Violeta: new Planta('Violeta', 25, 45),
    Alecrim: new Planta('Alecrim', 15, 35),
    Margarida: new Planta('Margarida', 30, 50),
    Begônia: new Planta('Begônia', 35, 55),
    Azaleia: new Planta('Azaleia', 40, 60),
    Hibisco: new Planta('Hibisco', 25, 45),
    Peperômia: new Planta('Peperômia', 30, 50),
  };
  
  module.exports = { Planta, plantas };