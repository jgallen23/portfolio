$('body').addClass('load').on('webkitAnimationEnd', function() { $('body').removeClass('load').removeClass('preanim'); });

var filter = function(className) {

  $('.nav li').removeClass('selected');
  $('.nav .' + className).addClass('selected');

  var els = $('.content .box').filter(function() {
    var el = $(this);
    
    return (!el.hasClass(className) && el.css('display') != 'none');
  });
  console.log(className, els.length);
  els 
    .anim('fly-out', function() {
      $('.content .' + className).show();
    });
}

$('.content .box').hide();
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
