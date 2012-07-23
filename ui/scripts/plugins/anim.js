var onLast = function(els, eventName, each, callback) {
  var index = 0;
  var count = els.length;

  var check = function() {
    each.call($(this));
    index++;
    if (count == index) {
      callback.call(els);
    }
  }
  els.one(eventName, check);
  if (count == 0) {
    callback.call(this);
  }
}


$.fn.anim = function(className, callback) {
  new onLast(this, 'AnimationEnd webkitAnimationEnd animationend oAnimationEnd MSAnimationEnd', function() {
    this.removeClass(className);
    this.hide();
  }, function() {
    console.log('all done');
    callback.call(this);
  });
  return this.addClass(className);
}
