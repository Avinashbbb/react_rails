RSpec.configure do |config|
  config.after(:each, type: :request) {Warden.test_reset!}
  config.include Warden::Test::Helpers, type: 'feature'
  config.include Devise::Test::ControllerHelpers, type: :controller
end