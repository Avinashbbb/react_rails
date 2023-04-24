class MyMailerInterceptor
  def self.delivering_email(message)
    message.to = ENV['DEV_MAIL_TO'] ? (ENV['DEV_MAIL_TO'][0] == "[" ? YAML.load(ENV['DEV_MAIL_TO']) : ENV['DEV_MAIL_TO']) : ['mlefrancois@fungo.ca','ndemers@fungo.ca']
    Rails.logger.info("from email interceptor - message.to=#{message.to}")
    message.bcc = []
    message.subject = "PARFAIT MENAGE TEST (ne pas considérer) - #{message.subject}"
  end
end
