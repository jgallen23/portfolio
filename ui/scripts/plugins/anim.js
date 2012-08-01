(function($) {
  var vendorEvents = [
    'AnimationEnd',
    'webkitAnimationEnd',
    'animationend',
    'oAnimationEnd',
    'MSAnimationEnd',
    'TransistionEnd',
    'webkitTransistionEnd',
    'transitionend',
    'oTransistionEnd',
    'MSTransistionEnd',
  ];

  var BindEvents = function(els) {
    var index = 0;
    var count = els.length;

    var check = function() {
      var el = $(this);
      el.trigger('animationStep');

      index++;
      if (count == index) {
        el.trigger('animationComplete');
      }
    }
    els.one(vendorEvents.join(' '), check);
    if (count == 0) {
      el.trigger('animationComplete');
    }
    return this;
  }

  $.fn.animationEvents = function() {
    new BindEvents(this);
    return this;
  }
})(jQuery);
