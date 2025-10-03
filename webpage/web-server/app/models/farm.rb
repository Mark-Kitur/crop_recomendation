class Farm < ApplicationRecord
  belongs_to :user
  has_many :data_points, dependent: :destroy
end