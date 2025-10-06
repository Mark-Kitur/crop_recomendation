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

# app/controllers/concerns/jwt_cookie.rb
# module JwtCookie
#   extend ActiveSupport::Concern

#   def set_jwt_cookie(user)
#     token = Warden::JWTAuth::UserEncoder.new.call(user, :user, nil).first
#     cookies.signed[:jwt] = {
#       value: token,
#       httponly: true,
#       secure: Rails.env.production?,
#       same_site: :lax
#     }
#   end

#   def clear_jwt_cookie
#     cookies.delete(:jwt)
#   end
# end
