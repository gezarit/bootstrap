describe('dropdownToggle', function() {
  var $compile, $rootScope, $document, $location, element;

  beforeEach(module('ui.bootstrap.dropdownToggle'));
  beforeEach(module('template/dropdownToggle/dropdownToggle.html'));

  beforeEach(inject(function(_$compile_, _$rootScope_, _$document_, _$location_) {
    $compile = _$compile_;
    $rootScope = _$rootScope_;
    $document = _$document_;
    $location = _$location_;
    element = $compile('<dropdown-toggle heading="Click me"><li>Hello 1</li><li>Hello 2</li></dropdown-toggle>')($rootScope);
    $rootScope.$digest();
  }));


  it('should contain the appropriate elements', function() {
     expect(element.hasClass('dropdown')).toBe(true);

     expect(element.find('a').length).toBe(1);
     expect(element.find('a').hasClass('dropdown-toggle')).toBe(true);
     expect(element.find('ul').length).toBe(1);
     expect(element.find('ul').hasClass('dropdown-menu')).toBe(true);
     expect(element.find('li').length).toBe(2);
  });
  
  it('should toggle on `a` click', function() {
    var a = element.find('a');

    expect(element.hasClass('open')).toBe(false);
    a.click();
    expect(element.hasClass('open')).toBe(true);
    a.click();
    expect(element.hasClass('open')).toBe(false);
  });

  it('should toggle on `ul` click', function() {
    var ul = element.find('ul');

    expect(element.hasClass('open')).toBe(false);
    ul.click();
    expect(element.hasClass('open')).toBe(true);
    ul.click();
    expect(element.hasClass('open')).toBe(false);
  });

  it('should toggle on element click', function() {
    expect(element.hasClass('open')).toBe(false);
    element.click();
    expect(element.hasClass('open')).toBe(true);
    element.click();
    expect(element.hasClass('open')).toBe(false);
  });

  it('should close on document click', function() {
    expect(element.hasClass('open')).toBe(false);
    element.click();
    expect(element.hasClass('open')).toBe(true);
    $document.click();
    expect(element.hasClass('open')).toBe(false);
  });

  it('should close on $location change', function() {
    element.find('a').click();
    $location.path('/foo');
    $rootScope.$apply();
    expect(element.hasClass('open')).toBe(false);
  });

  it('should only allow one dropdown to be open at once', function() {
    var element2 = $compile('<dropdown-toggle heading="Click me 2"><li>New 1</li><li>New 2</li></dropdown-toggle>')($rootScope);

    expect(element.hasClass('open')).toBe(false);
    expect(element2.hasClass('open')).toBe(false);
    element.click();
    expect(element.hasClass('open')).toBe(true);
    expect(element2.hasClass('open')).toBe(false);
    element2.click();
    expect(element.hasClass('open')).toBe(false);
    expect(element2.hasClass('open')).toBe(true);
  });

  it('should initially open element from attributes state', function() {
    element = $compile('<dropdown-toggle heading="Click me" opened="true"><li></li></dropdown-toggle>')($rootScope);
    $rootScope.$digest();

    expect(element.hasClass('open')).toBe(true);
  });

  it('should only allow one element to be initially open', function() {
    element = $compile('<dropdown-toggle heading="Click me" opened="true"><li></li></dropdown-toggle>')($rootScope);
    var element2 = $compile('<dropdown-toggle heading="Click me 2" opened="true"><li></li></dropdown-toggle>')($rootScope);
    $rootScope.$digest();

    expect(element.hasClass('open')).toBe(false);
    expect(element2.hasClass('open')).toBe(true);
  });

  it('executes the inner function on click and closes the dropdown', function() {
    $rootScope.listHandler = jasmine.createSpy('listHandler');
    element = $compile('<dropdown-toggle heading="" opened="true"><li ng-click="listHandler()"></li></dropdown-toggle>')($rootScope);
    $rootScope.$digest();

    expect(element.hasClass('open')).toBe(true);
    expect($rootScope.listHandler).not.toHaveBeenCalled();

    var li = element.find('li');
    li.click();
    $rootScope.$digest();

    expect(element.hasClass('open')).toBe(false);
    expect($rootScope.listHandler).toHaveBeenCalled();
  });

  it('executes the onToggle expression every time the menu opens or closes', function() {
    $rootScope.toggleHandler = jasmine.createSpy('toggleHandler');
    element = $compile('<dropdown-toggle heading="" on-toggle="toggleHandler(open)"><li></li></dropdown-toggle>')($rootScope);
    $rootScope.$digest();

    expect(element.hasClass('open')).toBe(false);
    expect($rootScope.toggleHandler).not.toHaveBeenCalled();

    element.click();
    $rootScope.$digest();
    expect(element.hasClass('open')).toBe(true);
    expect($rootScope.toggleHandler).toHaveBeenCalledWith(true);

    element.click();
    $rootScope.$digest();
    expect(element.hasClass('open')).toBe(false);
    expect($rootScope.toggleHandler).toHaveBeenCalledWith(false);
  });

  it('executes other document click events normally', function() {
    var checkboxEl = $compile('<input type="checkbox" ng-click="clicked = true" />')($rootScope);
    $rootScope.$digest();

    expect(element.hasClass('open')).toBe(false);
    expect($rootScope.clicked).toBeFalsy();

    element.click();
    $rootScope.$digest();
    expect(element.hasClass('open')).toBe(true);
    expect($rootScope.clicked).toBeFalsy();

    checkboxEl.click();
    $rootScope.$digest();
    expect($rootScope.clicked).toBeTruthy();
  });

  it('handles correctly placement attribute', function() {
    element = $compile('<dropdown-toggle heading="" placement="right"><li></li></dropdown-toggle>')($rootScope);
    $rootScope.$digest();

    expect(element.find('ul').hasClass('pull-right')).toBe(true);
  });

});
  
