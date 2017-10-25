Set.prototype.isSuperset = function(subset) {
  var this_set = this
  subset.forEach (function(elem) {
    if (!this_set.has(elem)) {
      return false;
    }
  })
  return true;
}

Set.prototype.union = function(setB) {
  var union = Set.from_iterable(this);
  setB.forEach(function(elem) {
    union.add(elem);
  })
  return union;
}

Set.prototype.intersection = function(setB) {
  var intersection = new Set();
  var this_set = this
  setB.forEach(function(elem) {
    if (this_set.has(elem)) {
      intersection.add(elem);
    }
  })
  return intersection;
}

Set.prototype.difference = function(setB) {
  var difference = Set.from_iterable(this);
  setB.forEach( function (elem) {
    difference.delete(elem);
  })
  return difference;
}
Set.from_iterable = function(arr) {
  if(typeof Set.prototype.values == 'undefined'){
    var new_set = new Set()
    arr.forEach(function(v,i,t){
      new_set.add(v)
    })
  }else{
    var new_set = new Set(arr)
  }
  return new_set
}
var initHooch = function(){
  hooch = {
    Emptier: Class.extend({
      init: function($emptier){
        var $target = $($emptier.data('target'));
        var emptier = this
        var scroll_to_selector = $emptier.data('scroll-to')
        if($(scroll_to_selector).length > 0){
          this.scroll_to = $(scroll_to_selector)
        }
        $emptier.click(function(e){
          $target.empty();
          if(emptier.scroll_to){
            if($('[data-hooch-offset]').length > 0){
              extra_offset = $('[data-hooch-offset]').outerHeight()
            }
              $('html, body').animate({
                scrollTop: emptier.scroll_to.offset().top - extra_offset
              }, 300);

          }
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
    HideShow: Class.extend({
      init: function($trigger){
        this.$trigger = $trigger
        this.$target = $($trigger.data('target'))
        var trigger = this
        if($trigger.data('any-click-closes')){
          $(window).on('click',function(e){
            if(trigger.$target.is(':visible') && ($(e.target).data('target') != trigger.$trigger.data('target'))){
              trigger.$target.hide()
            }
          })
        }
        $trigger.on('click', function(e){
          trigger.$target.toggle()
        })
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
        var $revealable = $hover_revealer.data('revealable')
        $hover_revealer.bind('mouseover',function(){
          $revealable.show();
        });
        $hover_revealer.bind('mouseout',function(){
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
    ModalTrigger: Class.extend({
      init: function($modal_trigger){
        this.$modal_content = $($modal_trigger.data('content-target'))
        var modal_trigger = this
        $modal_trigger.on('click', function(){
          new hooch.Modal(modal_trigger.$modal_content)
        })
      }
    }),
    ModalDismisser: Class.extend({
      init: function($dismisser,modal_mask){
        var dismisser = this
        this.$dismisser = $dismisser;
        hooch.dismisser = this
        this.modal_mask = modal_mask
        $dismisser.css({cursor: 'pointer'})
        $dismisser.on('click', function(){
          dismisser.dismissModal()
        })
      },
      dismissModal: function(){
        hooch.dismisser = null
        this.modal_mask.close()
      }
    }),
    Modal: Class.extend({
      init: function($modal_content){
        this.$modal_content = $modal_content
        this.getMask()
        this.getDismisser()
        this.getContentWrapper()
        this.attachDismisser()
        this.disableScroll()
        this.$modal_content.trigger('modalInitialized')
        this.$modal_mask.show()
        this.$modal_content.trigger('modalVisible')
      },
      getMask: function(){
        this.mask_top = $(window).scrollTop()
        this.mask_height = $(window).height()
        this.$modal_mask = $('#hooch-mask')
        this.$modal_mask.css({height: this.mask_height + 'px', top: this.mask_top + 'px',
          position: 'absolute', 'z-index': 100000,
          left: 0, right: 0, bottom: 0
        })
      },
      getContentWrapper: function(){
        this.$modal_wrapper = this.$modal_mask.find('#hooch-modal')
        this.$modal_element = $('<div/>', {id: 'hooch_content', style: 'position: relative; float: left;'})
        this.$modal_wrapper.html(this.$modal_element)
        this.$modal_element.html(this.$modal_content)
        this.$modal_content.show()
      },
      getDismisser: function(){
        this.$dismisser = this.$modal_mask.find('#hooch-dismiss')
      },
      attachDismisser: function(){
        this.$modal_wrapper.append(this.$dismisser)
        this.dismisser = new hooch.ModalDismisser(this.$dismisser,this)
      },
      close: function(){
        this.$modal_mask.hide()
        this.$modal_content.hide()
        this.enableScroll()
        this.$modal_content.trigger('modalClosed')
      },
      disableScroll: function(){
        var modal = this
        modal.old_height = $('body')[0].style.height
        modal.old_overflow = $('body')[0].style.overflow
        $('body').css({height: '100%',overflow: 'hidden'})
        $('body').on({
          'mousewheel.hoochModalScroll DOMMouseScroll.hoochModalScroll': function(e) {
            if(($(e.target).attr('id') == 'hooch-content') || ($(e.target).parents('#hooch-content').length > 0)){
              var delta = e.originalEvent.wheelDelta
              new_scrolltop = $('#hooch-content').scrollTop() - delta
              $('#hooch-content').scrollTop(new_scrolltop)
            }
            e.preventDefault();
          }
        })
        if (window.addEventListener){ // older FF
          window.addEventListener('DOMMouseScroll', hooch.preventDefault, false)
        }
        window.onwheel = hooch.preventDefault; // modern standard
        window.onmousewheel = document.onmousewheel = hooch.preventDefault; // older browsers, IE
        window.ontouchmove  = hooch.preventDefault; // mobile
        document.onkeydown  = hooch.preventDefaultForScrollKeys;
      },
      enableScroll: function(){
        $('body').css({height: this.old_height, overflow: this.old_overflow})
        $('body').off('.hoochModalScroll')
        if (window.removeEventListener){
          window.removeEventListener('DOMMouseScroll', hooch.preventDefault, false);
        }
        window.onmousewheel = document.onmousewheel = null;
        window.onwheel = null;
        window.ontouchmove = null;
        document.onkeydown = null;
      }
    }),
    closeModal: function(){
      if(hooch.dismisser){
        hooch.dismisser.dismissModal()
      }
    },
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
            if($(this).data('hooch_collapser')){
              var hooch_collapser = $(this).data('hooch_collapser')
              expandable.collapsers.push(hooch_collapser)
              hooch_collapser.addExpandable(expandable)
            } else{
              expandable.collapsers.push(new hooch.Collapser($(this),expandable))
            }
          })
        }
        this.$expander = $('[data-expand-id="' + $expandable.data('expand-id') + '"][data-expander]');
        this.expanders = []
        this.$expander.each(function(){
          if($(this).data('hooch_expander')){
            var hooch_expander = $(this).data('hooch_expander')
            expandable.expanders.push(hooch_expander)
            hooch_expander.addExpandable(expandable)
          } else{
            expandable.expanders.push(new hooch.Expander($(this),expandable))
          }
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
        this.$expander.data('hooch_expander', this);
        this.targets = [target];
        this.expand_class = $expander.data('expand-class')
        this.collapse_class = $expander.data('collapse-class')
        this.bindTarget(target);
      },
      addExpandable: function(target){
        this.targets.push(target)
        this.bindTarget(target)
      },
      bindTarget: function(target){
        if(this.$expander.data('fake-dropdown')){
          target.$expandable.on('click',function(){
            target.toggle();
          })
          target.$expandable.on('mouseleave',function(){
            target.collapse();
          })
        }
        this.$expander.bind('click',function(){
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
        } else if(this.targets[0].collapsers.length > 0) {
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
        } else if(this.targets[0].collapsers.length > 0) {
          this.$expander.show();
        }
      }
    }),
    Collapser: Class.extend({
      init: function($collapser,target){
        this.$collapser = $collapser;
        this.$collapser.data('hooch_collapser', this);
        $collapser.bind('click',function(){
          target.collapse();
        })
      },
      addExpandable: function(target){
        this.$collapser.bind('click',function(){
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
        this.$revealer          = $revealer;
        this.children_id        = this.$revealer.data('revealer-children-id');
        this.$all_children      = $('[data-revealer-id="' + this.children_id + '"]');
        this.bindEvent();
        revealer.reveal();
      },
      reveal: function(){
        var sanitized_value = this.getSanitizedValue();
        if('true' == sanitized_value){ sanitized_value = true }
        if('false' == sanitized_value){ sanitized_value = false }
        this.$children = [];
        var revealer = this;
        this.$all_children.each(function(){
          var triggers = $(this).data('revealer-triggers');
          if(triggers){
            trigger_prototype = typeof(triggers)
            if(trigger_prototype.toLowerCase() == 'string'){
              var revelation_triggers = eval('(' + triggers + ')');
            } else {
              revelation_triggers = triggers
            }
            if($.inArray(sanitized_value,revelation_triggers) > -1){
              revealer.$children.push($(this));
            }
          } else {
            if(sanitized_value == $(this).data('revealer-trigger')){
              revealer.$children.push($(this));
            }
          }
        });
        this.hideChildren();
        this.revealChosenOnes();
      },
      getSanitizedValue: function(){
        if(this.$revealer[0].nodeName.toLowerCase() == "select"){
          var sanitized_value = this.$revealer.val();
        } else if(this.$revealer[0].nodeName.toLowerCase() == "input" && this.$revealer.attr('type') == "checkbox"){
          var sanitized_value = this.$revealer.is(':checked');
        }
        return sanitized_value;
      },
      hideChildren: function(){
        this.$all_children.hide();
      },
      revealChosenOnes: function(){
        $.each(this.$children,function(){ $(this).show(); });
      },
      bindEvent: function(){
        var revealer = this;
        this.$revealer.bind('change',function(){
          revealer.reveal();
        });
      }
    }),
    TabGroup: Class.extend({
      init: function($tab_group){
        this.$tab_group = $tab_group;
        this.getStateBehavior();
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
          this.default_tab.toggleTarget(this.state_behavior);
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
      },
      getStateBehavior: function(){
        if(this.$tab_group.data('no-history')){
          this.state_behavior = 'no history'
        } else {
          this.state_behavior = 'replace'
        }
      }
    }),
    TabTrigger: Class.extend({
      init: function($tab_trigger,tab_group){
        this.$tab_trigger = $tab_trigger;
        this.tab_group = tab_group;
        this.state_behavior = this.tab_group.state_behavior
        this.tab_group_name = tab_group.name;
        this.tab_id = $tab_trigger.data('tab-target-id');
        this.getPushState();
        this.getTarget();
        var tab_trigger = this;
        $tab_trigger.on('click', function(e){
          e.preventDefault();
          tab_trigger.$tab_trigger.trigger('tabTriggerClicked')
          tab_trigger.toggleTarget()
          tab_trigger.$tab_trigger.trigger('tabLoaded')
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
      toggleTarget: function(requested_state_behavior){
        var was_visible = this.$target.is(':visible');
        if(!was_visible){
          this.tab_group.setActiveTab(this);
          this.resize();
          var change_history = true;
          var history_method = 'pushState'
          if('no history' == requested_state_behavior || 'no history' == this.state_behavior){
            change_history = false
          } else if('replace' == requested_state_behavior){
            history_method = 'replaceState'
          }
          if (this.push_state && change_history) {
            var current_query = jQuery.extend(true, {}, hooch.beginning_params);
            current_query = jQuery.extend(true, current_query, history.state);
            var current_state = new hooch.IhHistoryState(current_query)
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
      },
      addPath: function(new_path){
        this.new_path = new_path
      },
      newPath: function(){
        return [location.protocol, '//', location.host, this.new_path].join('');
      },
      addKeyValue: function(key,value){
        this.addState(key,value)
        this.setNewParams()
      },
      setNewParams: function(){
        history['replaceState'](this.state, null, this.toUrl());
      },
      replacePath: function(new_path){
        this.addPath(new_path)
        history['replaceState']({}, null, this.newPath());
      }
    }),
    HistoryPusher: Class.extend({
      init: function($history_pusher){
        this.$history_pusher = $history_pusher
        this.getPusherType()
        var history_pusher = this
        this.bindPusher()
      },
      bindPusher: function(){
        var bind_method = 'bind' + this.pusher_type
        this[bind_method]()
      },
      bindLink: function(){
        var history_pusher = this
        this.$history_pusher.on('click apiclick', function(){
          history_pusher.pushIt()
        })
      },
      bindForm: function(){
        var history_pusher = this
        this.$history_pusher.on('submit apisubmit', function(){
          history_pusher.pushIt()
        })
      },
      getPusherType: function(){
        switch(this.$history_pusher.get(0).nodeName.toLowerCase()){
          case 'form':
            this.pusher_type = 'Form'
            break;
          case 'a':
          default:
            this.pusher_type = 'Link'
            break;
        }
      },
      getNewParams: function(){
        var get_params_method = 'get' + this.pusher_type + 'Params'
        this[get_params_method]()
      },
      getFormParams: function(){
        this.new_params = this.$history_pusher.serializeArray().
          reduce(
            function(obj, item) {
              obj[item.name] = item.value;
              return obj;
            },
            {}
          );
      },
      getLinkParams: function(){
        this.new_params = {}
        this.new_params[this.$history_pusher.data('key')] = this.$history_pusher.data('value')
      },
      pushIt: function(){
        this.getNewParams()
        var history_pusher = this
        history_pusher.current_state = new hooch.IhHistoryState(history.state)
        $.each(this.new_params,function(new_key,new_value){
          history_pusher.current_state.addState(new_key,new_value)
        })
        history_pusher.current_state.setNewParams()
      }
    }),
    HistoryReplacer: Class.extend({
      init: function($history_replacer){
        this.new_path = $history_replacer.data('new-path')
        var history_replacer = this
        $history_replacer.on('click', function(){
          history_replacer.replaceIt()
        })
      },
      replaceIt: function(){
        this.current_state = new hooch.IhHistoryState(history.state)
        this.current_state.replacePath(this.new_path)
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
        var $target = $($remover.data('target'));
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
    }),
    PageReloader: Class.extend({
      init: function($reloader){
        $reloader.on('click', function(){
          window.location.reload(true)
        })
      }
    }),
    FakeCheckbox: Class.extend({
      init: function($fake_checkbox){
        this.$fake_checkbox = $fake_checkbox
        this.$form = this.getForm()
        this.prepDeselectors()
        this.$field = this.getField()
        var fake_checkbox = this
        this.$fake_checkbox.click(function(){ fake_checkbox.change() })
      },
      change: function(){
        if(this.$fake_checkbox.hasClass('checked')){
          this.deselect()
        } else {
          this.select()
        }
      },
      deselect: function(){
        this.$fake_checkbox.removeClass('checked')
        this.removeCheckedFromForm()
        this.removeValue()
      },
      select: function(){
        this.$fake_checkbox.addClass('checked')
        this.addCheckedToForm()
        this.addValue()
      },
      getField: function(){
        this.field_name = this.$fake_checkbox.data('field-name')
        this.value = this.$fake_checkbox.data('field-value')
        this.field_selector = '[name="' + this.field_name +'"][value="' + this.value + '"]'
        var $field
        if(this.$form.find(this.field_selector).length > 0){
          $field = this.$form.find(this.field_selector)
          this.$fake_checkbox.addClass('checked')
          this.addCheckedToForm()
        } else {
          $field = $('<input type="hidden" name="' + this.field_name + '" value="' + this.value + '">')
        }
        return $field
      },
      getForm: function(){
        var form_selector = this.$fake_checkbox.data('form-selector')
        var $form = $(form_selector)
        if($form.length == 0){
          console.log("WARNING: hooch.FakeCheckbox could not find the form with the selector '" + form_selector + "'")
        }
        var toggleable_selector = this.$fake_checkbox.data('toggle-form')
        if(toggleable_selector == true || toggleable_selector == 'true'){
          this.$toggle_form = $form
        } else {
          var $toggleable = $(toggleable_selector)
          if($toggleable.length > 0){
            this.$toggle_form = $toggleable
          } else {
            this.$toggle_form = false
          }
        }
        return $form
      },
      prepDeselectors: function(){
        var $deselector = this.$form.find('[data-fake-deselector]')
        var fake_checkbox = this
        $deselector.on('click', function(){
          if(fake_checkbox.$fake_checkbox.hasClass('checked')){
            fake_checkbox.deselect()
          }
        })
      },
      addValue: function(){
        this.$form.append(this.$field)
        this.possiblyShowForm()
      },
      removeValue: function(){
        this.$field.detach()
        this.possiblyHideForm()
      },
      possiblyShowForm: function(){
        if(this.$toggle_form && this.$toggle_form.is(':hidden')){
          this.$toggle_form.show()
        }
      },
      possiblyHideForm: function(){
        if(this.$toggle_form && this.$toggle_form.is(':visible') && this.formNoCheckedBoxes()){
          this.$toggle_form.hide()
        }
      },
      addCheckedToForm: function(){
        if(this.$toggle_form){
          var form_checkbox_list = this.$form.data('checked_fake_checkboxes')
          if(form_checkbox_list){
            form_checkbox_list.push(this.field_selector)
            this.$form.data('checked_fake_checkboxes',form_checkbox_list)
          } else {
            this.$form.data('checked_fake_checkboxes',[this.field_selector])
          }
        }
      },
      removeCheckedFromForm: function(){
        if(this.$toggle_form){
          var form_checkbox_list = this.$form.data('checked_fake_checkboxes')
          var fake_checkbox = this
          var new_list = $.grep(form_checkbox_list, function(fs){return fs != fake_checkbox.field_selector})
          this.$form.data('checked_fake_checkboxes',new_list)
        }
      },
      formNoCheckedBoxes: function(){
        return (!this.$form.data('checked_fake_checkboxes') || this.$form.data('checked_fake_checkboxes').length == 0)
      }
    }),
    FakeSelect: Class.extend({
      init: function($fake_select){
        this.all_options    = []
        this.select_display = $fake_select.find('[data-select-display]')
        this.real_select = $fake_select.find('input')
        var fake_select = this
        $fake_select.find('[data-select-value][data-select-name]').each(function(){
          fake_select.all_options.push(new hooch.FakeOption($(this), fake_select));
        })
        if(this.real_select.val() != "" && typeof(this.real_select.val()) != "undefined"){
          this.initial_select(this.findOptionForValue(this.real_select.val()));
        }
      },
      initial_select: function(fake_option){
        this.select_display.html(fake_option.select_name);
        this.real_select.val(fake_option.select_value);
      },
      select: function(fake_option){
        this.initial_select(fake_option);
        this.select_display.trigger('click');
      },
      findOptionForValue: function(value){
        var selected_option
        $.each(this.all_options, function(i, option){
          if(option.select_value == value){
            selected_option = option
          }
        });
        return selected_option;
      }
    }),
    FakeOption: Class.extend({
      init: function($fake_option,$fake_select){
        this.select_value = $fake_option.data('select-value')
        this.select_name  = $fake_option.data('select-name')
        this.$fake_option = $fake_option
        var fake_option = this
        $fake_option.on('click', function(){
          $fake_select.select(fake_option)
        })
      }
    }),
    Sorter: Class.extend({
      init: function($sorter){
        this.$sorter = $sorter
        this.$jq_obj = $sorter
        $sorter.data('hooch.Sorter',this)
        //////////////////////////////////////////
        // Helpful for debugging in the browser
        // var new_uuid = new UUID
        // this.uniq_id = new_uuid.value
        // this.created_at = new Date()
        //////////////////////////////////////////
        this.is_visible = $sorter.is(':visible')
        if(this.is_visible){
          this.setWidth()
          this.setBoundaries()
          this.getSortElements()
        }
        this.getSendSort()
        this.startInactivityRefresh()
        var sorter = this
        $(window).on('mouseup touchend touchcancel', function(e){
          sorter.onMouseup(e)
        });
        $sorter.on('scroll', function(){
          sorter.handleScroll()
        })
        $sorter.parents().on('scroll', function(){
          sorter.handleScroll()
        })
        var observer = new MutationObserver(function(mutations) {
          sorter.onMutation(mutations)
        });
        var config = { childList: true, subtree: true, attributes: true }
        observer.observe($sorter[0], config);
      },
      usePolymorphicId: function(){
        if(this.$sorter.data('polymorphic-id')){
          return true
        } else {
          return false
        }
      },
      setWidth: function(){
        this.width = this.$sorter[0].getBoundingClientRect().width
        this.$sorter.css({width: this.width})
      },
      onMutation: function(mutations){
        if(this.disabled) return
        var sorter = this;
        var actually_changed_nodes = false
        mutations.forEach(function(mutation) {
          if(mutation.addedNodes.length > 0){
            var added_node = $(mutation.addedNodes[0])
            if((!added_node.attr('id') || !added_node.attr('id').startsWith('thin_man_ajax_progress')) && !added_node.data('hooch-sorter-managed')){
              actually_changed_nodes = true
            }
          }
          if(mutation.removedNodes.length > 0){
            var removed_node = $(mutation.removedNodes[0])
            if((!removed_node.attr('id') || !removed_node.attr('id').startsWith('thin_man_ajax_progress')) && !removed_node.data('hooch-sorter-managed')){
              actually_changed_nodes = true
            }
          }
          if(actually_changed_nodes){ //updating sorter for changed element list
            sorter.getSortElements()
            sorter.setBoundaries()
            sorter.getSendSort()
          }
        });
      },
      onMouseup: function(e){ // If some user action caused a sorter to become visible, set things up
        if(this.disabled) return
        var sorter = this
        setTimeout(function(){
          if(!sorter.is_visible){
            if(sorter.$sorter.is(':visible')){
              sorter.is_visible = true
              sorter.setWidth();
              sorter.getSortElements();
            }
          }
        },1000)
      },
      handleScroll: function(){
        var sorter = this
        if(this.scroll_finished){
          clearTimeout(this.scroll_finished);  
        }
        this.scroll_finished = setTimeout(function(){
          sorter.setBoundaries()
          sorter.refreshGrid()
        }, 100);
      },
      getPressedElement: function(){
        if(this.sort_elements){
          var possible_pressed_element = $.grep(this.sort_elements, function(sort_element,i){return sort_element.pressed})
          if(possible_pressed_element.length > 0){
            return possible_pressed_element[0]
          }
        }
        return false
      },
      getSortElements: function(){
        this.$sort_elements = this.$sorter.children()
        this.sort_elements = []
        var sorter = this;
        this.$sort_elements.each(function(){
          if($(this).data('hooch.SortElement')){
            tmp_sort_element = $(this).data('hooch.SortElement')
            // if(tmp_sort_element.is_placeholder){
            //   var sort_element = tmp_sort_element.sort_element
            // } else {
              var sort_element = tmp_sort_element
            // }
          } else {
            var sort_element = new hooch.SortElement($(this),sorter)
          }
          sorter.sort_elements.push(sort_element)
        })
        if(this.sort_elements.length > 0){
          this.row_height = this.sort_elements[0].height;
          var elem_widths = this.sort_elements.map(function(sort_element,i,arr){return sort_element.width})
          this.min_elem_width = Math.min.apply(null,elem_widths);
          this.refreshGrid();
          if((this.min_elem_width * 2) <= this.width){
            this.mode = 'Grid'
          } else {
            this.mode = 'Vertical'
          }
        } else if(this.height > 0){
          this.min_elem_width = this.width;
          this.refreshGrid();
          this.mode = 'Vertical'
        }
      },
      setBoundaries: function(){
        this.offset = this.$sorter[0].getBoundingClientRect()
        this.top_boundary = this.offset.top + window.pageYOffset
        this.left_boundary = this.offset.left + window.pageXOffset
        this.right_boundary = this.left_boundary + this.width
        this.height = this.$sorter[0].getBoundingClientRect().height
        this.bottom_boundary = this.top_boundary + this.height
      },
      handleDrag: function(){
        this.refreshSequence()
        this.refreshGrid()
      },
      handleRemoval: function(){

      },
      refreshGrid: function(){
        this.rows = {}
        var sorter = this
        $.each(this.sort_elements,function(i,sort_element){
          var this_element
          if(sort_element != sorter.dragging_element){
            this_element = sort_element
          } else {
            this_element = sort_element.placeholder
          }
          if(this_element){
            var elem_top = this_element.getOffset().top;
            if(!sorter.rows[elem_top]){
              sorter.rows[elem_top] = []
            }
            sorter.rows[elem_top].push(this_element)
          }
        })
        this.row_keys = Object.keys(this.rows).map(function(val,i){return parseFloat(val)}).sort(sorter.numberSort)
        if('Horizontal' == this.mode){
          $.each(this.rows, function(row_key,row){row.sort(sorter.elementHorizontalSort)})
        }
      },
      draggingElementForGrid: function(){
        if(this.dragging_element){
          if(this.dragging_element.dragging){
            return this.dragging_element.placeholder
          } else {
            return this.dragging_element
          }
        }
        return nil
      },
      refreshSequence: function(){
        var target_location = this.dragging_element.getCenter()
        var refresh_method = this['refreshSequence' + this.mode]
        refresh_method.call(this, target_location)
      },
      insertDraggingElement: function(element,e){
        this.dragging_element = element
        this.refreshSequence()
        this.getSortElements()
        this.refreshGrid()
      },
      refreshSequenceGrid: function(target_location){
        var dragging_element = this.dragging_element
        if(!this.withinCurrentRow(target_location.y)){
          this.seekCurrentRow(target_location)
        }
        if('end' == this.current_row_key){
          var last_element = this.getLastElement();
          if(!last_element.is_placeholder){
            last_element.$sort_element.after(dragging_element.placeholder.$sort_element)
          }
        } else if('begin' == this.current_row_key){
          var first_element = this.getFirstElement();
          if(!first_element.is_placeholder){
            first_element.$sort_element.before(dragging_element.placeholder.$sort_element)
          }
        } else {
          var hovered_element = this.getHoveredElementHorizontal(target_location);
          if(hovered_element){
            if('leftmost' == hovered_element){
              var leftmost_element = this.current_row[0]
              leftmost_element.$sort_element.before(dragging_element.placeholder.$sort_element)
            } else {
              hovered_element.$sort_element.after(dragging_element.placeholder.$sort_element);
            }
          }
        }
      },
      refreshSequenceVertical: function(target_location){
        var dragging_element = this.dragging_element
        var hovered_element = this.getHoveredElementVertical(target_location)
        if(hovered_element){
          if('first' == hovered_element){
            var first_key = this.row_keys[0]
            var first_element = this.rows[first_key][0]
            first_element.$sort_element.before(dragging_element.placeholder.$sort_element)
          } else if('empty' == hovered_element){
            this.$sorter.html(dragging_element.placeholder.$sort_element)
          } else {
            hovered_element.$sort_element.after(dragging_element.placeholder.$sort_element)
          }
        }
      },
      rowAfter: function(row){
        return this.row_keys[this.row_keys.indexOf[row] + 1]
      },
      elemAfter: function(row, elem){
        return row[row.indexOf(elem) + 1]
      },
      seekCurrentRow: function(target_location){
        var sorter = this
        var row_key = $.grep(this.row_keys,function(rowY,i){
          var nextRowY = sorter.rowAfter(rowY)
          var below_top_edge = target_location.y >= rowY
          if(nextRowY){
            var above_bottom_edge = target_location.y < nextRowY
          } else {
            var above_bottom_edge = target_location.y < (rowY + sorter.row_height)
          }
          return (below_top_edge && above_bottom_edge)
        })[0]
        if(row_key){
          this.current_row_key = row_key;
          this.current_row = this.rows[row_key];
        } else if(target_location.y > this.rows[Math.max.apply(null,this.row_keys)][0].getOffset().top) {
          this.current_row_key = 'end';
          this.current_row = undefined;
        } else {
          this.current_row_key = 'begin';
          this.current_row = undefined;
        }
      },
      getHoveredElementHorizontal: function(target_location){
        var current_element = false;
        var sorter = this
        current_element = $.grep(this.current_row, function(sort_element,i){
          if(!sort_element.is_placeholder){
            var elem_center = sort_element.getCenter();
            var slot_left = elem_center.x;
            var past_left_edge = target_location.x >= slot_left

            var next_elem = sorter.elemAfter(sorter.current_row, sort_element)
            var before_right_edge
            if(next_elem){
              if(!next_elem.is_placeholder){
                var next_elem_center = next_elem.getCenter();
                before_right_edge = target_location.x < next_elem_center.x
              }
            } else {
              before_right_edge = past_left_edge
            }
            return (past_left_edge && before_right_edge)
          }
          return false
        })[0]
        if(current_element){
          return current_element
        } else {
          var first_elem = this.current_row[0]
          if(first_elem && !first_elem.is_placeholder && first_elem.getCenter().x > target_location.x){
            return 'leftmost'
          }
        }
      },
      getHoveredElementVertical: function(target_location){
        if(this.$sort_elements.length == 0){
          return 'empty'
        } else {
          var sorter = this
          current_element_key = $.grep(sorter.row_keys, function(row_key,i){
            var this_elem = sorter.rows[row_key][0]
            if(!this_elem.is_placeholder){
              var elem_center = this_elem.getCenter()
              var slot_top = elem_center.y
              var below_top_edge = target_location.y >= slot_top
              var next_row = sorter.rows[sorter.row_keys[i+1]]
              var above_bottom_edge
              var next_elem
              if(next_row){
                next_elem = next_row[0]
                if(next_elem && !next_elem.is_placeholder){
                  var next_elem_center = next_elem.getCenter()
                  above_bottom_edge = target_location.y < next_elem_center.y
                }
              }
              if(!next_elem){
                above_bottom_edge = below_top_edge
              }
              return(below_top_edge && above_bottom_edge)
            }
            return false
          })[0]
          if(current_element_key){
            return this.rows[current_element_key][0]
          } else {
            var first_key = this.row_keys[0]
            var first_elem = this.rows[first_key][0]
            if(first_elem && !first_elem.is_placeholder && first_elem.getCenter().y > target_location.y){
              return 'first'
            }
          }
        }
      },
      getLastElement: function(){
        var last_row_key = this.row_keys[this.row_keys.length-1]
        var last_row = this.rows[last_row_key];
        return last_row[last_row.length-1]
      },
      getFirstElement: function(){
        var first_row_key = this.row_keys[0]
        var first_row = this.rows[first_row_key]
        return first_row[0]
      },
      elementHorizontalSort: function(a,b){
        if(a.getOffset().left < b.getOffset().left){
          return -1
        }
        if(b.getOffset().left < a.getOffset().left){
          return 1
        }
        return 0
      },
      numberSort: function(a,b){
        if(parseInt(a) < parseInt(b)){return -1}
        if(parseInt(b) < parseInt(a)){return 1}
        return 0
      },
      withinCurrentRow: function(y_value){
        if(this.current_row_key){
          var top_edge = this.current_row_key
          var bottom_edge = top_edge + this.row_height;
          var in_current_row = (top_edge < y_value) && (y_value < bottom_edge)
          if(in_current_row){
            this.current_row = this.rows[this.current_row_key]
          }
          return in_current_row
        }
        return false
      },
      setDraggingElement: function(sort_element){
        this.dragging_element = sort_element;
        var current_row = this.rows[sort_element.starting_offset.top]
        drag_index = current_row.indexOf(sort_element)
        if(drag_index > -1){
          current_row.splice(drag_index, 1)
        }
        current_row.push(sort_element.placeholder)
        this.refreshGrid();
      },
      giveUpDraggingElement: function(){
        var sorter = this
        $.each(this.rows, function(row_key, row){
          var placeholder_index = sorter.rows[row_key].indexOf(sorter.dragging_element.placeholder)
            if(placeholder_index > -1){
              sorter.rows[row_key].splice(placeholder_index,1)
            }
        })
        delete this.dragging_element
        this.getSortElements()
      },
      dropDraggingElement: function(){
        this.reinsertDraggingElement()
        this.sendSort()
      },
      reinsertDraggingElement: function(){
        if(this.dragging_element){
          this.rows[this.placeholderRowKey()].push(this.dragging_element)
          this.dragging_element.drop()
          delete this.dragging_element
          this.refreshGrid();
        }
      },
      sendSort: function(){
        $.ajax({
          url: this.$sorter.attr('href'),
          method: 'PATCH',
          data: this.getFormData()
        })
      },
      getFormData: function(){
        var id_array = $.map(this.$sorter.children(),function(e,i){return $(e).attr('id')})
        var form_data = {}
        if(this.usePolymorphicId()){
          form_data['polymorphic_items'] = id_array
        } else {
          var first_id = id_array[0]
          var last_underscore_location = first_id.lastIndexOf('_')
          var array_name = first_id.slice(0,last_underscore_location)          
          form_data[array_name] = id_array.map(function(id){
            return id.slice((last_underscore_location + 1))
          })
        }
        if(this.$sorter.data('sort-field')){
          form_data['sort_field'] = this.$sorter.data('sort-field')
        }
        var csrf_token = $('[name="csrf-token"]').attr('content')
        if(csrf_token){
          form_data['authenticity_token'] = csrf_token
        }
        return form_data
      },
      placeholderRowKey: function(){
        var sorter = this
        return $.grep(this.row_keys, function(row_key,i){
          var placeholder_index = sorter.rows[row_key].indexOf(sorter.dragging_element.placeholder)
          if(placeholder_index > -1){
            sorter.rows[row_key].splice(placeholder_index,1)
            return true
          }
          return false
        })[0]
      },
      containsPoint: function(point){
        var contains_horizontal = this.left_boundary <= point.x && point.x <= this.right_boundary
        var contains_vertical = this.top_boundary <= point.y && point.y <= this.bottom_boundary
        return contains_horizontal && contains_vertical
      },
      matchesFilters: function(element_filters){
        var recipient_filters = this.$sorter.data('recipient-filters')
        if(typeof element_filters.any == 'object'){
          // At least one of these is required to match
          var any = true
          for(var key in element_filters.any){
            if(!recipient_filters.hasOwnProperty(key)){
              any = false
              break
            }
            var include_source = Set.from_iterable(recipient_filters[key])
            var include_test = Set.from_iterable(element_filters.any[key])
            if(include_source.intersection(include_test).size == 0){
              any = false
              break
            }
          }
          if(!any) return false
        }
        // All of these are required to match
        var all = true
        for(var key in element_filters.all){
          if(!recipient_filters.hasOwnProperty(key)){
            all = false
            break
          }
          var include_source = Set.from_iterable(recipient_filters[key])
          var include_test = Set.from_iterable(element_filters.all[key])
          if(!include_source.isSuperset(include_test)){
            all = false
            break
          }
        }
        if(!all) return false
        // None of these can be present to match
        var none = true
        for(var key in element_filters.none){
          if(!recipient_filters.hasOwnProperty(key)){continue}
          var exclude_source = Set.from_iterable(recipient_filters[key])
          var exclude_test = Set.from_iterable(element_filters.none[key])
          if(exclude_source.intersection(exclude_test).size != 0){
            none = false
            break
          }
        }
        if(!none) return false
        return true
      },
      maskMe: function(){
        this.mask = $('<div>')
          .css({position: 'absolute', 'z-index': 1000,
            'background-color': 'rgba(64,64,64,0.5)',
            top: this.top_boundary, left: this.left_boundary,
            width: this.width, height: this.height})
        $('body').append(this.mask)
      },
      unmaskMe: function(){
        if(this.mask) this.mask.remove()
      },
      startInactivityRefresh: function(){
        this.last_activity_time = new Date().getTime();
        var sorter = this
        $('body').on("mousemove keypress", function(e) {
          sorter.last_activity_time = new Date().getTime();
        });
        setTimeout(function(){sorter.inactivityRefresh()}, 6000);
      },
      inactivityRefresh: function() {
        var sorter = this
        if(new Date().getTime() - this.last_activity_time >= 1800000){
          var $reload_link = $('<a>').text('Reload Page')
          new hooch.PageReloader($reload_link)
          var $modal_content = $('<div>').html("You must reload the page after 30 minutes of inactivity. ")
          $modal_content.append($reload_link)
          var modal = new hooch.Modal($modal_content)
          modal.$dismisser.remove()
          delete modal.dismisser
          delete modal.$dismisser
        } else {
          setTimeout(function(){sorter.inactivityRefresh()}, 60000);
        }
      },
      getSendSort: function(){
        var send_sort_now = this.$sorter.find('[data-send-sort-now]')
        var sorter = this
        if(send_sort_now.length > 0){
          console.log('got send sort:')
          console.log(this.$sorter.attr('id'))
          send_sort_now.on('click', function(){
            console.log('sending sort...')
            sorter.sendSort()
          })
        }
      },
      disable: function(){
        this.disabled = true
      }
    }),
    SortElement: Class.extend({
      init: function($sort_element,sorter){
        this.$jq_obj = $sort_element
        //////////////////////////////////////////
        // Helpful for debugging in the browser:
        // var new_uuid = new UUID
        // this.uniq_id = new_uuid.value
        // this.created_at = new Date()
        //////////////////////////////////////////
        if(sorter) this.sorter = sorter;
        $sort_element.data('hooch.SortElement', this)
        this.$sort_element = $sort_element;        
        this.reusable = $sort_element.data('sort-reusable')
        if(typeof(window.getComputedStyle) == 'function'){
          var computed_style = window.getComputedStyle(this.$sort_element[0])
          var current_offset = this.getOffset()
          this.width = current_offset.width
          this.height = current_offset.height
          this.background_color = computed_style.getPropertyValue('background-color')
          this.padding = computed_style.getPropertyValue('padding')
          this.float = computed_style.getPropertyValue('float')
        }else{
          this.width = this.$sort_element.width()
          this.height = this.$sort_element.height()
        }
        this.original_positioning = 
          { position: this.$sort_element.css('position'),
            top: this.$sort_element.css('top'),
            left: this.$sort_element.css('left'),
            width: this.width,
            height: this.height
          }
        $sort_element.css({width: this.width})
        this.dragging = false
        this.getDragHandle()
        this.$sort_element.css({cursor: ''});
        this.$drag_handle.css({cursor: 'move'});
        var sort_element = this
        this.$drag_handle.on('mousedown touchstart', $.proxy(sort_element.onMousedown, sort_element))
        this.$sort_element.on('dragstart', function(e){hooch.pauseEvent(e); return false})
        this.element_filters = this.getElementFilters() || {}
        $(window).on('mousemove touchmove', function(e){
          sort_element.onMousemove(e)
        })
        $(window).on('mouseup touchend touchcancel', function(e){
          sort_element.onMouseup(e)
        })
      },
      onMousedown: function(e){
        if(this.disabled) return
        hooch.pauseEvent(e)        
        if(1 == e.which){
          if(!this.pressed && !this.dragging && (!this.sorter || !this.sorter.dragging_element)){
            this.pressed = true
            this.starting_offset = this.getOffset();
            this.mouse_start = {top: e.originalEvent.pageY, left: e.originalEvent.pageX}
            this.maskNonTargets()
          }
        }
        return false
      },
      onMousemove: function(e){
        if(this.disabled) return
        hooch.pauseEvent(e)
        if(this.pressed){this.setDragging()}
        if(this.dragging){
          var target_sorter = this.targetSorter(e)
          if(target_sorter){
            this.attachToSorter(target_sorter,e)
          } else if(this.sorter){
            this.sorter.handleDrag()
          }
          this.setPosition(e)
        }
        return false
      },
      onMouseup: function(e){
        if(this.disabled) return
        if(this.pressed) this.unSetPressed()
        if(this.dragging) this.handleMouseUp()
      },
      handleMouseUp: function(){
        if(this.sorter){
          this.sorter.dropDraggingElement()
        } else {
          this.drop()
        }
      },
      currentSorters: function(){
        var sort_element = this
        return window.any_time_manager.recordedObjects['hooch.Sorter'].
          filter(function(sorter){return sorter != sort_element.sorter}) //Don't need the current parent
      },
      targetSorter: function(e){
        var current_sorters = this.currentSorters()
        if(current_sorters){
          var current_center = this.getCenter()
          var element_filters = this.element_filters
          return $.grep(current_sorters, function(sorter,i){
            return sorter.containsPoint(current_center) && sorter.matchesFilters(element_filters)
          })[0]
        }
      },
      maskNonTargets: function(){
        $.each(this.getNonTargets(), function(i,non_target_sorter){
          non_target_sorter.maskMe()
        })
      },
      unmaskNonTargets: function(){
        $.each(this.getNonTargets(), function(i,non_target_sorter){
          non_target_sorter.unmaskMe()
        })
      },
      getNonTargets: function(){
        var current_sorters = this.currentSorters()
        if(current_sorters){
          var element_filters = this.element_filters
          return $.grep(current_sorters, function(sorter,i){
            return !sorter.matchesFilters(element_filters)
          })       
        }
        return []
      },
      attachToSorter: function(target_sorter,e){
        if(this.reusable){
          delete this.reusable
        } else {
          this.destroyPlaceHolder()
        }
        if(this.sorter){
          this.sorter.giveUpDraggingElement()
        }
        this.createPlaceHolder()
        this.sorter = target_sorter
        this.sorter.insertDraggingElement(this)
      },
      unSetPressed: function(){
        this.pressed = false
      },
      getDragHandle: function(){
        this.$drag_handle = this.$sort_element.findExclude('[data-drag-handle]','[data-sorter]')
        if(this.$drag_handle.length < 1){
          this.$drag_handle = this.$sort_element
        }
      },
      createPlaceHolder: function(){
        var $placeholder = this.$sort_element.
            clone().
            removeAttr('id').
            removeAttr('data-sort-element').
            css(this.original_positioning)
        if(!this.reusable){ $placeholder.css({visibility: 'hidden'}) }
        if(this.sorter){ $placeholder.data('hooch-sorter-managed',true) }
        this.placeholder = new hooch.SortPlaceholder($placeholder,this)
      },
      destroyPlaceHolder: function(){
        this.placeholder.destroy()
        delete this.placeholder
      },
      setDragging: function(){
        this.dragging = true
        this.unSetPressed()
        this.createPlaceHolder()
        $tmp = $('<div style="display: none;" data-hooch-sorter-managed="true"></div>')
        this.$sort_element.before($tmp)
        this.$sort_element
          .css({position: 'absolute', top: this.starting_offset.top, left: this.starting_offset.left, width: this.width, height: this.height, backgroundColor: this.background_color, padding: this.padding, float: this.float})
          .data('hooch-sorter-managed',true)
          .appendTo('body')
        $tmp.replaceWith(this.placeholder.$sort_element)
        if(this.sorter){this.sorter.setDraggingElement(this)}
      },
      drop: function(){
        this.dragging = false
        this.css(this.original_positioning).data('hooch-sorter-managed',true)
        this.placeholder.replaceWith(this.$sort_element);
        delete this.placeholder
        this.unmaskNonTargets()
      },
      getElementFilters: function(){
        return this.$sort_element.data('target-filters')
      },
      getOffset: function(){
        var viewport_offset = this.$sort_element[0].getBoundingClientRect()
        return {top: viewport_offset.top + window.pageYOffset,
          left: viewport_offset.left + window.pageXOffset,
          height: viewport_offset.height,
          width: viewport_offset.width}
      },
      setPosition: function(e){
        var delta = this.getDelta(e)
        var new_position = this.getNewPosition(delta);
        this.$sort_element.css(new_position);
      },
      getDelta: function(e){
        return {
          top: (e.originalEvent.pageY - this.mouse_start.top),
          left: (e.originalEvent.pageX - this.mouse_start.left)
        }
      },
      getNewPosition: function(delta){
        return {top: (this.starting_offset.top + delta.top), left: (this.starting_offset.left + delta.left)}
      },
      getCenter: function(){
        var new_offset = this.getOffset()
        var newX = new_offset.left
        var newY = new_offset.top
        var width = this.width
        var height = this.height
        var centerX = newX + (width / 2)
        var centerY = newY + (height / 2)
        var center = {x: centerX, y: centerY}
        return center
      },
      clone: function(){
        return this.$sort_element.clone();
      },
      css: function(css_obj){
        return this.$sort_element.css(css_obj);
      },
      replaceWith: function($jq_obj){
        this.$sort_element.replaceWith($jq_obj)
      },
      disable: function(){
        this.disabled = true
      },
      destroy: function(){
        this.disable()
        this.$sort_element.remove()
      }
    }),
    scroll_keys: {37: 1, 38: 1, 39: 1, 40: 1},
    key_code_map: { // borrowed from jresig: https://github.com/jeresig/jquery.hotkeys
      8: "backspace",
      9: "tab",
      10: "return",
      13: "return",
      16: "shift",
      17: "ctrl",
      18: "alt",
      19: "pause",
      20: "capslock",
      27: "esc",
      32: "space",
      33: "pageup",
      34: "pagedown",
      35: "end",
      36: "home",
      37: "left",
      38: "up",
      39: "right",
      40: "down",
      45: "insert",
      46: "del",
      59: ";",
      61: "=",
      96: "0",
      97: "1",
      98: "2",
      99: "3",
      100: "4",
      101: "5",
      102: "6",
      103: "7",
      104: "8",
      105: "9",
      106: "*",
      107: "+",
      109: "-",
      110: ".",
      111: "/",
      112: "f1",
      113: "f2",
      114: "f3",
      115: "f4",
      116: "f5",
      117: "f6",
      118: "f7",
      119: "f8",
      120: "f9",
      121: "f10",
      122: "f11",
      123: "f12",
      144: "numlock",
      145: "scroll",
      173: "-",
      186: ";",
      187: "=",
      188: ",",
      189: "-",
      190: ".",
      191: "/",
      192: "`",
      219: "[",
      220: "\\",
      221: "]",
      222: "'"
    },
    preventDefault: function(e) {
      e = e || window.event;
      if (e.preventDefault)
        e.preventDefault();
      e.returnValue = false;
    },
    preventDefaultForScrollKeys: function(e) {
      if (hooch.scroll_keys[e.keyCode]) {
        hooch.preventDefault(e);
        return false;
      }
    },
    Atarget: Class.extend({
      init: function($atarget){
        $atarget.on('click', function(e) {
          e.preventDefault();
          var whichAnchor = $(this).attr('href');
          if($(whichAnchor).length) {
            $('html, body').animate({
              scrollTop: $(whichAnchor).offset().top -90
            }, 1000);
          }
        });
      }
    }),
    BindKey: Class.extend({
      init: function($bound_element){
        this.$bound_element = $bound_element
        this.element_type = $bound_element.get(0).nodeName.toLowerCase()
        this.key_name = $bound_element.data('bind-key')
        if(!this.key_name){
          console.log("Warning! Hooch key binder couldn't find a key name to bind")
          return
        }
        var key_binder = this
        var codes = $.grep(Object.keys(hooch.key_code_map), function(code){return (hooch.key_code_map[code] == key_binder.key_name)})
        if(codes.length < 1){
          console.log('Warning! Hooch key binder could not find a key to bind for the key name ' + this.key_name)
          return
        }
        $(window).on('keyup', function(e){key_binder.do_it_now(e)} )
      },
      do_it_now: function(e){
        var focussed_elem_name = document.activeElement.nodeName.toLowerCase()
        if('textarea' != focussed_elem_name &&
           'select' != focussed_elem_name &&
          ('input' != focussed_elem_name ||
           'submit' == $(document.activeElement).prop('type'))){
          var selected_key_name = hooch.key_code_map[e.keyCode]

          if(this.key_name == selected_key_name){
            e.preventDefault
            switch(this.element_type){
              case 'a':
              if(this.$bound_element.data('ajax-target')){
                this.$bound_element.click()
              } else {
                window.location = this.$bound_element.attr('href')
              }
              break;
              case 'form':
              this.$bound_element.submit()
              break;
              case 'input':
                if('submit' == $this.$bound_element.prop('type')){
                  this.$bound_element.click()
                }
              default:
              break;
            }
            return false
          }
        }
      }
    })
  };
  hooch.SortPlaceholder = hooch.SortElement.extend({
    init: function($sort_element,sort_element){
      var new_uuid = new UUID
      //////////////////////////////////////////
      // Helpful for debugging in the browser
      // this.uniq_id = new_uuid.value
      //////////////////////////////////////////

      $sort_element.data('hooch.SortElement', this)
      this.sort_element = sort_element
      this.sorter = sort_element.sorter;
      this.is_placeholder = true;
      this.$sort_element = $sort_element;
      this.width = this.$sort_element.width()
      this.height = this.$sort_element.height()
    }
  })
  hooch.AjaxExpandable = hooch.Expandable.extend({
    expand: function(){
      if(!this.ajax_loaded){
        this.ajax_loaded = true;
        new thin_man.AjaxLinkSubmission(this.$expander);
      }
      this._super();
    }
  });
  hooch.SelectActionChanger = hooch.FakeSelect.extend({
    init: function($fake_select){
      this.auto_submit = $fake_select.data('auto-submit');
      this._super($fake_select);
    },
    select: function(fake_option){
      var form = this.select_display.parents('form:first');
      form.attr('action', fake_option.select_value);
      this.select_display.html(fake_option.select_name);
      this.select_display.trigger('click');
      if (this.auto_submit){
        this.submitForm();
      }
    },
    submitForm: function(form){
      form.submit();
    }
  });
  hooch.FakeSelectRevealer = hooch.Revealer.extend({
    init: function($fake_select){
      this.fake_select = new hooch.FakeSelect($fake_select)
      this.children_id        = $fake_select.data('revealer-children-id');
      this.highlander         = $fake_select.data('revealer-highlander');
      this.$revelation_target = $('[data-revealer-target="' + this.children_id + '"]');
      this._super($fake_select);
    },
    bindEvent: function(){
      var revealer = this;
      $.each(this.fake_select.all_options, function(){
        this.$fake_option.bind('click', function(){
          revealer.reveal();
        })
      })
    },
    reveal: function(){
      var sanitized_value = this.fake_select.real_select.val()
      if('true' == sanitized_value){ sanitized_value = true }
      if('false' == sanitized_value){ sanitized_value = false }
      this.$children = [];
      var revealer = this;
      this.$all_children.each(function(){
        var triggers = $(this).data('revealer-triggers');
        if(triggers){
          trigger_prototype = typeof(triggers)
          if(trigger_prototype.toLowerCase() == 'string'){
            var revelation_triggers = eval('(' + triggers + ')');
          } else {
            revelation_triggers = triggers
          }
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
    getSanitizedValue: function(){
      return this.real_select.val();
    },
    hideChildren: function(){
      this._super();
      if (this.highlander){
        this.$form = this.$revealer.parents('form:first')
        if(this.$form.length > 0){
          this.$form.after(this.$all_children)
        }
      }
    },
    revealChosenOnes: function(){
      if (this.highlander){
        this.$revelation_target.html(this.$children);
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
    init: function($tab_group){
      this._super($tab_group)
      this.handlePreloads();
    },
    handlePreloads: function(){
      var tab_group = this
      var preload_tabs = this.$tab_group.data('preload-tabs');
      if(preload_tabs){
        var list_prototype = typeof(preload_tabs)
        if(list_prototype.toLowerCase() == 'string'){
          preload_tabs = eval('(' + preload_tabs + ')');
        }
        $.each(preload_tabs, function(i,preload_tab_id){
          var preload_tab = tab_group.tab_triggers_by_id[preload_tab_id]
          preload_tab.loadTarget();
        })
      }
    },
    getTabTriggerClass: function(){
      this.tab_trigger_class = hooch.AjaxTabTrigger;
    }
  });
  hooch.AjaxTabTrigger = hooch.TabTrigger.extend({
    toggleTarget: function(pop){
      var tab_group = this.tab_group;
      if(!this.ajax_loaded){
        this.loadTarget()
        this._super(pop);
      } else {
        this._super(pop);
        tab_group.resize()
      }
    },
    loadTarget: function(){
      var tab_group = this.tab_group;
      this.ajax_loaded = true;
      this.$tab_trigger.data('ajax-target','[data-tab-id="' + this.tab_id + '"]')
      new thin_man.AjaxLinkSubmission(this.$tab_trigger,{'on_complete': function(){tab_group.resize()}});
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
      ['hover_overflow','hidey_button','hide-show','submit-proxy','click-proxy','field-filler','revealer',
        'checkbox-hidden-proxy','prevent-double-submit','prevent-double-link-click', 'tab-group',
        'hover-reveal', 'emptier', 'remover', 'checkbox-proxy', 'fake-checkbox', 'fake-select', 'select-action-changer',
        'sorter', 'sort-element', 'bind-key','modal-trigger','history-pusher', 'history-replacer', 'link', 'atarget',
        'page-reloader'],'hooch');
    window.any_time_manager.load();
  };
  hooch.pauseEvent = function(e){
    if(e.stopPropagation) e.stopPropagation();
    if(e.preventDefault) e.preventDefault();
    e.cancelBubble=true;
    e.returnValue=false;
  };
  hooch.isTouchDevice = function(){
    var el = document.createElement('div');
    el.setAttribute('ongesturestart', 'return;');
    return typeof el.ongesturestart === "function";
  };
  //https://stackoverflow.com/questions/901115/how-can-i-get-query-string-values-in-javascript
  hooch.beginning_params = (function(a) {
    if (a == "") return {};
    var b = {};
    for (var i = 0; i < a.length; ++i)
    {
        var p=a[i].split('=', 2);
        if (p.length == 1)
            b[p[0]] = "";
        else
            b[p[0]] = decodeURIComponent(p[1].replace(/\+/g, " "));
    }
    return b;
  })(window.location.search.substr(1).split('&'));
  $.fn.findExclude = function( selector, mask, result )
  {
      result = typeof result !== 'undefined' ? result : new jQuery();
      this.children().each( function(){
          thisObject = jQuery( this );
          if( thisObject.is( selector ) )
              result.push( this );
          if( !thisObject.is( mask ) )
              thisObject.findExclude( selector, mask, result );
      });
      return result;
  }
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
  $(document).ajaxStop(function(){
    if(window.any_time_manager.hasOwnProperty('recordedObjects') && window.any_time_manager.recordedObjects.hasOwnProperty('hooch.Sorter')){
      $.each(window.any_time_manager.recordedObjects['hooch.Sorter'], function(index, sorter){
        sorter.setBoundaries()
      })
    }
  })
}
if(typeof Class === "undefined"){
  $.getScript('https://rawgit.com/edraut/js_inheritance/a6c1e40986ecb276335b0a0b1792abd01f05ff6c/inheritance.js', function(){
    initHooch();
  });
}else{
  initHooch();
}
