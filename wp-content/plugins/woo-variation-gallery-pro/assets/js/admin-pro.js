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
/******/ 	return __webpack_require__(__webpack_require__.s = 7);
/******/ })
/************************************************************************/
/******/ ({

/***/ 7:
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(8);


/***/ }),

/***/ 8:
/***/ (function(module, exports, __webpack_require__) {

jQuery(function ($) {
    Promise.resolve().then(function () {
        return __webpack_require__(9);
    }).then(function (_ref) {
        var WooVariationGalleryAdminPro = _ref.WooVariationGalleryAdminPro;


        WooVariationGalleryAdminPro.GWPAdmin();

        $('#woocommerce-product-data').on('woocommerce_variations_loaded', function () {
            WooVariationGalleryAdminPro.ImageUploader();
            WooVariationGalleryAdminPro.Sortable();
        });

        $('#variable_product_options').on('woocommerce_variations_added', function () {
            WooVariationGalleryAdminPro.ImageUploader();
            WooVariationGalleryAdminPro.Sortable();
        });
    });
}); // end of jquery main wrapper

/***/ }),

/***/ 9:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "WooVariationGalleryAdminPro", function() { return WooVariationGalleryAdminPro; });
var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/*global woo_variation_gallery_admin */
var WooVariationGalleryAdminPro = function ($) {
    var WooVariationGalleryAdminPro = function () {
        function WooVariationGalleryAdminPro() {
            _classCallCheck(this, WooVariationGalleryAdminPro);
        }

        _createClass(WooVariationGalleryAdminPro, null, [{
            key: 'GWPAdmin',
            value: function GWPAdmin() {
                if ($().gwp_live_feed) {

                    $().gwp_live_feed();
                }
                if ($().gwp_deactivate_popup) {
                    $().gwp_deactivate_popup('woo-variation-gallery');
                }
            }
        }, {
            key: 'ImageUploader',
            value: function ImageUploader() {
                $(document).off('click', '.add-woo-variation-gallery-image');
                $(document).on('click', '.add-woo-variation-gallery-image', this.AddImage);
                $(document).on('click', '.remove-woo-variation-gallery-image', this.RemoveImage);
                $(document).on('click', '.woo_variation_gallery_media_video_popup_link', this.AttachmentVideoPopup);

                $('.woocommerce_variation').each(function () {
                    var optionsWrapper = $(this).find('.options');
                    var galleryWrapper = $(this).find('.woo-variation-gallery-wrapper');
                    galleryWrapper.insertBefore(optionsWrapper);
                });
            }
        }, {
            key: 'AddImage',
            value: function AddImage(event) {
                var _this = this;

                event.preventDefault();
                event.stopPropagation();

                var file_frame = void 0;
                var product_variation_id = $(this).data('product_variation_id');

                if (typeof wp !== 'undefined' && wp.media && wp.media.editor) {

                    // If the media frame already exists, reopen it.
                    if (file_frame) {
                        file_frame.open();
                        return;
                    }

                    // Create the media frame.
                    file_frame = wp.media.frames.select_image = wp.media({
                        title: woo_variation_gallery_admin.choose_image,
                        button: {
                            text: woo_variation_gallery_admin.add_image
                        },
                        /*states : [
                            new wp.media.controller.Library({
                                title      : woo_variation_gallery_admin.choose_image,
                                filterable : 'all',
                                multiple   : 'add'
                            })
                        ],*/
                        library: {
                            type: ['image'] // [ 'video', 'image' ]
                        },
                        // multiple : true
                        multiple: 'add'
                    });

                    // When an image is selected, run a callback.
                    file_frame.on('select', function () {

                        var images = file_frame.state().get('selection').toJSON();

                        var html = images.map(function (image) {
                            if (image.type === 'image') {
                                var id = image.id,
                                    woo_variation_gallery_video = image.woo_variation_gallery_video,
                                    _image$sizes = image.sizes;
                                _image$sizes = _image$sizes === undefined ? {} : _image$sizes;
                                var thumbnail = _image$sizes.thumbnail,
                                    full = _image$sizes.full;


                                var url = thumbnail ? thumbnail.url : full.url;
                                var template = wp.template('woo-variation-gallery-image');
                                return template({ id: id, url: url, product_variation_id: product_variation_id, woo_variation_gallery_video: woo_variation_gallery_video });
                            }
                        }).join('');

                        $(_this).parent().prev().find('.woo-variation-gallery-images').append(html);

                        // Variation Changed
                        WooVariationGalleryAdminPro.Sortable();
                        WooVariationGalleryAdminPro.VariationChanged(_this);
                    });

                    // Finally, open the modal.
                    file_frame.open();
                }
            }
        }, {
            key: 'VariationChanged',
            value: function VariationChanged($el) {
                $($el).closest('.woocommerce_variation').addClass('variation-needs-update');
                $('button.cancel-variation-changes, button.save-variation-changes').removeAttr('disabled');
                $('#variable_product_options').trigger('woocommerce_variations_input_changed');
            }
        }, {
            key: 'RemoveImage',
            value: function RemoveImage(event) {
                var _this2 = this;

                event.preventDefault();
                event.stopPropagation();

                // Variation Changed
                WooVariationGalleryAdminPro.VariationChanged(this);

                _.delay(function () {
                    $(_this2).parent().remove();
                }, 1);
            }
        }, {
            key: 'Sortable',
            value: function Sortable() {
                $('.woo-variation-gallery-images').sortable({
                    items: 'li.image',
                    cursor: 'move',
                    scrollSensitivity: 40,
                    forcePlaceholderSize: true,
                    forceHelperSize: false,
                    helper: 'clone',
                    opacity: 0.65,
                    placeholder: 'woo-variation-gallery-sortable-placeholder',
                    start: function start(event, ui) {
                        ui.item.css('background-color', '#f6f6f6');
                    },
                    stop: function stop(event, ui) {
                        ui.item.removeAttr('style');
                    },
                    update: function update() {
                        // Variation Changed
                        WooVariationGalleryAdminPro.VariationChanged(this);
                    }
                });
            }
        }, {
            key: 'AttachmentVideoPopup',
            value: function AttachmentVideoPopup(event) {
                var _this3 = this;

                event.preventDefault();
                event.stopPropagation();

                var video_frame = void 0;
                if (typeof wp !== 'undefined' && wp.media && wp.media.editor) {

                    // If the media frame already exists, reopen it.
                    if (video_frame) {
                        video_frame.open();
                        return;
                    }

                    // Create the media frame.
                    video_frame = wp.media.frames.select_image = wp.media({
                        title: woo_variation_gallery_admin.choose_video,
                        button: {
                            text: woo_variation_gallery_admin.add_video
                        },
                        /*states : [
                            new wp.media.controller.Library({
                                title      : woo_variation_gallery_admin.choose_image,
                                filterable : 'all',
                                multiple   : 'add'
                            })
                        ],*/
                        library: {
                            type: ['video'] // [ 'video', 'image' ]
                        },
                        multiple: false
                    });

                    // When an image is selected, run a callback.
                    video_frame.on('select', function () {

                        var video = video_frame.state().get('selection').first().toJSON();

                        if (video.type === 'video') {
                            $(_this3).closest('.compat-attachment-fields').find('.compat-field-woo_variation_gallery_media_video input').val(video.url).change();
                        }
                    });

                    // Finally, open the modal.
                    video_frame.open();
                }
            }
        }]);

        return WooVariationGalleryAdminPro;
    }();

    return WooVariationGalleryAdminPro;
}(jQuery);



/***/ })

/******/ });
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXNzZXRzL2pzL2FkbWluLXByby5qcyIsInNvdXJjZXMiOlsid2VicGFjazovLy93ZWJwYWNrL2Jvb3RzdHJhcCBkOGI4OGQyMTcwNzFlNWI5NTZlYSIsIndlYnBhY2s6Ly8vc3JjL2pzL2JhY2tlbmQuanMiLCJ3ZWJwYWNrOi8vL3NyYy9qcy9Xb29WYXJpYXRpb25HYWxsZXJ5QWRtaW5Qcm8uanMiXSwic291cmNlc0NvbnRlbnQiOlsiIFx0Ly8gVGhlIG1vZHVsZSBjYWNoZVxuIFx0dmFyIGluc3RhbGxlZE1vZHVsZXMgPSB7fTtcblxuIFx0Ly8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbiBcdGZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblxuIFx0XHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcbiBcdFx0aWYoaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0pIHtcbiBcdFx0XHRyZXR1cm4gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0uZXhwb3J0cztcbiBcdFx0fVxuIFx0XHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuIFx0XHR2YXIgbW9kdWxlID0gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0gPSB7XG4gXHRcdFx0aTogbW9kdWxlSWQsXG4gXHRcdFx0bDogZmFsc2UsXG4gXHRcdFx0ZXhwb3J0czoge31cbiBcdFx0fTtcblxuIFx0XHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cbiBcdFx0bW9kdWxlc1ttb2R1bGVJZF0uY2FsbChtb2R1bGUuZXhwb3J0cywgbW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cbiBcdFx0Ly8gRmxhZyB0aGUgbW9kdWxlIGFzIGxvYWRlZFxuIFx0XHRtb2R1bGUubCA9IHRydWU7XG5cbiBcdFx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcbiBcdFx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xuIFx0fVxuXG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlcyBvYmplY3QgKF9fd2VicGFja19tb2R1bGVzX18pXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm0gPSBtb2R1bGVzO1xuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZSBjYWNoZVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5jID0gaW5zdGFsbGVkTW9kdWxlcztcblxuIFx0Ly8gZGVmaW5lIGdldHRlciBmdW5jdGlvbiBmb3IgaGFybW9ueSBleHBvcnRzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQgPSBmdW5jdGlvbihleHBvcnRzLCBuYW1lLCBnZXR0ZXIpIHtcbiBcdFx0aWYoIV9fd2VicGFja19yZXF1aXJlX18ubyhleHBvcnRzLCBuYW1lKSkge1xuIFx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBuYW1lLCB7XG4gXHRcdFx0XHRjb25maWd1cmFibGU6IGZhbHNlLFxuIFx0XHRcdFx0ZW51bWVyYWJsZTogdHJ1ZSxcbiBcdFx0XHRcdGdldDogZ2V0dGVyXG4gXHRcdFx0fSk7XG4gXHRcdH1cbiBcdH07XG5cbiBcdC8vIGdldERlZmF1bHRFeHBvcnQgZnVuY3Rpb24gZm9yIGNvbXBhdGliaWxpdHkgd2l0aCBub24taGFybW9ueSBtb2R1bGVzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm4gPSBmdW5jdGlvbihtb2R1bGUpIHtcbiBcdFx0dmFyIGdldHRlciA9IG1vZHVsZSAmJiBtb2R1bGUuX19lc01vZHVsZSA/XG4gXHRcdFx0ZnVuY3Rpb24gZ2V0RGVmYXVsdCgpIHsgcmV0dXJuIG1vZHVsZVsnZGVmYXVsdCddOyB9IDpcbiBcdFx0XHRmdW5jdGlvbiBnZXRNb2R1bGVFeHBvcnRzKCkgeyByZXR1cm4gbW9kdWxlOyB9O1xuIFx0XHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQoZ2V0dGVyLCAnYScsIGdldHRlcik7XG4gXHRcdHJldHVybiBnZXR0ZXI7XG4gXHR9O1xuXG4gXHQvLyBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGxcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubyA9IGZ1bmN0aW9uKG9iamVjdCwgcHJvcGVydHkpIHsgcmV0dXJuIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmplY3QsIHByb3BlcnR5KTsgfTtcblxuIFx0Ly8gX193ZWJwYWNrX3B1YmxpY19wYXRoX19cbiBcdF9fd2VicGFja19yZXF1aXJlX18ucCA9IFwiXCI7XG5cbiBcdC8vIExvYWQgZW50cnkgbW9kdWxlIGFuZCByZXR1cm4gZXhwb3J0c1xuIFx0cmV0dXJuIF9fd2VicGFja19yZXF1aXJlX18oX193ZWJwYWNrX3JlcXVpcmVfXy5zID0gNyk7XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gd2VicGFjay9ib290c3RyYXAgZDhiODhkMjE3MDcxZTViOTU2ZWEiLCJqUXVlcnkoJCA9PiB7XG4gICAgaW1wb3J0KCcuL1dvb1ZhcmlhdGlvbkdhbGxlcnlBZG1pblBybycpLnRoZW4oKHtXb29WYXJpYXRpb25HYWxsZXJ5QWRtaW5Qcm99KSA9PiB7XG5cbiAgICAgICAgV29vVmFyaWF0aW9uR2FsbGVyeUFkbWluUHJvLkdXUEFkbWluKCk7XG5cbiAgICAgICAgJCgnI3dvb2NvbW1lcmNlLXByb2R1Y3QtZGF0YScpLm9uKCd3b29jb21tZXJjZV92YXJpYXRpb25zX2xvYWRlZCcsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIFdvb1ZhcmlhdGlvbkdhbGxlcnlBZG1pblByby5JbWFnZVVwbG9hZGVyKCk7XG4gICAgICAgICAgICBXb29WYXJpYXRpb25HYWxsZXJ5QWRtaW5Qcm8uU29ydGFibGUoKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgJCgnI3ZhcmlhYmxlX3Byb2R1Y3Rfb3B0aW9ucycpLm9uKCd3b29jb21tZXJjZV92YXJpYXRpb25zX2FkZGVkJywgZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgV29vVmFyaWF0aW9uR2FsbGVyeUFkbWluUHJvLkltYWdlVXBsb2FkZXIoKTtcbiAgICAgICAgICAgIFdvb1ZhcmlhdGlvbkdhbGxlcnlBZG1pblByby5Tb3J0YWJsZSgpO1xuICAgICAgICB9KTtcbiAgICB9KTtcblxufSk7ICAvLyBlbmQgb2YganF1ZXJ5IG1haW4gd3JhcHBlclxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyBzcmMvanMvYmFja2VuZC5qcyIsIi8qZ2xvYmFsIHdvb192YXJpYXRpb25fZ2FsbGVyeV9hZG1pbiAqL1xuY29uc3QgV29vVmFyaWF0aW9uR2FsbGVyeUFkbWluUHJvID0gKCgkKSA9PiB7XG4gICAgY2xhc3MgV29vVmFyaWF0aW9uR2FsbGVyeUFkbWluUHJvIHtcblxuICAgICAgICBzdGF0aWMgR1dQQWRtaW4oKSB7XG4gICAgICAgICAgICBpZiAoJCgpLmd3cF9saXZlX2ZlZWQpIHtcblxuICAgICAgICAgICAgICAgICQoKS5nd3BfbGl2ZV9mZWVkKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoJCgpLmd3cF9kZWFjdGl2YXRlX3BvcHVwKSB7XG4gICAgICAgICAgICAgICAgJCgpLmd3cF9kZWFjdGl2YXRlX3BvcHVwKCd3b28tdmFyaWF0aW9uLWdhbGxlcnknKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHN0YXRpYyBJbWFnZVVwbG9hZGVyKCkge1xuICAgICAgICAgICAgJChkb2N1bWVudCkub2ZmKCdjbGljaycsICcuYWRkLXdvby12YXJpYXRpb24tZ2FsbGVyeS1pbWFnZScpO1xuICAgICAgICAgICAgJChkb2N1bWVudCkub24oJ2NsaWNrJywgJy5hZGQtd29vLXZhcmlhdGlvbi1nYWxsZXJ5LWltYWdlJywgdGhpcy5BZGRJbWFnZSk7XG4gICAgICAgICAgICAkKGRvY3VtZW50KS5vbignY2xpY2snLCAnLnJlbW92ZS13b28tdmFyaWF0aW9uLWdhbGxlcnktaW1hZ2UnLCB0aGlzLlJlbW92ZUltYWdlKTtcbiAgICAgICAgICAgICQoZG9jdW1lbnQpLm9uKCdjbGljaycsICcud29vX3ZhcmlhdGlvbl9nYWxsZXJ5X21lZGlhX3ZpZGVvX3BvcHVwX2xpbmsnLCB0aGlzLkF0dGFjaG1lbnRWaWRlb1BvcHVwKTtcblxuICAgICAgICAgICAgJCgnLndvb2NvbW1lcmNlX3ZhcmlhdGlvbicpLmVhY2goZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIGxldCBvcHRpb25zV3JhcHBlciA9ICQodGhpcykuZmluZCgnLm9wdGlvbnMnKTtcbiAgICAgICAgICAgICAgICBsZXQgZ2FsbGVyeVdyYXBwZXIgPSAkKHRoaXMpLmZpbmQoJy53b28tdmFyaWF0aW9uLWdhbGxlcnktd3JhcHBlcicpO1xuICAgICAgICAgICAgICAgIGdhbGxlcnlXcmFwcGVyLmluc2VydEJlZm9yZShvcHRpb25zV3JhcHBlcilcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG5cbiAgICAgICAgc3RhdGljIEFkZEltYWdlKGV2ZW50KSB7XG5cbiAgICAgICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgICAgICBldmVudC5zdG9wUHJvcGFnYXRpb24oKTtcblxuICAgICAgICAgICAgbGV0IGZpbGVfZnJhbWU7XG4gICAgICAgICAgICBsZXQgcHJvZHVjdF92YXJpYXRpb25faWQgPSAkKHRoaXMpLmRhdGEoJ3Byb2R1Y3RfdmFyaWF0aW9uX2lkJyk7XG5cbiAgICAgICAgICAgIGlmICh0eXBlb2Ygd3AgIT09ICd1bmRlZmluZWQnICYmIHdwLm1lZGlhICYmIHdwLm1lZGlhLmVkaXRvcikge1xuXG4gICAgICAgICAgICAgICAgLy8gSWYgdGhlIG1lZGlhIGZyYW1lIGFscmVhZHkgZXhpc3RzLCByZW9wZW4gaXQuXG4gICAgICAgICAgICAgICAgaWYgKGZpbGVfZnJhbWUpIHtcbiAgICAgICAgICAgICAgICAgICAgZmlsZV9mcmFtZS5vcGVuKCk7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAvLyBDcmVhdGUgdGhlIG1lZGlhIGZyYW1lLlxuICAgICAgICAgICAgICAgIGZpbGVfZnJhbWUgPSB3cC5tZWRpYS5mcmFtZXMuc2VsZWN0X2ltYWdlID0gd3AubWVkaWEoe1xuICAgICAgICAgICAgICAgICAgICB0aXRsZSAgICA6IHdvb192YXJpYXRpb25fZ2FsbGVyeV9hZG1pbi5jaG9vc2VfaW1hZ2UsXG4gICAgICAgICAgICAgICAgICAgIGJ1dHRvbiAgIDoge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGV4dCA6IHdvb192YXJpYXRpb25fZ2FsbGVyeV9hZG1pbi5hZGRfaW1hZ2VcbiAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgLypzdGF0ZXMgOiBbXG4gICAgICAgICAgICAgICAgICAgICAgICBuZXcgd3AubWVkaWEuY29udHJvbGxlci5MaWJyYXJ5KHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aXRsZSAgICAgIDogd29vX3ZhcmlhdGlvbl9nYWxsZXJ5X2FkbWluLmNob29zZV9pbWFnZSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBmaWx0ZXJhYmxlIDogJ2FsbCcsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbXVsdGlwbGUgICA6ICdhZGQnXG4gICAgICAgICAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgICAgICBdLCovXG4gICAgICAgICAgICAgICAgICAgIGxpYnJhcnkgIDoge1xuICAgICAgICAgICAgICAgICAgICAgICAgdHlwZSA6IFsnaW1hZ2UnXSAvLyBbICd2aWRlbycsICdpbWFnZScgXVxuICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICAvLyBtdWx0aXBsZSA6IHRydWVcbiAgICAgICAgICAgICAgICAgICAgbXVsdGlwbGUgOiAnYWRkJ1xuICAgICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAgICAgLy8gV2hlbiBhbiBpbWFnZSBpcyBzZWxlY3RlZCwgcnVuIGEgY2FsbGJhY2suXG4gICAgICAgICAgICAgICAgZmlsZV9mcmFtZS5vbignc2VsZWN0JywgKCkgPT4ge1xuXG4gICAgICAgICAgICAgICAgICAgIGxldCBpbWFnZXMgPSBmaWxlX2ZyYW1lLnN0YXRlKCkuZ2V0KCdzZWxlY3Rpb24nKS50b0pTT04oKTtcblxuICAgICAgICAgICAgICAgICAgICBsZXQgaHRtbCA9IGltYWdlcy5tYXAoKGltYWdlKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoaW1hZ2UudHlwZSA9PT0gJ2ltYWdlJykge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxldCB7aWQsIHdvb192YXJpYXRpb25fZ2FsbGVyeV92aWRlbywgc2l6ZXMgOiB7dGh1bWJuYWlsLCBmdWxsfSA9IHt9fSA9IGltYWdlO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbGV0IHVybCAgICAgID0gdGh1bWJuYWlsID8gdGh1bWJuYWlsLnVybCA6IGZ1bGwudXJsO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxldCB0ZW1wbGF0ZSA9IHdwLnRlbXBsYXRlKCd3b28tdmFyaWF0aW9uLWdhbGxlcnktaW1hZ2UnKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gdGVtcGxhdGUoe2lkLCB1cmwsIHByb2R1Y3RfdmFyaWF0aW9uX2lkLCB3b29fdmFyaWF0aW9uX2dhbGxlcnlfdmlkZW99KTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfSkuam9pbignJyk7XG5cbiAgICAgICAgICAgICAgICAgICAgJCh0aGlzKS5wYXJlbnQoKS5wcmV2KCkuZmluZCgnLndvby12YXJpYXRpb24tZ2FsbGVyeS1pbWFnZXMnKS5hcHBlbmQoaHRtbCk7XG5cbiAgICAgICAgICAgICAgICAgICAgLy8gVmFyaWF0aW9uIENoYW5nZWRcbiAgICAgICAgICAgICAgICAgICAgV29vVmFyaWF0aW9uR2FsbGVyeUFkbWluUHJvLlNvcnRhYmxlKCk7XG4gICAgICAgICAgICAgICAgICAgIFdvb1ZhcmlhdGlvbkdhbGxlcnlBZG1pblByby5WYXJpYXRpb25DaGFuZ2VkKHRoaXMpO1xuXG4gICAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgICAgICAvLyBGaW5hbGx5LCBvcGVuIHRoZSBtb2RhbC5cbiAgICAgICAgICAgICAgICBmaWxlX2ZyYW1lLm9wZW4oKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHN0YXRpYyBWYXJpYXRpb25DaGFuZ2VkKCRlbCkge1xuICAgICAgICAgICAgJCgkZWwpLmNsb3Nlc3QoJy53b29jb21tZXJjZV92YXJpYXRpb24nKS5hZGRDbGFzcygndmFyaWF0aW9uLW5lZWRzLXVwZGF0ZScpO1xuICAgICAgICAgICAgJCgnYnV0dG9uLmNhbmNlbC12YXJpYXRpb24tY2hhbmdlcywgYnV0dG9uLnNhdmUtdmFyaWF0aW9uLWNoYW5nZXMnKS5yZW1vdmVBdHRyKCdkaXNhYmxlZCcpO1xuICAgICAgICAgICAgJCgnI3ZhcmlhYmxlX3Byb2R1Y3Rfb3B0aW9ucycpLnRyaWdnZXIoJ3dvb2NvbW1lcmNlX3ZhcmlhdGlvbnNfaW5wdXRfY2hhbmdlZCcpO1xuICAgICAgICB9XG5cbiAgICAgICAgc3RhdGljIFJlbW92ZUltYWdlKGV2ZW50KSB7XG5cbiAgICAgICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgICAgICBldmVudC5zdG9wUHJvcGFnYXRpb24oKTtcblxuICAgICAgICAgICAgLy8gVmFyaWF0aW9uIENoYW5nZWRcbiAgICAgICAgICAgIFdvb1ZhcmlhdGlvbkdhbGxlcnlBZG1pblByby5WYXJpYXRpb25DaGFuZ2VkKHRoaXMpO1xuXG4gICAgICAgICAgICBfLmRlbGF5KCgpID0+IHtcbiAgICAgICAgICAgICAgICAkKHRoaXMpLnBhcmVudCgpLnJlbW92ZSgpO1xuICAgICAgICAgICAgfSwgMSk7XG4gICAgICAgIH1cblxuICAgICAgICBzdGF0aWMgU29ydGFibGUoKSB7XG4gICAgICAgICAgICAkKCcud29vLXZhcmlhdGlvbi1nYWxsZXJ5LWltYWdlcycpLnNvcnRhYmxlKHtcbiAgICAgICAgICAgICAgICBpdGVtcyAgICAgICAgICAgICAgICA6ICdsaS5pbWFnZScsXG4gICAgICAgICAgICAgICAgY3Vyc29yICAgICAgICAgICAgICAgOiAnbW92ZScsXG4gICAgICAgICAgICAgICAgc2Nyb2xsU2Vuc2l0aXZpdHkgICAgOiA0MCxcbiAgICAgICAgICAgICAgICBmb3JjZVBsYWNlaG9sZGVyU2l6ZSA6IHRydWUsXG4gICAgICAgICAgICAgICAgZm9yY2VIZWxwZXJTaXplICAgICAgOiBmYWxzZSxcbiAgICAgICAgICAgICAgICBoZWxwZXIgICAgICAgICAgICAgICA6ICdjbG9uZScsXG4gICAgICAgICAgICAgICAgb3BhY2l0eSAgICAgICAgICAgICAgOiAwLjY1LFxuICAgICAgICAgICAgICAgIHBsYWNlaG9sZGVyICAgICAgICAgIDogJ3dvby12YXJpYXRpb24tZ2FsbGVyeS1zb3J0YWJsZS1wbGFjZWhvbGRlcicsXG4gICAgICAgICAgICAgICAgc3RhcnQgICAgICAgICAgICAgICAgOiBmdW5jdGlvbiAoZXZlbnQsIHVpKSB7XG4gICAgICAgICAgICAgICAgICAgIHVpLml0ZW0uY3NzKCdiYWNrZ3JvdW5kLWNvbG9yJywgJyNmNmY2ZjYnKTtcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIHN0b3AgICAgICAgICAgICAgICAgIDogZnVuY3Rpb24gKGV2ZW50LCB1aSkge1xuICAgICAgICAgICAgICAgICAgICB1aS5pdGVtLnJlbW92ZUF0dHIoJ3N0eWxlJyk7XG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICB1cGRhdGUgICAgICAgICAgICAgICA6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAgICAgLy8gVmFyaWF0aW9uIENoYW5nZWRcbiAgICAgICAgICAgICAgICAgICAgV29vVmFyaWF0aW9uR2FsbGVyeUFkbWluUHJvLlZhcmlhdGlvbkNoYW5nZWQodGhpcyk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cblxuICAgICAgICBzdGF0aWMgQXR0YWNobWVudFZpZGVvUG9wdXAoZXZlbnQpIHtcbiAgICAgICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgICAgICBldmVudC5zdG9wUHJvcGFnYXRpb24oKTtcblxuICAgICAgICAgICAgbGV0IHZpZGVvX2ZyYW1lO1xuICAgICAgICAgICAgaWYgKHR5cGVvZiB3cCAhPT0gJ3VuZGVmaW5lZCcgJiYgd3AubWVkaWEgJiYgd3AubWVkaWEuZWRpdG9yKSB7XG5cbiAgICAgICAgICAgICAgICAvLyBJZiB0aGUgbWVkaWEgZnJhbWUgYWxyZWFkeSBleGlzdHMsIHJlb3BlbiBpdC5cbiAgICAgICAgICAgICAgICBpZiAodmlkZW9fZnJhbWUpIHtcbiAgICAgICAgICAgICAgICAgICAgdmlkZW9fZnJhbWUub3BlbigpO1xuICAgICAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgLy8gQ3JlYXRlIHRoZSBtZWRpYSBmcmFtZS5cbiAgICAgICAgICAgICAgICB2aWRlb19mcmFtZSA9IHdwLm1lZGlhLmZyYW1lcy5zZWxlY3RfaW1hZ2UgPSB3cC5tZWRpYSh7XG4gICAgICAgICAgICAgICAgICAgIHRpdGxlICAgIDogd29vX3ZhcmlhdGlvbl9nYWxsZXJ5X2FkbWluLmNob29zZV92aWRlbyxcbiAgICAgICAgICAgICAgICAgICAgYnV0dG9uICAgOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0ZXh0IDogd29vX3ZhcmlhdGlvbl9nYWxsZXJ5X2FkbWluLmFkZF92aWRlb1xuICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICAvKnN0YXRlcyA6IFtcbiAgICAgICAgICAgICAgICAgICAgICAgIG5ldyB3cC5tZWRpYS5jb250cm9sbGVyLkxpYnJhcnkoe1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRpdGxlICAgICAgOiB3b29fdmFyaWF0aW9uX2dhbGxlcnlfYWRtaW4uY2hvb3NlX2ltYWdlLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZpbHRlcmFibGUgOiAnYWxsJyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBtdWx0aXBsZSAgIDogJ2FkZCdcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgICAgIF0sKi9cbiAgICAgICAgICAgICAgICAgICAgbGlicmFyeSAgOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0eXBlIDogWyd2aWRlbyddIC8vIFsgJ3ZpZGVvJywgJ2ltYWdlJyBdXG4gICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgIG11bHRpcGxlIDogZmFsc2VcbiAgICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgICAgIC8vIFdoZW4gYW4gaW1hZ2UgaXMgc2VsZWN0ZWQsIHJ1biBhIGNhbGxiYWNrLlxuICAgICAgICAgICAgICAgIHZpZGVvX2ZyYW1lLm9uKCdzZWxlY3QnLCAoKSA9PiB7XG5cbiAgICAgICAgICAgICAgICAgICAgbGV0IHZpZGVvID0gdmlkZW9fZnJhbWUuc3RhdGUoKS5nZXQoJ3NlbGVjdGlvbicpLmZpcnN0KCkudG9KU09OKCk7XG5cbiAgICAgICAgICAgICAgICAgICAgaWYgKHZpZGVvLnR5cGUgPT09ICd2aWRlbycpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICQodGhpcykuY2xvc2VzdCgnLmNvbXBhdC1hdHRhY2htZW50LWZpZWxkcycpLmZpbmQoJy5jb21wYXQtZmllbGQtd29vX3ZhcmlhdGlvbl9nYWxsZXJ5X21lZGlhX3ZpZGVvIGlucHV0JykudmFsKHZpZGVvLnVybCkuY2hhbmdlKClcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAgICAgLy8gRmluYWxseSwgb3BlbiB0aGUgbW9kYWwuXG4gICAgICAgICAgICAgICAgdmlkZW9fZnJhbWUub3BlbigpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIFdvb1ZhcmlhdGlvbkdhbGxlcnlBZG1pblBybztcbn0pKGpRdWVyeSk7XG5cbmV4cG9ydCB7IFdvb1ZhcmlhdGlvbkdhbGxlcnlBZG1pblBybyB9O1xuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyBzcmMvanMvV29vVmFyaWF0aW9uR2FsbGVyeUFkbWluUHJvLmpzIl0sIm1hcHBpbmdzIjoiOzs7Ozs7OztBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7Ozs7Ozs7Ozs7Ozs7QUM3REE7QUFDQTtBQUFBO0FBQUE7QUFBQTtBQUNBO0FBQ0E7QUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTs7Ozs7Ozs7Ozs7Ozs7QUNoQkE7QUFDQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQ0E7QUFEQTtBQUFBO0FBQUE7QUFJQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBWEE7QUFBQTtBQUFBO0FBY0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQXhCQTtBQUFBO0FBQUE7QUEwQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBREE7QUFHQTs7Ozs7OztBQU9BO0FBQ0E7QUFEQTtBQUdBO0FBQ0E7QUFoQkE7QUFDQTtBQWtCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBeEZBO0FBQUE7QUFBQTtBQTJGQTtBQUNBO0FBQ0E7QUFDQTtBQTlGQTtBQUFBO0FBQUE7QUFnR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBM0dBO0FBQUE7QUFBQTtBQThHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQWxCQTtBQW9CQTtBQWxJQTtBQUFBO0FBQUE7QUFvSUE7QUFDQTtBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFEQTtBQUdBOzs7Ozs7O0FBT0E7QUFDQTtBQURBO0FBR0E7QUFmQTtBQUNBO0FBaUJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFqTEE7QUFDQTtBQURBO0FBQUE7QUFDQTtBQW1MQTtBQUNBO0FBQ0E7Ozs7O0EiLCJzb3VyY2VSb290IjoiIn0=