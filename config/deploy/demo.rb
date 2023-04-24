set :rails_env, 'staging'
set :branch, 'staging'
role :app, %w{web@demo.app.optigo.ca}
role :web, %w{web@demo.app.optigo.ca}
role :db,  %w{web@demo.app.optigo.ca}

set :deploy_to, '/home/web/apps/optigo_demo'

set :rvm_ruby_version, "ruby-2.5.0@optigo_demo"
set :application, 'OptigoDemo'

namespace :deploy do
  desc 'Install the required packages'
  task :yarn do
    on roles(:all) do |host|
      within '/home/web/apps/optigo_demo/current/client' do
        execute :yarn, :install
        execute :yarn, 'build:production'
      end
    end
  end
end

after 'deploy:publishing', 'deploy:yarn'

