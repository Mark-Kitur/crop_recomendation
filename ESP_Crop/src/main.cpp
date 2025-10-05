#include <Arduino.h>
#include <LiquidCrystal.h>
#include <DHT.h>
#include "model.h" 
#include <ESP8266WiFi.h>         
#include <ESP8266HTTPClient.h>   
#include <interrupts.h>

// WiFi credentials
const char* ssid = "GRACE D";
const char* password = "grace019";

const char* serverName = "http://192.168.2.171:3000/data_points";

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

void sendWeb(float temperature, float humidity, float Rainfall, float pH, float N, float P, float K);

void setup() {
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

  // Send data to web
  int button = analogRead(A0);
  Serial.println(button);
  if (button >500){
    Serial.println(button);
    sendWeb(temperature,humidity,Rainfall,pH,N,P,K);
  }
  // else{
  //   Serial.println("Sender mode not ACTIVATED");
  //   lcd.clear();
  //   lcd.setCursor(0,0);
  //   lcd.print("Sender mode");
  //   lcd.setCursor(0,1);
  //   lcd.print("Not Activated");
  //   delay(500);
  //   lcd.clear();
  // }

   delay(3000);
}


void sendWeb(float temperature, float humidity, float Rainfall, float pH, float N, float P, float K)
{
  Serial.println("Sender mode activated");
    lcd.clear();
    lcd.setCursor(0,0);
    lcd.print("Sender mode");
    lcd.setCursor(0,1);
    lcd.print("Activated");    
    //  Send data to Flask
  if (WiFi.status() == WL_CONNECTED) {
    WiFiClient client;
    HTTPClient http;
    http.begin(client, serverName);   
    http.addHeader("Content-Type", "application/json");
    //http.addHeader("X-DEVICE-UID", "esp8266-1234abcd");

    // String jsonData = "{";
    // jsonData += "\"data_point\":{";
    // jsonData += "\"temperature\":" + String(temperature, 1) + ",";
    // jsonData += "\"humidity\":" + String(humidity, 1) + ",";
    // jsonData += "\"rainfall\":" + String(Rainfall, 1) + ",";
    // jsonData += "\"ph_value\":" + String(pH, 1) + ",";
    // jsonData += "\"nitrogen\":" + String(N, 1) + ",";
    // jsonData += "\"phosphorus\":" + String(P, 1) + ",";
    // jsonData += "\"potassium\":" + String(K, 1);
    // jsonData += "}}"; 

    String jsonData = "{";
    jsonData += "\"temperature\":" + String(temperature,1) + ",";
    jsonData += "\"humidity\":" + String(humidity,1) + ",";
    jsonData += "\"N\":" + String(N) + ",";
    jsonData += "\"P\":" + String(P) + ",";
    jsonData += "\"K\":" + String(K) + ",";
    jsonData += "\"pH\":" + String(pH) + ",";
    jsonData += "\"rainfall\":" + String(Rainfall);
    jsonData += "}";  


    int httpResponseCode = http.POST(jsonData);

    if (httpResponseCode > 0) {
      Serial.print("Data sent. Response: ");
      Serial.println(httpResponseCode);
      lcd.clear();
      lcd.setCursor(0,0);
      lcd.print("Data Sent");
      lcd.setCursor(0,1);
      lcd.print(httpResponseCode);
      delay(2000);
    } else {
      Serial.print("Error sending data: ");
      Serial.println(httpResponseCode);
      lcd.clear();
      lcd.setCursor(0,0);
      lcd.print("Data Not Sent");
      lcd.setCursor(0,1);
      lcd.print(httpResponseCode);
      delay(200);
    }

    http.end();
  } else {
    Serial.println("WiFi Disconnected");
    lcd.clear();
    lcd.setCursor(0,0);
    lcd.print("NO Wifi ");
    delay(500);
  }

  delay(2000); 
}

