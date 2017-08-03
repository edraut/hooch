MutationObserver = Class.extend({
  init: function(callback){},
  observe: function(elem,config){}
})
String.prototype.startsWith = function(prefix) {
    return this.slice(0, prefix.length) == prefix;
}
describe("hooch", function() {

  it("Emptier", function() {
    var emptier_div = affix('[data-emptier="true"][data-target="#my_div"]')
    var emptier_target = affix('#my_div')
    emptier_target.html('stuff')
    $('[data-emptier]').each(function(){new hooch.Emptier($(this))})
    expect(emptier_target.html()).toMatch('stuff');
    $('[data-emptier]').click()
    expect(emptier_target.html()).not.toMatch('stuff');
  });

  it("Remover", function(){
    var remover_div = affix('[data-remover="true"][data-target="#my_div"]')
    var remover_target = affix('#my_div')
    $('[data-remover]').each(function(){new hooch.Remover($(this))})
    expect($('#my_div').length).toEqual(1);
    $('[data-remover]').click();
    expect($('#my_div').length).toEqual(0);
  });
  describe("Modal",function(){
    it('displays content in a modal', function(){
      var mask = affix('#hooch-mask')
      mask.hide()
      var modal = mask.affix('#hooch-modal')
      var dismiss = modal.affix('#hooch-dismiss')
      var example_content = affix('div')
      example_content.html("This is some content to display in a modal. It has a unique id f82kd82ls.")
      var hooch_modal = new hooch.Modal(example_content)
      expect(mask.is(':visible')).toBe(true)
      expect(modal.html().indexOf('This is some content to display') !== -1).toBe(true);
    });
    it('dismisses a modal', function(){
      var mask = affix('#hooch-mask')
      mask.hide()
      var modal = mask.affix('#hooch-modal')
      var dismiss = modal.affix('#hooch-dismiss')
      var example_content = affix('div')
      example_content.html("This is some content to display in a modal. It has a unique id f82kd82ls.")
      var hooch_modal = new hooch.Modal(example_content)
      expect(mask.is(':visible')).toBe(true)
      hooch_modal.close()
      expect(mask.is(':visible')).toBe(false)
    })
  });
  describe("Expander",function(){
    it('expands and collapses an element', function(){
      var expander = affix('[data-expander="true"][data-expand-id="my_expander"]')
      var expandable = affix('[data-expand-state="collapsed"][data-expand-id="my_expander"]')
      $('[data-expand-state]').each(function(){new hooch.Expandable($(this))});
      expect($('[data-expand-state]').css('display')).toEqual('none');
      $('[data-expander]').click()
      expect($('[data-expand-state]').css('display')).not.toEqual('none');
      expect($('[data-expander]').css('display')).not.toEqual('none');
      $('[data-expander]').click()
      expect($('[data-expand-state]').css('display')).toEqual('none');
    })

    it('expands an element with a class and modifies trigger with an expand class', function(){
      var expander = affix('[data-expander="true"][data-expand-id="my_expander"][data-expand-class="test-class-trigger"]')
      var expandable = affix('[data-expand-state="collapsed"][data-expand-id="my_expander"][data-expand-class="test-class-content"]')
      $('[data-expand-state]').each(function(){new hooch.Expandable($(this))});
      expect($('[data-expand-state]').hasClass("test-class-content")).toBe(false);
      expect($('[data-expander]').hasClass("test-class-trigger")).toBe(false);
      $('[data-expander]').click()
      expect($('[data-expand-state]').hasClass("test-class-content")).toBe(true);
      expect($('[data-expander]').hasClass("test-class-trigger")).toBe(true);
      $('[data-expander]').click()
      expect($('[data-expand-state]').hasClass("test-class-content")).toBe(false);
      expect($('[data-expander]').hasClass("test-class-trigger")).toBe(false);
    })

    it('expands an element with a class and modifies trigger with a collapse class', function(){
      var expander = affix('[data-expander="true"][data-expand-id="my_expander"][data-collapse-class="test-class-trigger"]')
      var expandable = affix('[data-expand-state="collapsed"][data-expand-id="my_expander"][data-expand-class="test-class-content"]')
      $('[data-expand-state]').each(function(){new hooch.Expandable($(this))});
      expect($('[data-expand-state]').hasClass("test-class-content")).toBe(false);
      expect($('[data-expander]').hasClass("test-class-trigger")).toBe(true);
      $('[data-expander]').click()
      expect($('[data-expand-state]').hasClass("test-class-content")).toBe(true);
      expect($('[data-expander]').hasClass("test-class-trigger")).toBe(false);
      $('[data-expander]').click()
      expect($('[data-expand-state]').hasClass("test-class-content")).toBe(false);
      expect($('[data-expander]').hasClass("test-class-trigger")).toBe(true);
    })

    it('expands and collapses an element with separate triggers', function(){
      var expander = affix('[data-expander="true"][data-expand-id="my_expander"]')
      var collapser = affix('[data-collapser="true"][data-expand-id="my_expander"]')
      var expandable = affix('[data-expand-state="collapsed"][data-expand-id="my_expander"]')
      $('[data-expand-state]').each(function(){new hooch.Expandable($(this))});
      expect($('[data-expand-state]').css('display')).toEqual('none');
      $('[data-expander]').click()
      expect($('[data-expand-state]').css('display')).not.toEqual('none');
      expect($('[data-collapser]').css('display')).not.toEqual('none');
      expect($('[data-expander]').css('display')).toEqual('none');
      $('[data-collapser]').click()
      expect($('[data-expand-state]').css('display')).toEqual('none');
      expect($('[data-collapser]').css('display')).toEqual('none');
      expect($('[data-expander]').css('display')).not.toEqual('none');
    })
  });
  describe('FakeCheckbox', function(){
    it('finds the target form', function(){
      var $form = affix('form#target_form')
      var $fake_checkbox = affix('div[data-fake-checkbox="true"][data-form-selector="#target_form"]')
      var fake_checkbox = new hooch.FakeCheckbox($fake_checkbox)
      expect(fake_checkbox.$form.attr('id')).toEqual('target_form')
    });
    it('finds a preëxisting target field', function(){
      var $form = affix('form#target_form')
      var $field = $form.affix('input[type="hidden"][name="like_candy"][value="true"]')
      var $fake_checkbox = affix('div[data-fake-checkbox="true"][data-form-selector="#target_form"][data-field-name="like_candy"][data-field-value="true"]')
      var fake_checkbox = new hooch.FakeCheckbox($fake_checkbox)
      expect($fake_checkbox.hasClass('checked')).toBe(true)
      expect(fake_checkbox.$field[0].nodeName.toLowerCase()).toEqual('input')
      expect(fake_checkbox.$field.prop('type')).toEqual('hidden')
      expect(fake_checkbox.$field.prop('name')).toEqual('like_candy')
      expect(fake_checkbox.$field.prop('value')).toEqual('true')
    });
    it('creates a target field if none exists', function(){
      var $form = affix('form#target_form')
      var $fake_checkbox = affix('div[data-fake-checkbox="true"][data-form-selector="#target_form"][data-field-name="like_candy"][data-field-value="true"]')
      var fake_checkbox = new hooch.FakeCheckbox($fake_checkbox)
      expect($fake_checkbox.hasClass('checked')).toBe(false)
      expect(fake_checkbox.$field[0].nodeName.toLowerCase()).toEqual('input')
      expect(fake_checkbox.$field.prop('type')).toEqual('hidden')
      expect(fake_checkbox.$field.prop('name')).toEqual('like_candy')
      expect(fake_checkbox.$field.prop('value')).toEqual('true')
    });
    it("handles checking and unchecking the box", function(){
      var $form = affix('form#target_form')
      var $fake_checkbox = affix('div[data-fake-checkbox="true"][data-form-selector="#target_form"][data-field-name="like_candy"][data-field-value="true"]')
      var fake_checkbox = new hooch.FakeCheckbox($fake_checkbox)
      expect($fake_checkbox.hasClass('checked')).toBe(false)
      expect($form.find('input[type="hidden"][name="like_candy"][value="true"]').length).toEqual(0)
      fake_checkbox.change()
      expect($fake_checkbox.hasClass('checked')).toBe(true)
      expect($form.find('input[type="hidden"][name="like_candy"][value="true"]').length).toEqual(1)
      fake_checkbox.change()
      expect($fake_checkbox.hasClass('checked')).toBe(false)
      expect($form.find('input[type="hidden"][name="like_candy"][value="true"]').length).toEqual(0)
    });
    it("toggles form wrapper visibility", function(){
      var $wrapper = affix('div#form_wrapper')
      var $form = $wrapper.affix('form#target_form')
      $wrapper.css('display','none')
      expect($form.is(':visible')).toEqual(false)
      var $fake_checkbox = affix('div[data-fake-checkbox="true"][data-form-selector="#target_form"][data-field-name="like_candy"][data-field-value="true"][data-toggle-form="#form_wrapper"]')
      var $fake_checkbox2 = affix('div[data-fake-checkbox="true"][data-form-selector="#target_form"][data-field-name="like_veggies"][data-field-value="true"][data-toggle-form="#form_wrapper"]')
      var fake_checkbox = new hooch.FakeCheckbox($fake_checkbox)
      var fake_checkbox2 = new hooch.FakeCheckbox($fake_checkbox2)
      expect($form.is(':visible')).toBe(false)
      expect(!!$form.data('checked_fake_checkboxes')).toEqual(false)
      // check both boxes
      fake_checkbox.change()
      fake_checkbox2.change()
      expect($form.is(':visible')).toEqual(true)
      expect($form.data('checked_fake_checkboxes').length).toEqual(2)

      // uncheck one box
      fake_checkbox.change()
      expect($form.is(':visible')).toEqual(true)
      expect($form.data('checked_fake_checkboxes').length).toEqual(1)

      // uncheck the last box
      fake_checkbox2.change()
      expect($form.is(':visible')).toEqual(false)
      expect($form.data('checked_fake_checkboxes').length).toEqual(0)
    });
    it("uses the form itself to toggle if no toggle target given", function(){
      var $form = affix('form#target_form')
      var $fake_checkbox = affix('div[data-fake-checkbox="true"][data-form-selector="#target_form"][data-field-name="like_candy"][data-field-value="true"][data-toggle-form=true]')
      var fake_checkbox = new hooch.FakeCheckbox($fake_checkbox)
      expect(fake_checkbox.$toggle_form.attr('id')).toEqual($form.attr('id'))
    });
    it("deselects all checkboxes", function(){
      var $form = affix('form#target_form')
      var $deselector = $form.affix('a[data-fake-deselector="true"]')
      var $fake_checkbox = affix('div[data-fake-checkbox="true"][data-form-selector="#target_form"][data-field-name="like_candy"][data-field-value="true"][data-toggle-form=true]')
      var fake_checkbox = new hooch.FakeCheckbox($fake_checkbox)
      fake_checkbox.change()
      expect($fake_checkbox.hasClass('checked')).toBe(true)
      expect($form.is(':visible')).toEqual(true)
      $deselector.trigger('click')
      expect($fake_checkbox.hasClass('checked')).toBe(false)
      expect($form.is(':visible')).toEqual(false)
    })
  });
  it('FakeSelect', function(){
    it('acts as a fake select', function(){
      FakeSelectTest("FakeSelect");
    });
  })

  describe('FakeSelectRevealer', function(){
    it('acts as a fake select', function(){
      FakeSelectTest("FakeSelectRevealer");
    });

    it('acts a revealer', function(){
      RevealerTest("FakeSelectRevealer");
    })
  });

  describe('SelectActionChanger', function(){
    it('change actions when select is changed', function(){
      var form = affix('form')
      var fake_select = form.affix('[data-select-action-changer="search"]')
      var fake_display = fake_select.affix('[data-select-display]')
      var fake_option1 = fake_select.affix('[data-select-value="pretty/url"][data-select-name="Pretty Stuff"]')
      var fake_option2 = fake_select.affix('[data-select-value="strong/url"][data-select-name="Strong Stuff"]')
      $('[data-select-action-changer]').each(function(){new hooch.SelectActionChanger($(this))})
      $('[data-select-value="pretty/url"]').click();
      expect($('[data-select-display]').html()).toEqual('Pretty Stuff');
      expect($('form').prop('action')).toMatch('pretty/url');
      $('[data-select-value="strong/url"]').click();
      expect($('[data-select-display]').html()).toEqual('Strong Stuff');
      expect($('form').prop('action')).toMatch('strong/url');
    });

    it('auto-submit', function(){
      var form = affix('form');
      var fake_select = form.affix('[data-select-action-changer="search"][data-auto-submit="true"]')
      var fake_display = fake_select.affix('[data-select-display]')
      var fake_option1 = fake_select.affix('[data-select-value="pretty/url"][data-select-name="Pretty Stuff"]')
      var hoo = new hooch.SelectActionChanger(fake_select);
      var submitCallback = spyOn(hoo, 'submitForm');
      $('[data-select-value="pretty/url"]').click();
      expect(submitCallback).toHaveBeenCalled();
    });
  });

  it('Revealer', function(){
    RevealerTest("Revealer");
  })

  describe('Sorter',function(){
    beforeEach(function(){
      $sorter = affix('div[data-sorter][style="width: 300px;"]')
      $sort_elem_a = $sorter.affix('div#a[style="width: 100px; height: 100px; position:relative; float:left;"]')
      $sort_elem_b = $sorter.affix('div#b[style="width: 100px; height: 100px; position:relative; float:left;"]')
      $sort_elem_c = $sorter.affix('div#c[style="width: 100px; height: 100px; position:relative; float:left;"]')
      $sort_elem_d = $sorter.affix('div#d[style="width: 100px; height: 100px; position:relative; float:left;"]')

      sorter = new hooch.Sorter($sorter)
      sort_elem_a = $.grep(sorter.sort_elements, function(elem,i){
        return 'a' == elem.$sort_element.attr('id')
      })[0]
      sort_elem_b = $.grep(sorter.sort_elements, function(elem,i){
        return 'b' == elem.$sort_element.attr('id')
      })[0]
      sort_elem_c = $.grep(sorter.sort_elements, function(elem,i){
        return 'c' == elem.$sort_element.attr('id')
      })[0]
      sort_elem_d = $.grep(sorter.sort_elements, function(elem,i){
        return 'd' == elem.$sort_element.attr('id')
      })[0]
    })
    it('sets the correct sort geometry', function(){
      //The fixtures for this test float horizontally into a grid three-wide, therefore the sorter should choose a 'Grid'
      expect(sorter.mode).toEqual('Grid')
    })
    it('Handles mousedown on a sort element', function(){
      sort_elem_a.onMousedown({which: 1, originalEvent: {pageY: 10, pageX: 10}})
      //Pressing the left mouse button on a sort element sets the mousestart position
      expect(sort_elem_a.mouse_start.top).toEqual(10)
      expect(sort_elem_a.mouse_start.left).toEqual(10)
      //That initial press should also set the 'pressed' attribute
      expect(sort_elem_a.pressed).toBe(true)
      //There should be no dragging element for the sorter yet
      expect(sorter.dragging_element).toBeUndefined()

    })
    it("Handles mousedown on a drag handle if provided", function(){
      // With no drag handle specified, the entire sort element must be draggable
      expect(sort_elem_a.$drag_handle.attr('id')).toEqual('a')

      // Now set up a sorter with handles
      $sorter_with_handles = affix('div[data-sorter][style="width: 300px;"]')
      $sort_elem_with_handle = $sorter_with_handles.affix('div#handled[style="width: 100px; height: 100px; position:relative; float:left;"]')
      $sort_elem_with_handle.affix('div#the_handle[data-drag-handle]')

      sorter_with_handles = new hooch.Sorter($sorter_with_handles)
      sort_elem_with_handle = $.grep(sorter_with_handles.sort_elements, function(elem,i){
        return 'handled' == elem.$sort_element.attr('id')
      })[0]
      expect(sort_elem_with_handle.$drag_handle.attr('id')).toEqual('the_handle')
    })
    it('Handles the initial mousemove when dragging an element', function(){
      sort_elem_a.onMousedown({which: 1, originalEvent: {pageY: 10, pageX: 10}})
      sorter.onMousemove({originalEvent: {pageY: 10, pageX: 11}})
      //Starting to move the mouse will unset the pressed flag so we don't try to initialize the movement again.
      expect(sort_elem_a.pressed).toBe(false)
      //We set the dragging element for the sorter to be element 'a'
      expect(sorter.dragging_element.$sort_element.attr('id')).toEqual('a')
      //We created a placeholder for element a
      expect(sort_elem_a.placeholder.is_placeholder).toBe(true)

      var elem_before_b = sort_elem_b.$sort_element.prev()
      //The dom element for the placeholder had it's id removed to avoid duplication
      expect(elem_before_b.attr('id')).toBeUndefined()
      //The dom element for the placeholder is now in the dom just before 'b', holding the place of the real 'a' as it is being dragged
      expect(elem_before_b.is(sort_elem_a.placeholder.$sort_element)).toBe(true)
      //The real element 'a' is now attached directly to the body
      expect(sort_elem_a.$sort_element.parent()[0].nodeName).toEqual('BODY')

    })
    it('Handles mousemove when dragging an element', function(){
      sort_elem_a.onMousedown({which: 1, originalEvent: {pageY: 10, pageX: 10}})
      sorter.onMousemove({originalEvent: {pageY: 10, pageX: 110}})
      var elem_before_c = sort_elem_c.$sort_element.prev()
      //The dom element for the placeholder is now in the dom just before 'c'
      expect(elem_before_c.is(sort_elem_a.placeholder.$sort_element)).toBe(true)
      //element 'b' is now the first in line, since a has shifted one forward
      expect(sorter.$sorter.children(':first').attr('id')).toEqual('b')
    })
    it('Handles dragging below the bottom of the grid', function(){
      sort_elem_a.onMousedown({which: 1, originalEvent: {pageY: 10, pageX: 10}})
      sorter.onMousemove({originalEvent: {pageY: 210, pageX: 10}})
      last_elem = sorter.$sorter.children(':last')
      //Dragging below the bottom of the grid puts the placeholder in the last place in the list
      expect(sort_elem_a.placeholder.$sort_element.is(last_elem)).toBe(true)
    })
    it('Handles dropping an element', function(){
      sort_elem_a.onMousedown({which: 1, originalEvent: {pageY: 10, pageX: 10}})
      sorter.onMousemove({originalEvent: {pageY: 210, pageX: 10}})
      sorter.onMouseup()
      last_elem = sorter.$sorter.children(':last')
      //Now the real element 'a' is in last place after being dragged below the sorter
      expect(sort_elem_a.$sort_element.is(last_elem)).toBe(true)
    })
    it('Handles a click without a drag', function(){
      sort_elem_a.onMousedown({which: 1, originalEvent: {pageY: 10, pageX: 10}})
      sorter.onMouseup()
      expect(sorter.dragging_element).toBeUndefined()
      var pressed_element = sorter.getPressedElement()
      expect(pressed_element).toBe(false)
    })
    it('Builds form data', function(){
      sorter.$sorter.attr('data-sort-field','my_sort')
      form_data = sorter.getFormData()
      expect(form_data['sort_field']).toEqual('my_sort')
    })
    it('dynamically adds sort elements', function(){
      var $sort_elem_e = $sorter.affix('div#e[style="width: 100px; height: 100px; position:relative; float:left;"]')
      sorter.handleMutations([{addedNodes: [$sort_elem_e[0]], removedNodes: []}])
      var sort_elem_e = $.grep(sorter.sort_elements, function(elem,i){
        return 'e' == elem.$sort_element.attr('id')
      })[0]
      expect(sort_elem_e.$sort_element.attr('id')).toEqual('e')
    })
    it('dynamically removes sort elements', function(){
      $sort_elem_c.detach()
      sorter.handleMutations([{addedNodes: [], removedNodes: [$sort_elem_c[0]]}])
      var sort_elem_c = $.grep(sorter.sort_elements, function(elem,i){
        return 'c' == elem.$sort_element.attr('id')
      })[0]
      expect(sort_elem_c).toBeUndefined()
      expect(sorter.sort_elements.length).toEqual(3)
    })
  })

  describe('BindKey', function(){
    it('submits a form', function(){
      var form = affix('form[data-bind-key="up"]')
      var binder = new hooch.BindKey(form)
      spyOn(form, 'submit')
      binder.do_it_now({keyCode: 38})
      expect(form.submit).toHaveBeenCalled();
    })
    it('clicks a link', function(){
      var link = affix('a[data-bind-key="tab"][data-ajax-link="true"][data-ajax-target="some_div"]')
      var binder = new hooch.BindKey(link)
      spyOn(link, 'click')
      binder.do_it_now({keyCode: 9})
      expect(link.click).toHaveBeenCalled();
    })
    it("doesn't act on other keys", function(){
      var form = affix('form[data-bind-key="down"]')
      var binder = new hooch.BindKey(form)
      spyOn(form, 'submit')
      binder.do_it_now({keyCode: 38})
      expect(form.submit).not.toHaveBeenCalled();
    })
    it("doesn't act if a non-submit input is focussed", function(){
      var form = affix('form[data-bind-key="up"]')
      var text_input = form.affix('input[type="text"]')
      text_input.focus()
      var binder = new hooch.BindKey(form)
      spyOn(form, 'submit')
      binder.do_it_now({keyCode: 38})
      expect(form.submit).not.toHaveBeenCalled();
    })
    it("doesn't act if a textarea is focussed", function(){
      var form = affix('form[data-bind-key="up"]')
      var textarea = form.affix('textarea')
      textarea.focus()
      var binder = new hooch.BindKey(form)
      spyOn(form, 'submit')
      binder.do_it_now({keyCode: 38})
      expect(form.submit).not.toHaveBeenCalled();
    })
    it("doesn't act if a select is focussed", function(){
      var form = affix('form[data-bind-key="up"]')
      var select = form.affix('select')
      select.focus()
      var binder = new hooch.BindKey(form)
      spyOn(form, 'submit')
      binder.do_it_now({keyCode: 38})
      expect(form.submit).not.toHaveBeenCalled();
    })
  })
  describe('TabGroup', function(){
    it('activates the default tab', function(){
      var $tab_group = affix('div[data-tab-group="sections"][data-default-tab="birds"]')
      var $fish_trigger = $tab_group.affix('a[data-tab-trigger="true"][data-tab-target-id="fish"][data-push-state="fish"]')
      var $bird_trigger = $tab_group.affix('a[data-tab-trigger="true"][data-tab-target-id="birds"][data-push-state="birds"]')
      var $fish_content = affix('div[data-tab-id="fish"]')
      $fish_content.html("All about fish.")
      var $bird_content = affix('div[data-tab-id="birds"]')
      $bird_content.html("All about birds.")
      history = {
        state: {},
        replaceState: function(state, throwaway, newpath){
          new_state = state
          new_path = newpath
        }
      }
      tab_group = new hooch.TabGroup($tab_group)
      expect($bird_content.css('display')).not.toEqual('none');
      expect($fish_content.css('display')).toEqual('none');
      expect(new_state.sections).toEqual('birds')
      delete history
      delete new_state
      delete new_path
    })
    it("doesn't change history if turned off", function(){
      var $tab_group = affix('div[data-tab-group="sections"][data-default-tab="birds"][data-no-history="true"]')
      var $fish_trigger = $tab_group.affix('a[data-tab-trigger="true"][data-tab-target-id="fish"][data-push-state="fish"]')
      var $bird_trigger = $tab_group.affix('a[data-tab-trigger="true"][data-tab-target-id="birds"][data-push-state="birds"]')
      var $fish_content = affix('div[data-tab-id="fish"]')
      $fish_content.html("All about fish.")
      var $bird_content = affix('div[data-tab-id="birds"]')
      $bird_content.html("All about birds.")
      history = {
        state: {},
        replaceState: function(state, throwaway, newpath){
          new_state = state
          new_path = newpath
        }
      }
      tab_group = new hooch.TabGroup($tab_group)
      expect($bird_content.css('display')).not.toEqual('none');
      expect($fish_content.css('display')).toEqual('none');
      expect(typeof new_state).toEqual('undefined')
      delete history
      delete new_state
      delete new_path
    })
  })
  describe('IhHistoryState', function(){
    it('toQueryString', function(){
      ih_history_state = new hooch.IhHistoryState({skeleton_key: 'treasure', foobar: 'baz'})
      var query_string = ih_history_state.toQueryString()
      expect(query_string).toEqual('skeleton_key=treasure&foobar=baz')
    })
    it('toUrl', function(){
      ih_history_state = new hooch.IhHistoryState({skeleton_key: 'treasure', foobar: 'baz'})
      var url = ih_history_state.toUrl()
      expect(url).toEqual([location.protocol,'//',location.host,location.pathname,'?','skeleton_key=treasure&foobar=baz'].join(''))
    })
    it('addState', function(){
      ih_history_state = new hooch.IhHistoryState({foobar: 'baz'})
      ih_history_state.addState('skeleton_key','treasure')
      var state = ih_history_state.state
      expect(state.foobar).toEqual('baz') // We didn't mess with the original state
      expect(state.skeleton_key).toEqual('treasure') // But we did add to it
    })
    it('addPath', function(){
      ih_history_state = new hooch.IhHistoryState({skeleton_key: 'treasure', foobar: 'baz'})
      ih_history_state.addPath('/my/new/path')
      var new_path = ih_history_state.new_path
      expect(new_path).toEqual('/my/new/path')
    })
    it('newPath', function(){
      ih_history_state = new hooch.IhHistoryState({skeleton_key: 'treasure', foobar: 'baz'})
      ih_history_state.addPath('/my/new/path')
      expect(ih_history_state.newPath()).toEqual([location.protocol,'//',location.host,'/my/new/path'].join(''))
    })
    it('addKeyValue', function(){
      ih_history_state = new hooch.IhHistoryState({skeleton_key: 'treasure', foobar: 'baz'})
      history = {
        state: {},
        replaceState: function(state, throwaway, newpath){
          new_state = state
          new_path = newpath
        }
      }
      ih_history_state.addKeyValue('my_key','my_value')
      expect(new_state.my_key).toEqual('my_value')
      expect(new_path).toEqual([location.protocol,'//',location.host,location.pathname,'?','skeleton_key=treasure&foobar=baz&my_key=my_value'].join(''))
      delete history
      delete new_state
      delete new_path
    })
    it('replacePath', function(){
      ih_history_state = new hooch.IhHistoryState({skeleton_key: 'treasure', foobar: 'baz'})
      history = {
        state: {},
        replaceState: function(state, throwaway, newpath){
          new_state = state
          new_path = newpath
        }
      }
      ih_history_state.replacePath('/my/new/path')
      expect(Object.keys(new_state).length).toEqual(0)
      expect(new_path).toEqual([location.protocol,'//',location.host,'/my/new/path'].join(''))
      delete history
      delete new_state
      delete new_path
    })
  })
  describe('HistoryPusher', function(){
    it('adds params to the query string', function(){
      var $link = affix('a[data-history-pusher="true"][data-key="my_key"][data-value="my_value"]')
      var pusher = new hooch.HistoryPusher($link)
      var new_state = null
      var new_path = null
      history = {
        state: {},
        replaceState: function(state, throwaway, newpath){
          new_state = state
          new_path = newpath
        }
      }
      pusher.pushIt()
      expect(new_state.my_key).toEqual('my_value')
      expect(new_path).toEqual([location.protocol,'//',location.host,location.pathname,'?','my_key=my_value'].join(''))
      delete history
    })
    it('adds form data to the query string', function(){
      var $form = affix('form[data-history-pusher="true"]')
      var $input = $form.affix('input[type="text"][name="my_key"][value="my_value"]')
      var $input = $form.affix('input[type="text"][name="my_key2"][value="my_value2"]')
      var pusher = new hooch.HistoryPusher($form)
      var new_state = null
      var new_path = null
      history = {
        state: {},
        replaceState: function(state, throwaway, newpath){
          new_state = state
          new_path = newpath
        }
      }
      pusher.pushIt()
      expect(new_state.my_key).toEqual('my_value')
      expect(new_state.my_key2).toEqual('my_value2')
      expect(new_path).toEqual([location.protocol,'//',location.host,location.pathname,'?','my_key=my_value&my_key2=my_value2'].join(''))
    })
  })
  describe('HistoryReplacer', function(){
    it('replaces the path', function(){
      var $link = affix('a[data-history-replacer="true"][data-new-path="/my/new/path"]')
      var replacer = new hooch.HistoryReplacer($link)
      var new_state = null
      var new_path = null
      history = {
        state: {},
        replaceState: function(state, throwaway, newpath){
          new_state = state
          new_path = newpath
        }
      }
      replacer.replaceIt()
      expect(Object.keys(new_state).length).toEqual(0)
      expect(new_path).toEqual([location.protocol,'//',location.host,'/my/new/path'].join(''))
      delete history
    })
  })
});



function FakeSelectTest(class_name){
  var class_name_dash = camelToDash(class_name);
  var fake_select = affix('[data-' + class_name_dash + '="color"]')
  var fake_display = fake_select.affix('[data-select-display]')
  var fake_option1 = fake_select.affix('[data-select-value="blue"][data-select-name="Blue"]')
  var fake_option2 = fake_select.affix('[data-select-value="green"][data-select-name="Green"]')
  var real_input = fake_select.affix('input[type="hidden"][data-real-select="true"]')
  $('[data-fake-select-revealer]').each(function(){new hooch[class_name]($(this))})
  $('[data-select-value="blue"]').click();
  expect($('[data-select-display]').html()).toEqual('Blue');
  expect($('input').val()).toEqual('blue');
  $('[data-select-value="green"]').click();
  expect($('[data-select-display]').html()).toEqual('Green');
  expect($('input').val()).toEqual('green');
}

function RevealerTest(class_name){
  var class_name_dash = camelToDash(class_name);
  var form = affix('form')
  var master_select = form.affix('select[data-'+ class_name_dash +'="true"][data-sub-type="FormFieldRevealer"][data-revealer-children-id="kind"]')
  var transaction = master_select.affix('option[value="Transaction"][selected="selected"]')
  var monthly = master_select.affix('option[value="Monthly"]')

  var child_target = form.affix('div[data-revealer-target="kind"]')

  var all_options = form.affix('div[data-revealer-id="kind"][data-revealer-trigger="Transaction"]')
  var all_select = all_options.affix('select')
  var flat_amount = all_select.affix('option[value="flat"]')
  var percentage = all_select.affix('option[value="percentage"]')

  var flat_options = form.affix('div[data-revealer-id="kind"][data-revealer-trigger="Monthly"]')
  var flat_select = flat_options.affix('select')
  var flat_option = flat_select.affix('option[value="flat"]')

  // FormFieldRevealer excercises all the functionality of Revealer plus some extra
  var revealer = new hooch.FormFieldRevealer(master_select)

  // The flat-only sub-select is hidden and outside the form
  expect(flat_options.is(':visible')).toBe(false)
  expect(form.find('[data-revealer-trigger="Transaction"]').length > 0).toBe(true)

  // The all-options sub-select is visible and inside the form
  expect(all_options.is(':visible')).toBe(true)
  expect(form.find('[data-revealer-trigger="Monthly"]').length > 0).toBe(false)

  // Change the master select and verify the sub-selects have changed correctly
  master_select.val('Monthly')
  revealer.reveal()

  expect(flat_options.is(':visible')).toBe(true)
  expect(form.find('[data-revealer-trigger="Transaction"]').length > 0).toBe(false)
  expect(all_options.is(':visible')).toBe(false)
  expect(form.find('[data-revealer-trigger="Monthly"]').length > 0).toBe(true)
}

function camelToDash(str) {
    return str.replace(/\W+/g, '-').replace(/([a-z\d])([A-Z])/g, '$1-$2').toLowerCase();
 }
