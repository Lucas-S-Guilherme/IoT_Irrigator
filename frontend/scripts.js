const apiEndpoint = 'http://localhost:3000/api';

// Variáveis globais
let nomeUsuario = '';
let tipoPlanta = '';
let usuarioId = null;

// Variável para armazenar o gráfico
let umidadeChart = null;

// Alternar para a tela de monitoramento
function mostrarTelaMonitoramento() {
  console.log('Alternando para a tela de monitoramento...'); // Debug
  document.getElementById('tela-inicial').style.display = 'none'; // Oculta a tela inicial
  document.getElementById('tela-monitoramento').style.display = 'block'; // Exibe a tela de monitoramento
  document.getElementById('nome-usuario-planta').innerText = `Usuário: ${nomeUsuario} | Planta: ${tipoPlanta}`;
}

// Alternar para a tela inicial
function mostrarTelaInicial() {
  document.getElementById('tela-monitoramento').style.display = 'none'; // Oculta a tela de monitoramento
  document.getElementById('tela-inicial').style.display = 'block'; // Exibe a tela inicial
}

// Salvar dados no localStorage
function salvarDadosLocalStorage() {
  localStorage.setItem('nomeUsuario', nomeUsuario);
  localStorage.setItem('tipoPlanta', tipoPlanta);
  localStorage.setItem('usuarioId', usuarioId);
}

// Carregar dados do localStorage
function carregarDadosLocalStorage() {
  nomeUsuario = localStorage.getItem('nomeUsuario') || '';
  tipoPlanta = localStorage.getItem('tipoPlanta') || '';
  usuarioId = localStorage.getItem('usuarioId') || null;

  if (nomeUsuario && tipoPlanta) {
    document.getElementById('nome-usuario').value = nomeUsuario;
    document.getElementById('selecionar-planta').value = tipoPlanta;
    mostrarTelaMonitoramento();
    fetchMoistureData(); // Carrega os dados ao iniciar
  }
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
      body: JSON.stringify({ nomeUsuario, tipoPlanta }), // Envia nome e tipo de planta
    });

    const data = await response.json();
    console.log('Resposta do backend:', data); // Debug

    if (response.ok) {
      usuarioId = data.usuarioId; // Armazena o ID do usuário retornado pelo backend
      salvarDadosLocalStorage(); // Salva os dados no localStorage
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

// Botão para voltar à tela inicial
document.getElementById('btn-voltar').addEventListener('click', () => {
  mostrarTelaInicial();
});

// Função para buscar dados de umidade
async function fetchMoistureData() {
  if (!usuarioId) {
    console.log('Usuário não selecionado. Aguardando...'); // Debug
    return;
  }

  try {
    const response = await fetch(`${apiEndpoint}/monitorar?usuarioId=${usuarioId}`); // Passa o ID do usuário
    console.log('Resposta do endpoint /monitorar:', response); // Debug

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

    // Atualiza o gráfico com o novo valor de umidade
    const umidadePercentual = Math.min(Math.max((data.umidade / 1023) * 100, 0), 100);
    const timestamp = new Date().toLocaleTimeString(); // Formata o timestamp
    atualizarGrafico(umidadePercentual, timestamp);

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

// Função para inicializar o gráfico
function inicializarGrafico() {
  const ctx = document.getElementById('umidadeChart').getContext('2d');
  umidadeChart = new Chart(ctx, {
    type: 'line', // Tipo de gráfico (linha)
    data: {
      labels: [], // Rótulos do eixo X (timestamps)
      datasets: [{
        label: 'Umidade (%)',
        data: [], // Dados do eixo Y (valores de umidade)
        backgroundColor: 'rgba(75, 192, 192, 0.2)', // Cor de fundo
        borderColor: 'rgba(75, 192, 192, 1)', // Cor da linha
        borderWidth: 1
      }]
    },
    options: {
      scales: {
        y: {
          beginAtZero: true,
          max: 100 // Valor máximo do eixo Y
        }
      }
    }
  });
}

// Função para atualizar o gráfico com novos dados
function atualizarGrafico(umidade, timestamp) {
  if (!umidadeChart) return;

  // Adiciona o novo valor de umidade e o timestamp ao gráfico
  umidadeChart.data.labels.push(timestamp);
  umidadeChart.data.datasets[0].data.push(umidade);

  // Limita o número de pontos no gráfico (opcional)
  if (umidadeChart.data.labels.length > 20) {
    umidadeChart.data.labels.shift(); // Remove o timestamp mais antigo
    umidadeChart.data.datasets[0].data.shift(); // Remove o valor mais antigo
  }

  // Atualiza o gráfico
  umidadeChart.update();
}

// Inicializa o gráfico ao carregar a página
inicializarGrafico();

// Carrega os dados do localStorage ao iniciar
carregarDadosLocalStorage();

// Atualizar a cada 5 segundos
setInterval(fetchMoistureData, 5000);

// Primeira chamada para buscar dados imediatamente
fetchMoistureData();