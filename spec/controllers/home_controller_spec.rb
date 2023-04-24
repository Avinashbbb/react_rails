require 'rails_helper'

RSpec.describe HomeController, type: :controller do
  context '#index' do
    it 'renders the rspec app' do
      get :index
    end
  end
end