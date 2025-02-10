#include <ESP8266WiFi.h>
#include <ESP8266HTTPClient.h>

const char* ssid = "dev";         // Nome da rede Wi-Fi
const char* password = "12345678";   // Senha da rede Wi-Fi
const char* serverUrl = "http://10.42.0.1:3000/sensor-data"; // URL da API

int sensorPin = A0;      // Pino do sensor de umidade
#define RELAY_PIN D0     // Pino do relé para a bomba de irrigação

WiFiClient wifiClient;   // Objeto WiFiClient

void setup() {
  Serial.begin(115200);
  pinMode(sensorPin, INPUT);      // Configura o pino do sensor como entrada
  pinMode(RELAY_PIN, OUTPUT);     // Configura o pino do relé como saída
  digitalWrite(RELAY_PIN, HIGH);  // Inicializa o relé desligado (nível alto)

  // Conectar ao Wi-Fi
  WiFi.begin(ssid, password);
  Serial.print("Conectando ao Wi-Fi");
  while (WiFi.status() != WL_CONNECTED) {
    delay(1000);
    Serial.print(".");
  }
  Serial.println("\nConectado ao Wi-Fi!");
}

void loop() {
  if (WiFi.status() == WL_CONNECTED) {
    int umidade = analogRead(sensorPin); // Leitura do sensor de umidade
    Serial.println("Umidade: " + String(umidade));

    // Lógica para controle da bomba
    if (umidade > 800) {  // Valor de limite de umidade (ajuste conforme necessário) - testes
      Serial.println("Baixa umidade detectada! Ligando a bomba de irrigação...");
      digitalWrite(RELAY_PIN,HIGH ); // Ativa o relé (bomba ligada)
    } else {
      Serial.println("Umidade suficiente. Desligando a bomba...");
      digitalWrite(RELAY_PIN, LOW); // Desativa o relé (bomba desligada)
    }
    
    // Enviar os dados para a API
    HTTPClient http;
    http.begin(wifiClient, serverUrl); // Usa o WiFiClient como argumento
    http.addHeader("Content-Type", "application/json");

    String jsonPayload = "{\"umidade\": " + String(umidade) + "}";
    int httpResponseCode = http.POST(jsonPayload);

    if (httpResponseCode > 0) {
      Serial.println("Dados enviados com sucesso! Código: " + String(httpResponseCode));
    } else {
      Serial.println("Erro ao enviar dados. Código: " + String(httpResponseCode));
    }
    http.end();
  } else {
    Serial.println("Wi-Fi desconectado. Tentando reconectar...");
    WiFi.begin(ssid, password);
  }

  delay(1000); // Enviar dados a cada 10 segundos
}
