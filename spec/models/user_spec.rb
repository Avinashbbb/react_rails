require 'rails_helper'

RSpec.describe User, type: :model do
  context '.super_admin?' do
    let(:user) {build(:user)}

    context 'user is a super admin' do
      it 'returns true' do
        user.add_role(:super_admin)
        
        expect(user.super_admin?).to be_truthy
      end
    end

    context 'user is not a super admin' do
      it 'returns false' do
        expect(user.super_admin?).to be_falsey
      end
    end

    context 'user is an admin' do
      it 'returns true' do
        user.add_role(:admin)

        expect(user.admin?).to be_truthy
      end
    end

    context 'user is not an admin' do
      it 'returns false' do
        expect(user.admin?).to be_falsey
      end
    end
  end
end
