from flask import Flask, request, jsonify

app = Flask(__name__)

@app.route('/data_points', methods=['POST'])
def receive_data():
    print("---- HEADERS ----")
    print(request.headers)
    print("---- RAW BODY ----")
    print(request.data)
    print("---- PARSED JSON ----")

    try:
        data = request.get_json(force=True)
        print("Received JSON:", data)
        return jsonify({"status": "success", "received": data}), 200
    except Exception as e:
        print("Error parsing JSON:", e)
        return jsonify({"status": "error", "message": str(e)}), 400

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=3000)
