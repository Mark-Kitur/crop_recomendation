class UsersController < ApplicationController
  before_action :authenticate_user!

  def me
    render json: current_user, status: :ok
  end
end