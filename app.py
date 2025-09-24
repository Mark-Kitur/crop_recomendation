from flask import Flask, render_template, request, redirect, url_for
import joblib

app = Flask(__name__)

# Load models and data
model = joblib.load(open("crop_model.pkl", "rb"))
crops = joblib.load(open("crop_map.pkl", "rb"))
final_dict = joblib.load(open("crop_thresholds.pkl", "rb"))


@app.route('/')
def home():
    return render_template('home.html')


@app.route('/predict', methods=['GET', 'POST'])
def predict():
    if request.method == 'POST':
        features = [float(x) for x in request.form.values()]
        prediction = model.predict([features])[0]
        crop_name = list(crops.keys())[list(crops.values()).index(prediction)]
        return render_template('pred.html', crop=crop_name)
    return render_template('pred.html')


@app.route('/recommend', methods=['GET', 'POST'])
def recommend():
    crop_list = list(final_dict.keys())
    if request.method == 'POST':
        crop = request.form["crop"]
        crop_optimums = final_dict.get(crop)

        if not crop_optimums:
            return f"No data found for {crop}"

        user_inputs = {
            "Nitrogen": float(request.form["nitrogen"]),
            "Phosphorus": float(request.form["phosphorus"]),
            "Potassium": float(request.form["potassium"]),
            "Temperature": float(request.form["temperature"]),
            "Humidity": float(request.form["humidity"]),
            "pH_Value": float(request.form["ph"]),
            "Rainfall": float(request.form["rainfall"])
        }

        recommendations = {}
        for key, user_val in user_inputs.items():
            optimum = crop_optimums.get(key)
            if optimum is None:
                continue
            recommendations.update(generate_advice(key,user_val,optimum))

        return render_template("result.html", crop=crop, recommendations=recommendations)

    return render_template("recommend.html", crops=crop_list)

def generate_advice(nutrient, user_val, optimum):
    lower = optimum * 0.8
    upper = optimum * 1.2
    advice = {}

    # Nutrients advice
    if nutrient in ["Nitrogen", "Phosphorus", "Potassium"]:
        fert = {
            "Nitrogen": "Urea (46% N)",
            "Phosphorus": "DAP (Diammonium Phosphate, 46% P, 18% N)",
            "Potassium": "MOP (Muriate of Potash, 60% K2O)"
        }[nutrient]

        if user_val < lower:
            advice[nutrient] = f"{nutrient} is low (Current: {user_val}, Optimal: {optimum}). Apply {fert} around {round(lower,1)}–{round(upper,1)} kg/acre."
        elif user_val > upper:
            advice[nutrient] = f"{nutrient} is high (Current: {user_val}, Optimal: {optimum}). Avoid extra application of {fert}."
        else:
            advice[nutrient] = f"{nutrient} is optimal (Current: {user_val})."

    # Environmental factors
    elif nutrient == "Temperature":
        if user_val < lower:
            advice[nutrient] = f"Temperature too low ({user_val}°C). Consider greenhouse or wait for warmer season."
        elif user_val > upper:
            advice[nutrient] = f"Temperature too high ({user_val}°C). Use shade nets or increase irrigation."
        else:
            advice[nutrient] = f"Temperature is optimal ({user_val}°C)."

    elif nutrient == "Humidity":
        if user_val < lower:
            advice[nutrient] = f"Humidity too low ({user_val}%). Use mulching or more irrigation."
        elif user_val > upper:
            advice[nutrient] = f"Humidity too high ({user_val}%). Improve ventilation or drainage."
        else:
            advice[nutrient] = f"Humidity is optimal ({user_val}%)."

    elif nutrient == "pH_Value":
        if user_val < lower:
            advice[nutrient] = f"Soil too acidic (pH {user_val}). Apply lime or organic matter."
        elif user_val > upper:
            advice[nutrient] = f"Soil too alkaline (pH {user_val}). Apply gypsum or organic compost."
        else:
            advice[nutrient] = f"Soil pH is optimal (pH {user_val})."

    elif nutrient == "Rainfall":
        if user_val < lower:
            advice[nutrient] = f"Rainfall too low ({user_val} mm). Use irrigation or water harvesting."
        elif user_val > upper:
            advice[nutrient] = f"Rainfall too high ({user_val} mm). Improve drainage or use raised beds."
        else:
            advice[nutrient] = f"Rainfall is optimal ({user_val} mm)."

    return advice

if __name__ == '__main__':
    app.run(debug=True)
