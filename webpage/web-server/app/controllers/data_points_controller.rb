class DataPointsController < ApplicationController
  skip_before_action :authenticate_user!, only: [:create] # device auth is via UID
  before_action :set_farm, only: [:index, :show, :destroy]
  before_action :set_data_point, only: [:show, :destroy]

  # For ESP8266
  def create
    user = User.find_by(device_uid: request.headers['X-DEVICE-UID'])
    return render json: { error: 'Unauthorized device' }, status: :unauthorized unless user

    # assume 1 device → 1 farm (take the first farm)
    farm = user.farms.first
    return render json: { error: 'No farm assigned to device' }, status: :unprocessable_entity unless farm

    data_point = farm.data_points.build(data_point_params)

    if data_point.save
      render json: data_point, status: :created
    else
      render json: { errors: data_point.errors.full_messages }, status: :unprocessable_entity
    end
  end

  # For dashboard/admin
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