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
  it('FakeSelect', function(){
    var fake_select = affix('[data-fake-select="color"]')
    var fake_display = fake_select.affix('[data-select-display]')
    var fake_option1 = fake_select.affix('[data-select-value="blue"][data-select-name="Blue"]')
    var fake_option2 = fake_select.affix('[data-select-value="green"][data-select-name="Green"]')
    var real_input = fake_select.affix('input[type="hidden"][data-real-select="true"]')
    $('[data-fake-select]').each(function(){new hooch.FakeSelect($(this))})
    $('[data-select-value="blue"]').click();
    expect($('[data-select-display]').html()).toEqual('Blue');
    expect($('input').val()).toEqual('blue');
    $('[data-select-value="green"]').click();
    expect($('[data-select-display]').html()).toEqual('Green');
    expect($('input').val()).toEqual('green');
  })

  it('SelectActionChanger', function(){
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
  })
});
