class Users::SessionsController < Devise::SessionsController
  respond_to :json 

  def me
    render json: current_user
  end

  private

  def respond_with(resource, _opts = {})
    payload = {
      user_id: resource.id,
      exp: 24.hours.from_now.to_i
    }

    token = JWT.encode(payload, ENV["SECRET_KEY_BASE"], 'HS256')

    cookies[:jwt] = {
      value: token,
      httponly: true,
      secure: Rails.env.production?,
      same_site: Rails.env.production? ? :none : :lax
    }

    render json: { message: 'Logged in successfully', user: resource }, status: :ok
  end

  def respond_to_on_destroy
    cookies.delete(:jwt, secure: Rails.env.production?, same_site: Rails.env.production? ? :none : :lax)
    render json: { message: 'Logged out successfully' }, status: :ok
  end  
end