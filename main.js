const { exec } = require('child_process');

// Iniciar backend
exec('node backend/index.js', (error, stdout, stderr) => {
  if (error) {
    console.error(`Erro ao iniciar o backend: ${error.message}`);
    return;
  }
  console.log(`Backend: ${stdout}`);
});

// Iniciar frontend
exec('npx http-server frontend -p 8080', (error, stdout, stderr) => {
  if (error) {
    console.error(`Erro ao iniciar o frontend: ${error.message}`);
    return;
  }
  console.log(`Frontend: ${stdout}`);
});

console.log('Servidor backend e frontend iniciados.');
console.log('Backend: http://localhost:3000');
console.log('Frontend: http://localhost:8080');