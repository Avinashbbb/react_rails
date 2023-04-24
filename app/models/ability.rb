class Ability
  include CanCan::Ability

  def initialize(user)
    if user.has_any_role?(:admin, :super_admin)
      can :manage, :all
      can :access, :rails_admin
      can :dashboard
    end
  end
end
