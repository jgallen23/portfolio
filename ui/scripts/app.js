$('body').addClass('load');
routie({
  //all
  '': function() {
    console.log('all');
    $('.nav li').removeClass('selected');
    $('.nav .all').addClass('selected');
    var el = $('.content .anim-out').show()
    setTimeout(function() {
      el.removeClass('anim-out');
    }, 100);
  },
  'sites': function() {

    console.log('sites');
    $('.nav li').removeClass('selected');
    $('.nav .sites').addClass('selected');
    $('.content .box:eq(2)')
      .addClass('anim-out')
      .one('webkitTransitionEnd', function() {
        console.log('end');
        $(this).hide();
      });
  }

});
