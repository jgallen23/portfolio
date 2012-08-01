$('body')
  .animationEvents()
  .one('animationComplete', function() {
    $(this)
      .removeClass('load')
      .removeClass('preanim');
  })
  .addClass('load');

var filter = function(className) {

  $('.nav li').removeClass('selected');
  $('.nav .' + className).addClass('selected');

  var els = $('.content .box').filter(function() {
    var el = $(this);
    return (!el.hasClass(className) && el.css('display') != 'none');
  });

  els 
    .animationEvents()
    .one('animationComplete', function() {
      els
        .hide()
        .removeClass('fly-out');
      $('.content .' + className).show();
    })
    .addClass('fly-out');
}

routie({
  //all
  '': function() {
    $('.nav li').removeClass('selected');
    $('.nav .all').addClass('selected');

    $('.content .box').show();
  },
  'sites': function() {
    filter('site');
  },
  'apps': function() {
    filter('app');
  },
  'code': function() {
    filter('code');
  }

});



/* content box */
(function(el) {
  var hoverIn = function() {
    var $el = $(this);
    $('.name', $el).animate({
      bottom: '170px'
    })
    $('.description', $el).animate({
      top: '0%'
    });
  }

  var hoverOut = function() {
    var $el = $(this);
    $('.name', $el).animate({
      bottom: '0'
    })
    $('.description', $el).animate({
      top: '-100%'
    });

  }

  el.hoverIntent(hoverIn, hoverOut);
})($('.content .box'));

//$('.header .box:eq(1)').twitter();
//$('.header .box:eq(2)').github();
