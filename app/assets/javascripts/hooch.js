var initHooch = function(){
  hooch = {
    Emptier: Class.extend({
      init: function($emptier){
        var $target = $($emptier.data('target'));
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
          new hooch.Modal(modal_trigger.$modal_content.html())
        })
      }
    }),
    ModalDismisser: Class.extend({
      init: function($dismisser,modal_mask){
        var dismisser = this
        this.modal_mask = modal_mask
        $dismisser.css({cursor: 'pointer'})
        $dismisser.on('click', function(){
          dismisser.modal_mask.close()
        })
      }
    }),
    Modal: Class.extend({
      init: function($modal_content){
        this.$modal_content = $modal_content
        this.setGeometry()
        this.getMask()
        this.getModal()
        this.getDismisser()
        this.getContentWrapper()
        this.disableScroll()
        this.$modal_mask.show()
      },
      setGeometry: function(){
        this.margin = 30;
        this.padding = 30;
        this.mask_top = $(window).scrollTop()
        this.mask_height = $(window).height()
        this.modal_height = this.mask_height - (this.margin*2)
      },
      getMask: function(){
        this.$modal_mask = $('#hooch-mask')
        this.$modal_mask.css({height: this.mask_height + 'px', top: this.mask_top + 'px',
          position: 'absolute', 'z-index': 100000,
          left: 0, right: 0, bottom: 0,
          'background-color': 'rgba(0,0,0,0.5)'
        })
      },
      getModal: function(){
        this.$modal_element = this.$modal_mask.find('#hooch-modal')
        this.$modal_element.css({'max-height': this.modal_height,
          'margin-top': this.margin, 'margin-bottom': this.margin,
          'padding-bottom': this.padding, 'padding-left': this.padding, 'padding-right': this.padding,
          position: 'relative', float: 'left', 'margin-left': '50%',
          '-webkit-transform': 'translateX(-50%)',
          '-moz-transform': 'translateX(-50%)',
          '-ms-transform': 'translateX(-50%)',
          '-o-transform': 'translateX(-50%)',
          transform: 'translateX(-50%)'})
      },
      getContentWrapper: function(){
        this.$modal_content_wrapper = this.$modal_element.find('#hooch-content')
        var content_height = this.modal_height - (this.padding*2)
        this.$modal_content_wrapper.css({'overflow-y': 'scroll', 'max-height': content_height, position: 'relative', float: 'left'})
        this.$modal_content_wrapper.html(this.$modal_content)
      },
      getDismisser: function(){
        this.$dismisser = this.$modal_mask.find('#hooch-dismiss')
        this.$dismisser.css({position: 'relative', float: 'right', 'font-size': '22px', 'line-height': '30px'})
        this.dismisser = new hooch.ModalDismisser(this.$dismisser,this)
      },
      close: function(){
        this.$modal_mask.hide()
        this.$modal_content_wrapper.empty()
        this.enableScroll()
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
        this.$revealer = $revealer;
        this.children_id = this.$revealer.data('revealer-children-id');
        this.$all_children = $('[data-revealer-id="' + this.children_id + '"]');
        $revealer.bind('change',function(){
          revealer.reveal();
        });
        revealer.reveal();
      },
      reveal: function(){
        var sanitized_value = this.$revealer.val();
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
    FakeSelect: Class.extend({
      init: function($fake_select){
        this.select_display = $fake_select.find('[data-select-display]')
        this.real_select = $fake_select.find('input')
        var fake_select = this
        $fake_select.find('[data-select-value][data-select-name]').each(function(){
          new hooch.FakeOption($(this),fake_select)
        })
      },
      select: function(fake_option){
        this.select_display.html(fake_option.select_name);
        this.real_select.val(fake_option.select_value);
        this.select_display.trigger('click');
      }
    }),
    FakeOption: Class.extend({
      init: function($fake_option,$fake_select){
        this.select_value = $fake_option.data('select-value')
        this.select_name = $fake_option.data('select-name')
        var fake_option = this
        $fake_option.on('click',function(){
          $fake_select.select(fake_option)
        })
      }
    }),
    Sorter: Class.extend({
      init: function($sorter){
        this.$sorter = $sorter
        $sorter.data('sorter',this)
        this.is_visible = $sorter.is(':visible')
        if(this.is_visible){
          this.setWidth();
          this.getSortElements()
        }
        var sorter = this
        $(window).on('mouseup', function(e){
          sorter.onMouseup();
        });
        $(window).on('mousemove', function(e){
          sorter.onMousemove(e)
        })
        var observer = new MutationObserver(function(mutations) {
          sorter.handleMutations(mutations)
        });
        var config = { childList: true, subtree: true, attributes: true };
        observer.observe($sorter[0], config);
      },
      onMousemove: function(e){
        if(this.dragging_element){
          this.handleMouseMove(e)
        } else {
          var pressed_element = this.getPressedElement()
          if(pressed_element){
            pressed_element.setDragging()
            this.handleMouseMove(e)
          }
        }
        return true
      },
      handleMouseMove: function(e){
        hooch.pauseEvent(e)
        this.dragging_element.dragging = true
        this.redrawDraggingElement(e);
        this.refreshSequence(e)
        return false
      },
      onMouseup: function(){
        if(this.dragging_element){
          var tmp_dragging_element = this.dragging_element
          this.removeDraggingElement()
          if(tmp_dragging_element.dragging){
            this.sendSort()
          }
          tmp_dragging_element.dragging = false
        }
        var pressed_element = this.getPressedElement()
        if(pressed_element){
          pressed_element.unSetPressed()
        }
        var sorter = this
        setTimeout(function(){
          if(!sorter.is_visible){
            if(sorter.$sorter.is(':visible')){
              sorter.setWidth();
              sorter.getSortElements();
            }
          }
        },1000)
      },
      setWidth: function(){
        this.width = this.$sorter.width()
        this.$sorter.css({width: this.width})
      },
      handleMutations: function(mutations){
        var sorter = this;
        mutations.forEach(function(mutation) {
          if(mutation.addedNodes.length > 0){
            var added_node = $(mutation.addedNodes[0])
            if((!added_node.attr('id') || !added_node.attr('id').startsWith('thin_man_ajax_progress')) && !added_node.data('hooch-sorter-managed')){
              sorter.getSortElements()
            }
          }
          if(mutation.removedNodes.length > 0){
            var removed_node = $(mutation.removedNodes[0])
            if((!removed_node.attr('id') || !removed_node.attr('id').startsWith('thin_man_ajax_progress')) && !removed_node.data('hooch-sorter-managed')){
              sorter.getSortElements()
            }
          }
        });
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
          var sort_element = new hooch.SortElement($(this),sorter)
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
        }
      },
      refreshGrid: function(){
        this.rows = {}
        var sorter = this
        $.each(this.sort_elements,function(i,sort_element){
          if(sort_element != sorter.dragging_element){
            this_element = sort_element
          } else {
            this_element = sort_element.placeholder
          }
          var elem_top = this_element.getOffset().top;
          if(!sorter.rows[elem_top]){
            sorter.rows[elem_top] = []
          }
          sorter.rows[elem_top].push(this_element)
        })
        this.row_keys = Object.keys(this.rows).map(function(val,i){return parseFloat(val)}).sort(sorter.numberSort)
        $.each(this.rows, function(row_key,row){row.sort(sorter.elementHorizontalSort)})
      },
      redrawDraggingElement: function(e){
        this.dragging_element.setPosition(e);
      },
      refreshSequence: function(){
        var target_location = this.dragging_element.getCenter()
        var refresh_method = this['refreshSequence' + this.mode]
        refresh_method.call(this, target_location)
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
            this.refreshGrid()
          }
        } else if('begin' == this.current_row_key){
          var first_element = this.getFirstElement();
          if(!first_element.is_placeholder){
            first_element.$sort_element.before(dragging_element.placeholder.$sort_element)
            this.refreshGrid()
          }
        } else {
          var hovered_element = this.getHoveredElementHorizontal(target_location);
          if(hovered_element){
            if('leftmost' == hovered_element){
              var leftmost_element = this.current_row[0]
              leftmost_element.$sort_element.before(dragging_element.placeholder.$sort_element)
              this.refreshGrid()
            } else {
              hovered_element.$sort_element.after(dragging_element.placeholder.$sort_element);
              this.refreshGrid()
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
            this.refreshGrid()
          } else {
            hovered_element.$sort_element.after(dragging_element.placeholder.$sort_element)
            this.refreshGrid()
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
        var current_row = this.rows[this.dragging_element.starting_offset.top]
        drag_index = current_row.indexOf(sort_element)
        if(drag_index > -1){
          current_row.splice(drag_index, 1)
        }
        current_row.push(this.dragging_element.placeholder)
        this.refreshGrid();
      },
      clearDraggingElement: function(){
        if(this.dragging_element){
          this.removeDraggingElement()
        }
      },
      removeDraggingElement: function(){
        if(this.dragging_element){
          var placeholder_row = this.removePlaceholder()
          this.rows[placeholder_row].push(this.dragging_element)
          this.dragging_element.drop()
          this.dragging_element = undefined;
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
        var first_id = id_array[0]
        var last_underscore_location = first_id.lastIndexOf('_')
        var array_name = first_id.slice(0,last_underscore_location)
        var form_data = {}
        form_data[array_name] = id_array.map(function(id){
          return id.slice((last_underscore_location + 1))
        })
        if(this.$sorter.data('sort-field')){
          form_data['sort_field'] = this.$sorter.data('sort-field')
        }
        var csrf_token = $('[name="csrf-token"]').attr('content')
        if(csrf_token){
          form_data['authenticity_token'] = csrf_token
        }
        return form_data
      },
      removePlaceholder: function(){
        var sorter = this
        return $.grep(this.row_keys, function(row_key,i){
          var placeholder_index = sorter.rows[row_key].indexOf(sorter.dragging_element.placeholder)
          if(placeholder_index > -1){
            sorter.rows[row_key].slice(placeholder_index,1)
            return true
          }
          return false
        })[0]
      }
    }),
    SortElement: Class.extend({
      init: function($sort_element,sorter){
        this.sorter = sorter;
        this.$sort_element = $sort_element;
        this.old_position = $sort_element.css('position')
        this.starting_width = this.$sort_element[0].style.width
        this.starting_height = this.$sort_element[0].style.height
        this.starting_top = this.$sort_element[0].style.top
        this.starting_left = this.$sort_element[0].style.left
        $sort_element.css({width: this.starting_width})
        if(typeof(window.getComputedStyle) == 'function'){
          var computed_style = window.getComputedStyle(this.$sort_element[0])
          this.width = parseInt(computed_style.width)
          this.height = parseInt(computed_style.height)
        }else{
          this.width = this.$sort_element.width()
          this.height = this.$sort_element.height()
        }
        this.dragging = false
        this.getDragHandle()
        this.$sort_element.css({cursor: ''});
        this.$drag_handle.css({cursor: 'move'});
        var sort_element = this
        this.$drag_handle.on('mousedown', $.proxy(sort_element.onMousedown, sort_element))
        this.$sort_element.on('dragstart', function(e){hooch.pauseEvent(e); return false})
      },
      onMousedown: function(e){
        if(1 == e.which){
          this.sorter.clearDraggingElement();
          this.pressed = true
          this.starting_offset = this.getOffset();
          this.mouse_start = {top: e.originalEvent.pageY, left: e.originalEvent.pageX}
        }
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
      setDragging: function(){
        this.sorter.clearDraggingElement();
        this.unSetPressed()
        this.placeholder = new hooch.SortPlaceholder(this.$sort_element.clone().removeAttr('id').css({width: this.width, height: this.height}).data('hooch-sorter-managed',true),this.sorter)
        this.placeholder.css({'visibility': 'hidden'});
        // this.placeholder.css({'background-color': 'pink'});
        $tmp = $('<div style="display: none;" data-hooch-sorter-managed="true"></div>')
        this.$sort_element.before($tmp)
        this.$sort_element
          .css({position: 'absolute', top: this.starting_offset.top, left: this.starting_offset.left, width: this.width, height: this.height})
          .data('hooch-sorter-managed',true)
          .appendTo('body')
        $tmp.replaceWith(this.placeholder.$sort_element)
        this.sorter.setDraggingElement(this);
      },
      drop: function(){
        this.css({position: this.old_position, top: this.starting_top, left: this.starting_left, width: this.starting_width, height: this.starting_height}).data('hooch-sorter-managed',true)
        this.placeholder.replaceWith(this.$sort_element);
        this.placeholder = undefined
      },
      getOffset: function(){
        return this.$sort_element.offset();
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
    init: function($sort_element,sorter){
      this.sorter = sorter;
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
        form.submit();
      }
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
        'hover-reveal', 'emptier', 'remover', 'checkbox-proxy', 'fake-select', 'select-action-changer',
        'sorter','bind-key','modal-trigger'],'hooch');
    window.any_time_manager.load();
  };
  hooch.pauseEvent = function(e){
    if(e.stopPropagation) e.stopPropagation();
    if(e.preventDefault) e.preventDefault();
    e.cancelBubble=true;
    e.returnValue=false;
  }
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
