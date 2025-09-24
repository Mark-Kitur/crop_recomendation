from flask import *
import joblib

app = Flask(__name__)
app.secret_key = "vsdvsdw4teryteYUYT&^T*^&)" # We can change based on what we agree the secret key to be

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
        try:
            # Convert all inputs to float
            features = [float(x) for x in request.form.values()]
        except ValueError:
            flash("⚠️ Please enter only numbers (integer or float).")
            return redirect(url_for("predict"))

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
            flash(f"No data found for {crop}")
            return redirect(url_for("recommend"))

        user_inputs = {}
        try:
            user_inputs = {
                "Nitrogen": float(request.form["nitrogen"]),
                "Phosphorus": float(request.form["phosphorus"]),
                "Potassium": float(request.form["potassium"]),
                "Temperature": float(request.form["temperature"]),
                "Humidity": float(request.form["humidity"]),
                "pH_Value": float(request.form["ph"]),
                "Rainfall": float(request.form["rainfall"])
            }
        except ValueError:
            flash("⚠️ Please enter only numbers (integer or float).")
            return redirect(url_for("recommend"))

        recommendations = {}
        for key, user_val in user_inputs.items():
            optimum = crop_optimums.get(key)
            if optimum is None:
                continue
            lower = optimum * 0.9
            upper = optimum * 1.1

            if user_val < lower:
                recommendations[key] = f"Increase {key} (Current: {user_val}, Optimal: {optimum})"
            elif user_val > upper:
                recommendations[key] = f"Reduce {key} (Current: {user_val}, Optimal: {optimum})"
            else:
                recommendations[key] = f"{key} is optimal (Current: {user_val})"

        return render_template("result.html", crop=crop, recommendations=recommendations)

    return render_template("recommend.html", crops=crop_list)


if __name__ == '__main__':
    app.run(debug=True)
