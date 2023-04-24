set :rvm_ruby_string, :local
set :rvm_ruby_version, "ruby-2.7.2@parfait_menage"
set :application, 'ParfaitMenage'
set :repo_url, 'git@github.com:CodeBoxxTechSchool/parfaitmenage-app.git'

set :format, :pretty

#set :log_level, :debug

# set :pty, true

set :linked_files, %w{config/application.yml config/database.yml config/secrets.yml}
set :linked_dirs, %w{log tmp/pids tmp/cache tmp/sockets vendor/bundle public/system public/bundles public/webpack/staging client/node_modules public/certificats node_modules}
set :deploy_to, '/home/web/apps/parfait_menage'

set :keep_releases, 3

set :ssh_options, { :forward_agent => true }
