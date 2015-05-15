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
      attrs += ' data-push-state=' + push_state if push_state.present?
      attrs
    end

    def tab_content(id)
      attrs = 'data-tab-id=' + id
    end

    def expander(id)
      attrs = "data-expander=true data-expand-id=" + id
    end

    def collapser(id)
      attrs = "data-collapser=true data-expand-id=" + id
    end

    def emptier(id)
      attrs = "data-emptier=true data-target=" + id
    end

    def remover(id)
      attrs = "data-remover=true data-target=" + id
    end

    def collapsed(id, type: nil)
      if :ajax == type
        type = 'AjaxExpandable'
      end
      attrs = "data-expand-state=collapsed data-expand-id=" + id
      attrs += " data-sub-type=" + type if type.present?
      attrs
    end

    def expanded(id, type: nil)
      if :ajax == type
        type = 'AjaxExpandable'
      end
      attrs = "data-expand-state=expanded data-expand-id=" + id
      attrs += " data-sub-type=" + type if type.present?
      attrs
    end

    def revealer(id, type: nil)
      ''.tap do |attrs|
        attrs += "data-revealer=true data-revealer-children-id=#{id}"
        attrs += " data-sub-type=#{type}" if type.present?
      end
    end

    def revealer_hash(id, type: nil)
      {}.tap do |params|
        params['data-revealer'] = true
        params['data-revealer-children-id'] = id
        params['data-sub-type'] = type if type.present?
      end
    end

    def click_proxy(target: nil)
      ''.tap do |attrs|
        attrs += "data-click-proxy=true"
        attrs += " data-target=#{target}" if target.present?
      end
    end

    def click_proxy_hash(target: nil)
      {}.tap do |params|
        params['data-click-proxy'] = true
        params['data-target'] = target if target.present?
      end
    end

    def submit_proxy(target: nil)
      ''.tap do |attrs|
        attrs += 'data-submit-proxy=true'
        attrs += " data-target=#{target}" if target.present?
      end
    end

    def submit_proxy_hash(target: nil)
      {}.tap do |params|
        params['data-submit-proxy'] = true
        params['data-target'] = target if target.present?
      end
    end

    def field_filler(target, value)
      ''.tap do |attrs|
        attrs += 'data-field-filler=true'
        attrs += " data-target=#{target}"
        attrs += " data-value=#{value}"
      end
    end

    def field_filler_hash(target, value)
      {}.tap do |params|
        params['data-field-filler'] = true
        params['data-target'] = target
        params['data-value'] = value
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
  end
end
