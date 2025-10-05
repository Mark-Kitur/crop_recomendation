class DataPointsController < ApplicationController
  require "onnxruntime"
  before_action :set_farm, only: [:index, :show, :destroy]
  before_action :set_data_point, only: [:show, :destroy]

  MODEL_PATH = Rails.root.join("app/models/ml/model.onnx").to_s
  SESSION = OnnxRuntime::Model.new(MODEL_PATH)

  CROP_LABELS = [
    "rice", "wheat", "maize", "chickpea", "kidneybeans",
    "pigeonpeas", "mothbeans", "mungbean", "blackgram", "lentil",
    "pomegranate", "banana", "mango", "grapes", "watermelon",
    "muskmelon", "apple", "orange", "papaya", "coconut",
    "cotton", "jute", "coffee"
  ]

  # ESP8266 sends sensor data
  def create
    user = User.find_by(device_uid: request.headers['X-DEVICE-UID'])
    return render json: { error: 'Unauthorized device' }, status: :unauthorized unless user

    farm = user.farms.first
    return render json: { error: 'No farm assigned to device' }, status: :unprocessable_entity unless farm

    data_point = farm.data_points.build(data_point_params)

    if data_point.save
      prediction = predict_crop(data_point)
      render json: data_point.as_json.merge(prediction), status: :created
    else
      render json: { errors: data_point.errors.full_messages }, status: :unprocessable_entity
    end
  end

  # For testing via API call
  def run_model
    test_input = { "float_input" => [[134.6, 12.57, 34.46, 67.7, 89.12, 80.67, 20.3]] }
    output = SESSION.predict(test_input)
    prediction = format_prediction(output)

    render json: prediction
  end  

  def index
    render json: @farm.data_points
  end

  def show
    render json: @data_point
  end

  def destroy
    @data_point.destroy
    render json: { message: "Data point deleted successfully" }, status: :ok
  end

  private

  def predict_crop(data_point)
    input = {
      "float_input" => [[
        data_point.nitrogen,
        data_point.phosphorus,
        data_point.potassium,
        data_point.temperature,
        data_point.humidity,
        data_point.ph_value,
        data_point.rainfall
      ]]
    }

    output = SESSION.predict(input)
    format_prediction(output)
  end

  def format_prediction(output)
    prediction_idx = output["output_label"].first
    crop_name = CROP_LABELS[prediction_idx] || "unknown"
    confidence = output["output_probability"].first[prediction_idx]

    { predicted_crop: crop_name, confidence: confidence }
  end

  def set_farm
    @farm = current_user.farms.find(params[:farm_id])
  rescue ActiveRecord::RecordNotFound
    render json: { error: "Farm not found" }, status: :not_found
  end

  def set_data_point
    @data_point = @farm.data_points.find(params[:id])
  rescue ActiveRecord::RecordNotFound
    render json: { error: "Data point not found" }, status: :not_found
  end

  def data_point_params
    params.require(:data_point).permit(
      :temperature, :humidity, :rainfall, :ph_value,
      :nitrogen, :phosphorus, :potassium, :soil_moisture
    )
  end
end