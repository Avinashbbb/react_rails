require 'rails_helper'

RSpec.describe ApplicationController, type: :controller do
  controller do
    def index
      raise CanCan::AccessDenied
    end
  end
  
  context '.after_sign_in_path_for' do
    let(:user) {build(:user)}

    it 'return the root path' do
      expect(subject.after_sign_in_path_for(user)).to eq(root_path)
    end
  end

  it 'rescues from CanCan::AccessDenied errors' do
    expect{get(:index)}.to raise_error(ActionController::RoutingError, 'Not Found')
  end
end