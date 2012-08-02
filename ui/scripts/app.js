$('body').addClass('load');

var filter = function(className) {

  $('.nav li').removeClass('selected');
  $('.nav .' + className).addClass('selected');

  $('.content .box').hide();
  $('.content .'+className).show();

}

routie({
  //all
  '': function() {
    $('.nav li').removeClass('selected');
    $('.nav .all').addClass('selected');

    $('.content .box').show();
  },
  sites: function() {
    filter('site');
  },
  apps: function() {
    filter('app');
  },
  code: function() {
    filter('code');
  },
  contact: function() {
    filter('contact');
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
})($('.content .has-details'));

//$('.header .box:eq(1)').twitter();
//$('.header .box:eq(2)').github();
