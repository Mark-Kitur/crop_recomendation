class DataPoint < ApplicationRecord
  belongs_to :farm
  
  validates :temperature, :humidity, :rainfall, :ph_value,
  :nitrogen, :phosphorus, :potassium, :soil_moisture,
  presence: true
  end