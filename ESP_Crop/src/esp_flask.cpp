// #include <ESP8266WiFi.h>
// #include <ESP8266HTTPClient.h>
// #include <ArduinoJson.h>

// // WiFi credentials
// const char* ssid = "GRACE D";
// const char* password = "grace019";

// // Flask server address (replace with your computer's local IP)
// const char* serverName = "http://192.168.2.171:5000/api/data";

// void setup() {
//   Serial.begin(9600);
//   WiFi.begin(ssid, password);

//   Serial.print("Connecting to WiFi");
//   while (WiFi.status() != WL_CONNECTED) {
//     delay(500);
//     Serial.print(".");
//   }
//   Serial.println("\nConnected!");
// }

// void loop() {
//   if (WiFi.status() == WL_CONNECTED) {
//     WiFiClient client;
//     HTTPClient http;

//     http.begin(client, serverName);
//     http.addHeader("Content-Type", "application/json");

//     // Example sensor values
//     float temp = 25.6;
//     float hum = 70.2;

//     // Create JSON
//     StaticJsonDocument<200> doc;
//     doc["temperature"] = temp;
//     doc["humidity"] = hum;
//     String requestBody;
//     serializeJson(doc, requestBody);

//     int httpResponseCode = http.POST(requestBody);

//     if (httpResponseCode > 0) {
//       String response = http.getString();
//       Serial.println("Server response: " + response);
//     } else {
//       Serial.println("Error sending POST: " + String(httpResponseCode));
//     }

//     http.end();
//   }

//   delay(5000);  // send every 5s
// }
