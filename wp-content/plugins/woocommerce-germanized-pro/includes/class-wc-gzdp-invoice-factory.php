<?php

if ( ! defined( 'ABSPATH' ) )
	exit;

/**
 * Order Factory Class
 *
 * The WooCommerce order factory creating the right order objects
 *
 * @class 		WC_Order_Factory
 * @version		2.2.0
 * @package		WooCommerce/Classes
 * @category	Class
 * @author 		WooThemes
 */
class WC_GZDP_Invoice_Factory {

	public function get_invoice( $the_invoice = false, $type = 'simple' ) {

		global $post;

		if ( false === $the_invoice ) {
			
			$types = wc_gzdp_get_invoice_types( $type );

			$args = array(
				'post_status'   => 'auto-draft',
				'post_type'     => 'invoice',
				'post_author'   => wc_gzdp_get_invoice_default_author(),
				'post_title'    => sprintf( __( 'New %s', 'woocommerce-germanized-pro' ), $types[ 'title' ] ),
			);

			$old_post_id = false;

			if ( is_object( $post ) ) {
				$old_post_id = $post->ID;
			}

			$the_invoice = wp_insert_post( $args );

			// Make sure to reset the post variable when in admin mode
			// Otherwise may lead to plugin incompatibilities in order screen
			if ( $old_post_id && is_admin() ) {
				$post = get_post( $old_post_id );
			}

			$type = explode( '-', $type );

			if ( ! is_wp_error( $the_invoice ) ) {
                update_post_meta( $the_invoice, '_type', $type[0] );

                if ( isset( $type[1] ) ) {
                    update_post_meta( $the_invoice, '_subtype', $type[1] );
                }
            }
		}
		
		if ( is_numeric( $the_invoice ) )
			$the_invoice = get_post( $the_invoice );

		if ( ! $the_invoice || ! is_object( $the_invoice ) )
			return false;

		$invoice_id  = absint( $the_invoice->ID );
		$invoice_type = ( get_post_meta( $invoice_id, '_type', true ) ? get_post_meta( $invoice_id, '_type', true ) : 'simple' );

		$classname = false;

		if ( $invoice_type_info = wc_gzdp_get_invoice_types( $invoice_type ) )
			$classname = $invoice_type_info['class_name'];

		// Support refunds
        if ( $subtype = get_post_meta( $invoice_id, '_subtype', true ) ) {
            $classname .= '_' . ucfirst( $subtype );
        }

		if ( ! class_exists( $classname ) )
			$classname = 'WC_GZDP_Invoice_Simple';

		return new $classname( $the_invoice );
	}
}
