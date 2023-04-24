# Parfait Menage App
Manage house cleaning, account statement for Parfait Menage

## Contributing
The engine has the following dependencies:

## +++ Setup DOCKER

### - database.yml, enter the desired database connection : local, staging or production

### - Add your IP into Authorize IP on server in parfaitmenage_app and parfaitmenage-crm (connect with ssh)
* parfaitmenage_app : parfaitmenage_app/current/config/application.yml
* parfaitmenage-crm : parfaitmenage-crm/current/.env

### - Restart puma on both projects
***Terminal***
* bundle exec cap staging puma:stop
* bundle exec cap staging puma:start

### - Docker-compose
* Run all 'docker-compose'

## --- Setup DOCKER

* Ruby version = ruby-2.5.0
* Gemset = parfait_menage
## Install ruby
    rvm install 2.5.0

## Create gemset
    rvm use 2.5.0@parfait_menage --create --default

## Install bundler
    gem install bundler

## Compile gems
    bundle install

## Create local DB
    rake db:create

## Migrate local DB
    rake db:migrate

## Compile libraries from `porlier/client` directory
    yarn install

## Build the admin panel from `porlier/client` directory
    yarn build:development

## Notes
- Avant de commencer à développer :
    - `yarn install` dans ***./client*** pour installer les packages frontend.  
    - Faire le setup du plugin ***eslint***.
- Avant de faire un ***pull request*** :
    - S'assurer qu'il n'y a pas de ***specs*** qui échouent.
    - Exécuter `yarn eslint` pour s'assurer que le ***js*** est optimal.
