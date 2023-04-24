class ApplicationController < ActionController::Base
  protect_from_forgery with: :null_session

  before_action :set_locale

  rescue_from CanCan::AccessDenied do |exception|
    raise ActionController::RoutingError.new('Not Found')
  end

  private

  def set_locale
    locale = params[:locale] || cookies[:locale]
    locale = %w(fr en).include?(locale) ? locale : 'fr'

    I18n.locale = cookies[:locale] = locale
  end
end
