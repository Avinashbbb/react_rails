set :rails_env, 'production'
set :branch, 'master'

role :app, %w{web@app.parfaitmenage.optigo.ca}
role :web, %w{web@app.parfaitmenage.optigo.ca}
role :db,  %w{web@app.parfaitmenage.optigo.ca}

set :deploy_to, '/home/web/apps/parfaitmenage_app'

namespace :deploy do
  desc 'Install the required packages'
  task :yarn do
    on roles(:all) do |host|
      within "#{current_path}/client" do
        execute :yarn, :install
        execute :yarn, 'build:production'
      end
    end
  end
end

after 'deploy:publishing', 'deploy:yarn'