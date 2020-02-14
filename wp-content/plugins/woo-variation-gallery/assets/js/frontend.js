/*!
 * WooCommerce Variation Gallery v1.1.20 
 * 
 * Author: Emran Ahmed ( emran.bd.08@gmail.com ) 
 * Date: 2019-1-7 11:23:22
 * Released under the GPLv3 license.
 */
/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(1);
__webpack_require__(3);
__webpack_require__(4);
__webpack_require__(5);
__webpack_require__(6);
module.exports = __webpack_require__(7);


/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

jQuery(function ($) {
    Promise.resolve().then(function () {
        return __webpack_require__(2);
    }).then(function () {

        // For Single Product

        $('.woo-variation-gallery-wrapper:not(.woo-variation-gallery-product-type-variable)').WooVariationGallery();

        // Ajax and Variation Product
        $(document).on('wc_variation_form', '.variations_form', function () {
            $('.woo-variation-gallery-wrapper').WooVariationGallery();
        });

        // Support for Jetpack's Infinite Scroll,
        $(document.body).on('post-load', function () {
            $('.woo-variation-gallery-wrapper').WooVariationGallery();
        });

        // YITH Quickview
        $(document).on('qv_loader_stop', function () {
            $('.woo-variation-gallery-wrapper:not(.woo-variation-gallery-product-type-variable)').WooVariationGallery();
        });
    });
}); // end of jquery main wrapper

/***/ }),
/* 2 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

// ================================================================
// WooCommerce Variation Gallery
/*global wc_add_to_cart_variation_params, woo_variation_gallery_options */
// ================================================================

var WooVariationGallery = function ($) {

    var Default = {};

    var WooVariationGallery = function () {
        function WooVariationGallery(element, config) {
            _classCallCheck(this, WooVariationGallery);

            // Assign
            this._el = element;
            this._element = $(element);
            this._config = $.extend({}, Default, config);

            this.$product = this._element.closest('.product');
            this.$variations_form = this.$product.find('.variations_form');
            this.$target = this._element.parent();
            this.$slider = $('.woo-variation-gallery-slider', this._element);
            this.$thumbnail = $('.woo-variation-gallery-thumbnail-slider', this._element);
            this.thumbnail_columns = this._element.data('thumbnail_columns');
            this.product_id = this.$variations_form.data('product_id');
            this.is_variation_product = this.$variations_form.length > 0;
            this.initial_load = true;

            // Call
            this.defaultGallery();
            this.initVariationImagePreload();

            this.initEvents();

            if (this.is_variation_product) {
                this.initSlick();
                this.initZoom();
                this.initPhotoswipe();
            }

            if (!this.is_variation_product) {
                this.imagesLoaded();
            }

            this.initVariationGallery();

            this._element.data('woo_variation_gallery', this);
            $(document).trigger('woo_variation_gallery_init', [this]);
        }

        _createClass(WooVariationGallery, [{
            key: 'init',
            value: function init() {
                var _this = this;

                return _.debounce(function () {
                    _this.initSlick();
                    _this.initZoom();
                    _this.initPhotoswipe();
                }, 500);
            }
        }, {
            key: 'dimension',
            value: function dimension() {

                //this._element.css('min-height', '0px');
                //this._element.css('min-width', '0px');

                //return _.debounce(() => {
                //this._element.css('min-height', this.$slider.height() + 'px');
                //this._element.css('min-width', this.$slider.width() + 'px');
                //}, 400);
            }
        }, {
            key: 'initEvents',
            value: function initEvents() {
                // $(window).on('resize', this.dimension());
                this._element.on('woo_variation_gallery_image_loaded', this.init());
            }
        }, {
            key: 'initSlick',
            value: function initSlick() {
                var _this2 = this;

                if (this.$slider.hasClass('slick-initialized')) {
                    this.$slider.slick('unslick');
                }

                this.$slider.off('init');
                this.$slider.off('beforeChange');
                this.$slider.off('afterChange');

                this._element.trigger('woo_variation_gallery_before_init', [this]);

                // Slider

                this.$slider.on('init', function (event) {
                    if (_this2.initial_load) {
                        _this2.initial_load = false;
                        // this._element.css('min-height', this.$slider.height() + 'px');
                    }
                }).on('beforeChange', function (event, slick, currentSlide, nextSlide) {
                    _this2.$thumbnail.find('.wvg-gallery-thumbnail-image').not('.slick-slide').removeClass('current-thumbnail');
                    _this2.$thumbnail.find('.wvg-gallery-thumbnail-image').not('.slick-slide').eq(nextSlide).addClass('current-thumbnail');
                }).on('afterChange', function (event, slick, currentSlide) {
                    _this2.stopVideo(_this2.$slider);
                    _this2.initZoomForTarget(currentSlide);
                }).slick();

                // Thumbnails

                this.$thumbnail.find('.wvg-gallery-thumbnail-image').not('.slick-slide').first().addClass('current-thumbnail');

                this.$thumbnail.find('.wvg-gallery-thumbnail-image').not('.slick-slide').each(function (index, el) {
                    $(el).find('div, img').on('click', function (event) {
                        event.preventDefault();
                        event.stopPropagation();
                        _this2.$slider.slick('slickGoTo', index);
                    });
                });

                _.delay(function () {
                    _this2._element.trigger('woo_variation_gallery_slider_slick_init', [_this2]);
                }, 1);

                _.delay(function () {
                    _this2.removeLoadingClass();
                }, 100);
            }
        }, {
            key: 'initZoomForTarget',
            value: function initZoomForTarget(currentSlide) {

                if (!woo_variation_gallery_options.enable_gallery_zoom) {
                    return;
                }

                var galleryWidth = parseInt(this.$target.width()),
                    zoomEnabled = false,
                    zoomTarget = this.$slider.slick('getSlick').$slides.eq(currentSlide);

                $(zoomTarget).each(function (index, target) {
                    var image = $(target).find('img');

                    if (parseInt(image.data('large_image_width')) > galleryWidth) {
                        zoomEnabled = true;

                        return false;
                    }
                });

                // If zoom not included.
                if (!$().zoom) {
                    return;
                }

                // But only zoom if the img is larger than its container.
                if (zoomEnabled) {
                    var zoom_options = $.extend({
                        touch: false
                    }, wc_single_product_params.zoom_options);

                    if ('ontouchstart' in document.documentElement) {
                        zoom_options.on = 'click';
                    }

                    zoomTarget.trigger('zoom.destroy');
                    zoomTarget.zoom(zoom_options);
                }
            }
        }, {
            key: 'initZoom',
            value: function initZoom() {
                var currentSlide = this.$slider.slick('slickCurrentSlide');
                this.initZoomForTarget(currentSlide);
            }
        }, {
            key: 'initPhotoswipe',
            value: function initPhotoswipe() {
                var _this3 = this;

                if (!woo_variation_gallery_options.enable_gallery_lightbox) {
                    return;
                }

                this._element.off('click', '.woo-variation-gallery-trigger');
                this._element.off('click', '.wvg-gallery-image a');

                this._element.on('click', '.woo-variation-gallery-trigger', function (event) {
                    _this3.openPhotoswipe(event);
                });

                this._element.on('click', '.wvg-gallery-image a', function (event) {
                    _this3.openPhotoswipe(event);
                });
            }
        }, {
            key: 'openPhotoswipe',
            value: function openPhotoswipe(event) {
                var _this4 = this;

                event.preventDefault();

                if (typeof PhotoSwipe === 'undefined') {
                    return false;
                }

                var pswpElement = $('.pswp')[0],
                    items = this.getGalleryItems();

                var options = $.extend({
                    index: this.$slider.slick('slickCurrentSlide')
                }, wc_single_product_params.photoswipe_options);

                // Initializes and opens PhotoSwipe.

                var photoswipe = new PhotoSwipe(pswpElement, PhotoSwipeUI_Default, items, options);

                // Gallery starts closing
                photoswipe.listen('close', function () {
                    _this4.stopVideo(pswpElement);
                });

                photoswipe.listen('afterChange', function () {
                    _this4.stopVideo(pswpElement);
                });

                photoswipe.init();
            }
        }, {
            key: 'stopVideo',
            value: function stopVideo(element) {
                $(element).find('iframe, video').each(function () {
                    var tag = $(this).prop("tagName").toLowerCase();
                    if (tag === 'iframe') {
                        var src = $(this).attr('src');
                        $(this).attr('src', src);
                    }

                    if (tag === 'video') {
                        $(this)[0].pause();
                    }
                });
            }
        }, {
            key: 'addLoadingClass',
            value: function addLoadingClass() {
                this._element.addClass('loading-gallery');
            }
        }, {
            key: 'removeLoadingClass',
            value: function removeLoadingClass() {
                this._element.removeClass('loading-gallery');
            }
        }, {
            key: 'getGalleryItems',
            value: function getGalleryItems() {
                var $slides = this.$slider.slick('getSlick').$slides,
                    items = [];

                if ($slides.length > 0) {
                    $slides.each(function (i, el) {
                        var img = $(el).find('img, iframe, video');
                        var tag = $(img).prop("tagName").toLowerCase();

                        var src = void 0,
                            item = void 0;
                        switch (tag) {
                            case 'img':
                                var large_image_src = img.attr('data-large_image'),
                                    large_image_w = img.attr('data-large_image_width'),
                                    large_image_h = img.attr('data-large_image_height');
                                item = {
                                    src: large_image_src,
                                    w: large_image_w,
                                    h: large_image_h,
                                    title: img.attr('data-caption') ? img.attr('data-caption') : img.attr('title')
                                };
                                break;
                            case 'iframe':
                                src = img.attr('src');
                                item = {
                                    html: '<iframe class="wvg-lightbox-iframe" src="' + src + '" style="width: 100%; height: 100%; margin: 0;padding: 0; background-color: #000000" frameborder="0" webkitAllowFullScreen mozallowfullscreen allowFullScreen></iframe>'
                                };
                                break;
                            case 'video':
                                src = img.attr('src');
                                item = {
                                    html: '<video class="wvg-lightbox-video" controls controlsList="nodownload" src="' + src + '" style="width: 100%; height: 100%; margin: 0;padding: 0; background-color: #000000"></video>'
                                };
                                break;
                        }

                        items.push(item);
                    });
                }
                return items;
            }
        }, {
            key: 'destroySlick',
            value: function destroySlick() {

                this.$slider.html('');
                this.$thumbnail.html('');

                if (this.$slider.hasClass('slick-initialized')) {
                    this.$slider.slick('unslick');
                }

                this._element.trigger('woo_variation_gallery_slick_destroy', [this]);
            }
        }, {
            key: 'defaultGallery',
            value: function defaultGallery() {
                var _this5 = this;

                if (this.is_variation_product) {
                    wp.ajax.send('wvg_get_default_gallery', {
                        data: {
                            product_id: this.product_id
                        },
                        success: function success(data) {
                            _this5._element.data('woo_variation_gallery_default', data);
                            _this5._element.trigger('woo_variation_default_gallery_loaded', _this5);
                        },
                        error: function error(e) {
                            _this5._element.data('woo_variation_gallery_default', []);
                            _this5._element.trigger('woo_variation_default_gallery_loaded', _this5);
                            console.error('Variation Gallery not available on variation id ' + _this5.product_id + '.');
                        }
                    });
                }
            }
        }, {
            key: 'initVariationImagePreload',
            value: function initVariationImagePreload() {
                var _this6 = this;

                //return;
                if (this.is_variation_product) {
                    wp.ajax.send('wvg_get_available_variation_images', {
                        data: {
                            product_id: this.product_id
                        },
                        success: function success(images) {
                            // console.log(data)
                            if (images.length > 1) {
                                _this6.imagePreload(images);
                            }
                            _this6._element.data('woo_variation_gallery_variation_images', images);
                        },
                        error: function error(e) {
                            _this6._element.data('woo_variation_gallery_variation_images', []);
                            console.error('Variation Gallery variations images not available on variation id ' + _this6.product_id + '.');
                        }
                    });
                }
            }
        }, {
            key: 'imagePreload',
            value: function imagePreload(images) {
                for (var i = 0; i < images.length; i++) {
                    try {

                        // Note: this won't work when chrome devtool is open and 'disable cache' is enabled within the network panel
                        /*let _img       = new Image();
                        let _gallery   = new Image();
                        let _full      = new Image();
                        let _thumbnail = new Image();
                         _img.src    = images[i].src;
                        _img.srcset = images[i].srcset;
                         _gallery.src = images[i].gallery_thumbnail_src;
                         _full.src = images[i].full_src;
                         _thumbnail.src = images[i].thumb_src;*/

                        // Append Content
                        var _img_src = images[i].src;
                        var _img_srcset = images[i].srcset;

                        var _gallery_src = images[i].gallery_thumbnail_src;
                        var _full_src = images[i].full_src;
                        var _thumbnail_src = images[i].thumb_src;

                        var template = '<div style="display: none"><img aria-hidden="true" style="display: none" src="' + _img_src + '" /><img style="display: none" src="' + _gallery_src + '" /><img style="display: none" src="' + _thumbnail_src + '" /><img style="display: none" src="' + _full_src + '" /></div>';

                        if (_img_srcset) {
                            var _template = '<div style="display: none"><img aria-hidden="true" style="display: none" src="' + _img_src + '" srcset="' + _img_srcset + '" /><img style="display: none" src="' + _gallery_src + '" /><img style="display: none" src="' + _thumbnail_src + '" /><img style="display: none" src="' + _full_src + '" /></div>';
                        }

                        // let template = `<div style="display: none"><img aria-hidden="true" style="display: none" src="${_img_src}" srcset="${_img_srcset}" /><img style="display: none" src="${_gallery_src}" /><img style="display: none" src="${_thumbnail_src}" /><img style="display: none" src="${_full_src}" /></div>`;
                        $('body').append(template);
                    } catch (e) {
                        console.error(e);
                    }
                }
            }
        }, {
            key: 'initVariationGallery',
            value: function initVariationGallery() {
                var _this7 = this;

                // show_variation, found_variation

                this.$variations_form.off('reset_image.wvg');
                this.$variations_form.off('click.wvg');
                this.$variations_form.off('show_variation.wvg');

                if (woo_variation_gallery_options.gallery_reset_on_variation_change) {
                    this.$variations_form.on('reset_image.wvg', function (event) {
                        _this7.addLoadingClass();
                        _this7.galleryReset();
                    });
                } else {
                    this.$variations_form.on('click.wvg', '.reset_variations', function (event) {
                        _this7.addLoadingClass();
                        _this7.galleryReset();
                    });
                }

                this.$variations_form.on('show_variation.wvg', function (event, variation) {
                    _this7.addLoadingClass();
                    _this7.galleryInit(variation.variation_gallery_images);
                });
            }
        }, {
            key: 'galleryReset',
            value: function galleryReset() {
                var _this8 = this;

                var $default_gallery = this._element.data('woo_variation_gallery_default');

                if ($default_gallery && $default_gallery.length > 0) {
                    this.galleryInit($default_gallery);
                } else {
                    _.delay(function () {
                        _this8.removeLoadingClass();
                    }, 100);
                }
            }
        }, {
            key: 'galleryInit',
            value: function galleryInit(images) {
                var _this9 = this;

                var hasGallery = images.length > 1;

                this._element.trigger('before_woo_variation_gallery_init', [this, images]);

                this.destroySlick();

                var slider_inner_html = images.map(function (image) {
                    var template = wp.template('woo-variation-gallery-slider-template');
                    return template(image);
                }).join('');

                var thumbnail_inner_html = images.map(function (image) {
                    var template = wp.template('woo-variation-gallery-thumbnail-template');
                    return template(image);
                }).join('');

                if (hasGallery) {
                    this.$target.addClass('woo-variation-gallery-has-product-thumbnail');
                } else {
                    this.$target.removeClass('woo-variation-gallery-has-product-thumbnail');
                }

                this.$slider.html(slider_inner_html);

                if (hasGallery) {
                    this.$thumbnail.html(thumbnail_inner_html);
                } else {
                    this.$thumbnail.html('');
                }

                //this._element.trigger('woo_variation_gallery_init', [this, images]);

                _.delay(function () {
                    _this9.imagesLoaded();
                }, 1);

                //this._element.trigger('after_woo_variation_gallery_init', [this, images]);
            }
        }, {
            key: 'imagesLoaded',
            value: function imagesLoaded() {
                var _this10 = this;

                // Some Script Add Custom imagesLoaded Function
                if (!$().imagesLoaded.done) {
                    this._element.trigger('woo_variation_gallery_image_loading', [this]);
                    this._element.trigger('woo_variation_gallery_image_loaded', [this]);
                    return;
                }

                this._element.imagesLoaded().progress(function (instance, image) {
                    _this10._element.trigger('woo_variation_gallery_image_loading', [_this10]);
                }).done(function (instance) {
                    _this10._element.trigger('woo_variation_gallery_image_loaded', [_this10]);
                });
            }
        }], [{
            key: '_jQueryInterface',
            value: function _jQueryInterface(config) {
                return this.each(function () {
                    new WooVariationGallery(this, config);
                });
            }
        }]);

        return WooVariationGallery;
    }();

    /**
     * ------------------------------------------------------------------------
     * jQuery
     * ------------------------------------------------------------------------
     */

    $.fn['WooVariationGallery'] = WooVariationGallery._jQueryInterface;
    $.fn['WooVariationGallery'].Constructor = WooVariationGallery;
    $.fn['WooVariationGallery'].noConflict = function () {
        $.fn['WooVariationGallery'] = $.fn['WooVariationGallery'];
        return WooVariationGallery._jQueryInterface;
    };

    return WooVariationGallery;
}(jQuery);

/* harmony default export */ __webpack_exports__["default"] = (WooVariationGallery);

/***/ }),
/* 3 */
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),
/* 4 */
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),
/* 5 */
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),
/* 6 */
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),
/* 7 */
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ })
/******/ ]);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXNzZXRzL2pzL2Zyb250ZW5kLmpzIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vL3dlYnBhY2svYm9vdHN0cmFwIDhlZTFmZTA0MGQyYTM5OTU0MTkzIiwid2VicGFjazovLy9zcmMvanMvZnJvbnRlbmQuanMiLCJ3ZWJwYWNrOi8vL3NyYy9qcy9Xb29WYXJpYXRpb25HYWxsZXJ5LmpzIiwid2VicGFjazovLy8uL3NyYy9zY3NzL3NsaWNrLnNjc3M/MmMzMyIsIndlYnBhY2s6Ly8vLi9zcmMvc2Nzcy9mcm9udGVuZC5zY3NzPzJjM2EiLCJ3ZWJwYWNrOi8vLy4vc3JjL3Njc3MvdGhlbWUtc3VwcG9ydC5zY3NzIiwid2VicGFjazovLy8uL3NyYy9zY3NzL2JhY2tlbmQuc2Nzcz9iZjUwIiwid2VicGFjazovLy8uL3NyYy9zY3NzL2d3cC1hZG1pbi5zY3NzP2FmZjMiXSwic291cmNlc0NvbnRlbnQiOlsiIFx0Ly8gVGhlIG1vZHVsZSBjYWNoZVxuIFx0dmFyIGluc3RhbGxlZE1vZHVsZXMgPSB7fTtcblxuIFx0Ly8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbiBcdGZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblxuIFx0XHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcbiBcdFx0aWYoaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0pIHtcbiBcdFx0XHRyZXR1cm4gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0uZXhwb3J0cztcbiBcdFx0fVxuIFx0XHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuIFx0XHR2YXIgbW9kdWxlID0gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0gPSB7XG4gXHRcdFx0aTogbW9kdWxlSWQsXG4gXHRcdFx0bDogZmFsc2UsXG4gXHRcdFx0ZXhwb3J0czoge31cbiBcdFx0fTtcblxuIFx0XHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cbiBcdFx0bW9kdWxlc1ttb2R1bGVJZF0uY2FsbChtb2R1bGUuZXhwb3J0cywgbW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cbiBcdFx0Ly8gRmxhZyB0aGUgbW9kdWxlIGFzIGxvYWRlZFxuIFx0XHRtb2R1bGUubCA9IHRydWU7XG5cbiBcdFx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcbiBcdFx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xuIFx0fVxuXG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlcyBvYmplY3QgKF9fd2VicGFja19tb2R1bGVzX18pXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm0gPSBtb2R1bGVzO1xuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZSBjYWNoZVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5jID0gaW5zdGFsbGVkTW9kdWxlcztcblxuIFx0Ly8gZGVmaW5lIGdldHRlciBmdW5jdGlvbiBmb3IgaGFybW9ueSBleHBvcnRzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQgPSBmdW5jdGlvbihleHBvcnRzLCBuYW1lLCBnZXR0ZXIpIHtcbiBcdFx0aWYoIV9fd2VicGFja19yZXF1aXJlX18ubyhleHBvcnRzLCBuYW1lKSkge1xuIFx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBuYW1lLCB7XG4gXHRcdFx0XHRjb25maWd1cmFibGU6IGZhbHNlLFxuIFx0XHRcdFx0ZW51bWVyYWJsZTogdHJ1ZSxcbiBcdFx0XHRcdGdldDogZ2V0dGVyXG4gXHRcdFx0fSk7XG4gXHRcdH1cbiBcdH07XG5cbiBcdC8vIGdldERlZmF1bHRFeHBvcnQgZnVuY3Rpb24gZm9yIGNvbXBhdGliaWxpdHkgd2l0aCBub24taGFybW9ueSBtb2R1bGVzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm4gPSBmdW5jdGlvbihtb2R1bGUpIHtcbiBcdFx0dmFyIGdldHRlciA9IG1vZHVsZSAmJiBtb2R1bGUuX19lc01vZHVsZSA/XG4gXHRcdFx0ZnVuY3Rpb24gZ2V0RGVmYXVsdCgpIHsgcmV0dXJuIG1vZHVsZVsnZGVmYXVsdCddOyB9IDpcbiBcdFx0XHRmdW5jdGlvbiBnZXRNb2R1bGVFeHBvcnRzKCkgeyByZXR1cm4gbW9kdWxlOyB9O1xuIFx0XHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQoZ2V0dGVyLCAnYScsIGdldHRlcik7XG4gXHRcdHJldHVybiBnZXR0ZXI7XG4gXHR9O1xuXG4gXHQvLyBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGxcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubyA9IGZ1bmN0aW9uKG9iamVjdCwgcHJvcGVydHkpIHsgcmV0dXJuIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmplY3QsIHByb3BlcnR5KTsgfTtcblxuIFx0Ly8gX193ZWJwYWNrX3B1YmxpY19wYXRoX19cbiBcdF9fd2VicGFja19yZXF1aXJlX18ucCA9IFwiXCI7XG5cbiBcdC8vIExvYWQgZW50cnkgbW9kdWxlIGFuZCByZXR1cm4gZXhwb3J0c1xuIFx0cmV0dXJuIF9fd2VicGFja19yZXF1aXJlX18oX193ZWJwYWNrX3JlcXVpcmVfXy5zID0gMCk7XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gd2VicGFjay9ib290c3RyYXAgOGVlMWZlMDQwZDJhMzk5NTQxOTMiLCJqUXVlcnkoJCA9PiB7XG4gICAgaW1wb3J0KCcuL1dvb1ZhcmlhdGlvbkdhbGxlcnknKS50aGVuKCgpID0+IHtcblxuICAgICAgICAvLyBGb3IgU2luZ2xlIFByb2R1Y3RcblxuICAgICAgICAkKCcud29vLXZhcmlhdGlvbi1nYWxsZXJ5LXdyYXBwZXI6bm90KC53b28tdmFyaWF0aW9uLWdhbGxlcnktcHJvZHVjdC10eXBlLXZhcmlhYmxlKScpLldvb1ZhcmlhdGlvbkdhbGxlcnkoKTtcblxuICAgICAgICAvLyBBamF4IGFuZCBWYXJpYXRpb24gUHJvZHVjdFxuICAgICAgICAkKGRvY3VtZW50KS5vbignd2NfdmFyaWF0aW9uX2Zvcm0nLCAnLnZhcmlhdGlvbnNfZm9ybScsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICQoJy53b28tdmFyaWF0aW9uLWdhbGxlcnktd3JhcHBlcicpLldvb1ZhcmlhdGlvbkdhbGxlcnkoKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgLy8gU3VwcG9ydCBmb3IgSmV0cGFjaydzIEluZmluaXRlIFNjcm9sbCxcbiAgICAgICAgJChkb2N1bWVudC5ib2R5KS5vbigncG9zdC1sb2FkJywgZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgJCgnLndvby12YXJpYXRpb24tZ2FsbGVyeS13cmFwcGVyJykuV29vVmFyaWF0aW9uR2FsbGVyeSgpO1xuICAgICAgICB9KTtcblxuICAgICAgICAvLyBZSVRIIFF1aWNrdmlld1xuICAgICAgICAkKGRvY3VtZW50KS5vbigncXZfbG9hZGVyX3N0b3AnLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAkKCcud29vLXZhcmlhdGlvbi1nYWxsZXJ5LXdyYXBwZXI6bm90KC53b28tdmFyaWF0aW9uLWdhbGxlcnktcHJvZHVjdC10eXBlLXZhcmlhYmxlKScpLldvb1ZhcmlhdGlvbkdhbGxlcnkoKTtcbiAgICAgICAgfSk7XG4gICAgfSk7XG59KTsgIC8vIGVuZCBvZiBqcXVlcnkgbWFpbiB3cmFwcGVyXG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gc3JjL2pzL2Zyb250ZW5kLmpzIiwiLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuLy8gV29vQ29tbWVyY2UgVmFyaWF0aW9uIEdhbGxlcnlcbi8qZ2xvYmFsIHdjX2FkZF90b19jYXJ0X3ZhcmlhdGlvbl9wYXJhbXMsIHdvb192YXJpYXRpb25fZ2FsbGVyeV9vcHRpb25zICovXG4vLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5cbmNvbnN0IFdvb1ZhcmlhdGlvbkdhbGxlcnkgPSAoKCQpID0+IHtcblxuICAgIGNvbnN0IERlZmF1bHQgPSB7fTtcblxuICAgIGNsYXNzIFdvb1ZhcmlhdGlvbkdhbGxlcnkge1xuXG4gICAgICAgIGNvbnN0cnVjdG9yKGVsZW1lbnQsIGNvbmZpZykge1xuXG4gICAgICAgICAgICAvLyBBc3NpZ25cbiAgICAgICAgICAgIHRoaXMuX2VsICAgICAgPSBlbGVtZW50O1xuICAgICAgICAgICAgdGhpcy5fZWxlbWVudCA9ICQoZWxlbWVudCk7XG4gICAgICAgICAgICB0aGlzLl9jb25maWcgID0gJC5leHRlbmQoe30sIERlZmF1bHQsIGNvbmZpZyk7XG5cbiAgICAgICAgICAgIHRoaXMuJHByb2R1Y3QgICAgICAgICAgICAgPSB0aGlzLl9lbGVtZW50LmNsb3Nlc3QoJy5wcm9kdWN0Jyk7XG4gICAgICAgICAgICB0aGlzLiR2YXJpYXRpb25zX2Zvcm0gICAgID0gdGhpcy4kcHJvZHVjdC5maW5kKCcudmFyaWF0aW9uc19mb3JtJyk7XG4gICAgICAgICAgICB0aGlzLiR0YXJnZXQgICAgICAgICAgICAgID0gdGhpcy5fZWxlbWVudC5wYXJlbnQoKTtcbiAgICAgICAgICAgIHRoaXMuJHNsaWRlciAgICAgICAgICAgICAgPSAkKCcud29vLXZhcmlhdGlvbi1nYWxsZXJ5LXNsaWRlcicsIHRoaXMuX2VsZW1lbnQpO1xuICAgICAgICAgICAgdGhpcy4kdGh1bWJuYWlsICAgICAgICAgICA9ICQoJy53b28tdmFyaWF0aW9uLWdhbGxlcnktdGh1bWJuYWlsLXNsaWRlcicsIHRoaXMuX2VsZW1lbnQpO1xuICAgICAgICAgICAgdGhpcy50aHVtYm5haWxfY29sdW1ucyAgICA9IHRoaXMuX2VsZW1lbnQuZGF0YSgndGh1bWJuYWlsX2NvbHVtbnMnKTtcbiAgICAgICAgICAgIHRoaXMucHJvZHVjdF9pZCAgICAgICAgICAgPSB0aGlzLiR2YXJpYXRpb25zX2Zvcm0uZGF0YSgncHJvZHVjdF9pZCcpO1xuICAgICAgICAgICAgdGhpcy5pc192YXJpYXRpb25fcHJvZHVjdCA9ICh0aGlzLiR2YXJpYXRpb25zX2Zvcm0ubGVuZ3RoID4gMCk7XG4gICAgICAgICAgICB0aGlzLmluaXRpYWxfbG9hZCAgICAgICAgID0gdHJ1ZTtcblxuICAgICAgICAgICAgLy8gQ2FsbFxuICAgICAgICAgICAgdGhpcy5kZWZhdWx0R2FsbGVyeSgpO1xuICAgICAgICAgICAgdGhpcy5pbml0VmFyaWF0aW9uSW1hZ2VQcmVsb2FkKCk7XG5cbiAgICAgICAgICAgIHRoaXMuaW5pdEV2ZW50cygpO1xuXG4gICAgICAgICAgICBpZiAodGhpcy5pc192YXJpYXRpb25fcHJvZHVjdCkge1xuICAgICAgICAgICAgICAgIHRoaXMuaW5pdFNsaWNrKCk7XG4gICAgICAgICAgICAgICAgdGhpcy5pbml0Wm9vbSgpO1xuICAgICAgICAgICAgICAgIHRoaXMuaW5pdFBob3Rvc3dpcGUoKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKCF0aGlzLmlzX3ZhcmlhdGlvbl9wcm9kdWN0KSB7XG4gICAgICAgICAgICAgICAgdGhpcy5pbWFnZXNMb2FkZWQoKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgdGhpcy5pbml0VmFyaWF0aW9uR2FsbGVyeSgpO1xuXG4gICAgICAgICAgICB0aGlzLl9lbGVtZW50LmRhdGEoJ3dvb192YXJpYXRpb25fZ2FsbGVyeScsIHRoaXMpO1xuICAgICAgICAgICAgJChkb2N1bWVudCkudHJpZ2dlcignd29vX3ZhcmlhdGlvbl9nYWxsZXJ5X2luaXQnLCBbdGhpc10pO1xuICAgICAgICB9XG5cbiAgICAgICAgc3RhdGljIF9qUXVlcnlJbnRlcmZhY2UoY29uZmlnKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5lYWNoKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICBuZXcgV29vVmFyaWF0aW9uR2FsbGVyeSh0aGlzLCBjb25maWcpXG4gICAgICAgICAgICB9KVxuICAgICAgICB9XG5cbiAgICAgICAgaW5pdCgpIHtcbiAgICAgICAgICAgIHJldHVybiBfLmRlYm91bmNlKCgpID0+IHtcbiAgICAgICAgICAgICAgICB0aGlzLmluaXRTbGljaygpO1xuICAgICAgICAgICAgICAgIHRoaXMuaW5pdFpvb20oKTtcbiAgICAgICAgICAgICAgICB0aGlzLmluaXRQaG90b3N3aXBlKCk7XG4gICAgICAgICAgICB9LCA1MDApO1xuICAgICAgICB9XG5cbiAgICAgICAgZGltZW5zaW9uKCkge1xuXG4gICAgICAgICAgICAvL3RoaXMuX2VsZW1lbnQuY3NzKCdtaW4taGVpZ2h0JywgJzBweCcpO1xuICAgICAgICAgICAgLy90aGlzLl9lbGVtZW50LmNzcygnbWluLXdpZHRoJywgJzBweCcpO1xuXG4gICAgICAgICAgICAvL3JldHVybiBfLmRlYm91bmNlKCgpID0+IHtcbiAgICAgICAgICAgIC8vdGhpcy5fZWxlbWVudC5jc3MoJ21pbi1oZWlnaHQnLCB0aGlzLiRzbGlkZXIuaGVpZ2h0KCkgKyAncHgnKTtcbiAgICAgICAgICAgIC8vdGhpcy5fZWxlbWVudC5jc3MoJ21pbi13aWR0aCcsIHRoaXMuJHNsaWRlci53aWR0aCgpICsgJ3B4Jyk7XG4gICAgICAgICAgICAvL30sIDQwMCk7XG4gICAgICAgIH1cblxuICAgICAgICBpbml0RXZlbnRzKCkge1xuICAgICAgICAgICAgLy8gJCh3aW5kb3cpLm9uKCdyZXNpemUnLCB0aGlzLmRpbWVuc2lvbigpKTtcbiAgICAgICAgICAgIHRoaXMuX2VsZW1lbnQub24oJ3dvb192YXJpYXRpb25fZ2FsbGVyeV9pbWFnZV9sb2FkZWQnLCB0aGlzLmluaXQoKSk7XG4gICAgICAgIH1cblxuICAgICAgICBpbml0U2xpY2soKSB7XG5cbiAgICAgICAgICAgIGlmICh0aGlzLiRzbGlkZXIuaGFzQ2xhc3MoJ3NsaWNrLWluaXRpYWxpemVkJykpIHtcbiAgICAgICAgICAgICAgICB0aGlzLiRzbGlkZXIuc2xpY2soJ3Vuc2xpY2snKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgdGhpcy4kc2xpZGVyLm9mZignaW5pdCcpO1xuICAgICAgICAgICAgdGhpcy4kc2xpZGVyLm9mZignYmVmb3JlQ2hhbmdlJyk7XG4gICAgICAgICAgICB0aGlzLiRzbGlkZXIub2ZmKCdhZnRlckNoYW5nZScpO1xuXG4gICAgICAgICAgICB0aGlzLl9lbGVtZW50LnRyaWdnZXIoJ3dvb192YXJpYXRpb25fZ2FsbGVyeV9iZWZvcmVfaW5pdCcsIFt0aGlzXSk7XG5cbiAgICAgICAgICAgIC8vIFNsaWRlclxuXG4gICAgICAgICAgICB0aGlzLiRzbGlkZXJcbiAgICAgICAgICAgICAgICAub24oJ2luaXQnLCAoZXZlbnQpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHRoaXMuaW5pdGlhbF9sb2FkKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmluaXRpYWxfbG9hZCA9IGZhbHNlO1xuICAgICAgICAgICAgICAgICAgICAgICAgLy8gdGhpcy5fZWxlbWVudC5jc3MoJ21pbi1oZWlnaHQnLCB0aGlzLiRzbGlkZXIuaGVpZ2h0KCkgKyAncHgnKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgLm9uKCdiZWZvcmVDaGFuZ2UnLCAoZXZlbnQsIHNsaWNrLCBjdXJyZW50U2xpZGUsIG5leHRTbGlkZSkgPT4ge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLiR0aHVtYm5haWwuZmluZCgnLnd2Zy1nYWxsZXJ5LXRodW1ibmFpbC1pbWFnZScpLm5vdCgnLnNsaWNrLXNsaWRlJykucmVtb3ZlQ2xhc3MoJ2N1cnJlbnQtdGh1bWJuYWlsJyk7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuJHRodW1ibmFpbC5maW5kKCcud3ZnLWdhbGxlcnktdGh1bWJuYWlsLWltYWdlJykubm90KCcuc2xpY2stc2xpZGUnKS5lcShuZXh0U2xpZGUpLmFkZENsYXNzKCdjdXJyZW50LXRodW1ibmFpbCcpO1xuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgLm9uKCdhZnRlckNoYW5nZScsIChldmVudCwgc2xpY2ssIGN1cnJlbnRTbGlkZSkgPT4ge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLnN0b3BWaWRlbyh0aGlzLiRzbGlkZXIpO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmluaXRab29tRm9yVGFyZ2V0KGN1cnJlbnRTbGlkZSk7XG4gICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAuc2xpY2soKTtcblxuICAgICAgICAgICAgLy8gVGh1bWJuYWlsc1xuXG4gICAgICAgICAgICB0aGlzLiR0aHVtYm5haWwuZmluZCgnLnd2Zy1nYWxsZXJ5LXRodW1ibmFpbC1pbWFnZScpLm5vdCgnLnNsaWNrLXNsaWRlJykuZmlyc3QoKS5hZGRDbGFzcygnY3VycmVudC10aHVtYm5haWwnKTtcblxuICAgICAgICAgICAgdGhpcy4kdGh1bWJuYWlsLmZpbmQoJy53dmctZ2FsbGVyeS10aHVtYm5haWwtaW1hZ2UnKS5ub3QoJy5zbGljay1zbGlkZScpLmVhY2goKGluZGV4LCBlbCkgPT4ge1xuICAgICAgICAgICAgICAgICQoZWwpLmZpbmQoJ2RpdiwgaW1nJykub24oJ2NsaWNrJywgKGV2ZW50KSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgICAgICAgICAgICAgIGV2ZW50LnN0b3BQcm9wYWdhdGlvbigpO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLiRzbGlkZXIuc2xpY2soJ3NsaWNrR29UbycsIGluZGV4KTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICBfLmRlbGF5KCgpID0+IHtcbiAgICAgICAgICAgICAgICB0aGlzLl9lbGVtZW50LnRyaWdnZXIoJ3dvb192YXJpYXRpb25fZ2FsbGVyeV9zbGlkZXJfc2xpY2tfaW5pdCcsIFt0aGlzXSk7XG4gICAgICAgICAgICB9LCAxKTtcblxuICAgICAgICAgICAgXy5kZWxheSgoKSA9PiB7XG4gICAgICAgICAgICAgICAgdGhpcy5yZW1vdmVMb2FkaW5nQ2xhc3MoKTtcbiAgICAgICAgICAgIH0sIDEwMCk7XG4gICAgICAgIH1cblxuICAgICAgICBpbml0Wm9vbUZvclRhcmdldChjdXJyZW50U2xpZGUpIHtcblxuICAgICAgICAgICAgaWYgKCF3b29fdmFyaWF0aW9uX2dhbGxlcnlfb3B0aW9ucy5lbmFibGVfZ2FsbGVyeV96b29tKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBsZXQgZ2FsbGVyeVdpZHRoID0gcGFyc2VJbnQodGhpcy4kdGFyZ2V0LndpZHRoKCkpLFxuICAgICAgICAgICAgICAgIHpvb21FbmFibGVkICA9IGZhbHNlLFxuICAgICAgICAgICAgICAgIHpvb21UYXJnZXQgICA9IHRoaXMuJHNsaWRlci5zbGljaygnZ2V0U2xpY2snKS4kc2xpZGVzLmVxKGN1cnJlbnRTbGlkZSk7XG5cbiAgICAgICAgICAgICQoem9vbVRhcmdldCkuZWFjaChmdW5jdGlvbiAoaW5kZXgsIHRhcmdldCkge1xuICAgICAgICAgICAgICAgIGxldCBpbWFnZSA9ICQodGFyZ2V0KS5maW5kKCdpbWcnKTtcblxuICAgICAgICAgICAgICAgIGlmIChwYXJzZUludChpbWFnZS5kYXRhKCdsYXJnZV9pbWFnZV93aWR0aCcpKSA+IGdhbGxlcnlXaWR0aCkge1xuICAgICAgICAgICAgICAgICAgICB6b29tRW5hYmxlZCA9IHRydWU7XG5cbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAvLyBJZiB6b29tIG5vdCBpbmNsdWRlZC5cbiAgICAgICAgICAgIGlmICghJCgpLnpvb20pIHtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC8vIEJ1dCBvbmx5IHpvb20gaWYgdGhlIGltZyBpcyBsYXJnZXIgdGhhbiBpdHMgY29udGFpbmVyLlxuICAgICAgICAgICAgaWYgKHpvb21FbmFibGVkKSB7XG4gICAgICAgICAgICAgICAgbGV0IHpvb21fb3B0aW9ucyA9ICQuZXh0ZW5kKHtcbiAgICAgICAgICAgICAgICAgICAgdG91Y2ggOiBmYWxzZVxuICAgICAgICAgICAgICAgIH0sIHdjX3NpbmdsZV9wcm9kdWN0X3BhcmFtcy56b29tX29wdGlvbnMpO1xuXG4gICAgICAgICAgICAgICAgaWYgKCdvbnRvdWNoc3RhcnQnIGluIGRvY3VtZW50LmRvY3VtZW50RWxlbWVudCkge1xuICAgICAgICAgICAgICAgICAgICB6b29tX29wdGlvbnMub24gPSAnY2xpY2snO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIHpvb21UYXJnZXQudHJpZ2dlcignem9vbS5kZXN0cm95Jyk7XG4gICAgICAgICAgICAgICAgem9vbVRhcmdldC56b29tKHpvb21fb3B0aW9ucyk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBpbml0Wm9vbSgpIHtcbiAgICAgICAgICAgIGxldCBjdXJyZW50U2xpZGUgPSB0aGlzLiRzbGlkZXIuc2xpY2soJ3NsaWNrQ3VycmVudFNsaWRlJyk7XG4gICAgICAgICAgICB0aGlzLmluaXRab29tRm9yVGFyZ2V0KGN1cnJlbnRTbGlkZSk7XG4gICAgICAgIH1cblxuICAgICAgICBpbml0UGhvdG9zd2lwZSgpIHtcblxuICAgICAgICAgICAgaWYgKCF3b29fdmFyaWF0aW9uX2dhbGxlcnlfb3B0aW9ucy5lbmFibGVfZ2FsbGVyeV9saWdodGJveCkge1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgdGhpcy5fZWxlbWVudC5vZmYoJ2NsaWNrJywgJy53b28tdmFyaWF0aW9uLWdhbGxlcnktdHJpZ2dlcicpO1xuICAgICAgICAgICAgdGhpcy5fZWxlbWVudC5vZmYoJ2NsaWNrJywgJy53dmctZ2FsbGVyeS1pbWFnZSBhJyk7XG5cbiAgICAgICAgICAgIHRoaXMuX2VsZW1lbnQub24oJ2NsaWNrJywgJy53b28tdmFyaWF0aW9uLWdhbGxlcnktdHJpZ2dlcicsIChldmVudCkgPT4ge1xuICAgICAgICAgICAgICAgIHRoaXMub3BlblBob3Rvc3dpcGUoZXZlbnQpXG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgdGhpcy5fZWxlbWVudC5vbignY2xpY2snLCAnLnd2Zy1nYWxsZXJ5LWltYWdlIGEnLCAoZXZlbnQpID0+IHtcbiAgICAgICAgICAgICAgICB0aGlzLm9wZW5QaG90b3N3aXBlKGV2ZW50KTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG5cbiAgICAgICAgb3BlblBob3Rvc3dpcGUoZXZlbnQpIHtcblxuICAgICAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcblxuICAgICAgICAgICAgaWYgKHR5cGVvZihQaG90b1N3aXBlKSA9PT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGxldCBwc3dwRWxlbWVudCA9ICQoJy5wc3dwJylbMF0sXG4gICAgICAgICAgICAgICAgaXRlbXMgICAgICAgPSB0aGlzLmdldEdhbGxlcnlJdGVtcygpO1xuXG4gICAgICAgICAgICBsZXQgb3B0aW9ucyA9ICQuZXh0ZW5kKHtcbiAgICAgICAgICAgICAgICBpbmRleCA6IHRoaXMuJHNsaWRlci5zbGljaygnc2xpY2tDdXJyZW50U2xpZGUnKVxuICAgICAgICAgICAgfSwgd2Nfc2luZ2xlX3Byb2R1Y3RfcGFyYW1zLnBob3Rvc3dpcGVfb3B0aW9ucyk7XG5cbiAgICAgICAgICAgIC8vIEluaXRpYWxpemVzIGFuZCBvcGVucyBQaG90b1N3aXBlLlxuXG4gICAgICAgICAgICBsZXQgcGhvdG9zd2lwZSA9IG5ldyBQaG90b1N3aXBlKHBzd3BFbGVtZW50LCBQaG90b1N3aXBlVUlfRGVmYXVsdCwgaXRlbXMsIG9wdGlvbnMpO1xuXG4gICAgICAgICAgICAvLyBHYWxsZXJ5IHN0YXJ0cyBjbG9zaW5nXG4gICAgICAgICAgICBwaG90b3N3aXBlLmxpc3RlbignY2xvc2UnLCAoKSA9PiB7XG4gICAgICAgICAgICAgICAgdGhpcy5zdG9wVmlkZW8ocHN3cEVsZW1lbnQpO1xuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIHBob3Rvc3dpcGUubGlzdGVuKCdhZnRlckNoYW5nZScsICgpID0+IHtcbiAgICAgICAgICAgICAgICB0aGlzLnN0b3BWaWRlbyhwc3dwRWxlbWVudCk7XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgcGhvdG9zd2lwZS5pbml0KCk7XG4gICAgICAgIH1cblxuICAgICAgICBzdG9wVmlkZW8oZWxlbWVudCkge1xuICAgICAgICAgICAgJChlbGVtZW50KS5maW5kKCdpZnJhbWUsIHZpZGVvJykuZWFjaChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgbGV0IHRhZyA9ICQodGhpcykucHJvcChcInRhZ05hbWVcIikudG9Mb3dlckNhc2UoKTtcbiAgICAgICAgICAgICAgICBpZiAodGFnID09PSAnaWZyYW1lJykge1xuICAgICAgICAgICAgICAgICAgICBsZXQgc3JjID0gJCh0aGlzKS5hdHRyKCdzcmMnKTtcbiAgICAgICAgICAgICAgICAgICAgJCh0aGlzKS5hdHRyKCdzcmMnLCBzcmMpO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIGlmICh0YWcgPT09ICd2aWRlbycpIHtcbiAgICAgICAgICAgICAgICAgICAgJCh0aGlzKVswXS5wYXVzZSgpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG5cbiAgICAgICAgYWRkTG9hZGluZ0NsYXNzKCkge1xuICAgICAgICAgICAgdGhpcy5fZWxlbWVudC5hZGRDbGFzcygnbG9hZGluZy1nYWxsZXJ5Jyk7XG4gICAgICAgIH1cblxuICAgICAgICByZW1vdmVMb2FkaW5nQ2xhc3MoKSB7XG4gICAgICAgICAgICB0aGlzLl9lbGVtZW50LnJlbW92ZUNsYXNzKCdsb2FkaW5nLWdhbGxlcnknKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGdldEdhbGxlcnlJdGVtcygpIHtcbiAgICAgICAgICAgIGxldCAkc2xpZGVzID0gdGhpcy4kc2xpZGVyLnNsaWNrKCdnZXRTbGljaycpLiRzbGlkZXMsXG4gICAgICAgICAgICAgICAgaXRlbXMgICA9IFtdO1xuXG4gICAgICAgICAgICBpZiAoJHNsaWRlcy5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICAgICAgJHNsaWRlcy5lYWNoKGZ1bmN0aW9uIChpLCBlbCkge1xuICAgICAgICAgICAgICAgICAgICBsZXQgaW1nID0gJChlbCkuZmluZCgnaW1nLCBpZnJhbWUsIHZpZGVvJyk7XG4gICAgICAgICAgICAgICAgICAgIGxldCB0YWcgPSAkKGltZykucHJvcChcInRhZ05hbWVcIikudG9Mb3dlckNhc2UoKTtcblxuICAgICAgICAgICAgICAgICAgICBsZXQgc3JjLCBpdGVtO1xuICAgICAgICAgICAgICAgICAgICBzd2l0Y2ggKHRhZykge1xuICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSAnaW1nJzpcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBsZXQgbGFyZ2VfaW1hZ2Vfc3JjID0gaW1nLmF0dHIoJ2RhdGEtbGFyZ2VfaW1hZ2UnKSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbGFyZ2VfaW1hZ2VfdyAgID0gaW1nLmF0dHIoJ2RhdGEtbGFyZ2VfaW1hZ2Vfd2lkdGgnKSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbGFyZ2VfaW1hZ2VfaCAgID0gaW1nLmF0dHIoJ2RhdGEtbGFyZ2VfaW1hZ2VfaGVpZ2h0Jyk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaXRlbSAgICAgICAgICAgICAgICA9IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc3JjICAgOiBsYXJnZV9pbWFnZV9zcmMsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHcgICAgIDogbGFyZ2VfaW1hZ2VfdyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaCAgICAgOiBsYXJnZV9pbWFnZV9oLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aXRsZSA6IGltZy5hdHRyKCdkYXRhLWNhcHRpb24nKSA/IGltZy5hdHRyKCdkYXRhLWNhcHRpb24nKSA6IGltZy5hdHRyKCd0aXRsZScpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgJ2lmcmFtZSc6XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc3JjICA9IGltZy5hdHRyKCdzcmMnKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpdGVtID0ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBodG1sIDogYDxpZnJhbWUgY2xhc3M9XCJ3dmctbGlnaHRib3gtaWZyYW1lXCIgc3JjPVwiJHtzcmN9XCIgc3R5bGU9XCJ3aWR0aDogMTAwJTsgaGVpZ2h0OiAxMDAlOyBtYXJnaW46IDA7cGFkZGluZzogMDsgYmFja2dyb3VuZC1jb2xvcjogIzAwMDAwMFwiIGZyYW1lYm9yZGVyPVwiMFwiIHdlYmtpdEFsbG93RnVsbFNjcmVlbiBtb3phbGxvd2Z1bGxzY3JlZW4gYWxsb3dGdWxsU2NyZWVuPjwvaWZyYW1lPmBcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgICAgICAgICBjYXNlICd2aWRlbyc6XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc3JjICA9IGltZy5hdHRyKCdzcmMnKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpdGVtID0ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBodG1sIDogYDx2aWRlbyBjbGFzcz1cInd2Zy1saWdodGJveC12aWRlb1wiIGNvbnRyb2xzIGNvbnRyb2xzTGlzdD1cIm5vZG93bmxvYWRcIiBzcmM9XCIke3NyY31cIiBzdHlsZT1cIndpZHRoOiAxMDAlOyBoZWlnaHQ6IDEwMCU7IG1hcmdpbjogMDtwYWRkaW5nOiAwOyBiYWNrZ3JvdW5kLWNvbG9yOiAjMDAwMDAwXCI+PC92aWRlbz5gXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgaXRlbXMucHVzaChpdGVtKTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiBpdGVtcztcbiAgICAgICAgfVxuXG4gICAgICAgIGRlc3Ryb3lTbGljaygpIHtcblxuICAgICAgICAgICAgdGhpcy4kc2xpZGVyLmh0bWwoJycpO1xuICAgICAgICAgICAgdGhpcy4kdGh1bWJuYWlsLmh0bWwoJycpO1xuXG4gICAgICAgICAgICBpZiAodGhpcy4kc2xpZGVyLmhhc0NsYXNzKCdzbGljay1pbml0aWFsaXplZCcpKSB7XG4gICAgICAgICAgICAgICAgdGhpcy4kc2xpZGVyLnNsaWNrKCd1bnNsaWNrJyk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHRoaXMuX2VsZW1lbnQudHJpZ2dlcignd29vX3ZhcmlhdGlvbl9nYWxsZXJ5X3NsaWNrX2Rlc3Ryb3knLCBbdGhpc10pO1xuICAgICAgICB9XG5cbiAgICAgICAgZGVmYXVsdEdhbGxlcnkoKSB7XG5cbiAgICAgICAgICAgIGlmICh0aGlzLmlzX3ZhcmlhdGlvbl9wcm9kdWN0KSB7XG4gICAgICAgICAgICAgICAgd3AuYWpheC5zZW5kKCd3dmdfZ2V0X2RlZmF1bHRfZ2FsbGVyeScsIHtcbiAgICAgICAgICAgICAgICAgICAgZGF0YSAgICA6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHByb2R1Y3RfaWQgOiB0aGlzLnByb2R1Y3RfaWRcbiAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgc3VjY2VzcyA6IChkYXRhKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLl9lbGVtZW50LmRhdGEoJ3dvb192YXJpYXRpb25fZ2FsbGVyeV9kZWZhdWx0JywgZGF0YSk7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLl9lbGVtZW50LnRyaWdnZXIoJ3dvb192YXJpYXRpb25fZGVmYXVsdF9nYWxsZXJ5X2xvYWRlZCcsIHRoaXMpO1xuICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICBlcnJvciAgIDogKGUpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuX2VsZW1lbnQuZGF0YSgnd29vX3ZhcmlhdGlvbl9nYWxsZXJ5X2RlZmF1bHQnLCBbXSk7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLl9lbGVtZW50LnRyaWdnZXIoJ3dvb192YXJpYXRpb25fZGVmYXVsdF9nYWxsZXJ5X2xvYWRlZCcsIHRoaXMpO1xuICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5lcnJvcihgVmFyaWF0aW9uIEdhbGxlcnkgbm90IGF2YWlsYWJsZSBvbiB2YXJpYXRpb24gaWQgJHt0aGlzLnByb2R1Y3RfaWR9LmApO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBpbml0VmFyaWF0aW9uSW1hZ2VQcmVsb2FkKCkge1xuICAgICAgICAgICAgLy9yZXR1cm47XG4gICAgICAgICAgICBpZiAodGhpcy5pc192YXJpYXRpb25fcHJvZHVjdCkge1xuICAgICAgICAgICAgICAgIHdwLmFqYXguc2VuZCgnd3ZnX2dldF9hdmFpbGFibGVfdmFyaWF0aW9uX2ltYWdlcycsIHtcbiAgICAgICAgICAgICAgICAgICAgZGF0YSAgICA6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHByb2R1Y3RfaWQgOiB0aGlzLnByb2R1Y3RfaWRcbiAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgc3VjY2VzcyA6IChpbWFnZXMpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKGRhdGEpXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoaW1hZ2VzLmxlbmd0aCA+IDEpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmltYWdlUHJlbG9hZChpbWFnZXMpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5fZWxlbWVudC5kYXRhKCd3b29fdmFyaWF0aW9uX2dhbGxlcnlfdmFyaWF0aW9uX2ltYWdlcycsIGltYWdlcyk7XG4gICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgIGVycm9yICAgOiAoZSkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5fZWxlbWVudC5kYXRhKCd3b29fdmFyaWF0aW9uX2dhbGxlcnlfdmFyaWF0aW9uX2ltYWdlcycsIFtdKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoYFZhcmlhdGlvbiBHYWxsZXJ5IHZhcmlhdGlvbnMgaW1hZ2VzIG5vdCBhdmFpbGFibGUgb24gdmFyaWF0aW9uIGlkICR7dGhpcy5wcm9kdWN0X2lkfS5gKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgaW1hZ2VQcmVsb2FkKGltYWdlcykge1xuICAgICAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBpbWFnZXMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgICAgICB0cnkge1xuXG4gICAgICAgICAgICAgICAgICAgIC8vIE5vdGU6IHRoaXMgd29uJ3Qgd29yayB3aGVuIGNocm9tZSBkZXZ0b29sIGlzIG9wZW4gYW5kICdkaXNhYmxlIGNhY2hlJyBpcyBlbmFibGVkIHdpdGhpbiB0aGUgbmV0d29yayBwYW5lbFxuICAgICAgICAgICAgICAgICAgICAvKmxldCBfaW1nICAgICAgID0gbmV3IEltYWdlKCk7XG4gICAgICAgICAgICAgICAgICAgIGxldCBfZ2FsbGVyeSAgID0gbmV3IEltYWdlKCk7XG4gICAgICAgICAgICAgICAgICAgIGxldCBfZnVsbCAgICAgID0gbmV3IEltYWdlKCk7XG4gICAgICAgICAgICAgICAgICAgIGxldCBfdGh1bWJuYWlsID0gbmV3IEltYWdlKCk7XG5cbiAgICAgICAgICAgICAgICAgICAgX2ltZy5zcmMgICAgPSBpbWFnZXNbaV0uc3JjO1xuICAgICAgICAgICAgICAgICAgICBfaW1nLnNyY3NldCA9IGltYWdlc1tpXS5zcmNzZXQ7XG5cbiAgICAgICAgICAgICAgICAgICAgX2dhbGxlcnkuc3JjID0gaW1hZ2VzW2ldLmdhbGxlcnlfdGh1bWJuYWlsX3NyYztcblxuICAgICAgICAgICAgICAgICAgICBfZnVsbC5zcmMgPSBpbWFnZXNbaV0uZnVsbF9zcmM7XG5cbiAgICAgICAgICAgICAgICAgICAgX3RodW1ibmFpbC5zcmMgPSBpbWFnZXNbaV0udGh1bWJfc3JjOyovXG5cbiAgICAgICAgICAgICAgICAgICAgLy8gQXBwZW5kIENvbnRlbnRcbiAgICAgICAgICAgICAgICAgICAgbGV0IF9pbWdfc3JjICAgID0gaW1hZ2VzW2ldLnNyYztcbiAgICAgICAgICAgICAgICAgICAgbGV0IF9pbWdfc3Jjc2V0ID0gaW1hZ2VzW2ldLnNyY3NldDtcblxuICAgICAgICAgICAgICAgICAgICBsZXQgX2dhbGxlcnlfc3JjICAgPSBpbWFnZXNbaV0uZ2FsbGVyeV90aHVtYm5haWxfc3JjO1xuICAgICAgICAgICAgICAgICAgICBsZXQgX2Z1bGxfc3JjICAgICAgPSBpbWFnZXNbaV0uZnVsbF9zcmM7XG4gICAgICAgICAgICAgICAgICAgIGxldCBfdGh1bWJuYWlsX3NyYyA9IGltYWdlc1tpXS50aHVtYl9zcmM7XG5cbiAgICAgICAgICAgICAgICAgICAgbGV0IHRlbXBsYXRlID0gYDxkaXYgc3R5bGU9XCJkaXNwbGF5OiBub25lXCI+PGltZyBhcmlhLWhpZGRlbj1cInRydWVcIiBzdHlsZT1cImRpc3BsYXk6IG5vbmVcIiBzcmM9XCIke19pbWdfc3JjfVwiIC8+PGltZyBzdHlsZT1cImRpc3BsYXk6IG5vbmVcIiBzcmM9XCIke19nYWxsZXJ5X3NyY31cIiAvPjxpbWcgc3R5bGU9XCJkaXNwbGF5OiBub25lXCIgc3JjPVwiJHtfdGh1bWJuYWlsX3NyY31cIiAvPjxpbWcgc3R5bGU9XCJkaXNwbGF5OiBub25lXCIgc3JjPVwiJHtfZnVsbF9zcmN9XCIgLz48L2Rpdj5gO1xuXG4gICAgICAgICAgICAgICAgICAgIGlmIChfaW1nX3NyY3NldCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgbGV0IHRlbXBsYXRlID0gYDxkaXYgc3R5bGU9XCJkaXNwbGF5OiBub25lXCI+PGltZyBhcmlhLWhpZGRlbj1cInRydWVcIiBzdHlsZT1cImRpc3BsYXk6IG5vbmVcIiBzcmM9XCIke19pbWdfc3JjfVwiIHNyY3NldD1cIiR7X2ltZ19zcmNzZXR9XCIgLz48aW1nIHN0eWxlPVwiZGlzcGxheTogbm9uZVwiIHNyYz1cIiR7X2dhbGxlcnlfc3JjfVwiIC8+PGltZyBzdHlsZT1cImRpc3BsYXk6IG5vbmVcIiBzcmM9XCIke190aHVtYm5haWxfc3JjfVwiIC8+PGltZyBzdHlsZT1cImRpc3BsYXk6IG5vbmVcIiBzcmM9XCIke19mdWxsX3NyY31cIiAvPjwvZGl2PmA7XG4gICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICAvLyBsZXQgdGVtcGxhdGUgPSBgPGRpdiBzdHlsZT1cImRpc3BsYXk6IG5vbmVcIj48aW1nIGFyaWEtaGlkZGVuPVwidHJ1ZVwiIHN0eWxlPVwiZGlzcGxheTogbm9uZVwiIHNyYz1cIiR7X2ltZ19zcmN9XCIgc3Jjc2V0PVwiJHtfaW1nX3NyY3NldH1cIiAvPjxpbWcgc3R5bGU9XCJkaXNwbGF5OiBub25lXCIgc3JjPVwiJHtfZ2FsbGVyeV9zcmN9XCIgLz48aW1nIHN0eWxlPVwiZGlzcGxheTogbm9uZVwiIHNyYz1cIiR7X3RodW1ibmFpbF9zcmN9XCIgLz48aW1nIHN0eWxlPVwiZGlzcGxheTogbm9uZVwiIHNyYz1cIiR7X2Z1bGxfc3JjfVwiIC8+PC9kaXY+YDtcbiAgICAgICAgICAgICAgICAgICAgJCgnYm9keScpLmFwcGVuZCh0ZW1wbGF0ZSlcblxuICAgICAgICAgICAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5lcnJvcihlKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBpbml0VmFyaWF0aW9uR2FsbGVyeSgpIHtcblxuICAgICAgICAgICAgLy8gc2hvd192YXJpYXRpb24sIGZvdW5kX3ZhcmlhdGlvblxuXG4gICAgICAgICAgICB0aGlzLiR2YXJpYXRpb25zX2Zvcm0ub2ZmKCdyZXNldF9pbWFnZS53dmcnKTtcbiAgICAgICAgICAgIHRoaXMuJHZhcmlhdGlvbnNfZm9ybS5vZmYoJ2NsaWNrLnd2ZycpO1xuICAgICAgICAgICAgdGhpcy4kdmFyaWF0aW9uc19mb3JtLm9mZignc2hvd192YXJpYXRpb24ud3ZnJyk7XG5cbiAgICAgICAgICAgIGlmICh3b29fdmFyaWF0aW9uX2dhbGxlcnlfb3B0aW9ucy5nYWxsZXJ5X3Jlc2V0X29uX3ZhcmlhdGlvbl9jaGFuZ2UpIHtcbiAgICAgICAgICAgICAgICB0aGlzLiR2YXJpYXRpb25zX2Zvcm0ub24oJ3Jlc2V0X2ltYWdlLnd2ZycsIChldmVudCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmFkZExvYWRpbmdDbGFzcygpO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmdhbGxlcnlSZXNldCgpO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgdGhpcy4kdmFyaWF0aW9uc19mb3JtLm9uKCdjbGljay53dmcnLCAnLnJlc2V0X3ZhcmlhdGlvbnMnLCAoZXZlbnQpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5hZGRMb2FkaW5nQ2xhc3MoKTtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5nYWxsZXJ5UmVzZXQoKTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgdGhpcy4kdmFyaWF0aW9uc19mb3JtLm9uKCdzaG93X3ZhcmlhdGlvbi53dmcnLCAoZXZlbnQsIHZhcmlhdGlvbikgPT4ge1xuICAgICAgICAgICAgICAgIHRoaXMuYWRkTG9hZGluZ0NsYXNzKCk7XG4gICAgICAgICAgICAgICAgdGhpcy5nYWxsZXJ5SW5pdCh2YXJpYXRpb24udmFyaWF0aW9uX2dhbGxlcnlfaW1hZ2VzKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG5cbiAgICAgICAgZ2FsbGVyeVJlc2V0KCkge1xuICAgICAgICAgICAgbGV0ICRkZWZhdWx0X2dhbGxlcnkgPSB0aGlzLl9lbGVtZW50LmRhdGEoJ3dvb192YXJpYXRpb25fZ2FsbGVyeV9kZWZhdWx0Jyk7XG5cbiAgICAgICAgICAgIGlmICgkZGVmYXVsdF9nYWxsZXJ5ICYmICRkZWZhdWx0X2dhbGxlcnkubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgICAgIHRoaXMuZ2FsbGVyeUluaXQoJGRlZmF1bHRfZ2FsbGVyeSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICBfLmRlbGF5KCgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5yZW1vdmVMb2FkaW5nQ2xhc3MoKTtcbiAgICAgICAgICAgICAgICB9LCAxMDApXG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBnYWxsZXJ5SW5pdChpbWFnZXMpIHtcblxuICAgICAgICAgICAgbGV0IGhhc0dhbGxlcnkgPSBpbWFnZXMubGVuZ3RoID4gMTtcblxuICAgICAgICAgICAgdGhpcy5fZWxlbWVudC50cmlnZ2VyKCdiZWZvcmVfd29vX3ZhcmlhdGlvbl9nYWxsZXJ5X2luaXQnLCBbdGhpcywgaW1hZ2VzXSk7XG5cbiAgICAgICAgICAgIHRoaXMuZGVzdHJveVNsaWNrKCk7XG5cbiAgICAgICAgICAgIGxldCBzbGlkZXJfaW5uZXJfaHRtbCA9IGltYWdlcy5tYXAoKGltYWdlKSA9PiB7XG4gICAgICAgICAgICAgICAgbGV0IHRlbXBsYXRlID0gd3AudGVtcGxhdGUoJ3dvby12YXJpYXRpb24tZ2FsbGVyeS1zbGlkZXItdGVtcGxhdGUnKTtcbiAgICAgICAgICAgICAgICByZXR1cm4gdGVtcGxhdGUoaW1hZ2UpO1xuICAgICAgICAgICAgfSkuam9pbignJyk7XG5cbiAgICAgICAgICAgIGxldCB0aHVtYm5haWxfaW5uZXJfaHRtbCA9IGltYWdlcy5tYXAoKGltYWdlKSA9PiB7XG4gICAgICAgICAgICAgICAgbGV0IHRlbXBsYXRlID0gd3AudGVtcGxhdGUoJ3dvby12YXJpYXRpb24tZ2FsbGVyeS10aHVtYm5haWwtdGVtcGxhdGUnKTtcbiAgICAgICAgICAgICAgICByZXR1cm4gdGVtcGxhdGUoaW1hZ2UpO1xuICAgICAgICAgICAgfSkuam9pbignJyk7XG5cbiAgICAgICAgICAgIGlmIChoYXNHYWxsZXJ5KSB7XG4gICAgICAgICAgICAgICAgdGhpcy4kdGFyZ2V0LmFkZENsYXNzKCd3b28tdmFyaWF0aW9uLWdhbGxlcnktaGFzLXByb2R1Y3QtdGh1bWJuYWlsJyk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICB0aGlzLiR0YXJnZXQucmVtb3ZlQ2xhc3MoJ3dvby12YXJpYXRpb24tZ2FsbGVyeS1oYXMtcHJvZHVjdC10aHVtYm5haWwnKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgdGhpcy4kc2xpZGVyLmh0bWwoc2xpZGVyX2lubmVyX2h0bWwpO1xuXG4gICAgICAgICAgICBpZiAoaGFzR2FsbGVyeSkge1xuICAgICAgICAgICAgICAgIHRoaXMuJHRodW1ibmFpbC5odG1sKHRodW1ibmFpbF9pbm5lcl9odG1sKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIHRoaXMuJHRodW1ibmFpbC5odG1sKCcnKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLy90aGlzLl9lbGVtZW50LnRyaWdnZXIoJ3dvb192YXJpYXRpb25fZ2FsbGVyeV9pbml0JywgW3RoaXMsIGltYWdlc10pO1xuXG4gICAgICAgICAgICBfLmRlbGF5KCgpID0+IHtcbiAgICAgICAgICAgICAgICB0aGlzLmltYWdlc0xvYWRlZCgpO1xuICAgICAgICAgICAgfSwgMSk7XG5cbiAgICAgICAgICAgIC8vdGhpcy5fZWxlbWVudC50cmlnZ2VyKCdhZnRlcl93b29fdmFyaWF0aW9uX2dhbGxlcnlfaW5pdCcsIFt0aGlzLCBpbWFnZXNdKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGltYWdlc0xvYWRlZCgpIHtcblxuICAgICAgICAgICAgLy8gU29tZSBTY3JpcHQgQWRkIEN1c3RvbSBpbWFnZXNMb2FkZWQgRnVuY3Rpb25cbiAgICAgICAgICAgIGlmICghJCgpLmltYWdlc0xvYWRlZC5kb25lKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5fZWxlbWVudC50cmlnZ2VyKCd3b29fdmFyaWF0aW9uX2dhbGxlcnlfaW1hZ2VfbG9hZGluZycsIFt0aGlzXSk7XG4gICAgICAgICAgICAgICAgdGhpcy5fZWxlbWVudC50cmlnZ2VyKCd3b29fdmFyaWF0aW9uX2dhbGxlcnlfaW1hZ2VfbG9hZGVkJywgW3RoaXNdKTtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHRoaXMuX2VsZW1lbnQuaW1hZ2VzTG9hZGVkKClcbiAgICAgICAgICAgICAgICAucHJvZ3Jlc3MoKGluc3RhbmNlLCBpbWFnZSkgPT4ge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLl9lbGVtZW50LnRyaWdnZXIoJ3dvb192YXJpYXRpb25fZ2FsbGVyeV9pbWFnZV9sb2FkaW5nJywgW3RoaXNdKTtcbiAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgIC5kb25lKChpbnN0YW5jZSkgPT4ge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLl9lbGVtZW50LnRyaWdnZXIoJ3dvb192YXJpYXRpb25fZ2FsbGVyeV9pbWFnZV9sb2FkZWQnLCBbdGhpc10pO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgICogalF1ZXJ5XG4gICAgICogLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgICovXG5cbiAgICAkLmZuWydXb29WYXJpYXRpb25HYWxsZXJ5J10gPSBXb29WYXJpYXRpb25HYWxsZXJ5Ll9qUXVlcnlJbnRlcmZhY2U7XG4gICAgJC5mblsnV29vVmFyaWF0aW9uR2FsbGVyeSddLkNvbnN0cnVjdG9yID0gV29vVmFyaWF0aW9uR2FsbGVyeTtcbiAgICAkLmZuWydXb29WYXJpYXRpb25HYWxsZXJ5J10ubm9Db25mbGljdCAgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICQuZm5bJ1dvb1ZhcmlhdGlvbkdhbGxlcnknXSA9ICQuZm5bJ1dvb1ZhcmlhdGlvbkdhbGxlcnknXTtcbiAgICAgICAgcmV0dXJuIFdvb1ZhcmlhdGlvbkdhbGxlcnkuX2pRdWVyeUludGVyZmFjZVxuICAgIH07XG5cbiAgICByZXR1cm4gV29vVmFyaWF0aW9uR2FsbGVyeTtcblxufSkoalF1ZXJ5KTtcblxuZXhwb3J0IGRlZmF1bHQgV29vVmFyaWF0aW9uR2FsbGVyeVxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyBzcmMvanMvV29vVmFyaWF0aW9uR2FsbGVyeS5qcyIsIi8vIHJlbW92ZWQgYnkgZXh0cmFjdC10ZXh0LXdlYnBhY2stcGx1Z2luXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9zcmMvc2Nzcy9zbGljay5zY3NzXG4vLyBtb2R1bGUgaWQgPSAzXG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsIi8vIHJlbW92ZWQgYnkgZXh0cmFjdC10ZXh0LXdlYnBhY2stcGx1Z2luXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9zcmMvc2Nzcy9mcm9udGVuZC5zY3NzXG4vLyBtb2R1bGUgaWQgPSA0XG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsIi8vIHJlbW92ZWQgYnkgZXh0cmFjdC10ZXh0LXdlYnBhY2stcGx1Z2luXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9zcmMvc2Nzcy90aGVtZS1zdXBwb3J0LnNjc3Ncbi8vIG1vZHVsZSBpZCA9IDVcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwiLy8gcmVtb3ZlZCBieSBleHRyYWN0LXRleHQtd2VicGFjay1wbHVnaW5cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL3NyYy9zY3NzL2JhY2tlbmQuc2Nzc1xuLy8gbW9kdWxlIGlkID0gNlxuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCIvLyByZW1vdmVkIGJ5IGV4dHJhY3QtdGV4dC13ZWJwYWNrLXBsdWdpblxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vc3JjL3Njc3MvZ3dwLWFkbWluLnNjc3Ncbi8vIG1vZHVsZSBpZCA9IDdcbi8vIG1vZHVsZSBjaHVua3MgPSAwIl0sIm1hcHBpbmdzIjoiOzs7Ozs7OztBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUM3REE7QUFDQTtBQUFBO0FBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7Ozs7Ozs7OztBQ3RCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFIQTtBQU1BO0FBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBNUNBO0FBQUE7QUFBQTtBQW1EQTtBQUNBO0FBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBekRBO0FBQUE7QUFBQTtBQUNBO0FBNERBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFwRUE7QUFBQTtBQUFBO0FBdUVBO0FBQ0E7QUFDQTtBQXpFQTtBQUFBO0FBQUE7QUEyRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQTdIQTtBQUFBO0FBQUE7QUFDQTtBQWdJQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQUE7QUFBQTtBQUNBO0FBR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFEQTtBQUNBO0FBR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQXJLQTtBQUFBO0FBQUE7QUF3S0E7QUFDQTtBQUNBO0FBMUtBO0FBQUE7QUFBQTtBQTRLQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBNUxBO0FBQUE7QUFBQTtBQThMQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFBQTtBQUNBO0FBRUE7QUFDQTtBQURBO0FBQ0E7QUFHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUEzTkE7QUFBQTtBQUFBO0FBOE5BO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQXpPQTtBQUFBO0FBQUE7QUE0T0E7QUFDQTtBQTdPQTtBQUFBO0FBQUE7QUFnUEE7QUFDQTtBQWpQQTtBQUFBO0FBQUE7QUFvUEE7QUFBQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQUE7QUFDQTtBQUNBO0FBQ0E7QUFBQTtBQUFBO0FBR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUpBO0FBTUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQURBO0FBR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQURBO0FBR0E7QUF2QkE7QUFDQTtBQXlCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBM1JBO0FBQUE7QUFBQTtBQUNBO0FBOFJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQXZTQTtBQUFBO0FBQUE7QUF5U0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBREE7QUFHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFaQTtBQWNBO0FBQ0E7QUEzVEE7QUFBQTtBQUFBO0FBNlRBO0FBQ0E7QUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBREE7QUFHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBZEE7QUFnQkE7QUFDQTtBQWpWQTtBQUFBO0FBQUE7QUFvVkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7Ozs7OztBQWNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQTNYQTtBQUFBO0FBQUE7QUE2WEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUF0WkE7QUFBQTtBQUFBO0FBd1pBO0FBQ0E7QUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQW5hQTtBQUFBO0FBQUE7QUFxYUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUE5Y0E7QUFBQTtBQUFBO0FBZ2RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQWhlQTtBQUFBO0FBQUE7QUE4Q0E7QUFDQTtBQUNBO0FBQ0E7QUFqREE7QUFDQTtBQURBO0FBQUE7QUFDQTtBQWtlQTs7Ozs7O0FBTUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTs7Ozs7O0FDemZBOzs7Ozs7QUNBQTs7Ozs7O0FDQUE7Ozs7OztBQ0FBOzs7Ozs7QUNBQTs7O0EiLCJzb3VyY2VSb290IjoiIn0=