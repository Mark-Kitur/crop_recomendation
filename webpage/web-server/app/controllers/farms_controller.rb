class FarmsController < ApplicationController
  before_action :ensure_user_authenticated
  before_action :set_farm, only: [:show, :update, :destroy]

  def index
    farms = current_user.farms
    render json: farms
  end

  def show
    render json: @farm
  end

  def create
    farm = current_user.farms.build(farm_params)
    if farm.save
      render json: farm, status: :created
    else
      render json: { errors: farm.errors.full_messages }, status: :unprocessable_entity
    end
  end

  def update
    if @farm.update(farm_params)
      render json: @farm
    else
      render json: { errors: @farm.errors.full_messages }, status: :unprocessable_entity
    end
  end

  def destroy
    @farm.destroy
    render json: { message: "Farm deleted successfully" }, status: :ok
  end

  private

  def set_farm
    @farm = current_user.farms.find(params[:id])
  rescue ActiveRecord::RecordNotFound
    render json: { error: "Farm not found" }, status: :not_found
  end

  def farm_params
    params.require(:farm).permit(:name)
  end
end