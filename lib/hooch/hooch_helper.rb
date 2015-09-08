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

    def revealer(id, type: nil)
      ''.tap do |attrs|
        attrs.concat "data-revealer=true data-revealer-children-id=#{id}"
        attrs.concat " data-sub-type=#{type}" if type.present?
      end
    end

    def revealer_hash(id, type: nil)
      {}.tap do |params|
        params['data-revealer'] = true
        params['data-revealer-children-id'] = id
        params['data-sub-type'] = type if type.present?
      end
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

    def field_filler(target, value)
      ''.tap do |attrs|
        attrs.concat 'data-field-filler=true'
        attrs.concat " data-target=#{target}"
        attrs.concat " data-value=#{value}"
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
