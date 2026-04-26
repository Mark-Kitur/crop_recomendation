#include "Arduino.h"

#define RS485__CRTL 4
#define RXD2 17
#define TXD2 16

HardwareSerial RS485Serial(2);

// 7_in_1 mapping in RS485 communication
const uint8_t CMD[][8] ={
  {0x01,0x03,0x00,0x00,0x00,0x01,0x84,0x0A}, // Humidity
  {0x01,0x03,0x00,0x01,0x00,0x01,0xD5,0xCA}, // Temperature
  {0x01,0x03,0x00,0x02,0x00,0x01,0x25,0xCA}, // Conductivity
  {0x01,0x03,0x00,0x03,0x00,0x01,0x74,0x0A}, // pH
  {0x01,0x03,0x00,0x04,0x00,0x01,0xC5,0xCB}, // Nitrogen
  {0x01,0x03,0x00,0x05,0x00,0x01,0x94,0x0B}, // Phosphorus
  {0x01,0x03,0x00,0x06,0x00,0x01,0x64,0x0B}, // Potassium  
};

const char * LABLS[]={
    "Humidity (%)",
    "Temperature (°C)",
    "Conductivity (µS/cm)",
    "pH",
    "Nitrogen (mg/L)",
    "Phosphorus (mg/L)",
    "Potassium (mg/L)"
};

// Read 7_in_1 sensor data via RS485
int readResponse(uint8_t *buffer, int len, int timeout=200){
    unsigned long start = millis();
    int index = 0;

    while(millis()- start < timeout){
        while(RS485Serial.available()){
            buffer[index++] = RS485Serial.read();
            if(index >= len) return index;
        }
    }
    return index; // Return bytes read (may be less than expected)
}

// Send RS854 Request and read value
bool readRegister(uint8_t cmd[8], float &value, bool scale10=false){
    uint8_t response[7];

    // clear buffer
    while(RS485Serial.available()) RS485Serial.read();

    //transimt 
    digitalWrite(RS485__CRTL, HIGH); 
    delay(2);
    RS485Serial.write(cmd, 8);
    RS485Serial.flush();

    // Switch to receive mode
    digitalWrite(RS485__CRTL, LOW);

    // wait for response
    int n = readResponse(response, 7);

    if (n !=7){
        Serial.println("Time OUT or Incomplete Response");
        return false;
    }

    if (response[0] != cmd[0] || response[1] != cmd[1]){
        Serial.println("Invalid Response Header");
        return false;
    }

    // Extract value (2 bytes)]
    int raw = (response[3] <<8) | response[4];

    if ( raw == 0xFFFF){
        Serial.println("Sensor Error: Invalid Value");
        return false;
    }

    value = scale10 ? raw / 10.0 : raw;
    return true;

}

void setitup(){
    Serial1.begin(9600);
    RS485Serial.begin(4800, SERIAL_8N1, RXD2, TXD2);
    pinMode(RS485__CRTL, OUTPUT);
    digitalWrite(RS485__CRTL, LOW); // Start in receive mode    
   
}


struct RS485Data {
    float humidity;
    float temperature;
    float conductivity;
    float pH;
    float nitrogen;
    float phosphorus;
    float potassium;
};

//extract all 7 values and store in outputs struct
void extractData(struct RS485Data outputs, float *humidity, float *temperature, float *conductivity, float *pH, float *nitrogen, float *phosphorus, float *potassium){
    *humidity = outputs.humidity;
    *temperature = outputs.temperature;
    *conductivity = outputs.conductivity;           
    *pH = outputs.pH;
    *nitrogen = outputs.nitrogen;
    *phosphorus = outputs.phosphorus;
    *potassium = outputs.potassium;     
}

void fetchData() {
    float values[7];
    bool ok;

    for (int i = 0; i < 7; i++) {

        bool scale = (i == 0 || i == 1 || i == 3);  
        // humidity, temperature, pH

        ok = readRegister((uint8_t *)CMD[i], values[i], scale);

        Serial.print(LABLS[i]);
        Serial.print(": ");

        if (ok) {
            Serial.println(values[i]);
        } else {
            values[i] = -1;  // mark error
            Serial.println("Error");
        }

        delay(100);
    }

    Serial.println("-----");
    delay(2000);

    // Store values in outputs struct
    struct RS485Data data = {
        values[0], // humidity
        values[1], // temperature
        values[2], // conductivity
        values[3], // pH
        values[4], // nitrogen
        values[5], // phosphorus
        values[6]  // potassium
    };
    float humidity, temperature, conductivity, pH, nitrogen, phosphorus, potassium;
    extractData(data, &humidity, &temperature, &conductivity, &pH, &nitrogen, &phosphorus, &potassium);

}
