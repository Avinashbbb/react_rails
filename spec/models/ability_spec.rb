require 'rails_helper'

RSpec.describe Ability, type: :model do
  context '.initialize' do
    subject {Ability}

    let(:user) {create(:user)}
    let(:ability){subject.new(user)}

    after(:each, :administrator) {
      expect(ability.can?(:manage, :all)).to be_truthy
      expect(ability.can?(:access, :rails_admin)).to be_truthy
      expect(ability.can?(:dashboard, nil)).to be_truthy
    }

    context 'The user has the admin role', :administrator do
      it 'gives the user the necessary roles' do
        user.add_role(:admin)
      end
    end

    context 'The user has the super admin role', :administrator do
      it 'gives the user the necessary roles' do
        user.add_role(:super_admin)
      end
    end

    context 'The user has no role' do
      it 'restrict the user ability to access resources' do
        expect(ability.can?(:manage, :all)).to be_falsey
        expect(ability.can?(:access, :rails_admin)).to be_falsey
        expect(ability.can?(:dashboard, nil)).to be_falsey
      end
    end
  end
end
