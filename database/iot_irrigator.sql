CREATE DATABASE iot_irrigation;
USE iot_irrigation;

CREATE TABLE usuarios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    tipo_planta VARCHAR(50) NOT NULL,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE umidade (
    id INT AUTO_INCREMENT PRIMARY KEY,
    valor INT NOT NULL,
    usuario_id INT,
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id),
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE acionamento (
    id INT AUTO_INCREMENT PRIMARY KEY,
    estado BOOLEAN NOT NULL,
    usuario_id INT,
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id),
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
); 	