require 'hooch/hooch_helper'
module Hooch
  class Railtie < Rails::Railtie
    initializer "hooch.hooch_helper" do
      ActionView::Base.send :include, HoochHelper
    end
  end
end
