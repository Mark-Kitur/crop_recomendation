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
  float humidity = dht.readHumidity();
  float temperature = dht.readTemperature();

  float mos=analogRead(soil_moisture); // just to stabilize reading
  Serial.print("Soil Moisture: ");
  Serial.println(mos);
  Serial.println();


  if (isnan(humidity) || isnan(temperature)) {
    Serial.println("Failed to read from DHT sensor!");
    lcd.clear();
    lcd.setCursor(0, 0);
    lcd.print("DHT Error!");
    delay(2000);
    return;
  }

  // fetch  data from 7 in 1 sensor
float humidity, temperature, conductivity, pH, nitrogen, phosphorus, potassium;
extractData(data, &humidity, &temperature, &conductivity, &pH, &nitrogen, &phosphorus, &potassium);



  // Predict crop
  int predClass = RF.predict(nitrogen, phosphorus, potassium, humidity, temperature, pH, conductivity);
  const char* crop = crops[predClass];

  // Print on Serial Monitor
  Serial.print("Nitrogen:");
  Serial.println(data[4]);
  Serial.print("Phosporus: ");
  Serial.println(data[5]);
  Serial.print("Potasium: ");
  Serial.println(data[6]);
  Serial.print("Temperature: ");
  Serial.println(temperature);
  Serial.print("Humidity: ");
  Serial.println(humidity);
  Serial.print("pH: ");
  Serial.println(data[3]);
  Serial.print("Rainfall: ");
  Serial.println(data[2]);
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
  lcd.print(temperature, 1);
  lcd.print("C H:");
  lcd.print(humidity, 0);

  // // Send data to web
  // int button = analogRead(A0);
  // //Serial.println(button);
  // if (button >500){
  //   //Serial.println(button);
  //   sendWeb(temperature,humidity,Rainfall,pH,N,P,K);
  // }
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

   delay(5000);
}

