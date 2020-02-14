<?php
	
	defined( 'ABSPATH' ) || exit;
	
	global $product;
	
	$product_id = $product->get_id();
	
	$product_type = $product->get_type();
	
	$columns = absint( get_option( 'woo_variation_gallery_thumbnails_columns', apply_filters( 'woo_variation_gallery_default_thumbnails_columns', 4 ) ) );
	
	$post_thumbnail_id = $product->get_image_id();
	
	$default_sizes  = wp_get_attachment_image_src( $post_thumbnail_id, 'woocommerce_single' );
	$default_height = $default_sizes[ 2 ];
	$default_width  = $default_sizes[ 1 ];
	
	$attachment_ids = $product->get_gallery_image_ids();
	
	$has_gallery_thumbnail = ( has_post_thumbnail() && ( count( $attachment_ids ) > 0 ) );
	
	$gallery_slider_js_options = apply_filters( 'woo_variation_gallery_slider_js_options', array(
		'slidesToShow'   => 1,
		'slidesToScroll' => 1,
		'arrows'         => false,
		'adaptiveHeight' => true,
		// 'lazyLoad'       => 'progressive',
		'rtl'            => is_rtl(),
	) );
	
	$thumbnail_slider_js_options = apply_filters( 'woo_variation_gallery_thumbnail_slider_js_options', array(
		'slidesToShow'   => $columns,
		'slidesToScroll' => $columns,
		'focusOnSelect'  => true,
		'arrows'         => false,
		'asNavFor'       => '.woo-variation-gallery-slider',
		'centerMode'     => true,
		'infinite'       => true,
		'centerPadding'  => '0px',
		'rtl'            => is_rtl(),
	) );
	
	$gallery_thumbnail_position = get_option( 'woo_variation_gallery_thumbnail_position', 'bottom' );
	
	// Reset Position
	if ( ! woo_variation_gallery()->is_pro_active() ) {
		$gallery_thumbnail_position = 'bottom';
	}
	
	$gallery_width = absint( get_option( 'woo_variation_gallery_width', apply_filters( 'woo_variation_gallery_default_width', 30 ) ) );
	
	$inline_style = apply_filters( 'woo_variation_product_gallery_inline_style', array(// 'max-width' => esc_attr( $gallery_width ) . '%'
	) );
	
	$wrapper_classes = apply_filters( 'woo_variation_gallery_product_image_classes', array(
		'woo-variation-product-gallery',
		'woo-variation-product-gallery-thumbnail-columns-' . absint( $columns ),
		$has_gallery_thumbnail ? 'woo-variation-gallery-has-product-thumbnail' : ''
	) );
?>

<div style="<?php echo esc_attr( wvg_generate_inline_style( $inline_style ) ) ?>" class="<?php echo esc_attr( implode( ' ', array_map( 'sanitize_html_class', array_unique( $wrapper_classes ) ) ) ); ?>">
    <div class="loading-gallery woo-variation-gallery-wrapper woo-variation-gallery-thumbnail-position-<?php echo esc_attr( $gallery_thumbnail_position ) ?> woo-variation-gallery-product-type-<?php echo esc_attr( $product_type ) ?>">

        <div class="woo-variation-gallery-container preload-style-<?php echo trim( get_option( 'woo_variation_gallery_preload_style', 'blur' ) ) ?>">

            <div class="woo-variation-gallery-slider-wrapper">
				
				<?php if ( has_post_thumbnail() && ( 'yes' === get_option( 'woo_variation_gallery_lightbox', 'yes' ) ) ): ?>
                    <a href="#" class="woo-variation-gallery-trigger woo-variation-gallery-trigger-position-<?php echo get_option( 'woo_variation_gallery_zoom_position', 'top-right' ) ?>">
                        <span class="dashicons dashicons-search"></span>
                    </a>
				<?php endif; ?>

                <div class="woo-variation-gallery-slider" data-slick='<?php echo htmlspecialchars( wp_json_encode( $gallery_slider_js_options ) ); // WPCS: XSS ok. ?>'>
					<?php
						// Main  Image
						//$default_image_loaded = false;
						if ( has_post_thumbnail() ) :
							echo wvg_get_gallery_image_html( $post_thumbnail_id, true );
						else:
							echo '<div class="wvg-gallery-image wvg-gallery-image-placeholder">';
							echo sprintf( '<img src="%s" alt="%s" class="wp-post-image" />', esc_url( wc_placeholder_img_src() ), esc_html__( 'Awaiting product image', 'woocommerce' ) );
							echo '</div>';
						endif;
						
						// Gallery Image
						if ( $has_gallery_thumbnail ) :
							foreach ( $attachment_ids as $attachment_id ) :
								echo wvg_get_gallery_image_html( $attachment_id, true );
							endforeach;
						endif;
					?>
                </div>
            </div> <!-- .woo-variation-gallery-slider-wrapper -->

            <div class="woo-variation-gallery-thumbnail-wrapper">
                <div class="woo-variation-gallery-thumbnail-slider woo-variation-gallery-thumbnail-columns-<?php echo esc_attr( $columns ) ?>" data-slick='<?php echo htmlspecialchars( wp_json_encode( $thumbnail_slider_js_options ) ); // WPCS: XSS ok. ?>'>
					<?php
						if ( $has_gallery_thumbnail ):
							// Main Image
							echo wvg_get_gallery_image_html( $post_thumbnail_id );
							
							// Gallery Image
							foreach ( $attachment_ids as $key => $attachment_id ) :
								echo wvg_get_gallery_image_html( $attachment_id, false, $key );
							endforeach;
						endif;
					?>
                </div>
            </div> <!-- .woo-variation-gallery-thumbnail-wrapper -->
        </div> <!-- .woo-variation-gallery-container -->
    </div> <!-- .woo-variation-gallery-wrapper -->
</div> <!-- .woo-variation-product-gallery -->


