describe("hooch", function() {

  beforeEach(function() {
  });

  it("empties an element", function() {
    var emptier_div = affix('[data-emptier="true"][data-target="#my_div"]')
    var emptier_target = affix('#my_div')
    emptier_target.html('stuff')
    $('[data-emptier]').each(function(){new hooch.Emptier($(this))})
    expect(emptier_target.html()).toMatch('stuff');
    $('[data-emptier]').click()
    expect(emptier_target.html()).not.toMatch('stuff');
  });

  it("removes an element", function(){
    var remover_div = affix('[data-remover="true"][data-target="#my_div"]')
    var remover_target = affix('#my_div')
    $('[data-remover]').each(function(){new hooch.Remover($(this))})
    expect($('#my_div').length).toEqual(1);
    $('[data-remover]').click();
    expect($('#my_div').length).toEqual(0);
  });

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

  it('expands an element with a class and modifies trigger with a class', function(){
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
