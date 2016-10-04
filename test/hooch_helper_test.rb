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
    attrs.must_equal 'data-tab-trigger=true data-tab-target-id=about data-push-state=about'
  end

  it "generates tab trigger attrs with push state" do
    attrs = tab_trigger('about', push_state: 'about')
    attrs.must_match ' data-push-state=about'
  end

  it "generates tab_content attrs" do
    attrs = tab_content('about')
    attrs.must_equal 'data-tab-id=about'
  end

  it "generates modal_trigger attrs" do
    attrs = modal_trigger('#privacy')
    attrs.must_equal 'data-modal-trigger="true" data-content-target="#privacy"'
  end

  it "generates expander attrs" do
    attrs = expander('see_more')
    attrs.must_equal "data-expander=true data-expand-id=see_more"
  end

  it "generates expander attrs with classes" do
    attrs = expander('see_more', expand_class: 'expanded', collapse_class: 'collapsed')
    attrs.must_equal "data-expander=true data-expand-id=see_more data-expand-class=expanded data-collapse-class=collapsed"
  end

  it "generates collapser attrs" do
    attrs = collapser('see_less')
    attrs.must_equal "data-collapser=true data-expand-id=see_less"
  end

  it "generates collapsed attrs" do
    attrs = collapsed('see_less', type: :ajax)
    attrs.must_equal "data-expand-state=collapsed data-expand-id=see_less data-sub-type=AjaxExpandable"
  end

  it "generates expanded attrs" do
    attrs = expanded('see_more', type: :ajax)
    attrs.must_equal "data-expand-state=expanded data-expand-id=see_more data-sub-type=AjaxExpandable"
  end

  it "generates emptier attrs" do
    attrs = emptier('get_empty')
    attrs.must_equal "data-emptier=true data-target=get_empty"
  end

  it "generates remover attrs" do
    attrs = remover('go_away')
    attrs.must_equal "data-remover=true data-target=go_away"
  end

  it "generates revealer attrs" do
    attrs = revealer_attrs('drill_down', highlander: true)
    attrs.must_equal 'data-revealer=true data-revealer-children-id="drill_down" data-sub-type=FormFieldRevealer data-revealer-highlander="true"'
  end

  it "generates a revealer hash" do
    params = revealer('drill_down', type: 'FormFieldRevealer')
    params['data-revealer'].must_equal true
    params['data-revealer-children-id'].must_equal 'drill_down'
    params['data-sub-type'].must_equal 'FormFieldRevealer'
  end

  it "generates revealer option attrs" do
    attrs = revealer_option_attrs('drill_down', trigger: 'more than one word')
    attrs.must_equal 'data-revealer-id=drill_down data-revealer-trigger="more than one word"'
  end

  it "generates click proxy attrs" do
    attrs = click_proxy
    attrs.must_equal "data-click-proxy=true"
  end

  it "generates click proxy attrs with target" do
    attrs = click_proxy('my_link')
    attrs.must_equal "data-click-proxy=true data-target=my_link"
  end

  it "generates click proxy hash" do
    params = click_proxy_hash('my_link')
    params['data-click-proxy'].must_equal true
    params['data-target'].must_equal 'my_link'
  end

  it "generates submit proxy attrs" do
    attrs = submit_proxy('my_form')
    attrs.must_equal 'data-submit-proxy=true data-target=my_form'
  end

  it "generates submit proxy params" do
    params = submit_proxy_hash('my_form')
    params['data-submit-proxy'].must_equal true
    params['data-target'].must_equal 'my_form'
  end

  it "generates field filler attrs" do
    attrs = field_filler('#amount_field', '10.00')
    attrs.must_equal 'data-field-filler=true data-target=#amount_field data-value="10.00"'
  end

  it "generates field filler params" do
    params = field_filler_hash('#amount_field', '10.00')
    params['data-field-filler'].must_equal true
    params['data-target'].must_equal '#amount_field'
    params['data-value'].must_equal '10.00'
  end

  it "generates link attrs" do
    attrs = link
    attrs.must_equal "data-link=true"
  end

  it "generates prevent double submit attrs" do
    attrs = prevent_double_submit
    attrs.must_equal "data-prevent-double-submit=true"
  end

  it "generates prevent_double_submit params" do
    params = prevent_double_submit_hash
    params["data-prevent-double-submit"].must_equal true
  end

  it "generates prevent_double_click attrs" do
    attrs = prevent_double_click
    attrs.must_equal "data-prevent-double-click=true"
  end

  it "generates prevent_double_click params" do
    params = prevent_double_click_hash
    params["data-prevent-double-click"].must_equal true
  end

  it "generates history pusher attrs" do
    attrs = history_pusher_attrs('my_key','my_value')
    attrs.must_equal 'data-history-pusher=true data-key=my_key data-value="my_value"'

    form_attrs = history_pusher_attrs
    form_attrs.must_equal 'data-history-pusher=true'
  end

  it "generates history_pusher params" do
    params = history_pusher('my_key','my_value')
    params["data-history-pusher"].must_equal true
    params["data-key"].must_equal 'my_key'
    params["data-value"].must_equal 'my_value'

    form_params = history_pusher
    form_params["data-history-pusher"].must_equal true
  end

  it "generates history replacer attrs" do
    attrs = history_replacer_attrs('/my/new/path')
    attrs.must_equal 'data-history-replacer=true data-new-path=/my/new/path'
  end

  it "generates history_replacer params" do
    params = history_replacer('/my/new/path')
    params["data-history-replacer"].must_equal true
    params["data-new-path"].must_equal '/my/new/path'
  end

end
