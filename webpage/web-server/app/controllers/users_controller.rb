class UsersController < ApplicationController
  before_action :ensure_user_authenticated

  def me
    render json: current_user, status: :ok
  end
end