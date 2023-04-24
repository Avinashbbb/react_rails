module Doorkeeper
  module ParfaitMenageTokenResponse
    def body
      user = User.find(@token.resource_owner_id)

      super.merge({user: user})
    end
  end
end