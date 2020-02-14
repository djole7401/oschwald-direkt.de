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
/******/ 	return __webpack_require__(__webpack_require__.s = 8);
/******/ })
/************************************************************************/
/******/ ({

/***/ 10:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "WooVariationGalleryAdmin", function() { return WooVariationGalleryAdmin; });
var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/*global woo_variation_gallery_admin */
var WooVariationGalleryAdmin = function ($) {
    var WooVariationGalleryAdmin = function () {
        function WooVariationGalleryAdmin() {
            _classCallCheck(this, WooVariationGalleryAdmin);
        }

        _createClass(WooVariationGalleryAdmin, null, [{
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
                        }
                        // multiple : true
                        //multiple : 'add'
                    });

                    // When an image is selected, run a callback.
                    file_frame.on('select', function () {

                        var images = file_frame.state().get('selection').toJSON();

                        var html = images.map(function (image) {
                            if (image.type === 'image') {
                                var id = image.id,
                                    _image$sizes = image.sizes;
                                _image$sizes = _image$sizes === undefined ? {} : _image$sizes;
                                var thumbnail = _image$sizes.thumbnail,
                                    full = _image$sizes.full;


                                var url = thumbnail ? thumbnail.url : full.url;
                                var template = wp.template('woo-variation-gallery-image');
                                return template({ id: id, url: url, product_variation_id: product_variation_id });
                            }
                        }).join('');

                        $(_this).parent().prev().find('.woo-variation-gallery-images').append(html);

                        // Variation Changed
                        WooVariationGalleryAdmin.Sortable();
                        WooVariationGalleryAdmin.VariationChanged(_this);

                        _.delay(function () {
                            WooVariationGalleryAdmin.ProNotice(_this);
                        }, 5);
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
            key: 'ProNotice',
            value: function ProNotice($el) {
                var total = $($el).closest('.woo-variation-gallery-wrapper').find('.woo-variation-gallery-images > li').length;
                $($el).closest('.woo-variation-gallery-wrapper').find('.woo-variation-gallery-images > li').each(function (i, el) {
                    if (i >= 2) {
                        $(el).remove();
                        $($el).closest('.woo-variation-gallery-wrapper').find('.woo-variation-gallery-pro-button').show();
                    } else {
                        $($el).closest('.woo-variation-gallery-wrapper').find('.woo-variation-gallery-pro-button').hide();
                    }
                });
            }
        }, {
            key: 'RemoveImage',
            value: function RemoveImage(event) {
                var _this2 = this;

                event.preventDefault();
                event.stopPropagation();

                // Variation Changed
                WooVariationGalleryAdmin.VariationChanged(this);

                _.delay(function () {
                    WooVariationGalleryAdmin.ProNotice(_this2);
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
                        WooVariationGalleryAdmin.VariationChanged(this);
                    }
                });
            }
        }]);

        return WooVariationGalleryAdmin;
    }();

    return WooVariationGalleryAdmin;
}(jQuery);



/***/ }),

/***/ 8:
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(9);


/***/ }),

/***/ 9:
/***/ (function(module, exports, __webpack_require__) {

jQuery(function ($) {
    Promise.resolve().then(function () {
        return __webpack_require__(10);
    }).then(function (_ref) {
        var WooVariationGalleryAdmin = _ref.WooVariationGalleryAdmin;

        // WooVariationGalleryAdmin.ImageUploader();
        // WooVariationGalleryAdmin.Sortable();

        WooVariationGalleryAdmin.GWPAdmin();

        $('#woocommerce-product-data').on('woocommerce_variations_loaded', function () {
            WooVariationGalleryAdmin.ImageUploader();
            WooVariationGalleryAdmin.Sortable();
        });

        $('#variable_product_options').on('woocommerce_variations_added', function () {
            WooVariationGalleryAdmin.ImageUploader();
            WooVariationGalleryAdmin.Sortable();
        });
    });
}); // end of jquery main wrapper

/***/ })

/******/ });
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXNzZXRzL2pzL2FkbWluLmpzIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vL3dlYnBhY2svYm9vdHN0cmFwIDhlZTFmZTA0MGQyYTM5OTU0MTkzIiwid2VicGFjazovLy9zcmMvanMvV29vVmFyaWF0aW9uR2FsbGVyeUFkbWluLmpzIiwid2VicGFjazovLy9zcmMvanMvYmFja2VuZC5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyIgXHQvLyBUaGUgbW9kdWxlIGNhY2hlXG4gXHR2YXIgaW5zdGFsbGVkTW9kdWxlcyA9IHt9O1xuXG4gXHQvLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuIFx0ZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXG4gXHRcdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuIFx0XHRpZihpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSkge1xuIFx0XHRcdHJldHVybiBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXS5leHBvcnRzO1xuIFx0XHR9XG4gXHRcdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG4gXHRcdHZhciBtb2R1bGUgPSBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSA9IHtcbiBcdFx0XHRpOiBtb2R1bGVJZCxcbiBcdFx0XHRsOiBmYWxzZSxcbiBcdFx0XHRleHBvcnRzOiB7fVxuIFx0XHR9O1xuXG4gXHRcdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuIFx0XHRtb2R1bGVzW21vZHVsZUlkXS5jYWxsKG1vZHVsZS5leHBvcnRzLCBtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuIFx0XHQvLyBGbGFnIHRoZSBtb2R1bGUgYXMgbG9hZGVkXG4gXHRcdG1vZHVsZS5sID0gdHJ1ZTtcblxuIFx0XHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuIFx0XHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG4gXHR9XG5cblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGVzIG9iamVjdCAoX193ZWJwYWNrX21vZHVsZXNfXylcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubSA9IG1vZHVsZXM7XG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlIGNhY2hlXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmMgPSBpbnN0YWxsZWRNb2R1bGVzO1xuXG4gXHQvLyBkZWZpbmUgZ2V0dGVyIGZ1bmN0aW9uIGZvciBoYXJtb255IGV4cG9ydHNcbiBcdF9fd2VicGFja19yZXF1aXJlX18uZCA9IGZ1bmN0aW9uKGV4cG9ydHMsIG5hbWUsIGdldHRlcikge1xuIFx0XHRpZighX193ZWJwYWNrX3JlcXVpcmVfXy5vKGV4cG9ydHMsIG5hbWUpKSB7XG4gXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIG5hbWUsIHtcbiBcdFx0XHRcdGNvbmZpZ3VyYWJsZTogZmFsc2UsXG4gXHRcdFx0XHRlbnVtZXJhYmxlOiB0cnVlLFxuIFx0XHRcdFx0Z2V0OiBnZXR0ZXJcbiBcdFx0XHR9KTtcbiBcdFx0fVxuIFx0fTtcblxuIFx0Ly8gZ2V0RGVmYXVsdEV4cG9ydCBmdW5jdGlvbiBmb3IgY29tcGF0aWJpbGl0eSB3aXRoIG5vbi1oYXJtb255IG1vZHVsZXNcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubiA9IGZ1bmN0aW9uKG1vZHVsZSkge1xuIFx0XHR2YXIgZ2V0dGVyID0gbW9kdWxlICYmIG1vZHVsZS5fX2VzTW9kdWxlID9cbiBcdFx0XHRmdW5jdGlvbiBnZXREZWZhdWx0KCkgeyByZXR1cm4gbW9kdWxlWydkZWZhdWx0J107IH0gOlxuIFx0XHRcdGZ1bmN0aW9uIGdldE1vZHVsZUV4cG9ydHMoKSB7IHJldHVybiBtb2R1bGU7IH07XG4gXHRcdF9fd2VicGFja19yZXF1aXJlX18uZChnZXR0ZXIsICdhJywgZ2V0dGVyKTtcbiBcdFx0cmV0dXJuIGdldHRlcjtcbiBcdH07XG5cbiBcdC8vIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbFxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5vID0gZnVuY3Rpb24ob2JqZWN0LCBwcm9wZXJ0eSkgeyByZXR1cm4gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iamVjdCwgcHJvcGVydHkpOyB9O1xuXG4gXHQvLyBfX3dlYnBhY2tfcHVibGljX3BhdGhfX1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5wID0gXCJcIjtcblxuIFx0Ly8gTG9hZCBlbnRyeSBtb2R1bGUgYW5kIHJldHVybiBleHBvcnRzXG4gXHRyZXR1cm4gX193ZWJwYWNrX3JlcXVpcmVfXyhfX3dlYnBhY2tfcmVxdWlyZV9fLnMgPSA4KTtcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyB3ZWJwYWNrL2Jvb3RzdHJhcCA4ZWUxZmUwNDBkMmEzOTk1NDE5MyIsIi8qZ2xvYmFsIHdvb192YXJpYXRpb25fZ2FsbGVyeV9hZG1pbiAqL1xuY29uc3QgV29vVmFyaWF0aW9uR2FsbGVyeUFkbWluID0gKCgkKSA9PiB7XG4gICAgY2xhc3MgV29vVmFyaWF0aW9uR2FsbGVyeUFkbWluIHtcblxuICAgICAgICBzdGF0aWMgR1dQQWRtaW4oKSB7XG4gICAgICAgICAgICBpZiAoJCgpLmd3cF9saXZlX2ZlZWQpIHtcbiAgICAgICAgICAgICAgICAkKCkuZ3dwX2xpdmVfZmVlZCgpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKCQoKS5nd3BfZGVhY3RpdmF0ZV9wb3B1cCkge1xuICAgICAgICAgICAgICAgICQoKS5nd3BfZGVhY3RpdmF0ZV9wb3B1cCgnd29vLXZhcmlhdGlvbi1nYWxsZXJ5Jyk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBzdGF0aWMgSW1hZ2VVcGxvYWRlcigpIHtcbiAgICAgICAgICAgICQoZG9jdW1lbnQpLm9mZignY2xpY2snLCAnLmFkZC13b28tdmFyaWF0aW9uLWdhbGxlcnktaW1hZ2UnKTtcbiAgICAgICAgICAgICQoZG9jdW1lbnQpLm9uKCdjbGljaycsICcuYWRkLXdvby12YXJpYXRpb24tZ2FsbGVyeS1pbWFnZScsIHRoaXMuQWRkSW1hZ2UpO1xuICAgICAgICAgICAgJChkb2N1bWVudCkub24oJ2NsaWNrJywgJy5yZW1vdmUtd29vLXZhcmlhdGlvbi1nYWxsZXJ5LWltYWdlJywgdGhpcy5SZW1vdmVJbWFnZSk7XG5cbiAgICAgICAgICAgICQoJy53b29jb21tZXJjZV92YXJpYXRpb24nKS5lYWNoKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICBsZXQgb3B0aW9uc1dyYXBwZXIgPSAkKHRoaXMpLmZpbmQoJy5vcHRpb25zJyk7XG4gICAgICAgICAgICAgICAgbGV0IGdhbGxlcnlXcmFwcGVyID0gJCh0aGlzKS5maW5kKCcud29vLXZhcmlhdGlvbi1nYWxsZXJ5LXdyYXBwZXInKTtcbiAgICAgICAgICAgICAgICBnYWxsZXJ5V3JhcHBlci5pbnNlcnRCZWZvcmUob3B0aW9uc1dyYXBwZXIpXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuXG4gICAgICAgIHN0YXRpYyBBZGRJbWFnZShldmVudCkge1xuXG4gICAgICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICAgICAgZXZlbnQuc3RvcFByb3BhZ2F0aW9uKCk7XG5cbiAgICAgICAgICAgIGxldCBmaWxlX2ZyYW1lO1xuICAgICAgICAgICAgbGV0IHByb2R1Y3RfdmFyaWF0aW9uX2lkID0gJCh0aGlzKS5kYXRhKCdwcm9kdWN0X3ZhcmlhdGlvbl9pZCcpO1xuXG4gICAgICAgICAgICBpZiAodHlwZW9mIHdwICE9PSAndW5kZWZpbmVkJyAmJiB3cC5tZWRpYSAmJiB3cC5tZWRpYS5lZGl0b3IpIHtcblxuICAgICAgICAgICAgICAgIC8vIElmIHRoZSBtZWRpYSBmcmFtZSBhbHJlYWR5IGV4aXN0cywgcmVvcGVuIGl0LlxuICAgICAgICAgICAgICAgIGlmIChmaWxlX2ZyYW1lKSB7XG4gICAgICAgICAgICAgICAgICAgIGZpbGVfZnJhbWUub3BlbigpO1xuICAgICAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgLy8gQ3JlYXRlIHRoZSBtZWRpYSBmcmFtZS5cbiAgICAgICAgICAgICAgICBmaWxlX2ZyYW1lID0gd3AubWVkaWEuZnJhbWVzLnNlbGVjdF9pbWFnZSA9IHdwLm1lZGlhKHtcbiAgICAgICAgICAgICAgICAgICAgdGl0bGUgICA6IHdvb192YXJpYXRpb25fZ2FsbGVyeV9hZG1pbi5jaG9vc2VfaW1hZ2UsXG4gICAgICAgICAgICAgICAgICAgIGJ1dHRvbiAgOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0ZXh0IDogd29vX3ZhcmlhdGlvbl9nYWxsZXJ5X2FkbWluLmFkZF9pbWFnZVxuICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICAvKnN0YXRlcyA6IFtcbiAgICAgICAgICAgICAgICAgICAgICAgIG5ldyB3cC5tZWRpYS5jb250cm9sbGVyLkxpYnJhcnkoe1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRpdGxlICAgICAgOiB3b29fdmFyaWF0aW9uX2dhbGxlcnlfYWRtaW4uY2hvb3NlX2ltYWdlLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZpbHRlcmFibGUgOiAnYWxsJyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBtdWx0aXBsZSAgIDogJ2FkZCdcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgICAgIF0sKi9cbiAgICAgICAgICAgICAgICAgICAgbGlicmFyeSA6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHR5cGUgOiBbJ2ltYWdlJ10gLy8gWyAndmlkZW8nLCAnaW1hZ2UnIF1cbiAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgLy8gbXVsdGlwbGUgOiB0cnVlXG4gICAgICAgICAgICAgICAgICAgIC8vbXVsdGlwbGUgOiAnYWRkJ1xuICAgICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAgICAgLy8gV2hlbiBhbiBpbWFnZSBpcyBzZWxlY3RlZCwgcnVuIGEgY2FsbGJhY2suXG4gICAgICAgICAgICAgICAgZmlsZV9mcmFtZS5vbignc2VsZWN0JywgKCkgPT4ge1xuXG4gICAgICAgICAgICAgICAgICAgIGxldCBpbWFnZXMgPSBmaWxlX2ZyYW1lLnN0YXRlKCkuZ2V0KCdzZWxlY3Rpb24nKS50b0pTT04oKTtcblxuICAgICAgICAgICAgICAgICAgICBsZXQgaHRtbCA9IGltYWdlcy5tYXAoKGltYWdlKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoaW1hZ2UudHlwZSA9PT0gJ2ltYWdlJykge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxldCB7aWQsIHNpemVzIDoge3RodW1ibmFpbCwgZnVsbH0gPSB7fX0gPSBpbWFnZTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxldCB1cmwgICAgICA9IHRodW1ibmFpbCA/IHRodW1ibmFpbC51cmwgOiBmdWxsLnVybDtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBsZXQgdGVtcGxhdGUgPSB3cC50ZW1wbGF0ZSgnd29vLXZhcmlhdGlvbi1nYWxsZXJ5LWltYWdlJyk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRlbXBsYXRlKHtpZCwgdXJsLCBwcm9kdWN0X3ZhcmlhdGlvbl9pZH0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9KS5qb2luKCcnKTtcblxuICAgICAgICAgICAgICAgICAgICAkKHRoaXMpLnBhcmVudCgpLnByZXYoKS5maW5kKCcud29vLXZhcmlhdGlvbi1nYWxsZXJ5LWltYWdlcycpLmFwcGVuZChodG1sKTtcblxuICAgICAgICAgICAgICAgICAgICAvLyBWYXJpYXRpb24gQ2hhbmdlZFxuICAgICAgICAgICAgICAgICAgICBXb29WYXJpYXRpb25HYWxsZXJ5QWRtaW4uU29ydGFibGUoKTtcbiAgICAgICAgICAgICAgICAgICAgV29vVmFyaWF0aW9uR2FsbGVyeUFkbWluLlZhcmlhdGlvbkNoYW5nZWQodGhpcyk7XG5cbiAgICAgICAgICAgICAgICAgICAgXy5kZWxheSgoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICBXb29WYXJpYXRpb25HYWxsZXJ5QWRtaW4uUHJvTm90aWNlKHRoaXMpO1xuICAgICAgICAgICAgICAgICAgICB9LCA1KTtcbiAgICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgICAgIC8vIEZpbmFsbHksIG9wZW4gdGhlIG1vZGFsLlxuICAgICAgICAgICAgICAgIGZpbGVfZnJhbWUub3BlbigpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgc3RhdGljIFZhcmlhdGlvbkNoYW5nZWQoJGVsKSB7XG4gICAgICAgICAgICAkKCRlbCkuY2xvc2VzdCgnLndvb2NvbW1lcmNlX3ZhcmlhdGlvbicpLmFkZENsYXNzKCd2YXJpYXRpb24tbmVlZHMtdXBkYXRlJyk7XG4gICAgICAgICAgICAkKCdidXR0b24uY2FuY2VsLXZhcmlhdGlvbi1jaGFuZ2VzLCBidXR0b24uc2F2ZS12YXJpYXRpb24tY2hhbmdlcycpLnJlbW92ZUF0dHIoJ2Rpc2FibGVkJyk7XG4gICAgICAgICAgICAkKCcjdmFyaWFibGVfcHJvZHVjdF9vcHRpb25zJykudHJpZ2dlcignd29vY29tbWVyY2VfdmFyaWF0aW9uc19pbnB1dF9jaGFuZ2VkJyk7XG4gICAgICAgIH1cblxuICAgICAgICBzdGF0aWMgUHJvTm90aWNlKCRlbCkge1xuICAgICAgICAgICAgbGV0IHRvdGFsID0gJCgkZWwpLmNsb3Nlc3QoJy53b28tdmFyaWF0aW9uLWdhbGxlcnktd3JhcHBlcicpLmZpbmQoJy53b28tdmFyaWF0aW9uLWdhbGxlcnktaW1hZ2VzID4gbGknKS5sZW5ndGg7XG4gICAgICAgICAgICAkKCRlbCkuY2xvc2VzdCgnLndvby12YXJpYXRpb24tZ2FsbGVyeS13cmFwcGVyJykuZmluZCgnLndvby12YXJpYXRpb24tZ2FsbGVyeS1pbWFnZXMgPiBsaScpLmVhY2goZnVuY3Rpb24gKGksIGVsKSB7XG4gICAgICAgICAgICAgICAgaWYgKGkgPj0gMikge1xuICAgICAgICAgICAgICAgICAgICAkKGVsKS5yZW1vdmUoKTtcbiAgICAgICAgICAgICAgICAgICAgJCgkZWwpLmNsb3Nlc3QoJy53b28tdmFyaWF0aW9uLWdhbGxlcnktd3JhcHBlcicpLmZpbmQoJy53b28tdmFyaWF0aW9uLWdhbGxlcnktcHJvLWJ1dHRvbicpLnNob3coKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICQoJGVsKS5jbG9zZXN0KCcud29vLXZhcmlhdGlvbi1nYWxsZXJ5LXdyYXBwZXInKS5maW5kKCcud29vLXZhcmlhdGlvbi1nYWxsZXJ5LXByby1idXR0b24nKS5oaWRlKCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cblxuICAgICAgICBzdGF0aWMgUmVtb3ZlSW1hZ2UoZXZlbnQpIHtcblxuICAgICAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgICAgIGV2ZW50LnN0b3BQcm9wYWdhdGlvbigpO1xuXG4gICAgICAgICAgICAvLyBWYXJpYXRpb24gQ2hhbmdlZFxuICAgICAgICAgICAgV29vVmFyaWF0aW9uR2FsbGVyeUFkbWluLlZhcmlhdGlvbkNoYW5nZWQodGhpcyk7XG5cbiAgICAgICAgICAgIF8uZGVsYXkoKCkgPT4ge1xuICAgICAgICAgICAgICAgIFdvb1ZhcmlhdGlvbkdhbGxlcnlBZG1pbi5Qcm9Ob3RpY2UodGhpcyk7XG4gICAgICAgICAgICAgICAgJCh0aGlzKS5wYXJlbnQoKS5yZW1vdmUoKTtcbiAgICAgICAgICAgIH0sIDEpO1xuICAgICAgICB9XG5cbiAgICAgICAgc3RhdGljIFNvcnRhYmxlKCkge1xuICAgICAgICAgICAgJCgnLndvby12YXJpYXRpb24tZ2FsbGVyeS1pbWFnZXMnKS5zb3J0YWJsZSh7XG4gICAgICAgICAgICAgICAgaXRlbXMgICAgICAgICAgICAgICAgOiAnbGkuaW1hZ2UnLFxuICAgICAgICAgICAgICAgIGN1cnNvciAgICAgICAgICAgICAgIDogJ21vdmUnLFxuICAgICAgICAgICAgICAgIHNjcm9sbFNlbnNpdGl2aXR5ICAgIDogNDAsXG4gICAgICAgICAgICAgICAgZm9yY2VQbGFjZWhvbGRlclNpemUgOiB0cnVlLFxuICAgICAgICAgICAgICAgIGZvcmNlSGVscGVyU2l6ZSAgICAgIDogZmFsc2UsXG4gICAgICAgICAgICAgICAgaGVscGVyICAgICAgICAgICAgICAgOiAnY2xvbmUnLFxuICAgICAgICAgICAgICAgIG9wYWNpdHkgICAgICAgICAgICAgIDogMC42NSxcbiAgICAgICAgICAgICAgICBwbGFjZWhvbGRlciAgICAgICAgICA6ICd3b28tdmFyaWF0aW9uLWdhbGxlcnktc29ydGFibGUtcGxhY2Vob2xkZXInLFxuICAgICAgICAgICAgICAgIHN0YXJ0ICAgICAgICAgICAgICAgIDogZnVuY3Rpb24gKGV2ZW50LCB1aSkge1xuICAgICAgICAgICAgICAgICAgICB1aS5pdGVtLmNzcygnYmFja2dyb3VuZC1jb2xvcicsICcjZjZmNmY2Jyk7XG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICBzdG9wICAgICAgICAgICAgICAgICA6IGZ1bmN0aW9uIChldmVudCwgdWkpIHtcbiAgICAgICAgICAgICAgICAgICAgdWkuaXRlbS5yZW1vdmVBdHRyKCdzdHlsZScpO1xuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgdXBkYXRlICAgICAgICAgICAgICAgOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgICAgIC8vIFZhcmlhdGlvbiBDaGFuZ2VkXG4gICAgICAgICAgICAgICAgICAgIFdvb1ZhcmlhdGlvbkdhbGxlcnlBZG1pbi5WYXJpYXRpb25DaGFuZ2VkKHRoaXMpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIFdvb1ZhcmlhdGlvbkdhbGxlcnlBZG1pbjtcbn0pKGpRdWVyeSk7XG5cbmV4cG9ydCB7IFdvb1ZhcmlhdGlvbkdhbGxlcnlBZG1pbiB9O1xuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyBzcmMvanMvV29vVmFyaWF0aW9uR2FsbGVyeUFkbWluLmpzIiwialF1ZXJ5KCQgPT4ge1xuICAgIGltcG9ydCgnLi9Xb29WYXJpYXRpb25HYWxsZXJ5QWRtaW4nKS50aGVuKCh7V29vVmFyaWF0aW9uR2FsbGVyeUFkbWlufSkgPT4ge1xuICAgICAgICAvLyBXb29WYXJpYXRpb25HYWxsZXJ5QWRtaW4uSW1hZ2VVcGxvYWRlcigpO1xuICAgICAgICAvLyBXb29WYXJpYXRpb25HYWxsZXJ5QWRtaW4uU29ydGFibGUoKTtcblxuICAgICAgICBXb29WYXJpYXRpb25HYWxsZXJ5QWRtaW4uR1dQQWRtaW4oKTtcblxuICAgICAgICAkKCcjd29vY29tbWVyY2UtcHJvZHVjdC1kYXRhJykub24oJ3dvb2NvbW1lcmNlX3ZhcmlhdGlvbnNfbG9hZGVkJywgZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgV29vVmFyaWF0aW9uR2FsbGVyeUFkbWluLkltYWdlVXBsb2FkZXIoKTtcbiAgICAgICAgICAgIFdvb1ZhcmlhdGlvbkdhbGxlcnlBZG1pbi5Tb3J0YWJsZSgpO1xuICAgICAgICB9KTtcblxuICAgICAgICAkKCcjdmFyaWFibGVfcHJvZHVjdF9vcHRpb25zJykub24oJ3dvb2NvbW1lcmNlX3ZhcmlhdGlvbnNfYWRkZWQnLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICBXb29WYXJpYXRpb25HYWxsZXJ5QWRtaW4uSW1hZ2VVcGxvYWRlcigpO1xuICAgICAgICAgICAgV29vVmFyaWF0aW9uR2FsbGVyeUFkbWluLlNvcnRhYmxlKCk7XG4gICAgICAgIH0pO1xuICAgIH0pO1xuXG59KTsgIC8vIGVuZCBvZiBqcXVlcnkgbWFpbiB3cmFwcGVyXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIHNyYy9qcy9iYWNrZW5kLmpzIl0sIm1hcHBpbmdzIjoiOzs7Ozs7OztBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7Ozs7Ozs7Ozs7OztBQzdEQTtBQUNBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFDQTtBQURBO0FBQUE7QUFBQTtBQUlBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBVkE7QUFBQTtBQUFBO0FBYUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUF0QkE7QUFBQTtBQUFBO0FBd0JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQURBO0FBR0E7Ozs7Ozs7QUFPQTtBQUNBO0FBREE7QUFHQTtBQUNBO0FBaEJBO0FBQ0E7QUFrQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQXpGQTtBQUFBO0FBQUE7QUE0RkE7QUFDQTtBQUNBO0FBQ0E7QUEvRkE7QUFBQTtBQUFBO0FBa0dBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBNUdBO0FBQUE7QUFBQTtBQThHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQTFIQTtBQUFBO0FBQUE7QUE2SEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFsQkE7QUFvQkE7QUFqSkE7QUFDQTtBQURBO0FBQUE7QUFDQTtBQW1KQTtBQUNBO0FBQ0E7Ozs7Ozs7Ozs7Ozs7Ozs7QUN2SkE7QUFDQTtBQUFBO0FBQUE7QUFBQTtBQUNBO0FBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7Ozs7QSIsInNvdXJjZVJvb3QiOiIifQ==