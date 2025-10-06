class RecommendationsController < ApplicationController
  #skip_before_action :authenticate_user!

  RECOMMENDATION_DATA = {
    'Apple' => { Nitrogen: 59.5, Rainfall: 87.47, Humidity: 83.93, Phosphorus: 107.5,
                 Temperature: 23.97, Potassium: 125.0, pH_Value: 6.29 },
    'Banana' => { Nitrogen: 59.5, Phosphorus: 69.5, Rainfall: 61.56, Humidity: 73.01,
                  Potassium: 35.5, Temperature: 26.99, pH_Value: 6.39 },
    'Blackgram' => { Nitrogen: 41.5, Rainfall: 61.40, Humidity: 59.95,
                     Phosphorus: 59.5, pH_Value: 6.51, Potassium: 34.5, Temperature: 26.37 },
    # … add other crops
  }.freeze

  def show
    crop = params[:id]
    optimums = RECOMMENDATION_DATA[crop]

    return render json: { error: "Crop not found" }, status: :not_found unless optimums

    # 🧠 Fetch the latest datapoint for the current user or farm
    # Adjust the query based on your actual schema
    latest_data_point = DataPoint.order(created_at: :desc).first

    unless latest_data_point
      return render json: { error: "No data points available" }, status: :not_found
    end

    # Map DB fields to the same nutrient keys used above
    user_inputs = {
      "Nitrogen" => latest_data_point.nitrogen,
      "Phosphorus" => latest_data_point.phosphorus,
      "Potassium" => latest_data_point.potassium,
      "Temperature" => latest_data_point.temperature,
      "Humidity" => latest_data_point.humidity,
      "pH_Value" => latest_data_point.ph_value,
      "Rainfall" => latest_data_point.rainfall
    }

    recommendations = {}

    user_inputs.each do |nutrient, user_val|
      optimum = optimums[nutrient.to_sym]
      next unless optimum
      recommendations[nutrient] = generate_advice(nutrient, user_val, optimum)
    end

    render json: {
      crop: crop,
      latest_data: user_inputs,
      recommendations: recommendations
    }
  end

  private

  def generate_advice(nutrient, user_val, optimum)
    lower = optimum * 0.8
    upper = optimum * 1.2

    fertilizer = {
      "Nitrogen" => "Urea (46% N)",
      "Phosphorus" => "DAP (Diammonium Phosphate, 46% P, 18% N)",
      "Potassium" => "MOP (Muriate of Potash, 60% K2O)"
    }[nutrient]

    case nutrient
    when "Nitrogen", "Phosphorus", "Potassium"
      if user_val < lower
        "#{nutrient} is low (#{user_val}, Optimal: #{optimum}). Apply #{fertilizer} around #{lower.round(1)}–#{upper.round(1)} kg/acre."
      elsif user_val > upper
        "#{nutrient} is high (#{user_val}, Optimal: #{optimum}). Avoid extra application of #{fertilizer}."
      else
        "#{nutrient} is optimal (#{user_val})."
      end
    when "Temperature"
      if user_val < lower
        "Temperature too low (#{user_val}°C). Consider greenhouse or wait for warmer season."
      elsif user_val > upper
        "Temperature too high (#{user_val}°C). Use shade nets or increase irrigation."
      else
        "Temperature is optimal (#{user_val}°C)."
      end
    when "Humidity"
      if user_val < lower
        "Humidity too low (#{user_val}%). Use mulching or more irrigation."
      elsif user_val > upper
        "Humidity too high (#{user_val}%). Improve ventilation or drainage."
      else
        "Humidity is optimal (#{user_val}%)."
      end
    when "pH_Value"
      if user_val < lower
        "Soil too acidic (pH #{user_val}). Apply lime or organic matter."
      elsif user_val > upper
        "Soil too alkaline (pH #{user_val}). Apply gypsum or organic compost."
      else
        "Soil pH is optimal (pH #{user_val})."
      end
    when "Rainfall"
      if user_val < lower
        "Rainfall too low (#{user_val} mm). Use irrigation or water harvesting."
      elsif user_val > upper
        "Rainfall too high (#{user_val} mm). Improve drainage or use raised beds."
      else
        "Rainfall is optimal (#{user_val} mm)."
      end
    else
      "No data available for #{nutrient}."
    end
  end
end

# class RecommendationsController < ApplicationController
#   #skip_before_action :authenticate_user!

#   RECOMMENDATION_DATA = {
#     'Apple' => { Nitrogen: 59.5, Rainfall: 87.46939849853516, Humidity: 83.93045806884766, Phosphorus: 107.5,
#                  Temperature: 23.97402000427246, Potassium: 125.0, pH_Value: 6.288139581680298 },
#     'Banana' => { Nitrogen: 59.5, Phosphorus: 69.5, Rainfall: 61.55639457702637, Humidity: 73.00811004638672,
#                   Potassium: 35.5, Temperature: 26.99626064300537, pH_Value: 6.392236232757568 },
#     'Blackgram' => { Nitrogen: 41.5, Rainfall: 61.39914321899414, Humidity: 59.954586029052734,
#                      Phosphorus: 59.5, pH_Value: 6.507127285003662, Potassium: 34.5, Temperature: 26.3730411529541 },
#     'ChickPea' => { Nitrogen: 59.5, Rainfall: 60.83279037475586, Humidity: 27.68508243560791,
#                     Potassium: 62.5, Phosphorus: 107.0, Temperature: 26.37205410003662, pH_Value: 6.02460789680481 },
#     'Coconut' => { Nitrogen: 59.5, Rainfall: 100.76889038085938, Humidity: 73.5538101196289,
#                    Phosphorus: 43.5, Temperature: 25.230430603027344, pH_Value: 6.443477392196655, Potassium: 35.5 },
#     'Coffee' => { Nitrogen: 59.5, Phosphorus: 43.5, Rainfall: 100.3416976928711, Humidity: 70.30092239379883,
#                   Potassium: 35.5, Temperature: 26.99448871612549, pH_Value: 6.272847414016724 },
#     'Cotton' => { Nitrogen: 59.5, Phosphorus: 64.5, Rainfall: 61.192270278930664, Humidity: 73.66732025146484,
#                   Potassium: 30.0, Temperature: 26.240188598632812, pH_Value: 6.331401824951172 },
#     'Grapes' => { Nitrogen: 59.5, Rainfall: 87.51620483398438, Humidity: 74.98869705200195,
#                   Phosphorus: 107.5, Temperature: 24.031827926635742, Potassium: 125.0, pH_Value: 6.286441087722778 },
#     'Jute' => { Nitrogen: 59.5, Phosphorus: 58.5, Rainfall: 143.48401641845703, Temperature: 26.379621505737305,
#                 Potassium: 35.5, pH_Value: 6.04501485824585, Humidity: 74.60461807250977 },
#     'KidneyBeans' => { Nitrogen: 59.5, Rainfall: 74.92848205566406, Humidity: 27.68508243560791,
#                        Potassium: 50.0, Temperature: 25.42708396911621, Phosphorus: 80.5, pH_Value: 6.02460789680481 },
#     'Lentil' => { Nitrogen: 59.0, Rainfall: 59.73252868652344, Temperature: 26.717247009277344, Phosphorus: 59.5,
#                   Humidity: 60.10750961303711, pH_Value: 6.461080551147461, Potassium: 34.5 },
#     'Maize' => { Nitrogen: 59.5, Phosphorus: 58.5, Rainfall: 88.73199081420898, Humidity: 66.62316513061523,
#                  Temperature: 26.615827560424805, Potassium: 25.5, pH_Value: 7.006514549255371 },
#     'Mango' => { Nitrogen: 59.5, Rainfall: 82.25465393066406, Humidity: 58.03376388549805,
#                  Temperature: 26.99448871612549, Phosphorus: 54.5, Potassium: 25.5, pH_Value: 6.564024925231934 },
#     'MothBeans' => { Nitrogen: 59.5, Rainfall: 61.39914321899414, Temperature: 26.868852615356445,
#                      Phosphorus: 58.5, Humidity: 60.080631256103516, pH_Value: 6.486391544342041, Potassium: 25.5 },
#     'MungBean' => { Nitrogen: 59.5, Rainfall: 60.33355712890625, Temperature: 26.99448871612549,
#                     Phosphorus: 59.5, Humidity: 74.54708862304688, Potassium: 35.0, pH_Value: 6.461080551147461 },
#     'Muskmelon' => { Nitrogen: 59.5, Phosphorus: 69.0, Humidity: 73.5538101196289, Temperature: 27.015381813049316,
#                      pH_Value: 6.729002237319946, Rainfall: 38.8426456451416, Potassium: 40.0 },
#     'Orange' => { Nitrogen: 59.5, Rainfall: 86.88021850585938, Humidity: 72.93193054199219, Phosphorus: 49.5,
#                   Potassium: 25.5, pH_Value: 6.472870588302612, Temperature: 25.34572696685791 },
#     'Papaya' => { Nitrogen: 59.5, Phosphorus: 69.0, Rainfall: 61.248046875, Temperature: 26.99626064300537,
#                   Humidity: 73.5538101196289, Potassium: 39.0, pH_Value: 6.495797872543335 },
#     'PigeonPeas' => { Nitrogen: 59.5, Rainfall: 82.10353469848633, Humidity: 56.16206169128418,
#                       Phosphorus: 55.5, Temperature: 26.528847694396973, Potassium: 25.5, pH_Value: 6.352273225784302 },
#     'Pomegranate' => { Nitrogen: 59.5, Rainfall: 93.50982666015625, Humidity: 71.8009147644043,
#                        Phosphorus: 44.0, pH_Value: 6.528604507446289, Potassium: 35.5, Temperature: 25.03185749053955 },
#     'Rice' => { Nitrogen: 59.5, Phosphorus: 64.0, Rainfall: 146.87425231933594, Temperature: 26.298786163330078,
#                 Potassium: 35.5, pH_Value: 6.0547356605529785, Humidity: 74.91326904296875 },
#     'Watermelon' => { Nitrogen: 59.5, Phosphorus: 45.5, Humidity: 74.1825942993164, Potassium: 40.0,
#                       Temperature: 26.997678756713867, Rainfall: 60.60572814941406, pH_Value: 6.542590141296387 }
#   }.freeze

#   # GET /recommendations
#   def index
#     render json: RECOMMENDATION_DATA.keys
#   end

#   # GET /recommendations/:id
#   def show
#     crop = params[:id]
#     recommendation = RECOMMENDATION_DATA[crop]
#     if recommendation
#       render json: recommendation
#     else
#       render json: { error: "Crop not found" }, status: :not_found
#     end
#   end
# end