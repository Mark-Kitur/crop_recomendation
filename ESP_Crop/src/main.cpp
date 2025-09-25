#include <Arduino.h>
#include <LiquidCrystal.h>
#include <DHT.h>
// #include <EloquentTinyML.h>
#include "model.h"   // Your exported RandomForest model

// LCD pin setup (avoid GPIO0 which is used by DHT11)
// LiquidCrystal lcd(13, 5, 4, 14, 2, 12); // RS, E, D4, D5, D6, D7
const int RS = 4, EN = 0, d4 = 14, d5 = 12, d6 = 13, d7 = 15;   
LiquidCrystal lcd(RS, EN, d4, d5, d6, d7);

// DHT11 setup
#define DHTPIN 2     // GPIO0 (D3 on NodeMCU)
#define DHTTYPE 11    // DHT11 sensor
DHT dht(DHTPIN, DHTTYPE);

// Machine Learning
Eloquent::ML::Port::RandomForest RF; 

// Crop labels (must match your training labels)
const char* crops[] = {
  "Chickpea", "Watermelon", "Jute", "Muskmelon",
  "Kidneybeans", "Mothbeans", "Rice", "Pomogranate",
  "Maize", "Pigeon peas", "Grapes", "Mango",
  "Coconut", "Coffee", "Cotton", "Apple",
  "Mungbeans", "Blackgram", "Orange", "Lentil",
  "Papaya", "Banana"
};

// Helper function: generate pseudo-random values
float randomval(float minVal, float maxVal) {
  return random(minVal * 10, maxVal * 10) / 10.0;  // one decimal precision
}

void setup() {
  Serial.begin(9600);
  dht.begin();
  lcd.begin(16, 2);
  lcd.print("Smart Farming");
  delay(2000);
  lcd.clear();
  randomSeed(analogRead(A0));  // better random seed
}

void loop() {
  // Collect sensor data
  float humidity = dht.readHumidity();
  float temperature = dht.readTemperature();

  // Check for failed DHT readings
  if (isnan(humidity) || isnan(temperature)) {
    Serial.println("Failed to read from DHT sensor!");
    lcd.clear();
    lcd.setCursor(0, 0);
    lcd.print("DHT Error!");
    delay(2000);
    return; // skip this loop iteration
  }

  // Simulate soil & rainfall values
  float N = randomval(0, 140);       // Nitrogen (kg/ha)
  float P = randomval(0, 140);       // Phosphorus
  float K = randomval(0, 200);       // Potassium
  float pH = randomval(4, 9);        // Soil pH
  float Rainfall = randomval(50, 300); // mm

  // Pack inputs [N, P, K, Temp, Humidity, pH, Rainfall]
  //93,56,36,24.01497622,82.05687182,6.98435366,185.2773389,
  float inputs[] = {N,P,K,temperature,humidity,pH,Rainfall};

  // Predict crop
  int predClass = RF.predict(inputs);
  const char* crop = crops[predClass];

  // Print on Serial Monitor
  Serial.print("Predicted Crop: ");
  Serial.println(crop);
  Serial.println(predClass);

  // Display on LCD
  lcd.clear();
  lcd.setCursor(0, 0);
  lcd.print("Crop: ");
  lcd.print(crop);
  lcd.setCursor(0, 1);
  lcd.print("Temp:");
  lcd.print(temperature, 1);
  lcd.print("C Hum:");
  lcd.print(humidity, 0);

  delay(5000);  // refresh every 5 seconds
}


// evans 