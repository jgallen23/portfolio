$.fidel('twitter', {
  init: function() {
    this.screenName = this.el.data('username');
    this.fetch();
  },
  fetch: function() {
    var self = this;
    $.ajax({
      url: 'https://api.twitter.com/1/statuses/user_timeline.json',
      data: {
        screen_name: self.screenName,
        exclude_replies: 'true',
        count: 1
      },
      dataType: 'jsonp',
      success: function(data, status) {
        if (status != 'success') {
          return;
        }

        var tweet = data[0];
        self.render(tweet);

      }
    });
  },
  render: function(tweet) {
    var url = 'http://twitter.com/' + tweet.user.screen_name;
    this.find('.name')
      .html('@' + tweet.user.screen_name)
      .attr('href', url);

    this.find('h3 a')
      .attr('href', url);

    var text = this.processLinks(tweet.text);
    this.find('.desc span').html(text);

    this.find('.date')
      .attr('href', 'http://twitter.com/'+tweet.user.screen_name+'/status/'+tweet.id_str)
      .attr('data-timestamp', tweet.created_at)
      .relativeTime();
  },
  processLinks: function(text) {
    var exp = /(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/i;
    text = text.replace(exp, "<a href='$1' target='_blank'>$1</a>");
    exp = /(^|\s)#(\w+)/g;
    text = text.replace(exp, "$1<a href='http://search.twitter.com/search?q=%23$2' target='_blank'>#$2</a>");
    exp = /(^|\s)@(\w+)/g;
    text = text.replace(exp, "$1<a href='http://www.twitter.com/$2' target='_blank'>@$2</a>");
    return text;
  }
});
