require 'test_helper'

class HoochHelperTest < ActionView::TestCase
  include Hooch::HoochHelper

  it "generates tab set attributes" do
    attrs = tab_set('sections')
    attrs.must_equal 'data-tab-group=sections'
  end

  it "generates ajax tab set attrs" do
    attrs = tab_set('sections', type: :ajax)
    attrs.must_match ' data-sub-type=AjaxTabGroup'
  end

  it "generates tab set attrs with a default" do
    attrs = tab_set('sections', default_tab: 'about')
    attrs.must_match ' data-default-tab=about'
  end

  it "generates tab trigger attrs" do
    attrs = tab_trigger('about')
    attrs.must_equal 'data-tab-trigger=true data-tab-target-id=about'
  end

  it "generates tab trigger attrs with push state" do
    attrs = tab_trigger('about', push_state: 'about')
    attrs.must_match ' data-push-state=about'
  end

  it "generates tab_content attrs" do
    attrs = tab_content('about')
    attrs.must_equal 'data-tab-id=about'
  end

  it "generates expander attrs" do
    attrs = expander('see_more')
    attrs.must_equal "data-expander=true data-expand-id=see_more"
  end

  it "generates collapser attrs" do
    attrs = collapser('see_less')
    attrs.must_equal "data-collapser=true data-expand-id=see_less"
  end
end
