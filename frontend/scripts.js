const apiEndpoint = 'http://localhost:3000/api';

// Variáveis globais
let nomeUsuario = '';
let tipoPlanta = '';

// Alternar para a tela de monitoramento
function mostrarTelaMonitoramento() {
    console.log('Alternando para a tela de monitoramento...'); // Debug
    document.getElementById('tela-inicial').style.display = 'none'; // Oculta a tela inicial
    document.getElementById('tela-monitoramento').style.display = 'block'; // Exibe a tela de monitoramento
    document.getElementById('nome-usuario-planta').innerText = `Usuário: ${nomeUsuario} | Planta: ${tipoPlanta}`;
  }

// Função para iniciar o monitoramento
document.getElementById('btn-iniciar-monitoramento').addEventListener('click', async () => {
    nomeUsuario = document.getElementById('nome-usuario').value;
    tipoPlanta = document.getElementById('selecionar-planta').value;
  
    console.log('Nome do usuário:', nomeUsuario); // Debug
    console.log('Tipo de planta selecionado:', tipoPlanta); // Debug
  
    if (!nomeUsuario || !tipoPlanta) {
      alert('Por favor, insira seu nome e selecione um tipo de planta.');
      return;
    }
  
    try {
      console.log('Enviando requisição para /selecionar-planta...'); // Debug
      const response = await fetch(`${apiEndpoint}/selecionar-planta`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ tipoPlanta }),
      });
  
      const data = await response.json();
      console.log('Resposta do backend:', data); // Debug
  
      if (response.ok) {
        alert(data.message);
        mostrarTelaMonitoramento();
      } else {
        alert(`Erro: ${data.message}`);
      }
    } catch (error) {
      console.error('Erro ao selecionar planta:', error);
      alert('Erro ao conectar com o servidor. Tente novamente.');
    }
  });

// Função para buscar dados de umidade
async function fetchMoistureData() {
    try {
      const response = await fetch(`${apiEndpoint}/monitorar`);
      
      // Verifica se a resposta é válida
      if (!response.ok) {
        throw new Error(`Erro na requisição: ${response.statusText}`);
      }
  
      // Converte a resposta para JSON
      const data = await response.json();
      console.log('Dados recebidos:', data); // Debug
  
      // Atualiza a interface com os dados recebidos
      updateBar(data.umidade);
      updateStatus(data.irrigacao, data.tipoPlanta);
  
      // Exibe a mensagem do backend (se existir)
      if (data.mensagem) {
        console.log(data.mensagem); // Debug
      }
    } catch (error) {
      console.error('Erro ao buscar dados:', error);
      document.getElementById('status-message').innerText = 'Erro ao conectar com o sensor. Tente novamente.';
    }
  }

// Função para atualizar a barra de umidade
function updateBar(umidade) {
  const bar = document.getElementById('bar');
  const moisturePercentage = Math.min(Math.max((umidade / 1023) * 100, 0), 100);
  bar.style.width = `${moisturePercentage}%`;
}

// Função para atualizar o status da irrigação
// function updateStatus(irrigacao) {
//   const statusMessage = document.getElementById('status-message');
//   statusMessage.innerText = irrigacao
//     ? `Irrigação ativada para ${tipoPlanta}! 💧`
//     : `Irrigação desativada para ${tipoPlanta}. 🌱`;
// }

// Função para atualizar o status da irrigação
function updateStatus(irrigacao, tipoPlanta) {
    const statusMessage = document.getElementById('status-message');
    if (irrigacao) {
      statusMessage.innerText = `Irrigação ativada para ${tipoPlanta}! 💧`;
    } else {
      statusMessage.innerText = `Irrigação desativada para ${tipoPlanta}. 🌱`;
    }
  
    // Adiciona uma mensagem sobre o sensor
    const sensorMessage = document.createElement('p');
    sensorMessage.innerText = 'Sensor de umidade não conectado. Dados simulados.';
    sensorMessage.style.color = 'orange';
    statusMessage.appendChild(sensorMessage);
  }

// Função para consultar dados históricos
document.getElementById('consultar-dados').addEventListener('click', async () => {
  try {
    const response = await fetch(`${apiEndpoint}/dados`);
    const data = await response.json();
    document.getElementById('dados').textContent = JSON.stringify(data, null, 2);
  } catch (error) {
    console.error('Erro ao consultar dados:', error);
  }
});

// Atualizar a cada 5 segundos
setInterval(fetchMoistureData, 5000);

// Primeira chamada para buscar dados imediatamente
fetchMoistureData();