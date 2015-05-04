module Hooch
  module HoochHelper
    def tab_set(name, type: nil, default_tab: nil)
      if :ajax == type
        type = 'hooch.AjaxTabGroup'
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
        type = 'hooch.AjaxExpandable'
      end
      attrs = "data-expand-state=expanded data-expand-id=" + id
      attrs += " data-sub-type=" + type if type.present?
      attrs
    end
  end
end
