class Users::RegistrationsController < Devise::RegistrationsController
  skip_before_action :verify_authenticity_token
  respond_to :json

  def create
    Rails.logger.debug "Incoming registration params: #{params.inspect}"
    super
  end

  private

  def respond_with(resource, _opts = {})
    if resource.persisted?
      render json: { message: 'User registered successfully', user: resource }, status: :created
    else
      render json: { errors: resource.errors.full_messages }, status: :unprocessable_entity
    end
  end

  def sign_up_params
    params.require(:user).permit(:email, :username, :password, :password_confirmation)
  end
end