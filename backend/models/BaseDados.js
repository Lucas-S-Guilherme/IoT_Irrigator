const db = require('../config/db');

class BaseDados {
  // Armazena o nome do usuário e o tipo de planta
  armazenarUsuario(nome, tipoPlanta) {
    return new Promise((resolve, reject) => {
      const query = 'INSERT INTO usuarios (nome, tipo_planta) VALUES (?, ?)';
      db.query(query, [nome, tipoPlanta], (err, results) => {
        if (err) {
          reject(err);
        } else {
          resolve(results.insertId); // Retorna o ID do usuário inserido
        }
      });
    });
  }

  // Armazena dados de umidade e acionamento no MySQL
  armazenarDados(umidade, acionamento, usuarioId) {
    const queryUmidade = 'INSERT INTO umidade (valor, usuario_id) VALUES (?, ?)';
    const queryAcionamento = 'INSERT INTO acionamento (estado, usuario_id) VALUES (?, ?)';

    // Insere a umidade
    db.query(queryUmidade, [umidade, usuarioId], (err, results) => {
      if (err) {
        console.error('Erro ao salvar umidade:', err);
      } else {
        console.log('Umidade salva com sucesso:', umidade);
      }
    });

    // Insere o acionamento (se existir)
    if (acionamento !== undefined) {
      db.query(queryAcionamento, [acionamento, usuarioId], (err, results) => {
        if (err) {
          console.error('Erro ao salvar acionamento:', err);
        } else {
          console.log('Acionamento salvo com sucesso:', acionamento);
        }
      });
    }
  }

  // Consulta todos os dados de umidade e acionamento
  consultarDados() {
    return new Promise((resolve, reject) => {
      const query = `
        SELECT 
          u.nome AS usuario,
          u.tipo_planta,
          um.valor AS umidade,
          um.timestamp AS umidade_timestamp,
          ac.estado AS acionamento,
          ac.timestamp AS acionamento_timestamp
        FROM usuarios u
        LEFT JOIN umidade um ON u.id = um.usuario_id
        LEFT JOIN acionamento ac ON u.id = ac.usuario_id
        ORDER BY um.timestamp DESC, ac.timestamp DESC
      `;

      db.query(query, (err, results) => {
        if (err) {
          reject(err);
        } else {
          resolve(results);
        }
      });
    });
  }
}

module.exports = BaseDados;