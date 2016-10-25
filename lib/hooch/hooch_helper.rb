module Hooch
  module HoochHelper
    def tab_set(name, type: nil, default_tab: nil)
      if :ajax == type
        type = 'AjaxTabGroup'
      end
      attrs = 'data-tab-group=' + name
      attrs += ' data-sub-type=' + type if type.present?
      attrs += ' data-default-tab=' + default_tab if default_tab.present?
      attrs
    end

    def tab_trigger(target_id, push_state: nil)
      attrs = 'data-tab-trigger=true data-tab-target-id=' + target_id
      if push_state.present?
        attrs += ' data-push-state=' + push_state
      else
        attrs += ' data-push-state=' + target_id
      end
      attrs
    end

    def tab_content(id)
      attrs = 'data-tab-id=' + id
    end

    def modal_trigger(target)
      attrs = 'data-modal-trigger="true"'
      attrs += " data-content-target=\"#{target}\""
    end

    def hide_show(target, any_click_closes: false)
      {}.tap do |params|
        params['data-hide-show'] = true
        params['data-target'] = target
        params['data-any-click-closes'] = true if any_click_closes
      end
    end

    def hide_show_attrs(target, any_click_closes: false)
      attrs = "data-hide-show=true data-target=" + target
      attrs += " data-any-click-closes=true" if any_click_closes
      attrs
    end

    def expander(id, expand_class: nil, collapse_class: nil)
      attrs = "data-expander=true data-expand-id=" + id
      attrs += " data-expand-class=" + expand_class if expand_class.present?
      attrs += " data-collapse-class=" + collapse_class if collapse_class.present?
      attrs
    end

    def collapser(id)
      attrs = "data-collapser=true data-expand-id=" + id
    end

    def collapsed(id, type: nil, expand_class: nil, collapse_class: nil)
      if :ajax == type
        type = 'AjaxExpandable'
      end
      attrs = "data-expand-state=collapsed data-expand-id=" + id
      attrs += " data-sub-type=" + type if type.present?
      attrs += " data-expand-class=" + expand_class if expand_class.present?
      attrs += " data-collapse-class=" + collapse_class if collapse_class.present?
      attrs
    end

    def expanded(id, type: nil, expand_class: nil, collapse_class: nil)
      if :ajax == type
        type = 'AjaxExpandable'
      end
      attrs = "data-expand-state=expanded data-expand-id=" + id
      attrs += " data-sub-type=" + type if type.present?
      attrs += " data-expand-class=" + expand_class if expand_class.present?
      attrs += " data-collapse-class=" + collapse_class if collapse_class.present?
      attrs
    end

    def emptier(id)
      attrs = "data-emptier=true data-target=" + id
    end

    def remover(id)
      attrs = "data-remover=true data-target=" + id
    end

    def revealer_attrs(id, type: nil, highlander: false)
      ''.tap do |attrs|
        attrs.concat "data-revealer=true data-revealer-children-id=\"#{id}\""
        attrs.concat " data-sub-type=\"#{type}\"" if type.present?
        if highlander
          attrs.concat " data-sub-type=FormFieldRevealer"
          attrs.concat " data-revealer-highlander=\"true\""
        end
      end.html_safe
    end

    def revealer(id, type: nil, highlander: false)
      {}.tap do |params|
        params['data-revealer'] = true
        params['data-revealer-children-id'] = id
        params['data-sub-type'] = type if type.present?
        params['data-sub-type'] = 'FormFieldRevealer' if highlander
      end
    end

    def revealer_option_attrs(id, trigger: nil, triggers: nil)
      ''.tap do |attrs|
        attrs.concat "data-revealer-id=#{id}"
        attrs.concat " data-revealer-trigger=\"#{trigger}\"" if trigger.present?
        attrs.concat " data-revealer-triggers='#{triggers.to_json}'" if triggers.present?
      end.html_safe
    end

    def revealer_option(id, trigger: nil, triggers: nil)
      {}.tap do |params|
        params['data-revealer-id'] = id
        params['data-revealer-trigger'] = trigger if trigger.present?
        params['data-revealer-triggers'] = triggers if triggers.present?
      end
    end

    def revealer_target_attrs(id)
      ''.tap do |attrs|
        attrs.concat "data-revealer-target=\"#{id}\""
      end.html_safe
    end

    def click_proxy(target = nil)
      ''.tap do |attrs|
        attrs.concat "data-click-proxy=true"
        attrs.concat " data-target=#{target}" if target.present?
      end
    end

    def click_proxy_hash(target = nil)
      {}.tap do |params|
        params['data-click-proxy'] = true
        params['data-target'] = target if target.present?
      end
    end

    def submit_proxy(target = nil)
      ''.tap do |attrs|
        attrs.concat 'data-submit-proxy=true'
        attrs.concat " data-target=#{target}" if target.present?
      end
    end

    def submit_proxy_hash(target = nil)
      {}.tap do |params|
        params['data-submit-proxy'] = true
        params['data-target'] = target if target.present?
      end
    end

    def fake_checkbox_attrs(form_selector, field_name, field_value)
      ''.tap do |attrs|
        attrs.concat 'data-fake-checkbox=true'
        attrs.concat " data-form-selector=#{form_selector}"
        attrs.concat " data-field-name=\"#{field_name}\""
        attrs.concat " data-field-value=\"#{field_value}\""
      end.html_safe
    end

    def fake_checkbox(form_selector, field_name, field_value)
      {}.tap do |params|
        params['data-fake-checkbox'] = true
        params['data-form-selector'] = form_selector
        params['data-field-name'] = field_name
        params['data-field-value'] = field_value
      end
    end

    def field_filler(target, value)
      ''.tap do |attrs|
        attrs.concat 'data-field-filler=true'
        attrs.concat " data-target=#{target}"
        attrs.concat " data-value=\"#{value}\""
      end.html_safe
    end

    def field_filler_hash(target, value)
      {}.tap do |params|
        params['data-field-filler'] = true
        params['data-target'] = target
        params['data-value'] = value
      end
    end

    def history_pusher_attrs(key = nil,value = nil)
      ''.tap do |attrs|
        attrs.concat 'data-history-pusher=true'
        attrs.concat " data-key=#{key}" if key
        attrs.concat " data-value=\"#{value}\"" if value
      end.html_safe
    end

    def history_pusher(key = nil,value = nil)
      {}.tap do |params|
        params['data-history-pusher'] = true
        params['data-key'] = key if key
        params['data-value'] = value if value
      end
    end

    def history_replacer_attrs(new_path)
      ''.tap do |attrs|
        attrs.concat 'data-history-replacer=true'
        attrs.concat " data-new-path=#{new_path}"
      end.html_safe
    end

    def history_replacer(new_path)
      {}.tap do |params|
        params['data-history-replacer'] = true
        params['data-new-path'] = new_path
      end
    end

    def link
      "data-link=true"
    end

    def prevent_double_submit
      "data-prevent-double-submit=true"
    end

    def prevent_double_submit_hash
      {"data-prevent-double-submit" => true}
    end

    def prevent_double_click
      "data-prevent-double-click=true"
    end

    def prevent_double_click_hash
      {"data-prevent-double-click" => true}
    end

    def bind_key(key_name)
      {"data-bind-key" => key_name}
    end

    def bind_key_attrs(key_name)
      "data-bind-key=\"#{key_name}\"".html_safe
    end
  end
end
