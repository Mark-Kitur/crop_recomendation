Rails.application.routes.draw do
  devise_for :users,
             defaults: { format: :json },
             controllers: {
               sessions: 'users/sessions',
               registrations: 'users/registrations'
             }

  resources :farms do
    resources :data_points, only: [:index, :show, :create, :destroy]
  end

  get "/health", to: proc { [200, {}, ["OK"]] }
end