require_relative 'boot'

require 'rails/all'

# Require the gems listed in Gemfile, including any gems
# you've limited to :test, :development, or :production.
Bundler.require(*Rails.groups)

module ParfaitMenageBackend
  class Application < Rails::Application
    # Initialize configuration defaults for originally generated Rails version.
    config.load_defaults 5.1

    config.autoload_paths += %W(#{Rails.root}/lib)

    config.time_zone = 'Eastern Time (US & Canada)'
    config.active_record.default_timezone = :local
    # config.active_record.default_timezone = :utc

    config.i18n.available_locales = [:en, :fr]
    config.i18n.default_locale = :fr

    Rails.application.config.to_prepare do
      #DeviseController.respond_to :html, :json
      Devise::SessionsController.layout('devise')
      Devise::PasswordsController.layout('devise')
      Devise::Mailer.layout('mailer')
    end

    config.middleware.insert_before 0, Rack::Cors do
      allow do
        origins '*'
        resource '*', headers: :any, methods: [:get, :post, :put, :delete, :options]
      end
    end

    config.generators do |g|
      g.template_engine nil #to skip views
      g.assets false
      g.helper false
      g.stylesheets false
    end

    config.paperclip_defaults = {
        storage: :s3,
        s3_credentials: {
            bucket: "parfait-menage-#{Rails.env.development? ? 'staging' : Rails.env}",
            access_key_id: ENV['AWS_ACCESS_KEY_ID'],
            secret_access_key: ENV['AWS_SECRET_ACCESS_KEY'],
            s3_region: ENV['AWS_REGION'],
        },
        s3_host_name: "s3-#{ENV['AWS_REGION']}.amazonaws.com",
        s3_protocol: 'http'
    }

    config.action_mailer.delivery_method = :smtp

    # SMTP settings for gmail
    config.action_mailer.smtp_settings = {
        :address              => "email-smtp.us-east-1.amazonaws.com",
        :port                 => 587,
        :user_name            => ENV['SMTP_USERNAME'],
        :password             => ENV['SMTP_PASSWORD'],
        :authentication       => "plain",
        :enable_starttls_auto => true
    }

    if Rails.env.production? || Rails.env.staging?
      config.middleware.use ExceptionNotification::Rack,
                            :slack => {
                                webhook_url: "https://hooks.slack.com/services/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",
                                channel: "#errors",
                                username: "parfaitmenage-#{Rails.env}-app",
                                additional_parameters: {mrkdwn: true}
                            },
                            :email => {
                                :email_prefix => "[ParfaitMenage App #{"STAGING-" if Rails.env.staging?}ERROR] ",
                                :sender_address => %{"ParfaitMenage notifier" <system@optigo.ca>},
                                :exception_recipients => %w{parfaitmenage@fungo.ca}
                            }
    end

    config.log_tags = [->(request) {request.uuid[0..6]}]
  end
end
