source 'https://rubygems.org'

git_source(:github) do |repo_name|
  repo_name = "#{repo_name}/#{repo_name}" unless repo_name.include?("/")
  "https://github.com/#{repo_name}.git"
end

#gem 'accounting_adapter', path: './accounting_adapter'
gem 'accounting_adapter', git: 'git@github.com:CodeBoxxTechSchool/accounting_adapter.git', branch: 'parfaitmenage'
gem 'paysafe', git: 'git@github.com:groupefungo/paysafe_sdk_ruby.git'
# gem 'paysafe', path: '../paysafe_sdk_ruby'

#gem 'optigo', path: './optigo'
gem 'optigo', git: 'git@github.com:groupefungo/optigo.git', branch: 'avinash'

gem 'aws-sdk-s3'
#gem 'bootsnap', require: false
gem 'cancan'
gem 'devise', '~> 4.4.3'
gem 'devise_token_auth'
gem 'doorkeeper', '5.0.2'
gem 'doorkeeper-i18n'
gem 'figaro'
gem 'geocoder'
gem 'jbuilder', '~> 2.5'
gem 'mysql2', '< 0.5'
gem 'paperclip'
gem 'paper_trail'
gem 'puma', '~> 4.3.12'
gem 'rack-cors', require: 'rack/cors'
gem 'rails', '~> 5.1.5'
gem 'rails_admin', '~> 1.3'
gem 'rails_admin-i18n'
gem 'rails-i18n', '~> 5.1'
gem 'recurrence'
gem 'rolify'
gem 'sass-rails', '~> 5.0'
gem 'sea_otter',  git: 'git@github.com:groupefungo/sea_otter'
gem 'time_difference'
gem 'turbolinks', '~> 5'
gem 'tzinfo-data', platforms: [:mingw, :mswin, :x64_mingw, :jruby]
gem 'uglifier', '>= 1.3.0'
gem 'whenever'
gem 'blazer'

#gem 'libv8', '~> 7.0'
# gem 'mini_racer', '0.2.4'

## peer dependencies from optigo
# gem 'lead_it_core_api', path: '../lead_it_core_api'
# gem 'lead_it_core_api', git: 'git@github.com:groupefungo/lead_it_core_api.git'
# gem 't140m_google_api_client', git: 'git@github.com:groupefungo/t140m_google_api_client', branch: 'rails_5'
gem 'tim_contactable', git: 'git@github.com:groupefungo/tim_contactable', branch: 'rails_5'

group :development, :test do
  gem 'byebug', platforms: [:mri, :mingw, :x64_mingw]
  gem 'letter_opener'
end

group :development do
  gem 'capistrano'
  gem 'capistrano-bundler'
  gem 'capistrano-rails'
  gem 'capistrano-rvm'
  gem 'capistrano3-puma', git: "https://github.com/seuros/capistrano-puma", tag: 'v4.0.0'
  gem 'listen'
  gem 'net-ssh'
  gem 'spring'
  gem 'spring-watcher-listen', '~> 2.0.0'
  gem 'sshkit'
  #gem 'web-console', '>= 3.3.0'
  gem 'rb-readline'
end

group :staging, :production do
  gem 'exception_notification'
  gem 'exception_notification-rake', '~> 0.3.0'
  gem 'slack-notifier'
end

gem 'mimemagic', '0.3.9'
gem 'bigdecimal', '~> 1.4.3'
