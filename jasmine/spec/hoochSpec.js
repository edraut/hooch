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
    expect($('#my_div').length).toEqual(1)
    $('[data-remover]').click()
    expect($('#my_div').length).toEqual(0)
  });

});
