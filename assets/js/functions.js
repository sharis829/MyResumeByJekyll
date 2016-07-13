$(document).ready(function() {
	headerSection();
	portfolioSection();
	contactSection();
});

function portfolioSection() {
	$('.section-portfolio .row').magnificPopup({
		delegate: 'a',
		type: 'image',
		image: {
			markup: '<div class="mfp-figure something-else">' +
				'<button class="mfp-close"></button>' +
				'<figure>' +
				'<img class="mfp-img" />' +
				'<figcaption>' +
				'<div class="mfp-bottom-bar">' +
				'<div class="mfp-title"></div>' +
				'<div class="mfp-counter"></div>' +
				'</div>' +
				'</figcaption>' +
				'</figure>' +
				'</div>',
			titleSrc: function(item) {
				return '<p>' + item.el.data('description') + '</p>' +
					'<p>Client: <em>' + item.el.data('client') + '</em>' +
					'Date: <em>' + item.el.data('date') + '</em>' +
					'Service: <em>' + item.el.data('service') + '</em>' +
					'</p>';
			}
		},
		tLoading: 'Loading image #%curr%...',
		mainClass: 'mfp-img-mobile',
		zoom: {
			enabled: true,
			duration: 300,
			easing: 'ease-in-out'
		},
		gallery: {
			enabled: true,
			navigateByImgClick: true,
			preload: [0, 1] // Will preload 0 - before current, and 1 after the current image
		},
		callbacks: {
			close: function() {
				location.hash = "";
			},
			change: function() {
				console.log('Content changed');

				location.hash = "gallery-" + this.currItem.el.data("image_id");
			}

		}
	});

	loadGalleryDeepLink();

	function loadGalleryDeepLink() {
		var prefix = "#gallery-";
		var h = location.hash;

		if (document.g_magnific_hash_loaded === undefined && h.indexOf(prefix) === 0) {
			h = h.substr(prefix.length);
			var $img = $('*[data-image_id="' + h + '"]');

			if ($img.length) {
				document.g_magnific_hash_loaded = true;
				$img.parents().find('.popup-gallery').magnificPopup("open", $img.index());
			}
		}
	}
}

function headerSection() {

	var offsetY = $('.navbar').height() / 2;

	/* apply scrollspy.js, 偏移量，正值为提前点亮 不到就点亮 负值为推迟 过了 才点亮*/
	$('body').scrollspy({
		target: '#navbar',
		offset: offsetY
	});

	$('header .btn-primary').on('click', function() {
		var scrollDistance = $('#service')[0].offsetTop;
		bodyScroll(scrollDistance, 'easeInQuint', offsetY / 2);
	});

	/* nav bar click event */
	$('.navbar a').on('click', function(e) {

		var $this = $(this),
			sectionId = $this.attr('href'),
			scrollDistance = $(sectionId)[0].offsetTop;

		// avoid the page refresh
		e.preventDefault();
		// scroll the body
		bodyScroll(scrollDistance, 'easeInQuint', offsetY / 2);

		// bp(>768px): collapse #navbar after the click
		if (Boolean($('#navbar').attr('aria-expanded'))) {
			$('#navbar').collapse('toggle');
		}

	});

	/*Responsive Text */
	$(".hero-content h1").fitText(1.2, {
		minFontSize: '50px',
		maxFontSize: '75px'
	});
	$(".hero-content p").fitText(1.5, {
		minFontSize: '20px',
		maxFontSize: '35px'
	});

	/* scroll to active the nav bar items */
	$(window).on('scroll', function(event) {
		var $this = $(this),
			scrollTop = $this.scrollTop(), // window 的 相对滚动条的距离
			$currentNavItem = $('li.active'), // 当前激活中的 nav item
			$sections = $('[class*="section-"]'), // 所有的sections
			activeSection, // 要被滚动到的section
			$activeNavItem; // 要被激活的nav item

		/* scroll and animate the nav bar*/
		var serviceOffsetTop = $('.section-service').offset().top,
			$navbar = $('.navbar');
		if (serviceOffsetTop && scrollTop >= serviceOffsetTop / 2 && $(window).width() >= 768) {
			$navbar.addClass('animate');
		} else {
			$navbar.removeClass('animate');
		}

	});
}

function bodyScroll(scrollDistance, easingEffect, offset) {

	var offset = offset || 0;

	$('body').animate({
		scrollTop: scrollDistance - offset
	}, {
		duration: 1000,
		easing: easingEffect,
		complete: function() {}
	});
}

function contactSection() {

	$('.section-contact').find('input, textarea').jqBootstrapValidation({
		/* prevent forms from submitting invalid datas */
		preventSubmit: true,

		/* will show if data is invalid*/
		submitError: function($form, event, errors) {
			console.log('submitError');
		},

		/* valid data */
		submitSuccess: function($form, event) {
			//防止submit button的提交事件
			event.preventDefault();

			var name = $('#input-name').val(),
				email = $('#input-email').val(),
				phone = $('#input-phone').val(),
				message = $('#input-message').val();

			$.ajax({
				url: "http://localhost/webapp/contact_me.php",
				type: 'GET',
				dataType: 'jsonp', //只能用GET
//				data: {
//					name: name,
//					email: email,
//					phone: phone,
//					message: message
//				},
				cache: true,
				success: function(data) {
					console.log(data);
					$('#success')
					  .html('<div class="alert alert-success alert-dismissible fade in" role="alert"></div>');
					  
					$('#success .alert')
					  .html('<button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button>');
					  
					$('#success .alert')
					  .append('<strong>Your message has been sent! </strong>');
				},
				error: function(msg) {
					console.log(msg);
					$('#success')
					  .html('<div class="alert alert-danger alert-dismissible fade in" role="alert"></div>');
					  
					$('#success .alert')
					  .html('<button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button>');
					  
					$('#success .alert')
					  .append('<strong>Sorry '+ name +', it seems that my mail server is not responding. Please try again later!</sTRONG>');
				}

			});

		},
		filter: function() {
			return $(this).is(":visible");
		}
	});
}

/* ========================================================================
 * FitText.js 1.2
 * http://daverupert.com
 * http://sam.zoy.org/wtfpl/
 * 
 * Copyright 2011, Dave Rupert 
 * Released under the WTFPL license
 *
 * Date: Thu May 05 14:23:00 2011 -0600
 * ======================================================================== */

(function($) {

	$.fn.fitText = function(kompressor, options) {

		// Setup options
		var compressor = kompressor || 1,
			settings = $.extend({
				'minFontSize': Number.NEGATIVE_INFINITY,
				'maxFontSize': Number.POSITIVE_INFINITY
			}, options);

		return this.each(function() {

			// Store the object
			var $this = $(this);

			// Resizer() resizes items based on the object width divided by the compressor * 10
			var resizer = function() {
				$this.css('font-size', Math.max(Math.min($this.width() / (compressor * 10), parseFloat(settings.maxFontSize)), parseFloat(settings.minFontSize)));
			};

			// Call once to set.
			resizer();

			// Call on resize. Opera debounces their resize by default.
			$(window).on('resize.fittext orientationchange.fittext', resizer);

		});

	};

})(jQuery);