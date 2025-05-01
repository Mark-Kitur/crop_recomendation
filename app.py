from flask import Flask, render_template, request, redirect, url_for
import pickle

app= Flask(__name__)

model= pickle.load(open(r"E:\data sciences\crop_recomendation\crop_model.pkl", "rb"))
crops = pickle.load(open(r"E:\data sciences\crop_recomendation\crop_map.pkl", "rb"))

@app.route('/')

def home():
    return render_template('index.html')

@app.route('/predict', methods=['POST'])
def predict():
    # Get form data and convert to float
    features= [float(x) for x in request.form.values()]
    prediction= model.predict([features])[0]
    # Get the crop name from the mapping
    crop_name = list(crops.keys())[list(crops.values()).index(prediction)]

    return render_template('index.html',crop=crop_name)

if __name__== '__main__':
    app.run(debug=True)