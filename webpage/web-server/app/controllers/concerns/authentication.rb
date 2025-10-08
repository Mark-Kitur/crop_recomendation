module Authentication
  extend ActiveSupport::Concern

  included do
    before_action :set_current_user_from_jwt
  end

  def ensure_user_authenticated
    render json: { error: 'Unauthorized' }, status: :unauthorized unless current_user
  end

  def current_user
    @current_user
  end

  private

  def set_current_user_from_jwt
    token = cookies[:jwt]
    return unless token

    begin
      payload, _header = JWT.decode(token, ENV["SECRET_KEY_BASE"], true, algorithm: 'HS256')
      @current_user = User.find_by(id: payload["user_id"])
    rescue JWT::DecodeError => e
      Rails.logger.warn "JWT Decode Error: #{e.message}"
      @current_user = nil
    end
  end
end