class User < ApplicationRecord
  devise :database_authenticatable, :registerable,
  :recoverable, :rememberable, :validatable,
  :jwt_authenticatable, jwt_revocation_strategy: JwtDenylist
  
  has_many :farms, dependent: :destroy
  validates :device_uid, presence: true, uniqueness: true
end