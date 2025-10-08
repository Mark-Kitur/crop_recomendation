class DataPoint < ApplicationRecord
  belongs_to :farm
  
  validates :farm_id, presence: true
  validates :temperature, :humidity, :rainfall, :ph_value,
  :nitrogen, :phosphorus, :potassium,
  presence: true
end