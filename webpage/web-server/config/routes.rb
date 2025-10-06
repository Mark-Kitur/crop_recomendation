Rails.application.routes.draw do
  devise_for :users,
             defaults: { format: :json },
             controllers: {
               sessions: 'users/sessions',
               registrations: 'users/registrations'
             }

  resources :farms do
    resources :data_points, only: [:index, :show, :destroy] # for user/admin views
  end

  # Device sends data here (no farm_id needed)
  resources :data_points, only: [:create]
  # config/routes.rb
  resources :recommendations, only: [:index, :show]

  # config/routes.rb
  post "/predict", to: "data_points#run_model"

  get "/my_data_point", to: "data_points#my_data_point"

  get "/users/me", to: "users#me"  # ✅ new route

  get "/health", to: proc { [200, {}, ["OK"]] }
end