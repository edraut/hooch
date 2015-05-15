# coding: utf-8
lib = File.expand_path('../lib', __FILE__)
$LOAD_PATH.unshift(lib) unless $LOAD_PATH.include?(lib)
require 'hooch/version'

Gem::Specification.new do |spec|
  spec.name          = "hooch"
  spec.version       = Hooch::VERSION
  spec.authors       = ["Eric Draut"]
  spec.email         = ["edraut@gmail.com"]
  spec.summary       = %q{Tools for building a browser UI. Get the good stuff.}
  spec.description   = %q{Hooch provides tools for common UI patterns without any dom or css. You build the html and css you want, then add data-attributes to get behavior. Keep behavior independent of look-and-feel and you can build "anything**"(** within reason).}
  spec.homepage      = ""
  spec.license       = "MIT"

  spec.files         = `git ls-files -z`.split("\x0")
  spec.executables   = spec.files.grep(%r{^bin/}) { |f| File.basename(f) }
  spec.test_files    = spec.files.grep(%r{^(test|spec|features)/})
  spec.require_paths = ["lib"]

  spec.add_dependency "rails", ">= 4.0.1"

  spec.add_development_dependency "bundler", "~> 1.7"
  spec.add_development_dependency "rake", "~> 10.0"
  spec.add_development_dependency "minitest"
  spec.add_development_dependency "minitest-rails"
  spec.add_development_dependency "sqlite3"
end
