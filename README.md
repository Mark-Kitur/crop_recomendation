Smart Crop Recommendation System


**Overview**

This project implements a Crop Recommendation System that suggests the most suitable crop to grow based on soil nutrients and environmental conditions. It combines Machine Learning (ML) with IoT (ESP8266 microcontroller) to support precision agriculture.
The workflow:
Collected and preprocessed agricultural data (soil nutrients & climate).
Trained a Random Forest Classifier model to recommend crops.
 Built a Flask web application for user-friendly crop prediction and farming advice.
 Converted the trained ML model to C code (micromlgen) and deployed it on an ESP8266 NodeMCU microcontroller.

Dataset
The dataset includes soil and environmental features:
N: Nitrogen content ratio in soil
P: Phosphorus content ratio in soil
K: Potassium content ratio in soil
Temperature: in °C
Humidity: in %
pH: Soil acidity/alkalinity
Rainfall: in mm
Tech Stack
Machine Learning: Random Forest Classifier (scikit-learn)
Web Framework: Flask (Python)
Frontend: HTML, CSS (simple UI for predictions)
Microcontroller: ESP8266 (NodeMCU)
TinyML Library: micromlgen for C model export

Flask Web App
The web app allows users to:
Input soil & environmental parameters.
Get the best crop recommendation.
Receive advice on optimizing conditions (nutrients, pH, rainfall, etc.).

ESP8266 Deployment
The trained Random Forest model was converted into C code.
Deployed on ESP8266 NodeMCU with:
DHT11 sensor for temperature & humidity.
LCD display to show predicted crop.
Random values (for testing) simulating N, P, K, pH, rainfall.
Feel free to fork, improve, or suggest enhancements. Together, let’s make farming smarter


