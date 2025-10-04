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

  get "/health", to: proc { [200, {}, ["OK"]] }
end