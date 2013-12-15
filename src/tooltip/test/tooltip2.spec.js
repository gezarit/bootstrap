describe('tooltip directive', function () {

  var $rootScope, $compile, $document, $timeout, $position;

  beforeEach(module('ui.bootstrap.tooltip'));
  beforeEach(module('template/tooltip/tooltip-popup.html'));
  beforeEach(inject(function (_$rootScope_, _$compile_, _$document_, _$timeout_, _$position_) {
    $rootScope = _$rootScope_;
    $compile = _$compile_;
    $document = _$document_;
    $timeout = _$timeout_;
    $position = _$position_;
  }));

  beforeEach(function(){
    this.addMatchers({
      toHaveOpenTooltips: function(noOfOpened) {
        var ttipElements = this.actual.find('div.tooltip');
        noOfOpened = noOfOpened || 1;

        this.message = function() {
          return "Expected '" + angular.mock.dump(ttipElements) + "' to have '" + ttipElements.length + "' opened tooltips.";
        };

        return ttipElements.length === noOfOpened;
      }
    });
  });

  function compileTooltip(ttipMarkup) {
    var fragment = $compile('<div>'+ttipMarkup+'</div>')($rootScope);
    $rootScope.$digest();
    return fragment;
  }

  function closeTooltip(hostEl, trigger, shouldNotFlush) {
    hostEl.trigger(trigger || 'mouseleave' );
    if (!shouldNotFlush) {
      $timeout.flush();
    }
  }

  describe('basic scenarios with default options', function () {

    it('shows default tooltip on mouse enter and closes on mouse leave', function () {
      var fragment = compileTooltip('<span tooltip="tooltip text">Trigger here</span>');

      fragment.find('span').trigger( 'mouseenter' );
      expect(fragment).toHaveOpenTooltips();

      closeTooltip(fragment.find('span'));
      expect(fragment).not.toHaveOpenTooltips();
    });

    it('should not show a tooltip when its content is empty', function () {
      var fragment = compileTooltip('<span tooltip=""></span>');
      fragment.find('span').trigger( 'mouseenter' );
      expect(fragment).not.toHaveOpenTooltips();
    });

    it('should not show a tooltip when its content becomes empty', function () {

      $rootScope.content = 'some text';
      var fragment = compileTooltip('<span tooltip="{{ content }}"></span>');

      fragment.find('span').trigger( 'mouseenter' );
      expect(fragment).toHaveOpenTooltips();

      $rootScope.content = '';
      $rootScope.$digest();
      $timeout.flush();
      expect(fragment).not.toHaveOpenTooltips();
    });

    it('should update tooltip when its content becomes empty', function () {
      $rootScope.content = 'some text';
      var fragment = compileTooltip('<span tooltip="{{ content }}"></span>');

      $rootScope.content = '';
      $rootScope.$digest();

      fragment.find('span').trigger( 'mouseenter' );
      expect(fragment).not.toHaveOpenTooltips();
    });
  });

  describe('option by option', function () {

    describe('placement', function () {

      it('can specify an alternative, valid placement', function () {
        var fragment = compileTooltip('<span tooltip="tooltip text" tooltip-placement="left">Trigger here</span>');
        fragment.find('span').trigger( 'mouseenter' );

        var ttipElement = fragment.find('div.tooltip');
        expect(fragment).toHaveOpenTooltips();
        expect(ttipElement).toHaveClass('left');

        closeTooltip(fragment.find('span'));
        expect(fragment).not.toHaveOpenTooltips();
      });

    });

  });
  
  describe('position', function() {
    
    beforeEach(function() {
      spyOn($position, 'position').andCallThrough();
    });
    
    it('is called once on mouse enter and leave', function () {
      var fragment = compileTooltip('<span tooltip="tooltip text">Trigger here</span>');

      expect($position.position).not.toHaveBeenCalled();
    
      fragment.find('span').trigger( 'mouseenter' );
      expect($position.position.calls.length).toEqual(1);

      closeTooltip(fragment.find('span'));
      expect($position.position.calls.length).toEqual(1);
    });
    
    it('is called once for content updates when is open', function () {
      $rootScope.content = 'some text';
      var fragment = compileTooltip('<span tooltip="{{ content }}">Trigger here</span>');

      expect($position.position).not.toHaveBeenCalled();
    
      fragment.find('span').trigger( 'mouseenter' );
      expect($position.position.calls.length).toEqual(1);
      
      $rootScope.content = 'some new text';
      $rootScope.$digest();
      expect($position.position.calls.length).toEqual(1);
    });
  });
});