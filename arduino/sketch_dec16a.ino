#include <ESP8266WiFi.h>
#include <ESP8266HTTPClient.h>
#include <ArduinoJson.h> // Biblioteca para parse de JSON

// Dados da sua rede Wi-Fi
const char* ssid = "dev";
const char* password = "12345678";

// Ajuste conforme IP/porta do seu backend e a rota de plantas
// Por exemplo: GET /api/planta/Hortela
String plantaAtual = "Hortela";
String serverUrlGetPlanta = "http://10.42.0.1:3000/api/planta/" + plantaAtual;

// Rota para envio dos dados de sensor
const char* serverUrlPostSensor = "http://10.42.0.1:3000/sensor-data";

// Pinos
int sensorPin = A0;      // Pino do sensor de umidade
#define RELAY_PIN D0     // Pino do relé para a bomba de irrigação

// Cliente Wi-Fi
WiFiClient wifiClient;

// Variáveis para faixa de umidade recebida do backend
int umidadeMin = 0;
int umidadeMax = 1023;

// Define o tamanho do vaso (1 = Pequeno, 2 = Médio, 3 = Grande)
int tamanhoVaso = 1;

void setup() {
  Serial.begin(115200);
  Serial.println("Iniciando setup...");

  pinMode(sensorPin, INPUT);
  pinMode(RELAY_PIN, OUTPUT);
  digitalWrite(RELAY_PIN, HIGH);

  // Conectar ao Wi-Fi
  WiFi.begin(ssid, password);
  Serial.print("Conectando ao Wi-Fi");
  while (WiFi.status() != WL_CONNECTED) {
    delay(1000);
    Serial.print(".");
  }
  Serial.println("\nConectado ao Wi-Fi!");

  // Assim que conectar, vamos buscar do backend a faixa de umidade da planta
  buscarFaixaUmidadeDoServidor();
}

void loop() {
  Serial.println("Iniciando loop...");
  if (WiFi.status() == WL_CONNECTED) {

    // Ler a umidade do sensor
    int umidade = analogRead(sensorPin);
    Serial.print("Umidade lida: ");
    Serial.println(umidade);

    // Exibe as faixas obtidas do backend
    Serial.print("Umidade mínima (umidadeMin) recebida: ");
    Serial.println(umidadeMin);
    Serial.print("Umidade máxima (umidadeMax) recebida: ");
    Serial.println(umidadeMax);

    // Lógica de acionamento da bomba:
    // Se estiver abaixo da umidade mínima, aciona a bomba
    if (umidade < umidadeMin) {
      Serial.println("Abaixo do valor mínimo! Acionando bomba de irrigação...");
      digitalWrite(RELAY_PIN, LOW);
      delay(getIrrigationTime(tamanhoVaso));
      digitalWrite(RELAY_PIN, HIGH);
      Serial.println("Desligando bomba de irrigação...");
    } else {
      Serial.println("Umidade acima do mínimo, não é necessário irrigar agora.");
    }

    // Enviar dados ao servidor (POST)
    HTTPClient http;
    http.begin(wifiClient, serverUrlPostSensor);
    http.addHeader("Content-Type", "application/json");

    String jsonPayload = "{\"umidade\": " + String(umidade) +
                         ", \"tamanhoVaso\": " + String(tamanhoVaso) + "}";

    Serial.print("Enviando dados para o servidor: ");
    Serial.println(jsonPayload);

    int httpResponseCode = http.POST(jsonPayload);
    if (httpResponseCode > 0) {
      Serial.print("Dados enviados com sucesso! Código HTTP: ");
      Serial.println(httpResponseCode);
    } else {
      Serial.print("Erro ao enviar dados: ");
      Serial.println(httpResponseCode);
    }
    http.end();

  } else {
    Serial.println("Erro: Wi-Fi desconectado!");
  }

  Serial.println("Finalizando loop...");
  delay(5000);
}

/**
 * Função que faz uma requisição GET ao servidor para buscar
 * os valores de umidade mínima e máxima definidos em Planta.js
 * para a 'plantaAtual'.
 */
 void buscarFaixaUmidadeDoServidor() {
  if (WiFi.status() == WL_CONNECTED) {
    Serial.println("Buscando faixa de umidade no servidor...");
    HTTPClient httpGet;
    httpGet.begin(wifiClient, serverUrlGetPlanta);

    int httpResponseCode = httpGet.GET();
    if (httpResponseCode > 0) {
      String payload = httpGet.getString();
      Serial.print("Resposta do servidor (faixas de umidade): ");
      Serial.println(payload);

      DynamicJsonDocument doc(256);
      DeserializationError error = deserializeJson(doc, payload);
      if (!error) {
        umidadeMin = doc["umidadeMin"] | 0;     // valor padrão = 0
        umidadeMax = doc["umidadeMax"] | 1023;  // valor padrão = 1023

        Serial.print("Planta recebida: ");
        Serial.println(doc["nome"].as<String>());
        Serial.print("umidadeMin: ");
        Serial.println(umidadeMin);
        Serial.print("umidadeMax: ");
        Serial.println(umidadeMax);
      } else {
        Serial.print("Erro ao parsear JSON: ");
        Serial.println(error.c_str());
      }
    } else {
      Serial.print("Falha ao fazer GET. Código HTTP: ");
      Serial.println(httpResponseCode);
    }
    httpGet.end();
  } else {
    Serial.println("Wi-Fi desconectado, não foi possível buscar a planta.");
  }
}

/**
 * Função que retorna o tempo (ms) de irrigação
 * com base no tamanho do vaso.
 */
int getIrrigationTime(int tamanhoVaso) {
  Serial.print("Determinando tempo de irrigação para tamanho de vaso: ");
  Serial.println(tamanhoVaso);
  switch (tamanhoVaso) {
    case 1: return 5000;  // Pequeno: 5s
    case 2: return 10000; // Médio: 10s
    case 3: return 15000; // Grande: 15s
    default: return 5000;
  }
}
