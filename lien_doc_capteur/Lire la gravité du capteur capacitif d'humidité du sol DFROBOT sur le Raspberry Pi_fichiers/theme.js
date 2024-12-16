/**
 * SmartMag Theme Frontend JS.
 * 
 * @copyright 2021 ThemeSphere.
 */
"use strict";

if (!Bunyad) {
	var Bunyad = {};
}

Bunyad.theme = (function($) {
	
	var hasTouch = false,
		responsiveMenu = false,
		isIframe = window.BunyadIsIframe || false,
		schemeKey = window.BunyadSchemeKey || 'bunyad-scheme';
		
	if (!window.requestIdleCallback) {
		window.requestIdleCallback = requestAnimationFrame;
	}
	
	// module
	var self = {
		init: function() {

			// Detect touch capability dynamically.
			$(window).on('touchstart', function() {
				// First touch.
				if (!hasTouch) {
					$('body').addClass('touch');
					self.touchNav();
				}

				hasTouch = true;
			});

			this.imageEffects();
			
			// Setup all sliders
			this.sliders();
			this.contentSlideshow();
			
			// Setup mobile header and navigation
			this.header();
			this.responsiveNav();
			this.megaMenus();
			
			// Start the news ticker
			this.newsTicker();
			
			// Setup the lightbox
			requestIdleCallback(this.lightbox);

			// Search modal
			this.searchModal();
			
			// Use sticky sidebar if enabled
			this.initStickySidebar();
			
			// User ratings
			this.userRatings();

			this.tabWidget();

			/**
			 * Woocommerce
			 */ 
			$('.woocommerce-ordering .drop li a').on('click', function(e) {
				var form = $(this).closest('form');
				form.find('[name=orderby]').val($(this).parent().data('value'));
				form.trigger('submit');
				
				e.preventDefault();
			});

			$(document).on('ts-ajax-pagination', e => {
				$(document).trigger('scroll.TSS');
				Bunyad.sliders();
			});

			// Lower priority.
			requestIdleCallback(() => {
				self.contextualBinds(document);

				// Nav icons class if missing
				$('.navigation i.only-icon').each(function() {	
					var el = $(this).closest('li');
					if (!el.hasClass('only-icon')) {
						el.addClass('only-icon');
					}
				});

				// Single show comments.
				$(document).on('click', '.ts-comments-show', function() {
					$(this).hide()
						.closest('.comments')
						.find('.ts-comments-hidden').show();
					return false;
				});
	
			}, {timeout: 1000});
		},

		/**
		 * @param {HTMLDocument|HTMLElement} document
		 */
		contextualBinds: function(document)
		{
			// Fit videos to container.
			requestAnimationFrame(() => {
				$('.featured-vid, .post-content', document).fitVids();
			});

			// Ratings
			$('.review-number', document).each(function() {
				var raw = $(this).find('span:not(.progress)').html(),
					progress = parseFloat(raw);
				
				$(this).find('.progress').css('width', (raw.search('%') === -1 ? (Math.round(progress / 10 * 100)) + '%' : progress));
			});

			$('.review-box ul li .bar', document).each(function() {
				$(this).data('width', $(this)[0].style.width).css('width', 0);
			});
		
			new Bunyad_InView(
				document.querySelectorAll('.review-box ul li', document),
				entry => {
					const bar = $(entry.target).find('.bar');
					bar.addClass('appear').css('width', bar.data('width'));
				},
				{once: true}
			);

			// Single top social sharing view all buttons
			$('.post-share-b .show-more', document).on('click', function() {
				$(this).parent().addClass('all');
				return false;
			});

			// Go back handler for 404.
			$('.go-back').on('click', function() { 
				window.history.back();
				return false;
			});
		},

		/**
		 * Reinit common theme functionality, in a context, usually ALP feature.
		 * 
		 * @param {HTMLDocument|HTMLElement} context
		 */
		reInit: function(context) {

			// Only for elements.
			if (context !== document) {
				this.imageEffects(context.querySelectorAll('img'));
			}

			this.contextualBinds(context);
			this.lightbox();
			this.contentSlideshow();
			this.userRatings();

			setTimeout(this.stickySidebar, 50);

			Bunyad.sliders();
		},

		/**
		 * Image scroll animations.
		 */
		imageEffects: function(elements) {

			// Image effects - remove temp CSS when loaded.
			if (!$('body').hasClass('img-effects')) {
				return;
			}

			if (!elements) {
				elements = document.querySelectorAll('.main-wrap .wp-post-image, .post-content img');
			}

			elements.forEach(e => e.classList.add('no-display'));
			$('.bunyad-img-effects-css').remove();

			new Bunyad_InView(
				elements,
				entry => entry.target.classList.add('appear'),
				{once: true},
				() => $(elements).addClass('appear')
			);
		},
		
		newsTicker: function() {
			$('.trending-ticker ul').each(function() {
				
				if (!$(this).find('li.active').length) {
					$(this).find('li:first').addClass('active');
				}
				
				var ticker = $(this);
				
				window.setInterval(function() {
					
					var active = ticker.find('li.active');
					active.fadeOut(function() {
						
						var next = active.next();
						if (!next.length) {
							next = ticker.find('li:first');
						}
						
						next.addClass('active').fadeIn();
						active.removeClass('active');
					});
					
				}, 8000);
			});
		},
		
		header: function() {
			
			const toggleDarkMode = (scheme) => {
				const prevScheme = (scheme == 'dark' ? 'light' : 'dark');

				// Set initial scheme.
				const htmlClass = $('html').data('origClass');
				let initialScheme;
				if (htmlClass) {
					initialScheme = htmlClass.includes('s-dark') ? 'dark' : 'light';
				}

				if (scheme !== initialScheme) {
					localStorage.setItem(schemeKey, scheme);
				}
				else {
					localStorage.removeItem(schemeKey);
				}
				
				$('html')
					.removeClass(`s-${prevScheme} site-s-${prevScheme}`)
					.addClass(`s-${scheme} site-s-${scheme}`);
			};
			
			$('.scheme-switcher .toggle').on('click', function() {
				const ele  = $(this);
				let scheme = ele.hasClass('toggle-dark') ? 'dark' : 'light';

				toggleDarkMode(scheme);

				// Notify auto-loaded posts.
				document.querySelectorAll('iframe.spc-auto-load-post').forEach(element => {
					element.contentWindow.postMessage({
						action: 'toggle-dark-mode',
						scheme
					}, '*');
				});

				return false;
			});

			// Listen and change in auto-loaded posts.
			if (isIframe) {
				window.addEventListener('message', e => {
					if (!e.data || e.data.action !== 'toggle-dark-mode') {
						return;
					}

					toggleDarkMode(e.data.scheme);
				});
			}
		},
		
		/**
		 * Setup the responsive nav events and markup
		 */
		responsiveNav: function() {
			this.initResponsiveNav();
		},

		initResponsiveNav: function() {
			
			if (responsiveMenu || !$('.off-canvas').length) {
				responsiveMenu = true;
				return;
			}
			
			// Set responsive initialized
			responsiveMenu = true;

			// Test for overlay/non-obstrusive scrollbar (MacOS).
			const hasOverlayScroll = () => {
				const ele = document.createElement("div");
				ele.setAttribute("style", "width:30px;height:30px;overflow:scroll;opacity:0");
				document.body.appendChild(ele);

				const result = ele.offsetWidth === ele.clientWidth;
				document.body.removeChild(ele);
				
				return result;
			}

			const setupScroll = () => {
				if (!hasTouch && !hasOverlayScroll()) {
					document.body.classList.add("has-scrollbar");
	
					// Reflow to fix scrollbars.
					const ele = $('.off-canvas-content');
					ele.css('display', 'block');
	
					requestAnimationFrame(function() {
						ele.css('display', 'flex');
					});
				}
			}

			const setupMenuHandlers = () => {
				// Setup mobile menu click handlers
				$('.mobile-menu li > a').each(function() {
					
					if ($(this).parent().children('ul').length) {
						$('<span class="chevron"><i class="tsi tsi-chevron-down"></i></span>').insertAfter($(this));
					}
				});
				
				$('.mobile-menu li .chevron').on('click', function() {
					$(this).closest('li').find('ul')
						.first()
						.parent()
						.toggleClass('active item-active');

					return false;
				});
			}

			const setupMobileMenu = () => {
				var container = $('.mobile-menu-container');

				// No items for mobile menu? Grab from others
				if (!container.find('.mobile-menu').children().length) {
					
					// Merge existing menus
					var mobileMenu = container.find('.mobile-menu'),
						mainMenu = $('.navigation-main .menu');
						
					if (!mainMenu.length) {
						return;
					}

					var menu = mainMenu.children().clone();
					
					// add category mega menu links
					menu.find('.mega-menu .sub-cats').each(function() {
						var container = $(this).closest('.menu-item');
						
						container.append($(this).find('.sub-nav'));
						container.find('.sub-nav').replaceWith(function() {
							return $('<ul />', {html: $(this).html()});
						});
						
						$(this).remove();
					});
					
					mobileMenu.append(menu);
				}
			}

			// Delayed setup.
			let isMenuSetup = false;
			const initSetup = () => {
				setupScroll();
				setupMobileMenu();
				setupMenuHandlers();
				
				isMenuSetup = true;
			};

			// Bunyad.util.onLoad(() => requestIdleCallback(initSetup, {timeout: 1000}));
			const showMenu = () => {
				if (!isMenuSetup) {
					initSetup();
				}
				
				$('html').toggleClass('off-canvas-active');
			}
		
			$('.mobile-head .menu-icon a, .smart-head .offcanvas-toggle')
				.on('click', function() {
					$(document).trigger('ts-sticky-bar-remove');
					showMenu();
				});

			// Off-canvas close
			$('.off-canvas .close').on('click', function() {
				showMenu();
				return false;
			});

			$('.off-canvas-backdrop').on('click', function() {
				$('.off-canvas .close').click();
				return false;
			})
		},

		megaMenus: function() {
			const media = window.matchMedia('(min-width: 940px)');
			const init  = e => {
				if (e.matches) {
					this.initMegaMenus();
				}
				media.removeListener(init);
			};

			init(media);
			media.addListener(init);
		},

		initMegaMenus: function() {
			// Bind events for mega menus
			$('.navigation .mega-menu-a').each(function() {
				
				var menu = $(this),
				    number = menu.find('.recent-posts').data('columns');
				
				// Init mega menus
				var default_mega_menu = function f() {
					menu.find('.posts').last().addClass('active');
					return f;
				}();

				// Mega-menu sub-cats handling.
				menu.find('.menu-item').on('mouseenter', function() {

					var id = parseInt( $(this).attr('class').match(/menu-cat-(\d+)/)[1] || 0 ),
					    menu = $(this).parents('.mega-menu'),
					    view_all = $(this).hasClass('view-all');
				
					if (!view_all && !id) {
						return;
					}
					
					// Remove other actives
					menu.find('.active, .current-menu-item').removeClass('active current-menu-item');

					// Activate current
					$(this).addClass('current-menu-item');
					var posts = menu.find('[data-id=' + id + ']').addClass('active');
					
					return false;
				});
				
				// Reset mega menu state on fresh hover
				menu.parent().on('mouseenter', function() {
					
					var menu = $(this).find('.mega-menu');
					
					// reset at beginning
					menu.find('.active, .current-menu-item')
						.removeClass('active current-menu-item');

					$(this)[0].offsetWidth; // reflow
					default_mega_menu();
				});
				
			});
		},
		
		/**
		 * Setup touch navigation for larger touch devices.
		 */
		touchNav: function() {
			
			var targets = $('.menu:not(.mobile-menu) a'),
				open_class = 'item-active',
				child_tag = 'ul, .mega-menu';
			
			targets.each(function() {
				
				var $this = $(this),
					$parent = $this.parent('li'),
					$siblings = $parent.siblings().find('a');
				
				$this.on('click', function(e) {

					var $this = $(this);
					e.stopPropagation();
					
					$siblings.parent('li').removeClass(open_class);
					
					// has a child? open the menu on tap
					if (!$this.parent().hasClass(open_class) && $this.next(child_tag).length > 0 && !$this.parents('.mega-menu.links').length) {
						e.preventDefault();
						$this.parent().addClass(open_class);
					}
				});
			});
			
			// close all menus
			$(document).on('click', function(e) {
				if (!$(e.target).is('.menu') && !$(e.target).parents('.menu').length) {
					targets.parent('li').removeClass(open_class);
				}
			});
		},

		initStickySidebar: function() {

			let hasInit  = false;
			const events = 'resize orientationchange scroll';
			const init = () => {
				if (hasInit) {
					return;
				}

				if (document.documentElement.clientWidth >= 940) {
					self.stickySidebar();
					hasInit = true;
					$(window).off(events, init);
				}
			}

			$(window).on(events, init);
			Bunyad.util.onLoad(init);
		},
		
		/**
		 * Setup sticky sidebar
		 */
		stickySidebar: function() {

			const init = (addExtra) => {

				const sticky = $('.ts-sticky-col, .main-sidebar[data-sticky=1]');
				if (!sticky.length) {
					return;
				}
				
				let add = 20;
				if ($('.admin-bar').length) {
					add += $('#wpadminbar').height();
				}
				add += addExtra || 0;

				sticky.each(function() {
				
					var stickyCol = $(this);
					if (stickyCol.data('init')) {
						return;
					}

					stickyCol.data('init', 1);
					
					// Add wrapper class if missing
					if (!stickyCol.find('.theiaStickySidebar').length) {
						stickyCol.find('.elementor-widget-wrap').first().addClass('theiaStickySidebar');
						stickyCol.css({display: 'block'});
					}

					stickyCol.theiaStickySidebar({
						minWidth: 940, 
						updateSidebarHeight: false,
						additionalMarginTop: add,
						additionalMarginBottom: 20,
						disableOnResponsiveLayouts: false
					});
					
					// Update TSS internal options on sticky header on / off.
					const options = stickyCol.data('tss-options');

					if (!options) {
						return;
					}

					const stickyInner       = stickyCol.find('.theiaStickySidebar');
					const stickyColHeight   = stickyCol.outerHeight();
					const stickyInnerHeight = stickyInner.outerHeight();

					$(document).on('sticky-bar-show', () => {

						const stickyHead = $('.smart-head-sticky');
						let addExtra = 0;
						if (stickyHead.length) {
							let height = window.getComputedStyle(stickyHead[0]).getPropertyValue('--head-h');
							addExtra = parseInt(height) || 0;
						}
		
						const newMarginTop = add + addExtra;

						// Do nothing if the height will exceed. This would cause a bug at bottom of sticky turning static.
						if (stickyInnerHeight + newMarginTop >= stickyColHeight) {
							return;
						}

						if (newMarginTop !== options.additionalMarginTop) {
							// Ignore unexpected negative transform of scrolling down.
							if (!sticky.css('transform').includes('-')) {
								options.additionalMarginTop = newMarginTop;
								setTimeout(() => $(window).trigger('scroll.TSS'), 300);
							}
						}
					});

					// Reset margins on sticky bar hide.
					$(document).on('sticky-bar-hide', () => {
						options.additionalMarginTop = add;
						setTimeout(() => $(window).trigger('scroll.TSS'), 300);
					});
				});
			};

			init();
			
			// for iframe loads in sidebar
			Bunyad.util.onLoad(() => setTimeout(() => {
				$(window).trigger('resize.TSS');
			}, 3500));
		},
		
		/**
		 * Setup legacy slider and slideshow.
		 */
		sliders: function() {

			if (!$.fn.flexslider) {
				return;
			}
			
			var is_rtl = ($('html').attr('dir') == 'rtl' ? true : false);
			
			// Classic / Legacy slider.
			var slider = $('.classic-slider');

			if (!slider.length) {
				return;
			}
			
			slider.find('.flexslider').flexslider({
				controlNav: true,
				animationSpeed: slider.data('animation-speed'),
				animation: slider.data('animation'),
				slideshowSpeed: slider.data('slide-delay'),
				manualControls: '.main-featured .flexslider .pages a',
				pauseOnHover: true,
				start: function() {
					$('.main-featured .slider').css('opacity', 1);
				},
				rtl: is_rtl
			});
			
			// Dynamic pagination - if not at default of 5
			var pages  = slider.find('.pages'),
				number = parseInt(pages.data('number'));
			
			if (number && number !== 5) {
				var width = (100 - ((number + 1) * 0.284900285)) / number;  // 100 - (slides + 1 * margin-left) / slides
				pages.find('a').css('width', width + '%');
			}
		},

		/**
		 * Post Content Slideshow: AJAX
		 */
		contentSlideshow: function() {

			var slideshow_cache = {},
				slideshow_wrap  = '.post-slideshow .post-pagination-large';
			
			if ($(slideshow_wrap).length && !$(slideshow_wrap).data('init') && $(slideshow_wrap).data('type') == 'ajax') {
			
				var processing;
				$(slideshow_wrap).data('init', true);

				$('.main-content').on('click', '.post-slideshow .post-pagination-large .links a', function() {
					
						// showing on home-page?
						if ($('body').hasClass('page')) {
							return;
						}
						
						// bottom links, scroll top
						var scroll;
						if ($(this).parents('.bottom').length) {
							scroll = true;
						}
						
						// abort existing request
						if (processing && processing.hasOwnProperty('abort')) {
							processing.abort();
						}
					
						var parent = $(this).closest('.post-slideshow'),
							url    = $(this).attr('href');
						
						parent.find('.content-page').removeClass('active').addClass('hidden previous');
					
						var show_slide = function(data) {
							
							// change browser url
							if (history.pushState) {
								history.pushState({}, '', url);
							}
							
							var page = $(data).find('.post-slideshow');
							
							if (page.length) {
								parent.find('.post-pagination-large').html(page.find('.post-pagination-large').html());
								parent.find('.content-page').after(page.find('.content-page').addClass('hidden loading'));
								
								setTimeout(function() {

									if (scroll) {
										$('html, body').animate({scrollTop: parent.offset().top - 50}, 200);
									}
									
									parent.find('.content-page.previous').remove();
									parent.find('.content-page.loading')
										.removeClass('previous hidden loading')
										.find('img').addClass('appear');
								}, 1);
							}
							
							processing = null;
							
						};
						
						// in cache?
						if (slideshow_cache[url]) {
							show_slide(slideshow_cache[url]);
						}
						else {
							
							// get via ajax
							processing = $.get(url, function(data) {
								slideshow_cache[url] = data;
								show_slide(data);
								
							});
						}
						
						return false;
				});
				
				// keyboard nav
				$(document).on('keyup', function(e) {				
						if (e.which == 37) {
							$(slideshow_wrap).find('.prev').parent().click();
						}
						else if (e.which == 39) {
							$(slideshow_wrap).find('.next').parent().click();
						}
				});
				
			}
		},
				
		/**
		 * User Ratings handling
		 */
		userRatings: function() {
			
			var compute_percent = function(e) {
				
				var offset = $(this).offset(),
				    position, percent;
				
				// count from right for RTL
				if ($('html').attr('dir') == 'rtl')  {
					offset.left = offset.left + $(this).outerWidth();
				}
				
				position = Math.abs(e.pageX - Math.max(0, offset.left));
				percent  = Math.min(100, Math.round(position / $(this).width() * 100));
				
				return percent;
			};

			// percent or points?
			var is_points = true,
				scale = parseInt($('.review-box .value-title').text()) || 10;
			
			if ($('.review-box .overall .percent').length) {
				is_points = false;
			}
			
			// update the bar and percent/points on hover
			$('.user-ratings .main-stars, .user-ratings .rating-bar').on('mousemove mouseenter mouseleave', 
				function(e) {
				
					// set main variables
					var bar = $(this).find('span'),
						user_ratings = $(this).closest('.user-ratings');
				
					bar.css('transition', 'none');
					
					if (user_ratings.hasClass('voted')) {
						return;
					}
				
					// hover over?
					if (e.type == 'mouseleave') {
						bar.css('width', bar.data('orig-width'));
						user_ratings.find('.hover-number').hide();
						user_ratings.find('.rating').show();
						return;
					}
					
					var percent = compute_percent.call(this, e);
					
					if (!bar.data('orig-width')) {
						bar.data('orig-width', bar[0].style.width);
					}
					
					bar.css('width', percent + '%');
					user_ratings.find('.rating').hide();
					user_ratings.find('.hover-number').show().text((is_points ? +parseFloat(percent / 100 * scale).toFixed(1) : percent + '%'));
				}
			);
			
			// add the rating
			$('.user-ratings .main-stars, .user-ratings .rating-bar').on('click', function(e) {
				
				// set main variables
				var bar = $(this).find('span'),
					user_ratings = $(this).closest('.user-ratings');
				
				if (user_ratings.hasClass('voted')) {
					return;
				}
				
				// setup ajax post data
				var post_data = {
						'action': 'bunyad_rate', 
						'id': user_ratings.data('post-id'), 
						'rating': compute_percent.call(this, e)
				};
				
				// get current votes
				var votes = user_ratings.find('.number'),
					cur_votes = parseInt(votes.text()) || 0;
				
				user_ratings.css('opacity', '0.3');
				bar.data('orig-width', bar[0].style.width);
				
				// add to votes and disable further voting 
				votes.text((cur_votes + 1).toString());
				
				$(this).trigger('mouseleave');
				user_ratings.addClass('voted');
				
				$.post(Bunyad.ajaxurl, post_data, function(data) {
					
					// update data
					if (data === Object(data)) {

						// change rating
						var cur_rating = user_ratings.find('.rating').text();
						user_ratings.find('.rating').text( cur_rating.search('%') !== -1 ? data.percent + ' %' : data.decimal );
						
						bar.css('width', data.percent + '%');
						bar.data('orig-width', data.percent);
					}
					
					user_ratings.hide().css('opacity', 1).fadeIn('slow');			
				}, 'json');
			});
		},
		
		tabWidget: function() {
			$(document).on('click', '.widget-tabbed .heading a', function() {
				
				var tab = $(this).data('tab'),
					tabs_data = $(this).closest('.widget-tabbed').find('.tabs-data'),
					parent = $(this).parent().parent(),
					active = parent.find('.active');
				
				if (!active.length) {
					active = parent.find('li:first-child');
				}

				active.removeClass('active').addClass('inactive');
				$(this).parent().addClass('active').removeClass('inactive');
				
				// hide current and show the clicked one
				var active_data = tabs_data.find('.tab-posts.active');
				if (!active_data.length) {
					active_data = tabs_data.find('.tab-posts:first-child');
				}
				
				active_data.hide();
				tabs_data.find('#recent-tab-' + tab).fadeIn().addClass('active').removeClass('inactive');

				return false;
			});
		},

		searchModal: function() {
			let isSetup = false;
			const target = $('.smart-head .search-icon');

			const setup = () => {
				if (isSetup || !$.fn.magnificPopup) {
					return;
				}

				isSetup = true;
				const scheme = $('.search-modal-wrap').data('scheme') == 'dark' ? ' s-dark' : '';

				// Search modal
				target.magnificPopup({
					items: {
						src: '.search-modal-wrap',
						type: 'inline'
					},
					removalDelay: 400,
					focus: 'input',
					closeBtnInside: false,
					closeOnBgClick: false,
					mainClass: 'search-modal' + scheme,
					midClick: true,
					fixedContentPos: true,
					autoFocusLast: false
				}); 
			};

			target.on('mouseover', setup);
			setTimeout(setup, 400);
		},

		/**
		 * Setup prettyPhoto
		 */
		lightbox: function() {
			
			// Can be disabled overall, or on mobile.
			if (
				!$.fn.magnificPopup 
				|| !$('body').hasClass('has-lb') 
				|| (!$('body').hasClass('has-lb-sm') && $(window).width() < 768)
			) {
				return;
			}

			if (isIframe) {
				return;
			}
			
			var mfpInit = {
				type: 'image',
				tLoading: '',
				mainClass: 'mfp-fade mfp-img-mobile',
				removalDelay: 300,
				callbacks: {
					afterClose: function() {
						if (this._lastFocusedEl) {
							$(this._lastFocusedEl).addClass('blur');
						}
					}
				}
			};

			/**
			 * Filter to handle valid images only.
			 */
			var filterImages = function() {
				
				if (!$(this).attr('href')) {
					return false;
				}
				
				return $(this).attr('href').match(/\.(jpe?g|webp|png|bmp|gif)($|\?.+?)/); 
			};
			
			/**
			 * Handle Galleries in post.
			 * 
			 * @param {HTMLElement} context
			 */
			var addGalleryLightbox = function(context) {
				var gal_selectors = '.gallery-slider, .post-content .gallery, .post-content .blocks-gallery-item, .post-content .tiled-gallery';
		
				// Filter to only tie valid images.
				$(gal_selectors, context)
					.find('a')
					.has('img')
					.filter(filterImages)
					.addClass('lightbox-gallery-img');

				// Add WooCommerce support
				$('.woocommerce a[data-rel^="prettyPhoto"], a.zoom').addClass('lightbox-gallery-img');
				gal_selectors += ', .woocommerce .images';

				// Attach the lightbox as gallery
				$(gal_selectors, context).magnificPopup($.extend({}, mfpInit, {
					delegate: '.lightbox-gallery-img',
					gallery: {enabled: true},
					image: {
						titleSrc: function(item) {
							var image   = item.el.find('img'), 
								caption = item.el.find('.caption').html();
							
							return (caption || image.attr('title') || ' ');
						}
					}
				}));
			};
			
			/**
			 * Non-gallery images in posts.
			 * 
			 * @param {HTMLElement} context 
			 */
			var addLightboxImages = function(context) {

				var selector = 
					$('.post-content, .main .featured, .single-creative .featured', context)
						.find('a:not(.lightbox-gallery-img)')
						.has('img, .img');

				selector.add('.lightbox-img')
					.filter(filterImages)
					.magnificPopup(mfpInit);

			};

			addGalleryLightbox();
			addLightboxImages();

			$('iframe.spc-auto-load-post').each(function() {
				const iframe = $(this).get(0).contentDocument;
				addGalleryLightbox(iframe);
				addLightboxImages(iframe);
			});
			
		}
	};

	self.stickyBarPause = false;

	return self;
	
})(jQuery);
/**
 * Utility methods.
 */
Bunyad.util = {
	
	throttle(fn, delay = 150, trails = true) {

		let pause = false;
		let trail;
		let timeout = function() {
			if (trail) {
				fn.apply(trail[0], trail[1]);
				trail = null;
				setTimeout(timeout, delay);
			} else {
				pause = false;
			}
		};

		return function(...args) {
			if (!pause) {
				fn.apply(this, args);
				pause = true;
				setTimeout(timeout, delay);
			} else if (trails) {
				trail = [this, args];
			}
		};
	},

	writeRaf(fn, options) {
		var running, 
		    args, 
		    that;

		var run = function() {
			running = false;
			fn.apply(that, args);
		};

		if (!options) {
			options = {};
		}

		return function() {
			args = arguments;
			that = options.that || this;

			if (!running) {
				running = true;
				requestAnimationFrame(run);
			}
		};
	},

	onLoad(cb) {
		document.readyState === 'complete' ? cb() : window.addEventListener('load', cb);
	}
};

/**
 * Authentication modal.
 */
(function($) {

	/** @type {Boolean} */
	let isInitialized = false;

	function init() {

		if (!$('#auth-modal').length) {
			return;
		}

		$(document).on('click', 'a', e => {
			if (e.currentTarget.hash === '#auth-modal') {
				if (!window.MicroModal) {
					return;
				}
		
				initModal();
				MicroModal.show('auth-modal', {
					awaitCloseAnimation: true
				});

				e.preventDefault();
			}
		});
	}

	function initModal(e) {

		if (isInitialized) {
			return;
		}

		const modal  = $('#auth-modal');
		const toggle = e => {
			modal.find('.auth-modal-login, .auth-modal-register').toggle();
			e.preventDefault();
		}
		
		modal.on('click', '.register-link, .login-link', toggle);
		isInitialized = true;
	}

	Bunyad.authModal = init;

})(jQuery);
(function($) {

	const cache = [];

	function init() {
		$('.section-head .subcats a, .block-head .filters a').on('click', e => {
			doFilter(e.currentTarget);
			return false;
		});
	}

	function doFilter(ele) {

		if ($(this).hasClass('active')) {
			return false;
		}

		ele = $(ele);

		const block   = ele.closest('.block-wrap');
		const blockId = block.data('id');
		const termId  = ele.data('id');
		const content = block.find('.block-content');
		const curActive = ele.parents('.filters').find('a.active');
		
		// Store "All" in cache.
		if (!curActive.data('id')) {
			cache[`${blockId}-0`] = block[0].outerHTML;
		}

		// Filter links active
		ele.addClass('active');
		curActive.removeClass('active');
		
		const cacheId = `${blockId}-${termId}`;
		content.removeClass('fade-in-up-lg')
			.addClass('loading');

		if (!cache[cacheId]) {

			const blockData = block.data('block') || {};
			blockData.props.filter = termId;

			// AJAX params
			const params =  {
				action: 'bunyad_block',
				block: blockData
			};

			$.post(
				Bunyad.ajaxurl,
				params,
				data => {
					cache[cacheId] = data;
					replaceContent(cache[cacheId], block, content);
				}
			);
		}
		else {
			replaceContent(cache[cacheId], block, content);
		}
	}

	function replaceContent(data, block, content) {
		const newHtml    = $(data);
		const newContent = newHtml.find('.block-content')
		newContent.find('img').addClass('no-display appear');

		// Race condition.
		newContent.find('.lazyloading').removeClass('lazyloading').addClass('lazyload');
		content.removeClass('fade-in-up-lg');

		requestAnimationFrame(() => {
			content.html(newContent.html())
				.removeClass('loading')
				.addClass('fade-in-up-lg')
				.addClass('ready');
		});
		
		// Set new block data.
		block.data('block', newHtml.data('block'));
	}

	Bunyad.blocksFilters = init;

})(jQuery);

(function($) {
	Bunyad.stickyHeader = function(header, options = {}) {
		var nav,
			isSmart = false,
			isSticky = false,
			stickyIsStatic = false,
			prevScroll = 0,
			curScroll  = 0,
			extraTop   = 0,
			stickyTop,
			hideAt,
			head,
			headHeight;

		let stickyBar;
		let stickyIsActive = false;
		let hasInitialized = false;
		
		/**
		 * Calculate header size.
		 */
		const calcHeadSize = Bunyad.util.writeRaf(() => {

			// Don't reset if it's stuck
			if (stickyIsActive) {
				return;
			}

			var new_height = head.css('min-height', 0).height();
			head.css('min-height', new_height);
			headHeight = new_height;
		});

		function setSize(skipCalc) {

			// Skip calculation if asked to and head height has been prev set
			if (skipCalc && headHeight) {
				return;
			}

			calcHeadSize();
		}

		/**
		 * Remove / disable sticky.
		 */
		function removeSticky(simpleHide) {
		
			// Check before dom modification 
			if (isSticky) {
				
				stickyIsActive = false;
				let visualHide = false;

				// Mainly for smart sticky. Simple hide by not unfixing completely.
				if (simpleHide) {
					if (!nav.hasClass('off')) {
						nav.addClass('off');
						visualHide = true;
					}
				}
				else {
					// isSticky already checks for presence of smart-head-sticky.
					nav.removeClass('smart-head-sticky off');
					visualHide = true;
				}
				
				if (visualHide) {
					setSize(true);
					$(document).trigger('sticky-bar-hide');
				}
			}
		}

		/**
		 * Make the bar sticky and setup handlers.
		 */
		function toggleSticky() {

			if (stickyIsStatic) {
				return;
			}

			curScroll = $(window).scrollTop();
			isSticky  = nav.hasClass('smart-head-sticky');

			// Check and apply sticky - separated writes
			const stickyWrites = Bunyad.util.writeRaf(() => {
				
				// Make it sticky when viewport is scrolled beyond the sticky bar.
				if (curScroll > stickyTop) {

					// For smart sticky, test for scroll change
					if (isSmart && (!prevScroll || curScroll > prevScroll)) {
						removeSticky(true);
					}
					else {
						stickyIsActive = true;
						
						if (!isSmart || curScroll < prevScroll-4 && !Bunyad.theme.stickyBarPause) {
							if (!nav.hasClass('smart-head-sticky') || nav.hasClass('off')) {
								nav.removeClass('off');
								nav.addClass('smart-head-sticky');

								$(document).trigger('sticky-bar-show');
							}
						}
					}
					
					prevScroll = curScroll;
					
				} else {
					
					// hide at a certain point
					if (curScroll <= hideAt) {
						prevScroll = 0;
						removeSticky();
					}
				}
			});
			
			stickyWrites();
		}

		/**
		 * Check if smart sticky is enabled.
		 */
		function checkSmart() {
			// Force smart at responsive.
			if ($(window).width() < 940) {
				isSmart = true;
			}
			else {
				isSmart = false;
			}

			if (head.data('sticky-type') == 'smart') {
				isSmart = true;
			}
			
			if (isSmart && nav.length) {
				nav.addClass('is-smart');
			}
		}

		/**
		 * Setup calculations and DOM targets.
		 */
		function setup() {

			// Reset vars - might be a re-init
			stickyIsStatic = false;
			
			if ($('.admin-bar').length) {
				extraTop = $('#wpadminbar').height();
			}

			stickyBar = head.data('sticky');
			if (!stickyBar) {
				return;
			}

			// Auto detect.
			if (stickyBar === 'auto') {
				const menu = head.find('.navigation-main .menu');
				if (menu.length) {
					const match = menu.eq(0).closest('.smart-head-row').attr('class')
						.match(/smart-head-(top|mid|bot)/);

					if (!match || !match[1]) {
						return;
					}
					
					stickyBar = match[1];
				}
			}
		
			stickyBar = head.find('.smart-head-' + stickyBar);
			nav = stickyBar;

			if (!stickyBar.length) {
				return;
			}
			
			stickyTop = nav.offset().top - extraTop;
			hideAt = stickyTop + 1;

			const isLast = head.find('.smart-head-row:last-child').is(stickyBar);
			
			// If not the last row, show late and hide early to prevent jumps for bottom row.
			if (!isLast) {
				stickyTop = head.offset().top + head.height();
				hideAt = stickyTop + 1;
				nav.addClass('animate');
			}
				
			checkSmart();

			// For smart, always animate.
			if (isSmart) {
				nav.addClass('animate');
			}

			// Android fix on addr bar hide
			if (isSmart && !stickyIsActive) {
				prevScroll = 0;
			}
		}

		/**
		 * Init it - called multiple times to test for init based on width.
		 */
		function initHandler() {

			if (hasInitialized) {
				return false;
			}
	
			if (
				(options.mobile && $(window).width() > 940)
				|| (!options.mobile && $(window).width() <= 940)
			) {
				return;
			}
	
			setup();
			if (!nav || !nav.length) {
				return;
			}
	
			// Setup sticky handler 
			toggleSticky();
	
			Bunyad.util.onLoad(calcHeadSize);
			$(window).on('scroll', toggleSticky);
			
			// Re-initialize on resize.
			$(window).on('resize orientationchange', () => {
				removeSticky();
				calcHeadSize();
				setup();
				toggleSticky();
			});

			hasInitialized = true;

			// Hooks.
			$(document).on('ts-sticky-bar-remove', removeSticky);
		}

		function init(header) {
			hasInitialized = false;
			head = $(header);

			if (!head.length) {
				return;
			}

			initHandler();
			$(window).on('resize orientationchange', initHandler);
		}

		init(header);

		return {
			init,
			getSticky: () => stickyBar,
		};
	};
})(jQuery);
/**
 * Minimal Element in-viewport handler.
 */
class Bunyad_InView {
	
	/**
	 * @param {NodeList} elements 
	 * @param {CallableFunction} callback 
	 * @param {Object} options 
	 * @param {CallableFunction} fallback
	 */
	constructor(elements = [], callback, options = {}, fallback) {

		this.elements = elements;
		this.callback = callback;
		this.options  = Object.assign({
			intersectOnly: true,
			observeOptions: {},
			once: false
		}, options);

		if (!this.callback) {
			return false;
		}

		if (!window.IntersectionObserver) {
			console.warn('Intersection observer missing.');
			fallback();
			return false;
		}

		// eslint-disable-next-line compat/compat
		this.observer = new IntersectionObserver(
			this.handleIntersection.bind(this), 
			this.options.observeOptions
		);

		elements.forEach(element => {
			this.observer.observe(element);
		});
	}

	handleIntersection(entries) {

		entries.forEach(entry => {
			if (this.options.intersectOnly && !entry.isIntersecting) {
				return;
			}

			this.callback.call(this, entry);

			if (this.options.once) {
				this.observer.unobserve(entry.target);
			}
		});
	}
}
(function($) {

	const cache = [];

	/**
	 * Setup pagination for blocks.
	 */
	function init() {

		// AJAX pagination handlers
		$('.main-wrap')
			.on('click', '.main-pagination .load-button, .pagination-numbers[data-type=numbers-ajax] a', e => {
				const target = e.currentTarget;

				if (target.dataset.processing) {
					return;
				}

				target.dataset.processing = true;

				ajaxPagination(target, () => {
					target.dataset.processing = false;
				});

				return false;
			});

		$('.main-pagination[data-type=infinite]').each(function() {
			infiniteLoad($(this).get(0));
		});
	}

	/**
	 * Infinite load handler.
	 * 
	 * @param {Element} pageEle Pagination element container.
	 * @param {Object} options 
	 */
	function infiniteLoad(pageEle, options) {
		const block = pageEle.closest('.block-wrap');
		pageEle._loads = 1;
		options = Object.assign({bottomDeduct: 30}, options);

		if (!block) {
			return;
		}

		const offset = {top: 0, bottom: 0};
		const compute = () => {
			const rect    = block.getBoundingClientRect();
			offset.top    = rect.top + window.scrollY;
			offset.bottom = offset.top + block.clientHeight - window.innerHeight;

			// Page element's height shouldn't be counted + extra deduction.
			offset.bottom -= pageEle.clientHeight + options.bottomDeduct;
		}

		compute();
		
		let isLoading = false;	
		const loadOnScroll = (e) => {

			if (isLoading || pageEle._loads > 5) {
				return;
			}

			if (window.scrollY > offset.bottom) {
				isLoading = true;
				pageEle._loads++;

				ajaxPagination(pageEle.querySelector('.load-button'), () => {
					compute();
					isLoading = false;
				});
			}
		};

		$(window).on('scroll', Bunyad.util.throttle(loadOnScroll, 150, false));
		$(window).on('resize', Bunyad.util.throttle(compute));
	}

	function ajaxPagination(ele, callback) {
		
		ele = $(ele);
			
		let block    = ele.closest('.block-wrap');
		let isBlock = true;
		let process  = processLoadMore;
		
		// Not a block, archives
		if (!block.length) {
			isBlock = false;
			block = ele.closest('.main-content');
		}

		// AJAX params
		const params =  {
			action: 'bunyad_block',
			block: block.data('block') || {},
			paged: (ele.data('page') || 0) + 1
		};

		// Type of pagination
		const type = ele.closest('.main-pagination').data('type');
		
		switch(type) {
		
			// Type: Load More
			case 'load-more':
			case 'infinite':
				ele.addClass('loading').find('.tsi').addClass('tsi-spin');
				process = processLoadMore;

				break;

			// Type: Numbered
			case 'numbers-ajax':

				block.find('.block-content').addClass('loading');
				
				// Change page number
				const permalink = ele.attr('href').match(/\/page\/(\d+)\//);
				if (permalink !== null) {
					params.paged = permalink[1];
				}
				else {
					// Plain links
					const src = ele.attr('href').match(/(\?|&)paged?=(\d+)/);
					params.paged = src ? src[2] : 1;
				}
				
				// Set height
				block.css('height', block.height());
				process = processNumbered;

				break;
		}

		// Process block.
		if (isBlock) {
			
			// Home blocks AJAX
			const ajaxUrl = Bunyad.ajaxurl;

			const blockId = block.data('id');
			const cacheId = `${blockId}-${params.paged}`;

			if (!cache[cacheId]) {
				$.post(
					ajaxUrl,
					params,
					data => {
						requestAnimationFrame(() => {
							process(data, block, ele);
							cache[cacheId] = data;
							!callback || callback();
						});
					}
				);
			}
			else {
				requestAnimationFrame(() => {
					process(cache[cacheId], block, ele);
					!callback || callback();
				});
			}
		}
	}

	/**
	 * Numbered Ajax callback.
	 */
	function processNumbered(data, block) {
		const blockContent = block.find('.block-content');
		
		blockContent
			.removeClass('fade-in-down-lg')
			.html($(data).find('.block-content').html());
		
		block.css('height', 'auto');
		blockContent.addClass('fade-in-down-lg').removeClass('loading');
		blockContent.on('animationend', e => blockContent.removeClass('fade-in-down-lg'));

		// Scroll to top, temporarily pausing sticky bar.
		Bunyad.theme.stickyBarPause = true;
		setTimeout(() => { Bunyad.theme.stickyBarPause = false; }, 300);
		$('html, body').animate({scrollTop: block.offset().top - 50}, 200);
		
		$(document).trigger('ts-ajax-pagination');		
	}

	/**
	 * Load More Ajax callback method.
	 */
	function processLoadMore(data, block, ele) {
		
		var content = $(data),
			posts;

		const wrap = block.find('.loop');

		posts = content.find('.loop').children().addClass('fade-in-up-lg');
		posts.each(function() {
			$(this).on('animationend', () => $(this).removeClass('fade-in-up-lg'));
		});
		
		wrap.append(posts);
		
		// Masonry reload
		if (wrap.hasClass('masonry')) {
			// posts.removeClass('fade-in-up-lg');
			// Bunyad.theme.masonry(true, posts, wrap.find('.posts-wrap'));
		}
		
		$(document).trigger('ts-ajax-pagination');

		const pagination = block.find('.main-pagination');
		const newPagination = content.find('.main-pagination');

		if (newPagination.length) {
			pagination.html(newPagination.html());
		}
		else {
			pagination.remove();
		}
		
		ele.removeClass('loading')
			.find('.tsi').removeClass('tsi-spin');
	}

	Bunyad.pagination = init;
})(jQuery);

/**
 * Live Search Handler
 */
(function($) {
	"use strict";
	
	var cache = {}, timer, element;
	
	const self = {
		
		init: function() {
			
			var search = $('.live-search-query');

			if (!search.length) {
				return;
			}
			
			// Turn off browser's own auto-complete
			$('.live-search-query').attr('autocomplete', 'off');
			
			// setup the live search on key press
			$('.live-search-query').on('keyup focus', function() {
				
				element = $(this).parent();
			
				var query = $(this).val(), result;

				// clear existing debounce
				clearTimeout(timer);
				
				// minimum of 1 character
				if (query.length < 1) {
					self.add_result('');
					return;
				}
				
				// debounce to prevent excessive ajax queries
				timer = setTimeout(function() {
					self.process(query);
				}, 250);
			});
			
			// setup hide 
			$(document).on('click', function(e) {
				
				var results = $('.live-search-results');
				
				if (results.is(':visible') && !$(e.target).closest('.search-form').length) {
					results.removeClass('fade-in');
					results.closest('form').removeClass('has-live-results');
				}
			});
		},
		
		/**
		 * Process the search query
		 */
		process: function(query) {

			// have it in cache?
			if (query in cache) {
				self.add_result(cache[query]);
			}
			else {
				$.get(Bunyad.ajaxurl, {action: 'bunyad_live_search', 'query': query}, function(data) {
					
					// add to cache and add results
					cache[query] = data;
					self.add_result(data);
				});
			}
		},
		
		/**
		 * Add live results to the container
		 */
		add_result: function(result) {
			
			if (!element.find('.live-search-results').length) {
				element.append($('<div class="live-search-results"></div>'));
			}
			
			var container = element.find('.live-search-results');

			if (!result) {
				container.removeClass('fade-in');
				return;
			}
			
			// add the html result
			container.html(result);
			
			requestAnimationFrame(function() {
				container.addClass('fade-in');
				container.closest('form').addClass('has-live-results');
			});
			
		}
	};

	Bunyad.liveSearch = self.init;
	
})(jQuery);

(function($) {
	/**
	 * Setup sliders.
	 */
	function init() {

		if (!$.fn.slick) {
			return;
		}

		// Setup all sliders
		$('.common-slider .slides:not(.loaded), .loop-carousel:not(.loaded), .gallery-slider:not(.loaded)').each(function() {

			const slider = $(this);
			if (slider.hasClass('loaded')) {
				return;
			}

			slider.one('init', function() {
				$(this).addClass('loaded');
			});
		
			// Common setting
			var vars = {
				rows: 0,
				prevArrow: '<a href="#" class="prev-arrow"><i class="tsi tsi-angle-left"></i></a>',
				nextArrow: '<a href="#" class="next-arrow"><i class="tsi tsi-angle-right"></i></a>',
				autoplay: slider.data('autoplay') ? true : false,
				autoplaySpeed: slider.data('speed') || 5000,
				fade: slider.data('animation') == 'fade' ? true : false,
				rtl: $('html').prop('dir') === 'rtl'
			};
				
			const sliderType = slider.data('slider');

			// First image load.
			if (vars.autoplay) {

				slider.on('init afterChange', function(e, slick) {				
					var ele     = $(this),
						current = ele.find('[data-slick-index="' + slick.currentSlide + '"]');

					var img = current.find('.wp-post-image').first();
					if (!img.length) {
						return;
					}					

					var loaded = img.hasClass('lazyloaded') || (img.is('img:not(.lazyload)') && img.prop('complete'));

					if (!loaded) {
						img.on('lazyloaded load', function(e) {
							slick.slickPlay();
						});
						
						slick.slickPause();
					}
				});
			}
			
			switch (sliderType) {
				case 'feat-grid':
					setupFeatGrid(slider, vars);
					break;
					
				case 'carousel':
					setupCarousel(slider, vars);
					break;

				case 'gallery':
					setupGallery(slider, vars);
					break;
			}

		});

		// Disable anchor jump on arrows
		$('.common-slider').on('click', '.slick-arrow', function(e) {
			e.preventDefault();
		});
	}

	/**
	 * For posts carousels.
	 */
	function setupCarousel(slider, vars) {

		const slidesNum = slider.data('slides') || 1;

		// If not defined, use columns - 1, min 2, max 4.
		const slidesNumMd = slider.data('slides-md') || (
			Math.min(4, Math.max(2, slidesNum - 1))
		);

		const slidesNumSm = slider.data('slides-sm') || 1;

		if (slider.data('arrows')) {
			// Set correct top for arrows on init.
			slider.on('init', (ele) => {
				const height = slider.find('.l-post:first-child .media-ratio').outerHeight();
				if (height) {
					slider[0].style.setProperty('--arrow-top', (height/2) + 'px');
				}
			});
		}

		slider.slick($.extend(vars, {
			arrows: slider.data('arrows') ? true : false,
			infinite: true,
			cssEase: 'ease-out',
			speed: 400,
			dots: slider.data('dots') ? true : false,
			dotsClass: 'nav-dots',
			adaptiveHeight: true,
			slidesToShow: slidesNum,
			slidesToScroll: slidesNum, 
			responsive: [
				{
					breakpoint: 940,
					settings: {slidesToShow: slidesNumMd, slidesToScroll: slidesNumMd}
				},
				{
					breakpoint: 540,
					settings: {slidesToShow: slidesNumSm, slidesToScroll: slidesNumSm}
				}
			]
		}));
	}

	/**
	 * Setup slider for featured grid.
	 */
	function setupFeatGrid(slider, vars) {

		const scrollNum = slider.data('scroll-num') || 1;
		let scrollNumMd = slider.data('scroll-num-md');
			
		if (!scrollNumMd) {
			scrollNumMd = Math.min(2, Math.max(1, scrollNum - 1));
		}

		slider.slick($.extend(vars, {
			arrows: true,
			infinite: true,
			cssEase: 'ease-out',
			speed: 500,
			slidesToShow: scrollNum,
			slidesToScroll: scrollNumMd, 
			responsive: [
				{
					breakpoint: 940,
					settings: {slidesToShow: scrollNumMd, slidesToScroll: scrollNumMd}
				},
				{
					breakpoint: 540,
					settings: {slidesToShow: 1, slidesToScroll: 1}
				}
			]
		}));
	}

	/**
	 * Setup gallery slider.
	 */
	function setupGallery(slider, vars) {
			
		vars = Object.assign(vars, {
			infinite: true,
			slidesToShow: 1,
			slidesToScroll: 1,
			adaptiveHeight: true
		});
		
		const init = () => {
			slider.slick(vars);
		};

		// slider.find('img').eq(0).imagesLoaded(init);
		init();
	}

	Bunyad.sliders = init;
})(jQuery);

// load when ready
jQuery(function($) {
		
	Bunyad.theme.init();
	Bunyad.pagination();
	Bunyad.sliders();
	Bunyad.blocksFilters();

	// Setup sticky headers as applicable.
	Bunyad.stickyHeaders = {
		main: Bunyad.stickyHeader('.smart-head-main', {mobile: false}),
		mobile: Bunyad.stickyHeader('.smart-head-mobile', {mobile: true})
	};

	Bunyad.liveSearch();
	Bunyad.authModal();
});
/**
 * Plugins and 3rd Party Libraries
 */

/*!
* FitVids 1.1
*
* Copyright 2013, Chris Coyier - http://css-tricks.com + Dave Rupert - http://daverupert.com
* Credit to Thierry Koblentz - http://www.alistapart.com/articles/creating-intrinsic-ratios-for-video/
* Released under the WTFPL license - http://sam.zoy.org/wtfpl/
*
*/
;(function($){$.fn.fitVids=function(options){var settings={customSelector:null,ignore:null};if(!document.getElementById("fit-vids-style")){var head=document.head||document.getElementsByTagName("head")[0];var css=".fluid-width-video-wrapper{width:100%;position:relative;padding:0;}.fluid-width-video-wrapper iframe,.fluid-width-video-wrapper object,.fluid-width-video-wrapper embed {position:absolute;top:0;left:0;width:100%;height:100%;}";var div=document.createElement("div");div.innerHTML='<p>x</p><style id="fit-vids-style">'+css+"</style>";head.appendChild(div.childNodes[1])}if(options){$.extend(settings,options)}return this.each(function(){var selectors=['iframe[src*="player.vimeo.com"]','iframe[src*="youtube.com"]','iframe[src*="youtube-nocookie.com"]','iframe[src*="kickstarter.com"][src*="video.html"]',"object","embed"];if(settings.customSelector){selectors.push(settings.customSelector)}var ignoreList=".fitvidsignore";if(settings.ignore){ignoreList=ignoreList+", "+settings.ignore}var $allVideos=$(this).find(selectors.join(","));$allVideos=$allVideos.not("object object");$allVideos=$allVideos.not(ignoreList);$allVideos.each(function(){var $this=$(this);if($this.parents(ignoreList).length>0){return}if(this.tagName.toLowerCase()==="embed"&&$this.parent("object").length||$this.parent(".fluid-width-video-wrapper").length){return}if((!$this.css("height")&&!$this.css("width"))&&(isNaN($this.attr("height"))||isNaN($this.attr("width")))){$this.attr("height",9);$this.attr("width",16)}var height=(this.tagName.toLowerCase()==="object"||($this.attr("height")&&!isNaN(parseInt($this.attr("height"),10))))?parseInt($this.attr("height"),10):$this.height(),width=!isNaN(parseInt($this.attr("width"),10))?parseInt($this.attr("width"),10):$this.width(),aspectRatio=height/width;if(!$this.attr("id")){var videoID="fitvid"+Math.floor(Math.random()*999999);$this.attr("id",videoID)}$this.wrap('<div class="fluid-width-video-wrapper"></div>').parent(".fluid-width-video-wrapper").css("padding-top",(aspectRatio*100)+"%");$this.removeAttr("height").removeAttr("width")})})}})(window.jQuery||window.Zepto);

/**
 * Plus/minus polyfill for numbers - used in WooCommerce
 * 
 * Author Bryce Adams
 */
jQuery( function( $ ) {

	// Quantity buttons
	$( 'div.quantity:not(.buttons_added), td.quantity:not(.buttons_added)' )
		.addClass( 'buttons_added' )
		.append( '<div class="vertical-buttons"><input type="button" value="+" class="plus" /><input type="button" value="-" class="minus" /></div>' );

	$( document ).on( 'click', '.plus, .minus', function() {

		// Get values
		var $qty		= $( this ).closest( '.quantity' ).find( '.qty' ),
			currentVal	= parseFloat( $qty.val() ),
			max			= parseFloat( $qty.attr( 'max' ) ),
			min			= parseFloat( $qty.attr( 'min' ) ),
			step		= $qty.attr( 'step' );

		// Format values
		if ( ! currentVal || currentVal === '' || currentVal === 'NaN' ) currentVal = 0;
		if ( max === '' || max === 'NaN' ) max = '';
		if ( min === '' || min === 'NaN' ) min = 0;
		if ( step === 'any' || step === '' || step === undefined || parseFloat( step ) === 'NaN' ) step = 1;

		// Change the value
		if ( $( this ).is( '.plus' ) ) {

			if ( max && ( max == currentVal || currentVal > max ) ) {
				$qty.val( max );
			} else {
				$qty.val( currentVal + parseFloat( step ) );
			}

		} else {

			if ( min && ( min == currentVal || currentVal < min ) ) {
				$qty.val( min );
			} else if ( currentVal > 0 ) {
				$qty.val( currentVal - parseFloat( step ) );
			}

		}

		// Trigger change event
		$qty.trigger( 'change' );

	});

});