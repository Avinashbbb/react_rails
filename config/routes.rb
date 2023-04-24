Rails.application.routes.draw do
  use_doorkeeper
  devise_for :users, only: [:sessions, :passwords]

  root 'home#index'

  mount RailsAdmin::Engine => '/admin', as: 'rails_admin'
  mount AccountingAdapter::Engine => '/', as: 'accounting_adapter'
  mount Blazer::Engine, at: "/reports"

  resources :home, only: :index

  get :'calendar', to: 'home#index', as: :calendar
  get :customers, to: 'home#index', as: :customers
  get :'customers/:customer_id', to: 'home#index', as: :customer
  get :'customers/:customer_id/contracts/:contract_id', to: 'home#index', as: :customer_contract
  get :'customers/:customer_id/contracts/:contract_id/preparations/:customer_item_id', to: 'home#index', as: :customer_contract_preparation
  get :'customers/:customer_id/contracts/:contract_id/preparations/:customer_item_id/jobs/:job_id', to: 'home#index', as: :customer_contract_preparation_job
  get :'franchises', to: 'home#index', as: :franchises
  get :'franchises/:franchise_id', to: 'home#index', as: :franchise
  get :items, to: 'home#index', as: :items
  get :'jobs/:job_id', to: 'home#index', as: :job
  get :preparations, to: 'home#index', as: :preparations
  get :'preparations/:customer_item_id', to: 'home#index', as: :customer_item_preparations
  get :differed_transactions_credit, to: 'home#index', as: :differed_transactions_credit

  namespace :api do
    namespace :v1 do
      get 'users', to: 'users#index', as: :users
      get 'show_current_user', to: 'users#show_current_user', as: :show_current_user
    end
  end
end
