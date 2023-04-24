Paperclip.interpolates :environment_bucket do |attachment, style|
  Rails.env == 'test' ? "/tmp/test" : Rails.env
end