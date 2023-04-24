ARG https_vs_ssl_setup

FROM ghcr.io/codeboxxtechschool/parfaitmenage-app/infra as base

ENV APP_HOME /app
RUN mkdir $APP_HOME
WORKDIR $APP_HOME

FROM base AS with_ssl_gems
RUN mkdir -p ~/.ssh
RUN chmod 700 ~/.ssh
RUN touch ~/.ssh/known_hosts
RUN ssh-keyscan github.com >> ~/.ssh/known_hosts

FROM base AS with_http_gems
RUN --mount=type=secret,id=GIT_PAT export GIT_PAT=$(cat /run/secrets/GIT_PAT) \
      && git config --global url."https://x-access-token:$GIT_PAT@github.com/".insteadOf git@github.com:

FROM $https_vs_ssl_setup AS with_bundler
RUN gem install -f bundler:2.3.20

FROM with_bundler AS with_bundled
ADD Gemfile* $APP_HOME/
RUN bundle config set --local with 'development'
RUN --mount=type=ssh bundle install --jobs 4 --retry 4

FROM with_bundled AS with_yarned
ENV CLIENT_HOME /app/client
RUN mkdir $CLIENT_HOME
ADD client/yarn.lock $CLIENT_HOME/yarn.lock
ADD client/package.json $CLIENT_HOME/package.json
RUN --mount=type=secret,id=GIT_PAT export NPM_PAT=$(cat /run/secrets/GIT_PAT) \
      && git config --global url."https://x-access-token:$NPM_PAT@github.com/".insteadOf ssh://git@github.com/
RUN --mount=type=ssh cd $CLIENT_HOME && yarn install --check-files --pure-lockfile
