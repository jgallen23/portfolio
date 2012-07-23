$.fidel('github', {
  init: function() {
    this.username = this.el.data('username');

    this.fetch();
  },
  fetch: function() {
    var self = this;
    $.ajax({
      url: 'https://api.github.com/users/'+this.username+'/events',
      dataType: 'jsonp',
      success: function(res, status) {
        if (status != 'success') {
          return;
        }

        var latestPush;
        for (var i = 0, c = res.data.length; i < c; i++) {
          var item = res.data[i];
          if (item.type == 'PushEvent') {
            latestPush = item;
            break;
          }
        }

        self.render(latestPush);
      }
    });

  },
  render: function(push) {
    var commit = push.payload.commits[0];
    this.find('.name')
      .html(push.repo.name)
      .attr('href', push.repo.url);

    this.find('.desc span')
      .html(commit.message);

    this.find('.date')
      .attr('data-timestamp', push.created_at)
      .relativeTime()
      .attr('href', commit.url);
    this.find('h3 a')
      .attr('href', 'http://github.com/'+this.username);
  }
});
