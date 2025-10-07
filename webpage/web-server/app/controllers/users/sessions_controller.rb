class Users::SessionsController < Devise::SessionsController
  include JwtCookie

  respond_to :json

  def destroy
    super do
      clear_jwt_cookie
    end
  end

  private

  def respond_with(resource, _opts = {})
    render json: { message: 'Logged in successfully.', user: resource }, status: :ok
  end

  def respond_to_on_destroy
    render json: { message: 'Logged out successfully.' }, status: :ok
  end
end