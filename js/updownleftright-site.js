/* =========================================================
 * updownleftright => created by kevin hu
 * ========================================================= */

;(function(factory){

  if (typeof define === 'function' && define.amd) {
      define(['jquery'], factory);
  } else if (typeof exports !== 'undefined') {
      module.exports = factory(require('jquery'));
  } else {
      factory(jQuery);
  }

})(function($){

	var updownleftright = (function(element, settings){
    var instanceUid = 0;

    /*
     *  constructor function for updownleftright
     */

    function settingDefault(element, settings){
      // create a new property to hold default settings and merge
      this.settings = $.extend({}, this, this.defaults, settings);

	    // default variables operates
      this.initials = {
      	bkgcolor: '#000',
      	titlecolor: '#fff',
      	textcolor: '#ff0',
      	lastindex: '',
      	duration: 600
      };

	    // extend this.initials args properties
      $.extend(this,this.initials);

      // operation on this.$el
      this.$el = $(element);

      this.init();

		 	// provides each carousel with a unique ID
      this.instanceUid = instanceUid++;
    }

    return settingDefault;

  })();

  updownleftright.prototype.init = function(){
    // test unit
    // this.test();

    // TODO: 儲存current show, prev, next & last show, prev, next => settings

    // init ppts
    this.pptsInit();

    // init percentages
    this.progressInit();

   //  // bind events
    this.eventsBind();
  };

	/**
	 *  init first section page and related setting
	 */

	updownleftright.prototype.pptsInit = function(){
		var $firstChild = this.$el.find('.ppts').children(':first'),
				bkgcolor = $firstChild.children().data('bkgcolor') ? $firstChild.children().data('bkgcolor') : this.settings.bkgcolor,
				titlecolor = $firstChild.children().data('titlecolor') ? $firstChild.children().data('titlecolor') : this.settings.titlecolor,
				textcolor = $firstChild.children().data('textcolor') ? $firstChild.children().data('textcolor') : this.settings.textcolor;

		// initial show hide class
		this.$el.find('.ppts section').addClass('hide');
    $firstChild.removeClass('hide').addClass('show');
    $firstChild.children().removeClass('hide').addClass('show');

    // initial first section style
    this.$el.css('background-color', bkgcolor);
    $firstChild.find('h1').css('color', titlecolor);
    $firstChild.find('h3').css('color', textcolor);

		// initial next section class
		$firstChild.next().addClass('next');

		// initial next right enabled class only
    this.$el.find('.controls').children('.right').addClass('enabled');

    // 目前用不到
    // add downs class to which had multiple section down side
		// this.$el.find('.ppts > section').each(function(index, element){
		// 	var $this = $(element);
		// 	if($this.children().length > 1)
		// 		$this.addClass('downs');
		// });
	};

	/**
	 *  init percentages setting
	 */

	updownleftright.prototype.progressInit = function(){
		this.eachPercent = 100 / (this.$el.find('.ppts > section').children().length - 1);
	};

	/**
	 *  bind keydown and click event
	 */

	updownleftright.prototype.eventsBind = function(){
		$(document).keydown(throttle(this.handleKeydown.bind(this), 50));
		this.$el.find('.controls').on('click', 'div', throttle(this.handleClick.bind(this), 50));
	};

	/**
	 *  handle key down event
	 */

	// 跟click整合不順..
	updownleftright.prototype.handleKeydown = function(e){
		// left = 37, up = 38, right = 39, down = 40
		if(e.keyCode < 37 || e.keyCode > 40)
			return;

		switch(e.keyCode) {
	    case 37:
	    	if(!this.$el.find('.controls').children('.left').hasClass('enabled'))
					return
				this.$el.find('.enabled').removeClass('enabled');
				// save current watch section index
				this.$el.find('.ppts > .show').data('lastindex', this.$el.find('.ppts > .show').children('.show').index());
				// check next watch section index, default index 0 if there is no last watch index
				this.$el.find('.ppts > .prev').data('lastindex') ? this.settings.lastindex = this.$el.find('.ppts > .prev').data('lastindex') : this.settings.lastindex = 0;

				this.handleAnimate('to-right');
				this.handleLeft();
				break;
	    case 38:
	    	if(!this.$el.find('.controls').children('.up').hasClass('enabled'))
					return
				this.$el.find('.enabled').removeClass('enabled');
				this.handleAnimate('to-down');
				this.handleUp();
				break;
	    case 39:
	    	if(!this.$el.find('.controls').children('.right').hasClass('enabled'))
					return
				this.$el.find('.enabled').removeClass('enabled');
				// save current watch section index
				this.$el.find('.ppts > .show').data('lastindex', this.$el.find('.ppts > .show').children('.show').index());
				// check next watch section index, default index 0 if there is no last watch index
				this.$el.find('.ppts > .next').data('lastindex') ? this.settings.lastindex = this.$el.find('.ppts > .next').data('lastindex') : this.settings.lastindex = 0;

				this.handleAnimate('to-left');
				this.handleRight();
				break;
	    case 40:
	    	if(!this.$el.find('.controls').children('.down').hasClass('enabled'))
					return
				this.$el.find('.enabled').removeClass('enabled');
				this.handleAnimate('to-up');
				this.handleDown();
				break;
			default:
				return;
		}
		setTimeout(this.handleProgress.bind(this), this.initials.duration);
		setTimeout(this.handleStyle.bind(this), this.initials.duration);
		setTimeout(this.handleDirection.bind(this), this.initials.duration);
	};

	/**
	 *  handle click event
	 */

	updownleftright.prototype.handleClick = function(e){
		var $this = $(e.currentTarget);

		if(!$this.hasClass('enabled'))
			return;

		this.$el.find('.enabled').removeClass('enabled');

		// save current watch section index
		if($this.attr('class') === 'left' || $this.attr('class') === 'right')
			this.$el.find('.ppts > .show').data('lastindex', this.$el.find('.ppts > .show').children('.show').index());

		switch($this.attr('class')) {
			case 'left':
				// check next watch section index, default index 0 if there is no last watch index
				this.$el.find('.ppts > .prev').data('lastindex') ? this.settings.lastindex = this.$el.find('.ppts > .prev').data('lastindex') : this.settings.lastindex = 0;
				this.handleAnimate('to-right');
				this.handleLeft();
				break;
			case 'up':
				this.handleAnimate('to-down');
				this.handleUp();
				break;
			case 'right':
				// check next watch section index, default index 0 if there is no last watch index
				this.$el.find('.ppts > .next').data('lastindex') ? this.settings.lastindex = this.$el.find('.ppts > .next').data('lastindex') : this.settings.lastindex = 0;
				this.handleAnimate('to-left');
				this.handleRight();
				break;
			case 'down':
				this.handleAnimate('to-up');
				this.handleDown();
				break;
			default:
				return;
		};
		setTimeout(this.handleProgress.bind(this), this.initials.duration);
		setTimeout(this.handleStyle.bind(this), this.initials.duration);
		setTimeout(this.handleDirection.bind(this), this.initials.duration);
	};

	/**
	 *  handle bkg, title, text style by user setting or default setting
	 */

	updownleftright.prototype.handleStyle = function(){
			var $show = this.$el.find('.ppts > .show'),
					bkgcolor = $show.children('.show').data('bkgcolor') ? this.$el.find('.ppts > .show').children('.show').data('bkgcolor') : this.settings.bkgcolor,
					titlecolor = $show.children('.show').data('titlecolor') ? this.$el.find('.ppts > .show').children('.show').data('titlecolor') : this.settings.titlecolor,
					textcolor = $show.children('.show').data('textcolor') ? this.$el.find('.ppts > .show').children('.show').data('textcolor') : this.settings.textcolor;

			this.$el.css('background-color', bkgcolor);
			$show.find('h1').css('color', titlecolor);
			$show.find('h3').css('color', textcolor);
	};

	/**
	 *  handle progress percentage
	 */

	updownleftright.prototype.handleProgress = function(){
			var index = this.$el.find('.ppts > .show').index(),
					currentIndex = 0;
			for(var i = 0, j = this.$el.find('.ppts > .show').index(); i <= j; i += 1){
				if(this.$el.children('.ppts').children().eq(i).children().hasClass('show'))
					currentIndex += this.$el.find('.ppts > .show').children('.show').index();
				else
					currentIndex += this.$el.find('.ppts > section').eq(i).children().length;
			}
			this.$el.find('.progress-percentage').css('width', currentIndex * this.eachPercent + "%");
	};

	/**
	 *  handle key down event
	 */

	updownleftright.prototype.handleDirection = function(){
			// remove all old next and prev class state
			this.$el.find('.next').removeClass('next');
			this.$el.find('.prev').removeClass('prev');

			// check new next and prev section
			this.$el.find('.show').next('section').length > 0 ? this.$el.find('.show').next('section').addClass('next') : '';
			this.$el.find('.show').prev('section').length > 0 ? this.$el.find('.show').prev('section').addClass('prev') : '';

			// check new direction enabled state
			this.$el.find('.ppts > .next').length > 0 ? this.$el.find('.right').addClass('enabled') : '';
			this.$el.find('.ppts > .prev').length > 0 ? this.$el.find('.left').addClass('enabled') : '';
			this.$el.find('.ppts > .show').children('.next').length > 0 ? this.$el.find('.down').addClass('enabled') : '';
			this.$el.find('.ppts > .show').children('.prev').length > 0 ? this.$el.find('.up').addClass('enabled') : '';
	};

	/**
	 *  handle left direction
	 */

	updownleftright.prototype.handleLeft = function(){
		setTimeout(function () {
			// add the new show class on section
			this.$el.find('.ppts > .show').children('.show').removeClass('show').addClass('hide');
			this.$el.find('.ppts > .prev').children().eq(this.settings.lastindex).removeClass('hide').addClass('show');
			this.$el.find('.ppts > .show').removeClass('show').addClass('hide');
			this.$el.find('.ppts > .prev').removeClass('hide').addClass('show');
		}.bind(this), this.initials.duration);
	};

	/**
	 *  handle right direction
	 */

	updownleftright.prototype.handleRight = function(){
		setTimeout(function () {
			// add the new show class on section
			this.$el.find('.ppts > .show').children('.show').removeClass('show').addClass('hide');
			this.$el.find('.ppts > .next').children().eq(this.settings.lastindex).removeClass('hide').addClass('show');
			this.$el.find('.ppts > .show').removeClass('show').addClass('hide');
			this.$el.find('.ppts > .next').removeClass('hide').addClass('show');
		}.bind(this), this.initials.duration);
	};

	/**
	 *  handle right direction
	 */

	updownleftright.prototype.handleUp = function(){
		setTimeout(function () {
			// add the new show class on section
			this.$el.find('.ppts > .show').children('.show').removeClass('show').addClass('hide');
			this.$el.find('.ppts > .show').children('.prev').removeClass('hide').addClass('show');
		}.bind(this), this.initials.duration);
	};

	/**
	 *  handle right direction
	 */

	updownleftright.prototype.handleDown = function(){
		setTimeout(function () {
			// add the new show class on section
			this.$el.find('.ppts > .show').children('.show').removeClass('show').addClass('hide');
			this.$el.find('.ppts > .show').children('.next').removeClass('hide').addClass('show');
		}.bind(this), this.initials.duration);
	};

	/**
	 *  handle animate
	 */

	updownleftright.prototype.handleAnimate = function(direction){
			// add animate class on section
		this.$el.find('.ppts').addClass(direction);
		setTimeout(function () {
			this.$el.find('.ppts').removeClass(direction);
		}.bind(this), this.initials.duration);
	};

	/**
	 *  init once for each dom object passed to jquery
	 */

	$.fn.updownleftright = function(options){
    return this.each(function(index,el){
      el.updownleftright = new updownleftright(el,options);
    });
  };

  // add extra function throttle for event function
  function throttle(fn, threshhold, scope) {
    // default 250 ms if not setting
    threshhold || (threshhold = 250);
    var last,
        deferTimer;
    return function () {
      var context = scope || this;

      var now = +new Date,
          args = arguments;
      if (last && now < last + threshhold) {
        // hold on to it
        clearTimeout(deferTimer);
        deferTimer = setTimeout(function () {
          last = now;
          fn.apply(context, args);
        }, threshhold);
      } else {
        last = now;
        fn.apply(context, args);
      }
    };
  }

});
