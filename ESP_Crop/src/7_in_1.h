#ifndef SENSOR_7_IN_1_H
#define SENSOR_7_IN_1_H

#include "Arduino.h"

#define RS485_CTRL 4
#define RXD2 17
#define TXD2 16

HardwareSerial RS485Serial(2);

// Modbus Request Commands
const uint8_t CMD[][8] = {
  {0x01,0x03,0x00,0x00,0x00,0x01,0x84,0x0A}, 
  {0x01,0x03,0x00,0x01,0x00,0x01,0xD5,0xCA}, 
  {0x01,0x03,0x00,0x02,0x00,0x01,0x25,0xCA}, 
  {0x01,0x03,0x00,0x03,0x00,0x01,0x74,0x0A}, 
  {0x01,0x03,0x00,0x04,0x00,0x01,0xC5,0xCB}, 
  {0x01,0x03,0x00,0x05,0x00,0x01,0x94,0x0B}, 
  {0x01,0x03,0x00,0x06,0x00,0x01,0x64,0x0B}
};

const char * LABELS[]={
    "Humidity (%)",
    "Temperature (°C)",
    "Conductivity (µS/cm)",
    "pH",
    "Nitrogen (mg/L)",
    "Phosphorus (mg/L)",
    "Potassium (mg/L)"
};

struct RS485Data {
    float humidity;
    float temperature;
    float conductivity;
    float pH;
    float nitrogen;
    float phosphorus;
    float potassium;
};

// ---------------- FUNCTIONS -----------------

int readResponse(uint8_t *buffer, int len, int timeout=200) {
    unsigned long start = millis();
    int index = 0;

    while (millis() - start < timeout) {
        while (RS485Serial.available()) {
            buffer[index++] = RS485Serial.read();
            if (index >= len) return index;
        }
    }
    return index;
}

bool readRegister(uint8_t cmd[8], float &value, bool scale10=false) {
    uint8_t response[7];

    while (RS485Serial.available()) RS485Serial.read();

    digitalWrite(RS485_CTRL, HIGH);
    delay(2);
    RS485Serial.write(cmd, 8);
    RS485Serial.flush();

    digitalWrite(RS485_CTRL, LOW);

    int n = readResponse(response, 7);

    if (n != 7) {
        Serial.println("Timeout or incomplete response!");
        return false;
    }

    int raw = (response[3] << 8) | response[4];
    value = scale10 ? raw / 10.0 : raw;
    return true;
}

void setitup() {
    RS485Serial.begin(4800, SERIAL_8N1, RXD2, TXD2);
    pinMode(RS485_CTRL, OUTPUT);
    digitalWrite(RS485_CTRL, LOW);
}

RS485Data fetchData() {
    RS485Data data;
    float values[7];

    for (int i = 0; i < 7; i++) {
        bool scale = (i == 0 || i == 1 || i == 3);
        bool ok = readRegister((uint8_t*)CMD[i], values[i], scale);

        Serial.print(LABELS[i]);
        Serial.print(": ");

        if (ok)
            Serial.println(values[i]);
        else {
            Serial.println("ERR");
            values[i] = -1;
        }

        delay(100);
    }

    data.humidity = values[0];
    data.temperature = values[1];
    data.conductivity = values[2];
    data.pH = values[3];
    data.nitrogen = values[4];
    data.phosphorus = values[5];
    data.potassium = values[6];

    return data;
}

#endif