require "hooch/version"
require 'hooch/railtie' if defined?(Rails)

module Hooch
  class Engine < ::Rails::Engine
    isolate_namespace Hooch
  end
end
