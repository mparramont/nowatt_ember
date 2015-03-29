# rails/app/controllers/api/channels_controller.rb
class Api::ChannelsController < ApplicationController
  def index
    render json: Channel.all
  end

  def show
    render json: Channel.find(params[:id])
  end
end
