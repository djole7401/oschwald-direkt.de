/*!
 * WooCommerce Variation Gallery - Pro v1.1.7 
 * 
 * Author: Emran Ahmed ( emran.bd.08@gmail.com ) 
 * Date: 2018-10-7 16:51:32
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
module.exports = __webpack_require__(4);


/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

jQuery(function ($) {
    Promise.resolve().then(function () {
        return __webpack_require__(2);
    }).then(function () {
        $(document).on('woo_variation_gallery_init', function () {
            $('.woo-variation-gallery-wrapper').WooVariationGalleryPro();
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
/*global wc_add_to_cart_variation_params, woo_variation_gallery_options, _ */
// ================================================================

var WooVariationGalleryPro = function ($) {

    var Default = {};

    var WooVariationGalleryPro = function () {
        function WooVariationGalleryPro(element, config) {
            _classCallCheck(this, WooVariationGalleryPro);

            // Assign
            this._el = element;
            this._element = $(element);
            this._config = $.extend({}, Default, config);

            this.$product = this._element.closest('.product');
            this.$variations_form = this.$product.find('.variations_form');
            this.$target = this._element.parent();
            this.$slider = $('.woo-variation-gallery-slider', this._element);
            this.$thumbnail = $('.woo-variation-gallery-thumbnail-slider', this._element);

            // Temp variable
            this.is_vertical = !!woo_variation_gallery_options.is_vertical;

            // Call
            this.init();

            this._element.data('woo_variation_gallery_pro', this);
            $(document).trigger('woo_variation_gallery_pro_init', [this]);
        }

        _createClass(WooVariationGalleryPro, [{
            key: 'init',
            value: function init() {
                var _this = this;

                this._element.on('woo_variation_gallery_slider_slick_init', function (event, gallery) {

                    if (woo_variation_gallery_options.is_vertical) {

                        //$(window).off('resize.wvg');

                        $(window).on('resize', _this.enableThumbnailPositionDebounce());
                        //$(window).on('resize', this.thumbnailHeightDebounce());

                        //this.$slider.on('setPosition', this.enableThumbnailPositionDebounce());
                        _this.$slider.on('setPosition', _this.thumbnailHeightDebounce());

                        _this.$slider.on('afterChange', function () {
                            _this.thumbnailHeight();
                        });
                    }

                    if (woo_variation_gallery_options.enable_thumbnail_slide) {

                        var thumbnails = _this.$thumbnail.find('.wvg-gallery-thumbnail-image').length;

                        if (parseInt(woo_variation_gallery_options.gallery_thumbnails_columns) < thumbnails) {
                            _this.$thumbnail.find('.wvg-gallery-thumbnail-image').removeClass('current-thumbnail');
                            _this.initThumbnailSlick();
                        } else {
                            _this.$slider.slick('slickSetOption', 'asNavFor', null, false);
                        }
                    }
                });

                this._element.on('woo_variation_gallery_slider_slick_init', function (event, gallery) {
                    if (_this.$slider.hasClass('slick-initialized')) {
                        // this.$slider.slick('setPosition');
                        // $(window).trigger('resize');
                    }
                });

                this._element.on('woo_variation_gallery_slick_destroy', function (event, gallery) {
                    if (_this.$thumbnail.hasClass('slick-initialized')) {
                        _this.$thumbnail.slick('unslick');
                    }
                });
            }
        }, {
            key: 'initThumbnailSlick',
            value: function initThumbnailSlick() {
                var _this2 = this;

                if (this.$thumbnail.hasClass('slick-initialized')) {
                    this.$thumbnail.slick('unslick');
                }

                this.$thumbnail.off('init');

                this.$thumbnail.on('init', function () {}).slick();

                _.delay(function () {
                    _this2._element.trigger('woo_variation_gallery_thumbnail_slick_init', [_this2]);
                }, 1);
            }
        }, {
            key: 'thumbnailHeight',
            value: function thumbnailHeight() {

                //console.log('thumbnailHeight...')
                if (this.is_vertical) {
                    if (this.$slider.slick('getSlick').$slides.length > 1) {
                        this.$thumbnail.height(this.$slider.height());
                    } else {
                        this.$thumbnail.height(0);
                    }
                } else {
                    this.$thumbnail.height('auto');
                }

                if (this.$thumbnail.hasClass('slick-initialized')) {
                    this.$thumbnail.slick('setPosition');
                }
            }
        }, {
            key: 'thumbnailHeightDebounce',
            value: function thumbnailHeightDebounce(event) {
                var _this3 = this;

                return _.debounce(function () {
                    _this3.thumbnailHeight();
                }, 401);
            }
        }, {
            key: 'enableThumbnailPosition',
            value: function enableThumbnailPosition() {

                if (!woo_variation_gallery_options.is_mobile) {
                    //    return;
                }

                if (woo_variation_gallery_options.is_vertical) {
                    //console.log('enableThumbnailPosition...')
                    if (window.matchMedia("(max-width: 768px)").matches || window.matchMedia("(max-width: 480px)").matches) {

                        this.is_vertical = false;

                        this._element.removeClass(woo_variation_gallery_options.thumbnail_position_class_prefix + 'left ' + woo_variation_gallery_options.thumbnail_position_class_prefix + 'right ' + woo_variation_gallery_options.thumbnail_position_class_prefix + 'bottom');
                        this._element.addClass(woo_variation_gallery_options.thumbnail_position_class_prefix + 'bottom');

                        this.$slider.slick('setPosition');
                    } else {

                        this.is_vertical = true;

                        this._element.removeClass(woo_variation_gallery_options.thumbnail_position_class_prefix + 'left ' + woo_variation_gallery_options.thumbnail_position_class_prefix + 'right ' + woo_variation_gallery_options.thumbnail_position_class_prefix + 'bottom');
                        this._element.addClass('' + woo_variation_gallery_options.thumbnail_position_class_prefix + woo_variation_gallery_options.thumbnail_position);

                        this.$slider.slick('setPosition');
                    }
                }
            }
        }, {
            key: 'enableThumbnailPositionDebounce',
            value: function enableThumbnailPositionDebounce(event) {
                var _this4 = this;

                return _.debounce(function () {
                    _this4.enableThumbnailPosition();
                }, 400);
            }
        }], [{
            key: '_jQueryInterface',
            value: function _jQueryInterface(config) {
                return this.each(function () {
                    new WooVariationGalleryPro(this, config);
                });
            }
        }]);

        return WooVariationGalleryPro;
    }();

    /**
     * ------------------------------------------------------------------------
     * jQuery
     * ------------------------------------------------------------------------
     */

    $.fn['WooVariationGalleryPro'] = WooVariationGalleryPro._jQueryInterface;
    $.fn['WooVariationGalleryPro'].Constructor = WooVariationGalleryPro;
    $.fn['WooVariationGalleryPro'].noConflict = function () {
        $.fn['WooVariationGalleryPro'] = $.fn['WooVariationGalleryPro'];
        return WooVariationGalleryPro._jQueryInterface;
    };

    return WooVariationGalleryPro;
}(jQuery);

/* harmony default export */ __webpack_exports__["default"] = (WooVariationGalleryPro);

/***/ }),
/* 3 */
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),
/* 4 */
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ })
/******/ ]);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXNzZXRzL2pzL2Zyb250ZW5kLXByby5qcyIsInNvdXJjZXMiOlsid2VicGFjazovLy93ZWJwYWNrL2Jvb3RzdHJhcCBkOGI4OGQyMTcwNzFlNWI5NTZlYSIsIndlYnBhY2s6Ly8vc3JjL2pzL2Zyb250ZW5kLmpzIiwid2VicGFjazovLy9zcmMvanMvV29vVmFyaWF0aW9uR2FsbGVyeVByby5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvc2Nzcy9mcm9udGVuZC5zY3NzPzQ0NWEiLCJ3ZWJwYWNrOi8vLy4vc3JjL3Njc3MvYmFja2VuZC5zY3NzPzcxODUiXSwic291cmNlc0NvbnRlbnQiOlsiIFx0Ly8gVGhlIG1vZHVsZSBjYWNoZVxuIFx0dmFyIGluc3RhbGxlZE1vZHVsZXMgPSB7fTtcblxuIFx0Ly8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbiBcdGZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblxuIFx0XHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcbiBcdFx0aWYoaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0pIHtcbiBcdFx0XHRyZXR1cm4gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0uZXhwb3J0cztcbiBcdFx0fVxuIFx0XHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuIFx0XHR2YXIgbW9kdWxlID0gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0gPSB7XG4gXHRcdFx0aTogbW9kdWxlSWQsXG4gXHRcdFx0bDogZmFsc2UsXG4gXHRcdFx0ZXhwb3J0czoge31cbiBcdFx0fTtcblxuIFx0XHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cbiBcdFx0bW9kdWxlc1ttb2R1bGVJZF0uY2FsbChtb2R1bGUuZXhwb3J0cywgbW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cbiBcdFx0Ly8gRmxhZyB0aGUgbW9kdWxlIGFzIGxvYWRlZFxuIFx0XHRtb2R1bGUubCA9IHRydWU7XG5cbiBcdFx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcbiBcdFx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xuIFx0fVxuXG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlcyBvYmplY3QgKF9fd2VicGFja19tb2R1bGVzX18pXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm0gPSBtb2R1bGVzO1xuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZSBjYWNoZVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5jID0gaW5zdGFsbGVkTW9kdWxlcztcblxuIFx0Ly8gZGVmaW5lIGdldHRlciBmdW5jdGlvbiBmb3IgaGFybW9ueSBleHBvcnRzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQgPSBmdW5jdGlvbihleHBvcnRzLCBuYW1lLCBnZXR0ZXIpIHtcbiBcdFx0aWYoIV9fd2VicGFja19yZXF1aXJlX18ubyhleHBvcnRzLCBuYW1lKSkge1xuIFx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBuYW1lLCB7XG4gXHRcdFx0XHRjb25maWd1cmFibGU6IGZhbHNlLFxuIFx0XHRcdFx0ZW51bWVyYWJsZTogdHJ1ZSxcbiBcdFx0XHRcdGdldDogZ2V0dGVyXG4gXHRcdFx0fSk7XG4gXHRcdH1cbiBcdH07XG5cbiBcdC8vIGdldERlZmF1bHRFeHBvcnQgZnVuY3Rpb24gZm9yIGNvbXBhdGliaWxpdHkgd2l0aCBub24taGFybW9ueSBtb2R1bGVzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm4gPSBmdW5jdGlvbihtb2R1bGUpIHtcbiBcdFx0dmFyIGdldHRlciA9IG1vZHVsZSAmJiBtb2R1bGUuX19lc01vZHVsZSA/XG4gXHRcdFx0ZnVuY3Rpb24gZ2V0RGVmYXVsdCgpIHsgcmV0dXJuIG1vZHVsZVsnZGVmYXVsdCddOyB9IDpcbiBcdFx0XHRmdW5jdGlvbiBnZXRNb2R1bGVFeHBvcnRzKCkgeyByZXR1cm4gbW9kdWxlOyB9O1xuIFx0XHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQoZ2V0dGVyLCAnYScsIGdldHRlcik7XG4gXHRcdHJldHVybiBnZXR0ZXI7XG4gXHR9O1xuXG4gXHQvLyBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGxcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubyA9IGZ1bmN0aW9uKG9iamVjdCwgcHJvcGVydHkpIHsgcmV0dXJuIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmplY3QsIHByb3BlcnR5KTsgfTtcblxuIFx0Ly8gX193ZWJwYWNrX3B1YmxpY19wYXRoX19cbiBcdF9fd2VicGFja19yZXF1aXJlX18ucCA9IFwiXCI7XG5cbiBcdC8vIExvYWQgZW50cnkgbW9kdWxlIGFuZCByZXR1cm4gZXhwb3J0c1xuIFx0cmV0dXJuIF9fd2VicGFja19yZXF1aXJlX18oX193ZWJwYWNrX3JlcXVpcmVfXy5zID0gMCk7XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gd2VicGFjay9ib290c3RyYXAgZDhiODhkMjE3MDcxZTViOTU2ZWEiLCJqUXVlcnkoJCA9PiB7XG4gICAgaW1wb3J0KCcuL1dvb1ZhcmlhdGlvbkdhbGxlcnlQcm8nKS50aGVuKCgpID0+IHtcbiAgICAgICAgJChkb2N1bWVudCkub24oJ3dvb192YXJpYXRpb25fZ2FsbGVyeV9pbml0JywgZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgJCgnLndvby12YXJpYXRpb24tZ2FsbGVyeS13cmFwcGVyJykuV29vVmFyaWF0aW9uR2FsbGVyeVBybygpO1xuICAgICAgICB9KTtcblxuICAgIH0pO1xufSk7ICAvLyBlbmQgb2YganF1ZXJ5IG1haW4gd3JhcHBlclxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyBzcmMvanMvZnJvbnRlbmQuanMiLCIvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4vLyBXb29Db21tZXJjZSBWYXJpYXRpb24gR2FsbGVyeVxuLypnbG9iYWwgd2NfYWRkX3RvX2NhcnRfdmFyaWF0aW9uX3BhcmFtcywgd29vX3ZhcmlhdGlvbl9nYWxsZXJ5X29wdGlvbnMsIF8gKi9cbi8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cblxuY29uc3QgV29vVmFyaWF0aW9uR2FsbGVyeVBybyA9ICgoJCkgPT4ge1xuXG4gICAgY29uc3QgRGVmYXVsdCA9IHt9O1xuXG4gICAgY2xhc3MgV29vVmFyaWF0aW9uR2FsbGVyeVBybyB7XG5cbiAgICAgICAgY29uc3RydWN0b3IoZWxlbWVudCwgY29uZmlnKSB7XG5cbiAgICAgICAgICAgIC8vIEFzc2lnblxuICAgICAgICAgICAgdGhpcy5fZWwgICAgICA9IGVsZW1lbnQ7XG4gICAgICAgICAgICB0aGlzLl9lbGVtZW50ID0gJChlbGVtZW50KTtcbiAgICAgICAgICAgIHRoaXMuX2NvbmZpZyAgPSAkLmV4dGVuZCh7fSwgRGVmYXVsdCwgY29uZmlnKTtcblxuICAgICAgICAgICAgdGhpcy4kcHJvZHVjdCAgICAgICAgID0gdGhpcy5fZWxlbWVudC5jbG9zZXN0KCcucHJvZHVjdCcpO1xuICAgICAgICAgICAgdGhpcy4kdmFyaWF0aW9uc19mb3JtID0gdGhpcy4kcHJvZHVjdC5maW5kKCcudmFyaWF0aW9uc19mb3JtJyk7XG4gICAgICAgICAgICB0aGlzLiR0YXJnZXQgICAgICAgICAgPSB0aGlzLl9lbGVtZW50LnBhcmVudCgpO1xuICAgICAgICAgICAgdGhpcy4kc2xpZGVyICAgICAgICAgID0gJCgnLndvby12YXJpYXRpb24tZ2FsbGVyeS1zbGlkZXInLCB0aGlzLl9lbGVtZW50KTtcbiAgICAgICAgICAgIHRoaXMuJHRodW1ibmFpbCAgICAgICA9ICQoJy53b28tdmFyaWF0aW9uLWdhbGxlcnktdGh1bWJuYWlsLXNsaWRlcicsIHRoaXMuX2VsZW1lbnQpO1xuXG4gICAgICAgICAgICAvLyBUZW1wIHZhcmlhYmxlXG4gICAgICAgICAgICB0aGlzLmlzX3ZlcnRpY2FsID0gISF3b29fdmFyaWF0aW9uX2dhbGxlcnlfb3B0aW9ucy5pc192ZXJ0aWNhbDtcblxuICAgICAgICAgICAgLy8gQ2FsbFxuICAgICAgICAgICAgdGhpcy5pbml0KCk7XG5cbiAgICAgICAgICAgIHRoaXMuX2VsZW1lbnQuZGF0YSgnd29vX3ZhcmlhdGlvbl9nYWxsZXJ5X3BybycsIHRoaXMpO1xuICAgICAgICAgICAgJChkb2N1bWVudCkudHJpZ2dlcignd29vX3ZhcmlhdGlvbl9nYWxsZXJ5X3Byb19pbml0JywgW3RoaXNdKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHN0YXRpYyBfalF1ZXJ5SW50ZXJmYWNlKGNvbmZpZykge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuZWFjaChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgbmV3IFdvb1ZhcmlhdGlvbkdhbGxlcnlQcm8odGhpcywgY29uZmlnKVxuICAgICAgICAgICAgfSlcbiAgICAgICAgfVxuXG4gICAgICAgIGluaXQoKSB7XG5cbiAgICAgICAgICAgIHRoaXMuX2VsZW1lbnQub24oJ3dvb192YXJpYXRpb25fZ2FsbGVyeV9zbGlkZXJfc2xpY2tfaW5pdCcsIChldmVudCwgZ2FsbGVyeSkgPT4ge1xuXG4gICAgICAgICAgICAgICAgaWYgKHdvb192YXJpYXRpb25fZ2FsbGVyeV9vcHRpb25zLmlzX3ZlcnRpY2FsKSB7XG5cbiAgICAgICAgICAgICAgICAgICAgLy8kKHdpbmRvdykub2ZmKCdyZXNpemUud3ZnJyk7XG5cbiAgICAgICAgICAgICAgICAgICAgJCh3aW5kb3cpLm9uKCdyZXNpemUnLCB0aGlzLmVuYWJsZVRodW1ibmFpbFBvc2l0aW9uRGVib3VuY2UoKSk7XG4gICAgICAgICAgICAgICAgICAgIC8vJCh3aW5kb3cpLm9uKCdyZXNpemUnLCB0aGlzLnRodW1ibmFpbEhlaWdodERlYm91bmNlKCkpO1xuXG4gICAgICAgICAgICAgICAgICAgIC8vdGhpcy4kc2xpZGVyLm9uKCdzZXRQb3NpdGlvbicsIHRoaXMuZW5hYmxlVGh1bWJuYWlsUG9zaXRpb25EZWJvdW5jZSgpKTtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy4kc2xpZGVyLm9uKCdzZXRQb3NpdGlvbicsIHRoaXMudGh1bWJuYWlsSGVpZ2h0RGVib3VuY2UoKSk7XG5cbiAgICAgICAgICAgICAgICAgICAgdGhpcy4kc2xpZGVyLm9uKCdhZnRlckNoYW5nZScsICgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMudGh1bWJuYWlsSGVpZ2h0KCk7XG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIGlmICh3b29fdmFyaWF0aW9uX2dhbGxlcnlfb3B0aW9ucy5lbmFibGVfdGh1bWJuYWlsX3NsaWRlKSB7XG5cbiAgICAgICAgICAgICAgICAgICAgbGV0IHRodW1ibmFpbHMgPSB0aGlzLiR0aHVtYm5haWwuZmluZCgnLnd2Zy1nYWxsZXJ5LXRodW1ibmFpbC1pbWFnZScpLmxlbmd0aDtcblxuICAgICAgICAgICAgICAgICAgICBpZiAocGFyc2VJbnQod29vX3ZhcmlhdGlvbl9nYWxsZXJ5X29wdGlvbnMuZ2FsbGVyeV90aHVtYm5haWxzX2NvbHVtbnMpIDwgdGh1bWJuYWlscykge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy4kdGh1bWJuYWlsLmZpbmQoJy53dmctZ2FsbGVyeS10aHVtYm5haWwtaW1hZ2UnKS5yZW1vdmVDbGFzcygnY3VycmVudC10aHVtYm5haWwnKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuaW5pdFRodW1ibmFpbFNsaWNrKCk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLiRzbGlkZXIuc2xpY2soJ3NsaWNrU2V0T3B0aW9uJywgJ2FzTmF2Rm9yJywgbnVsbCwgZmFsc2UpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIHRoaXMuX2VsZW1lbnQub24oJ3dvb192YXJpYXRpb25fZ2FsbGVyeV9zbGlkZXJfc2xpY2tfaW5pdCcsIChldmVudCwgZ2FsbGVyeSkgPT4ge1xuICAgICAgICAgICAgICAgIGlmICh0aGlzLiRzbGlkZXIuaGFzQ2xhc3MoJ3NsaWNrLWluaXRpYWxpemVkJykpIHtcbiAgICAgICAgICAgICAgICAgICAgLy8gdGhpcy4kc2xpZGVyLnNsaWNrKCdzZXRQb3NpdGlvbicpO1xuICAgICAgICAgICAgICAgICAgICAvLyAkKHdpbmRvdykudHJpZ2dlcigncmVzaXplJyk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIHRoaXMuX2VsZW1lbnQub24oJ3dvb192YXJpYXRpb25fZ2FsbGVyeV9zbGlja19kZXN0cm95JywgKGV2ZW50LCBnYWxsZXJ5KSA9PiB7XG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuJHRodW1ibmFpbC5oYXNDbGFzcygnc2xpY2staW5pdGlhbGl6ZWQnKSkge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLiR0aHVtYm5haWwuc2xpY2soJ3Vuc2xpY2snKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuXG4gICAgICAgIGluaXRUaHVtYm5haWxTbGljaygpIHtcbiAgICAgICAgICAgIGlmICh0aGlzLiR0aHVtYm5haWwuaGFzQ2xhc3MoJ3NsaWNrLWluaXRpYWxpemVkJykpIHtcbiAgICAgICAgICAgICAgICB0aGlzLiR0aHVtYm5haWwuc2xpY2soJ3Vuc2xpY2snKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgdGhpcy4kdGh1bWJuYWlsLm9mZignaW5pdCcpO1xuXG4gICAgICAgICAgICB0aGlzLiR0aHVtYm5haWwub24oJ2luaXQnLCAoKSA9PiB7XG5cbiAgICAgICAgICAgIH0pLnNsaWNrKCk7XG5cbiAgICAgICAgICAgIF8uZGVsYXkoKCkgPT4ge1xuICAgICAgICAgICAgICAgIHRoaXMuX2VsZW1lbnQudHJpZ2dlcignd29vX3ZhcmlhdGlvbl9nYWxsZXJ5X3RodW1ibmFpbF9zbGlja19pbml0JywgW3RoaXNdKTtcbiAgICAgICAgICAgIH0sIDEpO1xuICAgICAgICB9XG5cbiAgICAgICAgdGh1bWJuYWlsSGVpZ2h0KCkge1xuXG4gICAgICAgICAgICAvL2NvbnNvbGUubG9nKCd0aHVtYm5haWxIZWlnaHQuLi4nKVxuICAgICAgICAgICAgaWYgKHRoaXMuaXNfdmVydGljYWwpIHtcbiAgICAgICAgICAgICAgICBpZiAodGhpcy4kc2xpZGVyLnNsaWNrKCdnZXRTbGljaycpLiRzbGlkZXMubGVuZ3RoID4gMSkge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLiR0aHVtYm5haWwuaGVpZ2h0KHRoaXMuJHNsaWRlci5oZWlnaHQoKSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLiR0aHVtYm5haWwuaGVpZ2h0KDApO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIHRoaXMuJHRodW1ibmFpbC5oZWlnaHQoJ2F1dG8nKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKHRoaXMuJHRodW1ibmFpbC5oYXNDbGFzcygnc2xpY2staW5pdGlhbGl6ZWQnKSkge1xuICAgICAgICAgICAgICAgIHRoaXMuJHRodW1ibmFpbC5zbGljaygnc2V0UG9zaXRpb24nKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHRodW1ibmFpbEhlaWdodERlYm91bmNlKGV2ZW50KSB7XG4gICAgICAgICAgICByZXR1cm4gXy5kZWJvdW5jZSgoKSA9PiB7XG4gICAgICAgICAgICAgICAgdGhpcy50aHVtYm5haWxIZWlnaHQoKTtcbiAgICAgICAgICAgIH0sIDQwMSk7XG4gICAgICAgIH1cblxuICAgICAgICBlbmFibGVUaHVtYm5haWxQb3NpdGlvbigpIHtcblxuICAgICAgICAgICAgaWYgKCF3b29fdmFyaWF0aW9uX2dhbGxlcnlfb3B0aW9ucy5pc19tb2JpbGUpIHtcbiAgICAgICAgICAgIC8vICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKHdvb192YXJpYXRpb25fZ2FsbGVyeV9vcHRpb25zLmlzX3ZlcnRpY2FsKSB7XG4gICAgICAgICAgICAgICAgLy9jb25zb2xlLmxvZygnZW5hYmxlVGh1bWJuYWlsUG9zaXRpb24uLi4nKVxuICAgICAgICAgICAgICAgIGlmICh3aW5kb3cubWF0Y2hNZWRpYShcIihtYXgtd2lkdGg6IDc2OHB4KVwiKS5tYXRjaGVzIHx8IHdpbmRvdy5tYXRjaE1lZGlhKFwiKG1heC13aWR0aDogNDgwcHgpXCIpLm1hdGNoZXMpIHtcblxuICAgICAgICAgICAgICAgICAgICB0aGlzLmlzX3ZlcnRpY2FsID0gZmFsc2U7XG5cbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fZWxlbWVudC5yZW1vdmVDbGFzcyhgJHt3b29fdmFyaWF0aW9uX2dhbGxlcnlfb3B0aW9ucy50aHVtYm5haWxfcG9zaXRpb25fY2xhc3NfcHJlZml4fWxlZnQgJHt3b29fdmFyaWF0aW9uX2dhbGxlcnlfb3B0aW9ucy50aHVtYm5haWxfcG9zaXRpb25fY2xhc3NfcHJlZml4fXJpZ2h0ICR7d29vX3ZhcmlhdGlvbl9nYWxsZXJ5X29wdGlvbnMudGh1bWJuYWlsX3Bvc2l0aW9uX2NsYXNzX3ByZWZpeH1ib3R0b21gKTtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fZWxlbWVudC5hZGRDbGFzcyhgJHt3b29fdmFyaWF0aW9uX2dhbGxlcnlfb3B0aW9ucy50aHVtYm5haWxfcG9zaXRpb25fY2xhc3NfcHJlZml4fWJvdHRvbWApO1xuXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuJHNsaWRlci5zbGljaygnc2V0UG9zaXRpb24nKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZWxzZSB7XG5cbiAgICAgICAgICAgICAgICAgICAgdGhpcy5pc192ZXJ0aWNhbCA9IHRydWU7XG5cbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fZWxlbWVudC5yZW1vdmVDbGFzcyhgJHt3b29fdmFyaWF0aW9uX2dhbGxlcnlfb3B0aW9ucy50aHVtYm5haWxfcG9zaXRpb25fY2xhc3NfcHJlZml4fWxlZnQgJHt3b29fdmFyaWF0aW9uX2dhbGxlcnlfb3B0aW9ucy50aHVtYm5haWxfcG9zaXRpb25fY2xhc3NfcHJlZml4fXJpZ2h0ICR7d29vX3ZhcmlhdGlvbl9nYWxsZXJ5X29wdGlvbnMudGh1bWJuYWlsX3Bvc2l0aW9uX2NsYXNzX3ByZWZpeH1ib3R0b21gKTtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fZWxlbWVudC5hZGRDbGFzcyhgJHt3b29fdmFyaWF0aW9uX2dhbGxlcnlfb3B0aW9ucy50aHVtYm5haWxfcG9zaXRpb25fY2xhc3NfcHJlZml4fSR7d29vX3ZhcmlhdGlvbl9nYWxsZXJ5X29wdGlvbnMudGh1bWJuYWlsX3Bvc2l0aW9ufWApO1xuXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuJHNsaWRlci5zbGljaygnc2V0UG9zaXRpb24nKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBlbmFibGVUaHVtYm5haWxQb3NpdGlvbkRlYm91bmNlKGV2ZW50KSB7XG4gICAgICAgICAgICByZXR1cm4gXy5kZWJvdW5jZSgoKSA9PiB7XG4gICAgICAgICAgICAgICAgdGhpcy5lbmFibGVUaHVtYm5haWxQb3NpdGlvbigpO1xuICAgICAgICAgICAgfSwgNDAwKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgICAqIGpRdWVyeVxuICAgICAqIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgICAqL1xuXG4gICAgJC5mblsnV29vVmFyaWF0aW9uR2FsbGVyeVBybyddID0gV29vVmFyaWF0aW9uR2FsbGVyeVByby5falF1ZXJ5SW50ZXJmYWNlO1xuICAgICQuZm5bJ1dvb1ZhcmlhdGlvbkdhbGxlcnlQcm8nXS5Db25zdHJ1Y3RvciA9IFdvb1ZhcmlhdGlvbkdhbGxlcnlQcm87XG4gICAgJC5mblsnV29vVmFyaWF0aW9uR2FsbGVyeVBybyddLm5vQ29uZmxpY3QgID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAkLmZuWydXb29WYXJpYXRpb25HYWxsZXJ5UHJvJ10gPSAkLmZuWydXb29WYXJpYXRpb25HYWxsZXJ5UHJvJ107XG4gICAgICAgIHJldHVybiBXb29WYXJpYXRpb25HYWxsZXJ5UHJvLl9qUXVlcnlJbnRlcmZhY2VcbiAgICB9O1xuXG4gICAgcmV0dXJuIFdvb1ZhcmlhdGlvbkdhbGxlcnlQcm87XG5cbn0pKGpRdWVyeSk7XG5cbmV4cG9ydCBkZWZhdWx0IFdvb1ZhcmlhdGlvbkdhbGxlcnlQcm9cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gc3JjL2pzL1dvb1ZhcmlhdGlvbkdhbGxlcnlQcm8uanMiLCIvLyByZW1vdmVkIGJ5IGV4dHJhY3QtdGV4dC13ZWJwYWNrLXBsdWdpblxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vc3JjL3Njc3MvZnJvbnRlbmQuc2Nzc1xuLy8gbW9kdWxlIGlkID0gM1xuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCIvLyByZW1vdmVkIGJ5IGV4dHJhY3QtdGV4dC13ZWJwYWNrLXBsdWdpblxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vc3JjL3Njc3MvYmFja2VuZC5zY3NzXG4vLyBtb2R1bGUgaWQgPSA0XG4vLyBtb2R1bGUgY2h1bmtzID0gMCJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7QUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7Ozs7Ozs7Ozs7Ozs7O0FDN0RBO0FBQ0E7QUFBQTtBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTs7Ozs7Ozs7Ozs7O0FDUEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBSEE7QUFNQTtBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUE1QkE7QUFBQTtBQUFBO0FBbUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQWhGQTtBQUFBO0FBQUE7QUFrRkE7QUFDQTtBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFHQTtBQUNBO0FBQ0E7QUFDQTtBQWhHQTtBQUFBO0FBQUE7QUFDQTtBQW1HQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFwSEE7QUFBQTtBQUFBO0FBc0hBO0FBQ0E7QUFBQTtBQUNBO0FBQ0E7QUFDQTtBQTFIQTtBQUFBO0FBQUE7QUFDQTtBQTZIQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQXZKQTtBQUFBO0FBQUE7QUF5SkE7QUFDQTtBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBN0pBO0FBQUE7QUFBQTtBQThCQTtBQUNBO0FBQ0E7QUFDQTtBQWpDQTtBQUNBO0FBREE7QUFBQTtBQUNBO0FBK0pBOzs7Ozs7QUFNQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBOzs7Ozs7QUN0TEE7Ozs7OztBQ0FBOzs7QSIsInNvdXJjZVJvb3QiOiIifQ==