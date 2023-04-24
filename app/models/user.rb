class User < ApplicationRecord
  establish_connection "#{Rails.env}".to_sym

  rolify

  devise :database_authenticatable, :registerable,
         :recoverable, :rememberable, :trackable, :validatable

  has_many :integrations, class_name: 'AccountingAdapter::Integration'
  has_one :unit, class_name: 'Optigo::Unit'

  def super_admin?
    has_role?(:super_admin)
  end

  def admin?
    has_role?(:admin) || super_admin?
  end
end

