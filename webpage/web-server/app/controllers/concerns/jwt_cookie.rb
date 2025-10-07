# app/controllers/concerns/jwt_cookie.rb
module JwtCookie
  extend ActiveSupport::Concern

  COOKIE_NAME = :jwt

  included do
    after_action :set_jwt_cookie, only: [:create]
  end

  private

  def set_jwt_cookie
    return unless request.env['warden-jwt_auth.token']

    cookies.signed[COOKIE_NAME] = {
      value: request.env['warden-jwt_auth.token'],
      httponly: true,
      secure: Rails.env.production?,
      same_site: :lax,
      path: '/', # ensures cookie is sent for all routes
      domain: cookie_domain # dynamically set based on environment
    }
  end

  def clear_jwt_cookie
    cookies.delete(COOKIE_NAME, path: '/', domain: cookie_domain)
    cookies.delete(COOKIE_NAME, path: '/')
    cookies.delete(COOKIE_NAME)
  end

  def cookie_domain
    if Rails.env.production?
      '.yourdomain.com' # ← replace this with your real domain (e.g. ".jeliblog.netlify.app" if custom domain)
    else
      nil # localhost doesn’t need a domain
    end
  end
end