require 'hooch/hooch_helper'
module Hooch
  class Railtie < Rails::Railtie
    initializer "hooch.hooch_helper" do
      puts "initializing hooch helpers"
      ActionView::Base.send :include, HoochHelper
    end
  end
end
