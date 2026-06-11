#include <Arduino.h>
#include <LiquidCrystal_I2C.h>
#include <DHT.h>

#include "model.h"
#include "7_in_1.h"   // includes RS485 support

// set the LCD number of columns and rows
const int lcdColumns = 16;
const int lcdRows = 2;

LiquidCrystal_I2C lcd(0x27, lcdColumns, lcdRows);  

#define DHTPIN 2
#define DHTTYPE DHT11
DHT dht(DHTPIN, DHTTYPE);

Eloquent::ML::Port::RandomForest RF;

const char* crops[] = {
  "Chickpea","Watermelon","Jute","Muskmelon",
  "Kidneybeans","Mothbeans","Rice","Pomegranate",
  "Maize","Pigeon peas","Grapes","Mango",
  "Coconut","Coffee","Cotton","Apple",
  "Mungbeans","Blackgram","Orange","Lentil",
  "Papaya","Banana"
};

void setup() {
  Serial.begin(9600);
  dht.begin();
  lcd.init();
  lcd.backlight();

  lcd.setCursor(0,0);
  lcd.print("Smart Farming");
  delay(1500);
  lcd.clear();

  setitup();  // RS485 init
}

void loop() {

  RS485Data data = fetchData();

  float input[7] = {
    data.nitrogen,
    data.phosphorus,
    data.potassium,
    data.temperature,
    data.humidity,
    data.pH,
    data.conductivity
  };

  int pred = RF.predict(input);
  const char* crop = crops[pred];

  Serial.println("\nPredicted Crop: ");
  Serial.println(crop);

  lcd.clear();
  lcd.setCursor(0,0);
  lcd.print("Crop:");

  lcd.setCursor(0,1);
  lcd.print(crop);
  

  delay(3000);
}