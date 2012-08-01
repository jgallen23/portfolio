/**
* hoverIntent is similar to jQuery's built-in "hover" function except that
* instead of firing the onMouseOver event immediately, hoverIntent checks
* to see if the user's mouse has slowed down (beneath the sensitivity
* threshold) before firing the onMouseOver event.
* 
* hoverIntent r6 // 2011.02.26 // jQuery 1.5.1+
* <http://cherne.net/brian/resources/jquery.hoverIntent.html>
* 
* hoverIntent is currently available for use in all personal or commercial 
* projects under both MIT and GPL licenses. This means that you can choose 
* the license that best suits your project, and use it accordingly.
* 
* // basic usage (just like .hover) receives onMouseOver and onMouseOut functions
* $("ul li").hoverIntent( showNav , hideNav );
* 
* // advanced usage receives configuration object only
* $("ul li").hoverIntent({
*	sensitivity: 7, // number = sensitivity threshold (must be 1 or higher)
*	interval: 100,   // number = milliseconds of polling interval
*	over: showNav,  // function = onMouseOver callback (required)
*	timeout: 0,   // number = milliseconds delay before onMouseOut function call
*	out: hideNav    // function = onMouseOut callback (required)
* });
* 
* @param  f  onMouseOver function || An object with configuration options
* @param  g  onMouseOut function  || Nothing (use configuration options object)
* @author    Brian Cherne brian(at)cherne(dot)net
*/
(function($) {
	$.fn.hoverIntent = function(f,g) {
		// default configuration options
		var cfg = {
			sensitivity: 7,
			interval: 50,
			timeout: 0
		};
		// override configuration options with user supplied object
		cfg = $.extend(cfg, g ? { over: f, out: g } : f );

		// instantiate variables
		// cX, cY = current X and Y position of mouse, updated by mousemove event
		// pX, pY = previous X and Y position of mouse, set by mouseover and polling interval
		var cX, cY, pX, pY;

		// A private function for getting mouse position
		var track = function(ev) {
			cX = ev.pageX;
			cY = ev.pageY;
		};

		// A private function for comparing current and previous mouse position
		var compare = function(ev,ob) {
			ob.hoverIntent_t = clearTimeout(ob.hoverIntent_t);
			// compare mouse positions to see if they've crossed the threshold
			if ( ( Math.abs(pX-cX) + Math.abs(pY-cY) ) < cfg.sensitivity ) {
				$(ob).unbind("mousemove",track);
				// set hoverIntent state to true (so mouseOut can be called)
				ob.hoverIntent_s = 1;
				return cfg.over.apply(ob,[ev]);
			} else {
				// set previous coordinates for next time
				pX = cX; pY = cY;
				// use self-calling timeout, guarantees intervals are spaced out properly (avoids JavaScript timer bugs)
				ob.hoverIntent_t = setTimeout( function(){compare(ev, ob);} , cfg.interval );
			}
		};

		// A private function for delaying the mouseOut function
		var delay = function(ev,ob) {
			ob.hoverIntent_t = clearTimeout(ob.hoverIntent_t);
			ob.hoverIntent_s = 0;
			return cfg.out.apply(ob,[ev]);
		};

		// A private function for handling mouse 'hovering'
		var handleHover = function(e) {
			// copy objects to be passed into t (required for event object to be passed in IE)
			var ev = jQuery.extend({},e);
			var ob = this;

			// cancel hoverIntent timer if it exists
			if (ob.hoverIntent_t) { ob.hoverIntent_t = clearTimeout(ob.hoverIntent_t); }

			// if e.type == "mouseenter"
			if (e.type == "mouseenter") {
				// set "previous" X and Y position based on initial entry point
				pX = ev.pageX; pY = ev.pageY;
				// update "current" X and Y position based on mousemove
				$(ob).bind("mousemove",track);
				// start polling interval (self-calling timeout) to compare mouse coordinates over time
				if (ob.hoverIntent_s != 1) { ob.hoverIntent_t = setTimeout( function(){compare(ev,ob);} , cfg.interval );}

			// else e.type == "mouseleave"
			} else {
				// unbind expensive mousemove event
				$(ob).unbind("mousemove",track);
				// if hoverIntent state is true, then call the mouseOut function after the specified delay
				if (ob.hoverIntent_s == 1) { ob.hoverIntent_t = setTimeout( function(){delay(ev,ob);} , cfg.timeout );}
			}
		};

		// bind the function to the two event listeners
		return this.bind('mouseenter',handleHover).bind('mouseleave',handleHover);
	};
})(jQuery);


$.fn.relativeTime = function() {

  var getRelativeTime = function(timestamp) {
    var now = new Date().getTime() / 1000;
    var d = new Date(timestamp).getTime() / 1000;
    var diff = now - d;
    var v = Math.floor(diff / 86400); diff -= v * 86400;
    if (v > 0) return (v == 1 ? 'Yesterday' : v + ' days ago');
    v = Math.floor(diff / 3600); diff -= v * 3600;
    if (v > 0) return v + ' hour' + (v > 1 ? 's' : '') + ' ago';
    v = Math.floor(diff / 60); diff -= v * 60;
    if (v > 0) return v + ' minute' + (v > 1 ? 's' : '') + ' ago';
    return 'Just now';
  }
  return this.each(function() {

    var el = $(this);
    var time = el.data('timestamp');

    el.html(getRelativeTime(time));

  });

};


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


/*!
  * Routie - A tiny javascript hash router 
  * v0.0.1
  * https://github.com/jgallen23/routie
  * copyright JGA 2012
  * MIT License
  */

(function(w) {

  var routes = [];

  var Route = function(path, fn) {
    this.path = path;
    this.fn = fn;
    this.keys = [];
    this.regex = pathToRegexp(this.path, this.keys, false, false);

    //check against current hash
    var hash = getHash();
    checkRoute(hash, this);
  }

  Route.prototype.match = function(path, params){
    var m = this.regex.exec(path);
  
    if (!m) return false;

    
    for (var i = 1, len = m.length; i < len; ++i) {
      var key = this.keys[i - 1];

      var val = ('string' == typeof m[i]) ? decodeURIComponent(m[i]) : m[i];

      //if (key) {
        //params[key.name] = (undefined !== params[key.name]) ? params[key.name] : val;
      //} else {
      params.push(val);
      //}
    }

    return true;
  };

  var pathToRegexp = function(path, keys, sensitive, strict) {
    if (path instanceof RegExp) return path;
    if (path instanceof Array) path = '(' + path.join('|') + ')';
    path = path
      .concat(strict ? '' : '/?')
      .replace(/\/\(/g, '(?:/')
      .replace(/\+/g, '__plus__')
      .replace(/(\/)?(\.)?:(\w+)(?:(\(.*?\)))?(\?)?/g, function(_, slash, format, key, capture, optional){
        keys.push({ name: key, optional: !! optional });
        slash = slash || '';
        return ''
          + (optional ? '' : slash)
          + '(?:'
          + (optional ? slash : '')
          + (format || '') + (capture || (format && '([^/.]+?)' || '([^/]+?)')) + ')'
          + (optional || '');
      })
      .replace(/([\/.])/g, '\\$1')
      .replace(/__plus__/g, '(.+)')
      .replace(/\*/g, '(.*)');
    return new RegExp('^' + path + '$', sensitive ? '' : 'i');
  };

  var routie = function(path, fn) {
    if (typeof fn == 'function') {
      routes.push(new Route(path, fn));
    } else if (typeof path == 'object') {
      for (var p in path) {
        routes.push(new Route(p, path[p]));
      }
    } else if (typeof fn === 'undefined') {
      window.location.hash = path;
    }
  }

  var getHash = function() {
    return window.location.hash.substring(1);
  }

  var checkRoute = function(hash, route) {
    var params = [];
    if (route.match(hash, params)) {
      route.fn.apply(route, params);
      return true;
    }
    return false;
  }

  var hashChanged = function() {
    var hash = getHash();
    for (var i = 0, c = routes.length; i < c; i++) {
      var route = routes[i];
      if (checkRoute(hash, route))
        return;
    }
  }

  if (w.addEventListener) {
    w.addEventListener('hashchange', hashChanged);
  } else {
    w.attachEvent('onhashchange', hashChanged);
  }

  w.routie = routie;
})(window);


/*!
  * Fidel - A javascript view controller
  * v2.0.0
  * https://github.com/jgallen23/fidel
  * copyright JGA 2012
  * MIT License
  */

(function(w, $) {

var View = function(el, obj, options) {
  $.extend(this, obj);
  this.el = el;
  this.els = {};
  obj.defaults = obj.defaults || {};
  this.options = $.extend({}, obj.defaults, options);
  $('body').trigger('FidelPreInit', this);
  this.getElements();
  this.delegateEvents();
  this.delegateActions();
  if (this.init) {
    this.init();
  }
  $('body').trigger('FidelPostInit', this);
};
View.prototype.eventSplitter = /^(\w+)\s*(.*)$/;
View.prototype.find = function(selector) {
  return this.el.find(selector);
};
View.prototype.proxy = function(func) {
  return $.proxy(func, this);
};

View.prototype.getElements = function() {
  if (!this.elements)
    return;

  for (var selector in this.elements) {
    var elemName = this.elements[selector];
    this.els[elemName] = this.find(selector);
  }
};

View.prototype.delegateEvents = function() {
  var self = this;
  if (!this.events)
    return;
  for (var key in this.events) {
    var methodName = this.events[key];
    var match = key.match(this.eventSplitter);
    var eventName = match[1], selector = match[2];

    var method = this.proxy(this[methodName]);

    if (selector === '') {
      this.el.on(eventName, method);
    } else {
      if (this.els[selector]) {
        this.els[selector].on(eventName, method);
      } else {
        this.el.on(eventName, selector, method);
      }
    }
  }
};

View.prototype.delegateActions = function() {
  var self = this;
  self.el.on('click', '[data-action]', function(e) {
    var el = $(this);
    var action = el.attr('data-action');
    if (self[action]) {
      self[action](e, el);
    }
  });
};

View.prototype.on = function(eventName, cb) {
  this.el.on(eventName, cb);
};

View.prototype.emit = function(eventName, data) {
  this.el.trigger(eventName, data);
};
View.prototype.hide = function() {
  if (this.views) {
    for (var key in this.views) {
      this.views[key].hide();
    }
  }
  this.el.hide();
};
View.prototype.show = function() {
  if (this.views) {
    for (var key in this.views) {
      this.views[key].show();
    }
  }
  this.el.show();
};

//for plugins
View.onPreInit = function(fn) {
  $('body').on('FidelPreInit', function(e, obj) {
    fn.call(obj);
  });
};
View.onPostInit = function(fn) {
  $('body').on('FidelPostInit', function(e, obj) {
    fn.call(obj);
  });
};

$.fidel = function(name, obj) {

  $.fn[name] = function(options) {

    return this.each(function() {
      var $this = $(this);

      var data = $this.data(name);

      if (!data) {
        data = new View($this, obj, options);
        $this.data(name, data); 
      }
      if (typeof options === 'string') {
        data[options]();
      }
    });
  };

  $.fn[name].defaults = obj.defaults || {};

};

w.Fidel = View;
})(window, window.jQuery || window.Zepto);


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
