<?php
	
	defined( 'ABSPATH' ) or die( 'Keep Quit' );
	
	if ( ! function_exists( 'woo_variation_gallery_thumbnails_columns' ) ):
		function woo_variation_gallery_thumbnails_columns( $current ) {
			$value = absint( get_option( 'woo_variation_gallery_thumbnails_columns', 4 ) );
			
			return $value > 0 ? $value : $current;
		}
	endif;
	
	// function override
	function wvg_gallery_admin_html( $loop, $variation_data, $variation ) {
		$variation_id   = absint( $variation->ID );
		$gallery_images = get_post_meta( $variation_id, 'woo_variation_gallery_images', TRUE );
		?>
        <div class="form-row form-row-full woo-variation-gallery-wrapper">
            <h4><?php esc_html_e( 'Variation Image Gallery', 'woo-variation-gallery-pro' ) ?></h4>
            <div class="woo-variation-gallery-image-container">
                <ul class="woo-variation-gallery-images">
					<?php
						if ( is_array( $gallery_images ) && ! empty( $gallery_images ) ) {
							include 'admin-template.php';
						}
					?>
                </ul>
            </div>
            <p class="add-woo-variation-gallery-image-wrapper hide-if-no-js">
                <a href="#" data-product_variation_id="<?php echo absint( $variation->ID ) ?>" class="button add-woo-variation-gallery-image"><?php esc_html_e( 'Add Gallery Images', 'woo-variation-gallery-pro' ) ?></a>
            </p>
        </div>
		<?php
	}
