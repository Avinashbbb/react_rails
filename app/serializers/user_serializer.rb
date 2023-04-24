require 'fast_jsonapi'

class UserSerializer
  include FastJsonapi::ObjectSerializer

  set_key_transform :camel_lower

  attributes :id, :name, :opportunist_id
end
