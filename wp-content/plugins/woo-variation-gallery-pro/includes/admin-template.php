<?php
	defined( 'ABSPATH' ) or die( 'Keep Quit' );
	
	foreach ( $gallery_images as $image_id ):
		
		$image = wp_get_attachment_image_src( $image_id );
		$has_video = trim( get_post_meta( $image_id, 'woo_variation_gallery_media_video', TRUE ) );
		?>
        <li class="image <?php echo( $has_video ? 'video' : '' ) ?>">
            <input type="hidden" name="woo_variation_gallery[<?php echo $variation_id ?>][]" value="<?php echo $image_id ?>">
            <img src="<?php echo esc_url( $image[ 0 ] ) ?>">
            <a href="#" class="delete remove-woo-variation-gallery-image"><span class="dashicons dashicons-dismiss"></span></a>
        </li>
	
	<?php endforeach; ?>
