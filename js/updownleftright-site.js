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

    /*
     *  constructor function for updownleftright
     */

    function settingDefault(element, settings){
      // create a new property to hold default settings and merge
      this.settings = $.extend({}, this, this.defaults, settings);

	    // default variables operates
      this.initials = {
      	// bkgColor
      	// textColor
      	// width: 4,
      	// height: 4,
      	// mode: 'easy'
        // arrowUp: '.arrow-up',
        // arrowDown: '.arrow-down',
        // arrowRight: '.arrow-right',
        // arrowLeft: '.arrow-left'
      };

	    // extend this.initials args properties
      $.extend(this,this.initials);

      // operation on this.$el
      this.$el = $(element);

	    // ensure that the value of 'this' always references this element
      this.handleDirection = $.proxy(this.handleDirection,this);

      this.init();

		 	// provides each carousel with a unique ID
      // this.instanceUid = instanceUid++;
    }

    return settingDefault;

  })();

  updownleftright.prototype.init = function(){
    // test unit
    // this.test();

    // init ppts
    this.pptsInit();

	// TODO: keyCode 鍵盤

	  // // create item
   //  this.itemBuild();
   //  // create wall
   //  this.wallBuild();
	  // // Start the updownleftright
   //  this.updownleftrightStart();
   //  // bind events like click next/prev arrows and indicator dots
    this.eventsBind();
  };

	/**
	 *  init first page and related setting
	 */

	updownleftright.prototype.pptsInit = function(){
		var $firstChild = this.$el.find('.ppts').children(':first');

		// add show hide class
		this.$el.find('.ppts section').addClass('hide');
    $firstChild.removeClass('hide').addClass('show');
    $firstChild.children().removeClass('hide').addClass('show');

    // 看起來不一定需要
    // add downs class to which had multiple section down side
		this.$el.find('.ppts > section').each(function(index, element){
			var $this = $(element);
			if($this.children().length > 1)
				$this.addClass('downs');
		});

		// add next section class
		$firstChild.next().addClass('next');

		// add next right enabled class only
    this.$el.find('.controls').children('.right').addClass('enabled');
	};

	/**
	 *  bulid items and settings maze height and width
	 */

	updownleftright.prototype.eventsBind = function(){
		// $(document).keydown(throttle(this.handleKeydown.bind(this), 50));
		this.$el.find('.controls').on('click', 'div', throttle(this.handleClick.bind(this), 50));
	};

	/**
	 *  handle key down event
	 */

	// TODO: 離開時紀錄上一頁的index
	updownleftright.prototype.handleClick = function(e){
		var $this = $(e.currentTarget);
				// $show = this.$el.find('.ppts > .show'),
				// $next = this.$el.find('.ppts > .next'),
				// $prev = this.$el.find('.ppts > .prev'),
				// $showChild = this.$el.find('.ppts > .show').children(':first'),
				// $nextChild = this.$el.find('.ppts > .show').children('.next'),
				// $prevChild = this.$el.find('.ppts > .show').children('.prev');
		if(!$this.hasClass('enabled'))
			return;

		this.$el.find('.enabled').removeClass('enabled');
		// animate and set the new show class state and remove old
		switch($this.attr('class')) {
			case 'left':
				this.handleAnimate('to-right');
				setTimeout(function () {
						this.$el.find('.ppts > .show').children('.show').removeClass('show').addClass('hide');
						this.$el.find('.ppts > .prev').children(':first').removeClass('hide').addClass('show');
						this.$el.find('.ppts > .show').removeClass('show').addClass('hide');
						this.$el.find('.ppts > .prev').removeClass('hide').addClass('show');
				}.bind(this), 1200);
				break;
			case 'right':
				this.handleAnimate('to-left');
				setTimeout(function () {
						this.$el.find('.ppts > .show').children('.show').removeClass('show').addClass('hide');
						this.$el.find('.ppts > .next').children(':first').removeClass('hide').addClass('show');
						this.$el.find('.ppts > .show').removeClass('show').addClass('hide');
						this.$el.find('.ppts > .next').removeClass('hide').addClass('show');
				}.bind(this), 1200);
				break;
			case 'up':
				this.handleAnimate('to-down');
				setTimeout(function () {
						this.$el.find('.ppts > .show').children('.show').removeClass('show').addClass('hide');
						this.$el.find('.ppts > .show').children('.prev').removeClass('hide').addClass('show');
				}.bind(this), 1200);
				break;
			case 'down':
				this.handleAnimate('to-up');
				setTimeout(function () {
						this.$el.find('.ppts > .show').children('.show').removeClass('show').addClass('hide');
						this.$el.find('.ppts > .show').children('.next').removeClass('hide').addClass('show');
				}.bind(this), 1200);
				break;
			default:
				return;
		};

		setTimeout(function () {
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
		}.bind(this), 1200);
	};

	/**
	 *  handle key down event
	 */

	updownleftright.prototype.handleAnimate = function(direction){
		this.$el.find('.ppts').addClass(direction);
		setTimeout(function () {
			this.$el.find('.ppts').removeClass(direction);
		}.bind(this), 1200);
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
