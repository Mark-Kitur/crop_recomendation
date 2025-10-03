class Users::RegistrationsController < Devise::RegistrationsController
  respond_to :json

  private

  # Permit extra fields like device_uid
  def sign_up_params
    params.require(:user).permit(:email, :password, :password_confirmation, :device_uid)
  end

  def account_update_params
    params.require(:user).permit(:email, :password, :password_confirmation, :current_password, :device_uid)
  end

  def respond_with(resource, _opts = {})
    if resource.persisted?
      render json: { message: 'Signed up successfully', user: resource }, status: :ok
    else
      render json: { errors: resource.errors.full_messages }, status: :unprocessable_entity
    end
  end
end