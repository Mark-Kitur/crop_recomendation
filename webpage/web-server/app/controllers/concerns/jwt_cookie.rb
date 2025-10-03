module JwtCookie
  extend ActiveSupport::Concern

  included do
    after_action :set_jwt_cookie
  end

  private

  def set_jwt_cookie
    return unless request.env['warden-jwt_auth.token']

    cookies.signed[:jwt] = {
      value: request.env['warden-jwt_auth.token'],
      httponly: true,
      secure: Rails.env.production?,
      same_site: :lax
    }
  end

  def clear_jwt_cookie
    cookies.delete(:jwt, httponly: true, secure: Rails.env.production?, same_site: :lax)
  end
end