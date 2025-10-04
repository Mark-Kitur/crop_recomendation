#include <Arduino.h>
#include <LiquidCrystal.h>
#include <DHT.h>
#include "model.h" 
#include <ESP8266WiFi.h>         
#include <ESP8266HTTPClient.h>   
#include <interrupts.h>

// WiFi credentials
const char* ssid = "B1";
const char* password = "RoomB1@cax123";

const char* serverName = "http://192.168.2.171:5000/api/data";

int pin=5;
// LCD setup
const int RS = 4, EN = 0, d4 = 14, d5 = 12, d6 = 13, d7 = 15;   
LiquidCrystal lcd(RS, EN, d4, d5, d6, d7);

// DHT11 setup
#define DHTPIN 2     
#define DHTTYPE DHT11    
DHT dht(DHTPIN, DHTTYPE);

// Machine Learning
Eloquent::ML::Port::RandomForest RF; 

const char* crops[] = {
  "Chickpea", "Watermelon", "Jute", "Muskmelon",
  "Kidneybeans", "Mothbeans", "Rice", "Pomogranate",
  "Maize", "Pigeon peas", "Grapes", "Mango",
  "Coconut", "Coffee", "Cotton", "Apple",
  "Mungbeans", "Blackgram", "Orange", "Lentil",
  "Papaya", "Banana"
};

float randomval(float minVal, float maxVal) {
  return random(minVal * 10, maxVal * 10) / 10.0;
}

void isr_(){
  lcd.begin(16, 2);
  lcd.print("ISR");
  delay(100);
}

void setup() {
  // pinMode(pin,INPUT);
  // attachInterrupt(pin,isr_,RISING);
  Serial.begin(9600);
  dht.begin();
  lcd.begin(16, 2);
  lcd.print("Smart Farming");
  delay(2000);
  lcd.clear();
  randomSeed(analogRead(A0));  

  //  Connect to WiFi
  WiFi.begin(ssid, password);
  Serial.print("Connecting to WiFi");
  while (WiFi.status() != WL_CONNECTED) {
    delay(1000);
    Serial.print(".");
  }
  Serial.println("\nConnected to WiFi!");
  Serial.print("IP Address: ");
  Serial.println(WiFi.localIP());
}

void loop() {
  // Collect sensor data
  float humidity = dht.readHumidity();
  float temperature = dht.readTemperature();

  if (isnan(humidity) || isnan(temperature)) {
    Serial.println("Failed to read from DHT sensor!");
    lcd.clear();
    lcd.setCursor(0, 0);
    lcd.print("DHT Error!");
    delay(2000);
    return;
  }

  // Simulate soil & rainfall values
  float N = randomval(0, 140);
  float P = randomval(0, 140);
  float K = randomval(0, 200);
  float pH = randomval(4, 9);
  float Rainfall = randomval(50, 300);

  // Pack inputs
  float inputs[] = {N, P, K, temperature, humidity, pH, Rainfall};

  // Predict crop
  int predClass = RF.predict(inputs);
  const char* crop = crops[predClass];

  // Print on Serial Monitor
  Serial.print("Predicted Crop: ");
  Serial.println(crop);

  // Display on LCD
  lcd.clear();
  lcd.setCursor(0, 0);
  lcd.print("Crop: ");
  lcd.print(crop);
  lcd.setCursor(0, 1);
  lcd.print("T:");
  lcd.print(temperature, 1);
  lcd.print("C H:");
  lcd.print(humidity, 0);

  //  Send data to Flask
  if (WiFi.status() == WL_CONNECTED) {
    WiFiClient client;
    HTTPClient http;
    http.begin(client, serverName);   
    http.addHeader("Content-Type", "application/json");

    // Create JSON payload
    String jsonData = "{";
    jsonData += "\"temperature\":" + String(temperature,1) + ",";
    jsonData += "\"humidity\":" + String(humidity,1) + ",";
    jsonData += "\"N\":" + String(N) + ",";
    jsonData += "\"P\":" + String(P) + ",";
    jsonData += "\"K\":" + String(K) + ",";
    jsonData += "\"pH\":" + String(pH) + ",";
    jsonData += "\"rainfall\":" + String(Rainfall) + ",";
    jsonData += "\"predicted_crop\":\"" + String(crop) + "\"";
    jsonData += "}";

    int httpResponseCode = http.POST(jsonData);

    if (httpResponseCode > 0) {
      Serial.print("Data sent. Response: ");
      Serial.println(httpResponseCode);
    } else {
      Serial.print("Error sending data: ");
      Serial.println(httpResponseCode);
    }

    http.end();
  } else {
    Serial.println("WiFi Disconnected");
  }

  delay(5000);  
}
