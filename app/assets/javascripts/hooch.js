var initHooch = function(){
  hooch = {
    Emptier: Class.extend({
      init: function($emptier){
        $target = $($emptier.data('target'));
        $emptier.click(function(e){
          $target.empty();
        })
      }
    }),
    Toggler: Class.extend({
      init: function(jq_obj){
        this.jq_obj = jq_obj;
        this.label = jq_obj.data('toggler');
        this.value = jq_obj.val();
        this.targets = $('[data-toggle_trigger="' + this.label + '"]');
        this.targets.hide();
        this.targets.filter('[data-toggle_value="' + this.value + '"]').show();
      }
    }),
    HoverOverflow: Class.extend({
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
    }),
    HoverReveal: Class.extend({
      init: function($hover_revealer){
        $revealable = $hover_revealer.data('revealable')
        jq_obj.bind('mouseover',function(){
          $revealable.show();
        });
        jq_obj.bind('mouseout',function(){
          $revealable.hide();
        });

      }
    }),
    HideyButton: Class.extend({
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
    }),
    Expandable: Class.extend({
      init: function($expandable){
        var expandable = this;
        this.expand_class = $expandable.data('expand-class');
        this.collapse_class = $expandable.data('collapse-class');
        this.$expandable = $expandable;
        $expandable.data('expandable',this);
        this.collapsers = []
        this.$collapser = $('[data-expand-id="' + $expandable.data('expand-id') + '"][data-collapser]');
        if(this.$collapser.length > 0){
          this.$collapser.each(function(){
            expandable.collapsers.push(new hooch.Collapser($(this),expandable))
          })
        }
        this.$expander = $('[data-expand-id="' + $expandable.data('expand-id') + '"][data-expander]');
        this.expanders = []
        this.$expander.each(function(){
          expandable.expanders.push(new hooch.Expander($(this),expandable))
        })
        this.initial_state = $expandable.data('expand-state');
        if(this.initial_state == 'expanded'){
          this.expand();
        } else {
          this.collapse();
        }
      },
      hide_expanders: function(){
        $.each(this.expanders, function(){
          this.hide();
        })
      },
      hide_collapsers: function(){
        $.each(this.collapsers, function(){
          this.hide();
        })
      },
      show_expanders: function(){
        $.each(this.expanders, function(){
          this.show();
        })
      },
      show_collapsers: function(){
        $.each(this.collapsers, function(){
          this.show();
        })
      },
      expand: function(){
        if(this.collapsers.length > 0){

          this.show_collapsers();
        }
        this.hide_expanders();
        if(this.expand_class){
          this.$expandable.addClass(this.expand_class)
          this.$expandable.removeClass(this.collapse_class)
        }else{
          this.$expandable.show();
        }
        this.state = 'expanded'
      },
      collapse: function(){
        if(this.collapsers.length > 0){
          this.hide_collapsers();
        }
        this.show_expanders();
        if(this.collapse_class || this.expand_class){
          this.$expandable.addClass(this.collapse_class)
          this.$expandable.removeClass(this.expand_class)
        }else{
          this.$expandable.hide();
        }
        this.state = 'collapsed'
      },
      toggle: function(){
        if(this.state == 'collapsed'){
          this.expand();
        } else {
          this.collapse();
        }
      }
    }),
    Expander: Class.extend({
      init: function($expander,target){
        this.$expander = $expander;
        this.target = target;
        this.expand_class = $expander.data('expand-class')
        this.collapse_class = $expander.data('collapse-class')
        if($expander.data('fake-dropdown')){
          target.$expandable.on('click',function(){
            target.toggle();
          })
          target.$expandable.on('mouseleave',function(){
            target.collapse();
          })
        }
        $expander.bind('click',function(){
          target.toggle();
        })
      },
      hide: function(){
        if(this.expand_class || this.collapse_class){
          if(this.expand_class){
            this.$expander.addClass(this.expand_class)
          }
          if(this.collapse_class){
            this.$expander.removeClass(this.collapse_class)
          }
        } else if(this.target.collapsers.length > 0) {
          this.$expander.hide();
        }
      },
      show: function(){
        if(this.expand_class || this.collapse_class){
          if(this.expand_class){
            this.$expander.removeClass(this.expand_class)
          }
          if(this.collapse_class){
            this.$expander.addClass(this.collapse_class)
          }
        } else if(this.target.collapsers.length > 0) {
          this.$expander.show();
        }
      }
    }),
    Collapser: Class.extend({
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
    }),
    DisableForms: Class.extend({
      init: function($disable_container){
        $disable_container.find('input, select').each(function(){
          $(this).prop('disabled',true);
        });
      }
    }),
    Revealer: Class.extend({
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
    }),
    TabGroup: Class.extend({
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
        hooch.TabGroup.addGroup(this);
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
        this.tab_trigger_class = hooch.TabTrigger;
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
    }),
    TabTrigger: Class.extend({
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
            var current_state = new hooch.IhHistoryState(history.state)
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
    }),
    IhHistoryState: Class.extend({
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
    }),
    GoProxy: Class.extend({
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
    }),
    FieldFiller: Class.extend({
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
    }),
    CheckboxProxy: Class.extend({
      init: function($proxy){
        this.$proxy = $proxy;
        this.target = $($proxy.data('target'));
        var checkbox_proxy = this;
        if(checkbox_proxy.target.prop('checked')){
          this.$proxy.html("&#10003;");
        }
        $proxy.on('click',function(){
          if(checkbox_proxy.target.prop('checked')){
            checkbox_proxy.uncheck();
          }else{
            checkbox_proxy.check();
          }
        })
      },
      uncheck: function(){
        this.target.prop('checked', false);
        this.$proxy.html("");
      },
      check: function(){
        this.target.prop('checked', true);
        this.$proxy.html("&#10003;");
      }
    }),
    Remover: Class.extend({
      init: function($remover){
        $target = $($remover.data('target'));
        $remover.click(function(e){
          $target.remove();
        })
      }
    }),
    Link: Class.extend({
      init: function($link){
        $link.click(function(){
          window.location = $link.attr('href');
        })
      }
    }),
    CheckboxHiddenProxy: Class.extend({
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
    }),
    PreventDoubleSubmit: Class.extend({
      init: function($clickable){
        this.$clickable = $clickable;
        var double_click_preventer = this;
        switch($clickable.get(0).nodeName.toLowerCase()){
          case 'form':
            $clickable.submit(function(e){ double_click_preventer.preventItNow(); });
            break;
          case 'input':
          default:
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
    }),
    PreventDoubleLinkClick: Class.extend({
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
    }),
    ReloadPage: Class.extend({
      init: function(reload_page){
        window.location.href = reload_page;
      }
    })
  };
  hooch.AjaxExpandable = hooch.Expandable.extend({
      expand: function(){
        if(!this.ajax_loaded){
          this.ajax_loaded = true;
          new thin_man.AjaxLinkSubmission(this.$expander);
        }
        this._super();
      }
  });
  hooch.FormFieldRevealer = hooch.Revealer.extend({
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
  hooch.AjaxTabGroup = hooch.TabGroup.extend({
    getTabTriggerClass: function(){
      this.tab_trigger_class = hooch.AjaxTabTrigger;
    }
  });
  hooch.AjaxTabTrigger = hooch.TabTrigger.extend({
    toggleTarget: function(pop){
      var tab_group = this.tab_group;
      if(!this.ajax_loaded){
        this.ajax_loaded = true;
        this.$tab_trigger.data('ajax-target','[data-tab-id="' + this.tab_id + '"]')
        new thin_man.AjaxLinkSubmission(this.$tab_trigger,{'on_complete': function(){tab_group.resize()}});
        this._super(pop);
      } else {
        this._super(pop);
        tab_group.resize()
      }
    },
    resize: function(){
      // noop
    }
  });
  hooch.ClickProxy = hooch.GoProxy.extend({
    getTarget: function(){
      if(this.$proxy.data('target')){
        return $(this.$proxy.data('target'));
      } else {
        return this.$proxy.siblings('a');
      }
    },
    doItNow: function(){
      if(this.doable()) {
        if(this.target.data('ajax-target')){
          this.target.click();
        }else if(this.target.attr('href')){
          window.location = this.target.attr('href');
        }
        this.first_submit = false;
      }
    }
  });
  hooch.SubmitProxy = hooch.GoProxy.extend({
    getTarget: function(){
      if(this.$proxy.data('target')){
        return $(this.$proxy.data('target'));
      } else {
        return this.$proxy.parents('form:first');
      }
    },
    doItNow: function(){
      if(this.doable()) {
        this.target.submit();
        this.first_submit = false;
      }
    }
  });
  hooch.TabGroup.addGroup = function(group){
    if(!hooch.TabGroup.all_groups){
      hooch.TabGroup.all_groups = [];
    }
    hooch.TabGroup.all_groups.push(group);
  };
  hooch.TabGroup.find = function(name){
    var selected_group = null;
    $.each(hooch.TabGroup.all_groups,function(index,group){
      if(group.name == name){
        selected_group = group;
      }
    });
    return selected_group;
  };
  hooch.loadClasses = function(){
    window.any_time_manager.registerListWithClasses({
      'expand-state' : 'Expandable', 'prevent-double-click' : 'PreventDoubleLinkClick'
    },'hooch');
    window.any_time_manager.registerList(
      ['hover_overflow','hidey_button','submit-proxy','click-proxy','field-filler','revealer',
        'checkbox-hidden-proxy','prevent-double-submit','prevent-double-link-click', 'tab-group',
        'hover-reveal', 'emptier', 'remover', 'checkbox-proxy'],'hooch');
    window.any_time_manager.load();
  };
  $(document).ready(function(){
    if(typeof window.any_time_manager === "undefined" && typeof window.loading_any_time_manager === "undefined"){
      window.loading_any_time_manager = true;
      $.getScript("https://cdn.rawgit.com/edraut/anytime_manager/9f710d2280e68ea6156551728cb7e2d537a06ee6/anytime_manager.js",function(){
        window.loading_any_time_manager = false
        hooch.loadClasses();
      });
    }else if(typeof window.any_time_manager === "undefined"){
      if(typeof window.any_time_load_functions === 'undefined'){
        window.any_time_load_functions = []
      }
      window.any_time_load_functions.push(hooch.loadClasses)
    }else{
      hooch.loadClasses();
    };
    $(document).on('change','[data-toggler]',function(){
      new hooch.Toggler($(this));
    })
    $('[data-toggler]').each(function(){
      new hooch.Toggler($(this));
    })
    $('[data-disable_forms]').each(function(){
      new hooch.DisableForms($(this));
    })
    $('[data-link]').each(function(){
      new hooch.Link($(this));
    })
    // Initailizes auto complete for select inputs
    $('input,select,textarea').filter(':visible:enabled:first').each(function(){
      if(!$(this).data('date-picker')){
        $(this).focus();
      }
    });
  });
  $(window).bind("popstate", function(e){
    var previous_state = new hooch.IhHistoryState(e.originalEvent.state)
    $.each(previous_state.state, function(key,value){
      var tab_group = hooch.TabGroup.find(key)
      if(tab_group){
        var tab_trigger = tab_group.getTabByPushState(value)
        if(tab_trigger){
          tab_trigger.toggleTarget('no history');
        }
      }
    })
  });
}
if(typeof Class === "undefined"){
  $.getScript('https://rawgit.com/edraut/js_inheritance/a6c1e40986ecb276335b0a0b1792abd01f05ff6c/inheritance.js', function(){
    initHooch();
  });
}else{
  initHooch();
}
