require 'models/normalizer'

module Api
  module V1
    class UsersController < ApplicationController
      # make sure user is authenticated
      before_action :authenticate_user!
      # to allow to check the franchises
      include FranchiseScopable

      def index
        # make sure current_user should access the franchise users being fetched
        unless franchise_list_ids.include?(params[:franchise_id].to_i)
          render json: {}, status: 401
          return
        end

        data = User.where(opportunist_id: params[:franchise_id].to_i)

        instances = Models::Normalizer.normalize(data) do |user|
          UserSerializer.new(user).serializable_hash
        end

        render(json: {instances: instances, count: data.length})
      end

      def show_current_user
        if user_signed_in?
          render json: current_user
        else
          render json: {}, status: 401
        end
      end
    end
  end
end


