#include <Arduino.h>
#include <LiquidCrystal.h>
#include <DHT.h>
#include "model.h" 
  

// trigger pin
int button_pin=16;
/// LCD setup
const int RS = 4, EN = 0, d4 = 14, d5 = 12, d6 = 13, d7 = 15;   
LiquidCrystal lcd(RS, EN, d4, d5, d6, d7);

// DHT11 setup
#define DHTPIN 2     
#define DHTTYPE 11    
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
  return random(minVal * 10, maxVal * 10) / 10.0;
}

void setup() {
  pinMode(button_pin,INPUT_PULLUP);
  Serial.begin(9600);
  dht.begin();
  lcd.begin(16, 2);
  lcd.print("Smart Farming");
  delay(2000);
  lcd.clear();
  randomSeed(analogRead(A0));  
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

  delay(5000);  
}


