var loadJs = function(url){
  var requested_script = document.createElement('script');
  requested_script.type = 'text/javascript';
  requested_script.src = url;
  document.body.appendChild(requested_script);
}

if(typeof Class === "undefined"){
  loadJs('//rawgit.com/edraut/js_inheritance/master/inheritance.js');
};
var Toggler = Class.extend({
  init: function(jq_obj){
    this.jq_obj = jq_obj;
    this.label = jq_obj.data('toggler');
    this.value = jq_obj.val();
    this.targets = $('[data-toggle_trigger="' + this.label + '"]');
    this.targets.hide();
    this.targets.filter('[data-toggle_value="' + this.value + '"]').show();
  }
});

var HoverOverflow = Class.extend({
  init: function(jq_obj){
    this.old_border = jq_obj.css('border-right');
    this.old_z_index = jq_obj.css('z-index');
    var hoverable = this;
    jq_obj.bind('mouseover',function(){
      hoverable.jq_obj.css({'overflow':'visible','z-index':'10000','border-right':'1px solid white'});
    });
    jq_obj.bind('mouseout',function(){
      hoverable.jq_obj.css({'overflow':'hidden','z-index':hoverable.old_z_index,'border-right':hoverable.old_border});
    });
  }
})

var HoverReveal = Class.extend({
  init: function($hover_revealer){
    $revealable = $hover_revealer.data('revealable')
    jq_obj.bind('mouseover',function(){
      $revealable.show();
    });
    jq_obj.bind('mouseout',function(){
      $revealable.hide();
    });

  }
})

var HideyButton = Class.extend({
  init: function($hidey_button){
    $hidey_button.hide();
    this.form = $hidey_button.parents('form');
    this.$hidey_button = $hidey_button;
    this.bindInputs();
  },
  bindInputs: function(){
    this.inputs = this.form.find('input,select,textarea');
    var hidey_button = this;
    this.cache_input_values();
    this.inputs.each(function(){
      $(this).bind("propertychange keyup input paste datechange change",function(){
        if(hidey_button.form_changed()){
          hidey_button.$hidey_button.show();
        } else {
          hidey_button.$hidey_button.hide();
        }
      })
    });
  },
  cache_input_values: function(){
    this.inputs.each(function(){
      if($(this).is(":checkbox")){
        $(this).data('oldstate',$(this).is(':checked'));
      } else {
        $(this).data('oldval',$(this).val());
      }
    })
  },
  form_changed: function(){
    var changed = false;
    this.inputs.each(function(){
      if($(this).is(":checkbox")){
        if($(this).data('oldstate') != $(this).is(':checked')){
          changed = true;
          return false;
        }
      }else{
        if($(this).data('oldval') != $(this).val()){
          changed = true;
          return false;
        }
      }
    })
    return changed;
  }
})
var Expandable = Class.extend({
  init: function($expandable){
    this.$expandable = $expandable;
    $expandable.data('expandable',this);
    $collapser = $('[data-expand-id="' + $expandable.data('expand-id') + '"][data-collapser]');
    if($collapser.length > 0){
      this.collapser = new Collapser($collapser,this);
    }
    this.$expander = $('[data-expand-id="' + $expandable.data('expand-id') + '"][data-expander]');
    this.expander = new Expander(this.$expander,this);
    this.initial_state = $expandable.data('expand-state');
    if(this.initial_state == 'expanded'){
      this.expand();
    } else {
      this.collapse();
    }
  },
  expand: function(){
    if(this.collapser){
      this.expander.hide();
      this.collapser.show();
    }
    this.$expandable.show(10);
  },
  collapse: function(){
    if(this.collapser){
      this.collapser.hide();
      this.expander.show();
    }
    this.$expandable.hide(10);
  },
  toggle: function(){
    this.$expandable.toggle(10);
  }
});
var AjaxExpandable = Expandable.extend({
  expand: function(){
    if(!this.ajax_loaded){
      this.ajax_loaded = true;
      new AjaxLinkSubmission(this.$expander);
    }
    this._super();
  }
});
var Expander = Class.extend({
  init: function($expander,target){
    this.$expander = $expander;
    if($expander.data('fake-dropdown')){
      target.$expandable.on('click',function(){
        target.toggle();
      })
      target.$expandable.on('mouseleave',function(){
        target.collapse();
      })
    }
    $expander.bind('click',function(){
      if(target.collapser){
        target.expand();
      } else {
        target.toggle();
      }
    })
  },
  hide: function(){
    this.$expander.hide();
  },
  show: function(){
    this.$expander.show();
  }
});
var Collapser = Class.extend({
  init: function($collapser,target){
    this.$collapser = $collapser;
    $collapser.bind('click',function(){
      target.collapse();
    })
  },
  hide: function(){
    this.$collapser.hide();
  },
  show: function(){
    this.$collapser.show();
  }
})
var DisableForms = Class.extend({
  init: function($disable_container){
    $disable_container.find('input, select').each(function(){
      $(this).prop('disabled',true);
    });
  }
})

// Note: the method and variable names in this class are somehow creepy

var Revealer = Class.extend({
  init: function($revealer){
    var revealer = this;
    this.$revealer = $revealer;
    this.children_id = this.$revealer.data('revealer-children-id');
    this.$all_children = $('[data-revealer_id="' + this.children_id + '"]');
    $revealer.bind('change',function(){
      revealer.reveal();
    });
    revealer.reveal();
  },
  reveal: function(){
    var sanitized_value = this.$revealer.val();
    this.$children = [];
    var revealer = this;
    this.$all_children.each(function(){
      var triggers = $(this).data('revealer-triggers');
      if(triggers){
        var revelation_triggers = eval('(' + triggers + ')');
        if($.inArray(sanitized_value,revelation_triggers) > -1){
          revealer.$children.push($(this));
        }
      } else {
        if(sanitized_value == $(this).data('revealer-trigger')){
          revealer.$children.push($(this));
        }
      }
    })
    this.hideChildren();
    this.revealChosenOnes();
  },
  hideChildren: function(){
    this.$all_children.hide();
  },
  revealChosenOnes: function(){
    $.each(this.$children,function(){ $(this).show(); });
  }
});

var FormFieldRevealer = Revealer.extend({
  init: function($revealer){
    this.children_id = $revealer.data('revealer-children-id');
    this.$revelation_target = $('[data-revealer-target="' + this.children_id + '"]');
    this._super($revealer);
  },
  hideChildren: function(){
    this._super();
    this.$form = this.$revealer.parents('form:first')
    if(this.$form.length > 0){
      this.$form.after(this.$all_children)
    }
  },
  revealChosenOnes: function(){
    this.$revelation_target.html(this.$children);
    this._super();
  }
});

var TabGroup = Class.extend({
  init: function($tab_group){
    this.$tab_group = $tab_group;
    this.getName();
    this.tab_triggers = [];
    this.tab_triggers_by_id = {};
    this.getTabTriggerClass();
    this.createTabs();
    this.getConentParent();
    this.hideAll();
    this.handleDefault();
    TabGroup.addGroup(this);
  },
  createTabs: function(){
    var tab_group = this;
    this.$tab_group.find("[data-tab-trigger]").each(function(){
      var new_tab = new tab_group.tab_trigger_class($(this),tab_group);
      tab_group.tab_triggers.push(new_tab);
      tab_group.tab_triggers_by_id[new_tab.tab_id] = new_tab;
    })
  },
  getTabByPushState: function(state_value){
    var selected_tab = null;
    $.each(this.tab_triggers,function(index,trigger){
      if(trigger.push_state == state_value){
        selected_tab = trigger;
      }
    })
    return selected_tab;
  },
  getName: function(){
    this.name = this.$tab_group.data('tab-group');
  },
  getConentParent: function(){
    this.$content_parent = this.tab_triggers[0].getParent();
  },
  handleDefault: function(){
    if(this.$tab_group.data('default-tab')){
      this.default_tab = this.tab_triggers_by_id[this.$tab_group.data('default-tab')];
      this.default_tab.toggleTarget('replace');
    }
  },
  hideAll: function(trigger){
    $.each(this.tab_triggers,function(){
      this.hideTarget();
    })
  },
  getTabTriggerClass: function(){
    this.tab_trigger_class = TabTrigger;
  },
  deactivateTabTriggers: function(){
    $.each(this.tab_triggers,function(){
      this.$tab_trigger.removeClass('active');
    })
  },
  setActiveTab: function(tab_trigger){
    if(this.active_tab){
      var parent_height = this.$content_parent.height();
      this.$content_parent.css({'height': parent_height, 'overflow': 'hidden'});
    }
    this.hideAll();
    this.deactivateTabTriggers();
    this.active_tab = tab_trigger;
    tab_trigger.revealTarget();
  },
  resize: function(){
    this.$content_parent.css({'height': 'auto', 'overflow': 'visible'});
  },
  getActiveTab: function(){
    return this.active_tab;
  }
})
TabGroup.addGroup = function(group){
  if(!TabGroup.all_groups){
    TabGroup.all_groups = [];
  }
  TabGroup.all_groups.push(group);
}
TabGroup.find = function(name){
  var selected_group = null;
  $.each(TabGroup.all_groups,function(index,group){
    if(group.name == name){
      selected_group = group;
    }
  });
  return selected_group;
}
var AjaxTabGroup = TabGroup.extend({
  getTabTriggerClass: function(){
    this.tab_trigger_class = AjaxTabTrigger;
  }
})
var TabTrigger = Class.extend({
  init: function($tab_trigger,tab_group){
    this.$tab_trigger = $tab_trigger;
    this.tab_group = tab_group;
    this.tab_group_name = tab_group.name;
    this.tab_id = $tab_trigger.data('tab-target-id');
    this.getPushState();
    this.getTarget();
    var tab_trigger = this;
    $tab_trigger.on('click', function(e){
      e.preventDefault();
      tab_trigger.toggleTarget()
    })
  },
  getTarget: function(){
    this.$target = $('[data-tab-id="' + this.tab_id + '"]');
  },
  getPushState: function(){
    if(this.$tab_trigger.data('push-state') != null && this.$tab_trigger.data('push-state') != ""){
      this.push_state = this.$tab_trigger.data('push-state')
    }
  },
  toggleTarget: function(state_behavior){
    var was_visible = this.$target.is(':visible');
    if(!was_visible){
      this.tab_group.setActiveTab(this);
      this.resize();
      var change_history = true;
      var history_method = 'pushState'
      if('no history' == state_behavior){
        change_history = false
      } else if('replace' == state_behavior){
        history_method = 'replaceState'
      }
      if (this.push_state && change_history) {
        var current_state = new IhHistoryState(history.state)
        current_state.addState(this.tab_group_name, this.push_state);
        history[history_method](current_state.state, null, current_state.toUrl());
      }
    }
  },
  hideTarget: function(){
    this.$target.hide();
  },
  revealTarget: function(){
    this.$target.show();
    this.$tab_trigger.addClass('active');
  },
  getParent: function(){
    return this.$target.parent();
  },
  resize: function(){
    this.tab_group.resize();
  }
})

var AjaxTabTrigger = TabTrigger.extend({
  toggleTarget: function(pop){
    var tab_group = this.tab_group;
    if(!this.ajax_loaded){
      this.ajax_loaded = true;
      this.$tab_trigger.data('ajax-target','[data-tab-id="' + this.tab_id + '"]')
      new AjaxLinkSubmission(this.$tab_trigger,{'on_complete': function(){tab_group.resize()}});
      this._super(pop);
    } else {
      this._super(pop);
      tab_group.resize()
    }
  },
  resize: function(){
    // noop
  }
})
var IhHistoryState = Class.extend({
  init: function(state){
    this.state = jQuery.extend(true, {}, state);
  },
  toQueryString: function(){
    return $.param(this.state)
  },
  toUrl: function(){
    return [location.protocol, '//', location.host, location.pathname, '?', this.toQueryString()].join('');
  },
  addState: function(key,value){
    var new_state = {}
    new_state[key] = value
    this.state = $.extend(true, this.state, new_state);
  }
})
var GoProxy = Class.extend({
  init: function($proxy){
    this.first_submit = true;
    var go_proxy = this;
    go_proxy.$proxy = $proxy;
    go_proxy.target = go_proxy.getTarget();
    go_proxy.prevent_double_submit = $proxy.data('prevent-double-submit')
    switch($proxy.get(0).nodeName.toLowerCase()){
      case 'input':
        switch($proxy.attr('type')){
          case 'checkbox':
          default:
            $proxy.on('change',function(){
              go_proxy.doItNow();
            })
          break;
        }
        break;
      case 'select':
        $proxy.on('change',function(){
          go_proxy.doItNow();
        })
      break;
      case 'a':
      default:
        $proxy.on('click',function(e){
          e.preventDefault();
          go_proxy.doItNow();
          return false;
        });
        break;
    }
  },
  doable: function(){
    return(this.first_submit || !this.prevent_double_submit)
  }
});
var ClickProxy = GoProxy.extend({
  getTarget: function(){
    if(this.$proxy.data('target')){
      return $(this.$proxy.data('target'));
    } else {
      return this.$proxy.siblings('a');
    }
  },
  doItNow: function(){
    if(this.doable) {
      this.target.click();
      this.first_submit = false;
    }
  }
});

var SubmitProxy = GoProxy.extend({
  getTarget: function(){
    if(this.$proxy.data('target')){
      return $(this.$proxy.data('target'));
    } else {
      return this.$proxy.parents('form:first');
    }
  },
  doItNow: function(){
    if(this.doable) {
      this.target.submit();
      this.first_submit = false;
    }
  }
});

var FieldFiller = Class.extend({
  init: function($field_filler){
    this.$field_filler = $field_filler
    this.value = $field_filler.data('value');
    this.target = $($field_filler.data('target'));
    var field_filler = this
    this.$field_filler.bind('click', function(e){field_filler.fill(e)})
  },
  fill: function(e){
    e.preventDefault();
    this.target.val(this.value);
    return false;
  }
});

var Emptier = Class.extend({
  init: function($emptier){
    $target = $($emptier.data('target'));
    $emptier.click(function(e){
      $target.empty();
    })
  }
});

var Remover = Class.extend({
  init: function($remover){
    $target = $($remover.data('target'));
    $remover.click(function(e){
      $target.remove();
    })
  }
});

var Link = Class.extend({
  init: function($link){
    $link.click(function(){
      window.location = $link.attr('href');
    })
  }
});

var CheckboxHiddenProxy = Class.extend({
  init: function($checkbox){
    this.checked_value = $checkbox.data('checked-value');
    this.unchecked_value = $checkbox.data('unchecked-value');
    var target_selector = $checkbox.data('target');
    this.target = $(target_selector);
    var checkbox = this;
    $checkbox.click(function(){
      if ($(this).is(':checked')) {
        checkbox.target.val(checkbox.checked_value);
      } else {
        checkbox.target.val(checkbox.unchecked_value);
      }
    })
  }
});

var PreventDoubleSubmit = Class.extend({
  init: function($clickable){
    this.$clickable = $clickable;
    var double_click_preventer = this;
    switch($clickable.get(0).nodeName.toLowerCase()){
      case 'form':
        $clickable.submit(function(e){ double_click_preventer.preventItNow(); });
        break;
      case 'input':
        $clickable.click(function() {
          setTimeout(function(){
            $clickable.attr("disabled", "disabled");
          }, 10);
        });
        break;
    }
  },
  preventItNow: function(){
    this.$clickable.submit(function(e){ e.preventDefault(); return false; });
  }
});

var PreventDoubleLinkClick = Class.extend({
  init: function($clickable){
    $clickable.click(function(e) {
      if($clickable.data('clicked')) {
        e.preventDefault();
        return false;
      } else {
        $clickable.data('clicked',true);
        return true;
      }
    });
  }
});

var ReloadPage = Class.extend({
  init: function(reload_page){
    window.location.href = reload_page;
  }
})

$(window).bind("popstate", function(e){
  var previous_state = new IhHistoryState(e.originalEvent.state)
  $.each(previous_state.state, function(key,value){
    var tab_group = TabGroup.find(key)
    if(tab_group){
      var tab_trigger = tab_group.getTabByPushState(value)
      if(tab_trigger){
        tab_trigger.toggleTarget('no history');
      }
    }
  })
});
$(document).ready(function(){
  $(document).on('change','[data-toggler]',function(){
    new Toggler($(this));
  })
  $('[data-toggler]').each(function(){
    new Toggler($(this));
  })
  $('[data-disable_forms]').each(function(){
    new DisableForms($(this));
  })
  $('[data-link]').each(function(){
    new Link($(this));
  })
  // Initailizes auto complete for select inputs
  $('input,select,textarea').filter(':visible:enabled:first').each(function(){
    if(!$(this).data('date-picker')){
      $(this).focus();
    }
  });
});
if(typeof any_time_manager === "undefined"){
  loadJs("//rawgit.com/edraut/anytime_manager/master/anytime_manager.js");
};
any_time_manager.registerListWithClasses({
  'expand-state' : 'Expandable', 'prevent-double-click' : 'PreventDoubleLinkClick'
});
any_time_manager.registerList(
  'hover_overflow','hidey_button','submit-proxy','click_proxy','field-filler','revealer',
  'checkbox-hidden-proxy','prevent-double-submit','prevent-double-link-click', 'tab-group',
  'hover-reveal', 'emptier', 'remover');