#include <Arduino.h>
#include <LiquidCrystal.h>
#include <DHT.h>



#include "model.h" 
#include "7_in_1.h"

// #include <ESP8266WiFi.h>         
// #include <ESP8266HTTPClient.h>   


// WiFi credentials
const char* ssid = "Blue Ocean AP";
const char* password = "EnjoyYourStay";

const char* serverName = "http://10.125.163.244:3000/data_points";

int pin=5;
// LCD setup
const int RS = 4, EN = 0, d4 = 14, d5 = 12, d6 = 13, d7 = 15;   
int soil_moisture=A0;
LiquidCrystal lcd(RS, EN, d4, d5, d6, d7);
//0704554187
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




void setup() {
  Serial.begin(9600);
  pinMode(soil_moisture, INPUT);
  dht.begin();
  lcd.begin(16, 2);
  lcd.print("Smart Farming");
  delay(2000);
  lcd.clear();
  randomSeed(analogRead(A0));  

  // initilize 7_in_1 sensor
  setitup();

  // //  Connect to WiFi
  // WiFi.begin(ssid, password);
  // Serial.print("Connecting to WiFi");
  // while (WiFi.status() != WL_CONNECTED) {
  //   delay(1000);
  //   Serial.print(".");
  // }
  // Serial.println("\nConnected to WiFi!");
  // Serial.print("IP Address: ");
  // Serial.println(WiFi.localIP());
}

void loop() {
  // Collect sensor data
  // float humidity = dht.readHumidity();
  // float temperature = dht.readTemperature();

  // float mos=analogRead(soil_moisture); // just to stabilize reading
  // Serial.print("Soil Moisture: ");
  // Serial.println(mos);
  // Serial.println();


  // if (isnan(humidity) || isnan(temperature)) {
  //   Serial.println("Failed to read from DHT sensor!");
  //   lcd.clear();
  //   lcd.setCursor(0, 0);
  //   lcd.print("DHT Error!");
  //   delay(2000);
  //   return;
  // }

  // fetch  data from 7 in 1 sensor
  RS485Data data = fetchData();

  // Predict crop
 float input[7] = {
    data.nitrogen,
    data.phosphorus,
    data.potassium,
    data.temperature,
    data.humidity,
    data.pH,
    data.conductivity
};

int predClass = RF.predict(input); 
  const char* crop = crops[predClass];

  // Print on Serial Monitor
  Serial.print("Nitrogen:");
  Serial.println(data.nitrogen );
  Serial.print("Phosporus: ");
  Serial.println(data.phosphorus);
  Serial.print("Potasium: ");
  Serial.println(data.potassium );
  Serial.print("Temperature: ");
  Serial.println(data.temperature);
  Serial.print("Humidity: ");
  Serial.println(data.humidity);
  Serial.print("pH: ");
  Serial.println(data.pH);
  Serial.print("Rainfall: ");
  Serial.println(data.conductivity  );
  Serial.println("-----\n");
  Serial.print("Predicted Crop: ");
  Serial.println(crop);
  Serial.println();
  Serial.println();
  Serial.println();
  


  // Display on LCD
  lcd.clear();
  lcd.setCursor(0, 0);
  lcd.print("Crop: ");
  lcd.print(crop);
  lcd.setCursor(0, 1);
  lcd.print("T:");
  lcd.print(data.temperature, 1);
  lcd.print("C H:");
  lcd.print(data.humidity, 0);


   delay(5000);
}

